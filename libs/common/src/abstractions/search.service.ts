import { CipherView } from "../models/view/cipher.view";
import { SendView } from "../models/view/send.view";

import { FolderService } from "./folder/folder.service.abstraction";

export abstract class SearchService {
  indexedEntityId?: string = null;
  folderService?: FolderService = null;
  clearIndex: () => void;
  isSearchable: (query: string) => boolean;
  indexCiphers: (indexedEntityGuid?: string, ciphersToIndex?: CipherView[]) => Promise<void>;
  searchCiphers: (
    query: string,
    filter?: ((cipher: CipherView) => boolean) | ((cipher: CipherView) => boolean)[],
    ciphers?: CipherView[]
  ) => Promise<CipherView[]>;
  searchCiphersBasic: (ciphers: CipherView[], query: string, deleted?: boolean) => CipherView[];
  searchSends: (sends: SendView[], query: string) => SendView[];
}
