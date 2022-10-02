import { Directive, EventEmitter, Input, Output } from "@angular/core";

import { SearchService } from "@bitwarden/common/abstractions/search.service";
import { CipherView } from "@bitwarden/common/models/view/cipherView";

/**
 * Container class for ciphers sorted by their folder ID attribute
 */
class SortedCipher {
  folderId = "";
  ciphers: CipherView[] = [];
  constructor(allCiphers: CipherView[], folderId: string) {
    this.folderId = folderId;
    allCiphers.forEach((item) => {
      if (item.folderId == folderId) {
        this.ciphers.push(item);
      }
    });
  }
}

@Directive()
export class CiphersComponent {
  @Input() activeCipherId: string = null;
  @Output() onCipherClicked = new EventEmitter<CipherView>();
  @Output() onCipherRightClicked = new EventEmitter<CipherView>();
  @Output() onAddCipher = new EventEmitter();
  @Output() onAddCipherOptions = new EventEmitter();

  sortedCiphers: SortedCipher[] = [];
  loaded = false;
  ciphers: CipherView[] = [];
  searchText: string;
  searchPlaceholder: string = null;
  filter: (cipher: CipherView) => boolean = null;
  deleted = false;

  protected searchPending = false;

  private searchTimeout: any = null;

  constructor(protected searchService: SearchService) {}

  async load(filter: (cipher: CipherView) => boolean = null, deleted = false) {
    this.deleted = deleted || false;
    await this.applyFilter(filter);
    this.loaded = true;
  }

  async reload(filter: (cipher: CipherView) => boolean = null, deleted = false) {
    this.loaded = false;
    await this.load(filter, deleted);
  }

  async refresh() {
    await this.reload(this.filter, this.deleted);
  }

  async applyFilter(filter: (cipher: CipherView) => boolean = null) {
    this.filter = filter;
    await this.search(null);
  }

  async search(timeout: number = null, indexedCiphers?: CipherView[]) {
    this.searchPending = false;
    if (this.searchTimeout != null) {
      clearTimeout(this.searchTimeout);
    }
    if (timeout == null) {
      await this.doSearch(indexedCiphers);
      return;
    }
    this.searchPending = true;
    this.searchTimeout = setTimeout(async () => {
      await this.doSearch(indexedCiphers);
      this.searchPending = false;
    }, timeout);
  }

  selectCipher(cipher: CipherView) {
    this.onCipherClicked.emit(cipher);
  }

  rightClickCipher(cipher: CipherView) {
    this.onCipherRightClicked.emit(cipher);
  }

  addCipher() {
    this.onAddCipher.emit();
  }

  addCipherOptions() {
    this.onAddCipherOptions.emit();
  }

  isSearching() {
    return !this.searchPending && this.searchService.isSearchable(this.searchText);
  }

  protected deletedFilter: (cipher: CipherView) => boolean = (c) => c.isDeleted === this.deleted;

  protected async doSearch(indexedCiphers?: CipherView[]) {
    this.ciphers = await this.searchService.searchCiphers(
      this.searchText,
      [this.filter, this.deletedFilter],
      indexedCiphers
    );
  }
}
