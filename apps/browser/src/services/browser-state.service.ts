import { BehaviorSubject } from "rxjs";
import { Jsonify } from "type-fest";

import { AbstractCachedStorageService } from "@bitwarden/common/abstractions/storage.service";
import { GlobalState } from "@bitwarden/common/models/domain/global-state";
import { StorageOptions } from "@bitwarden/common/models/domain/storage-options";
import { StateService as BaseStateService } from "@bitwarden/common/services/state.service";

import { browserSession, sessionSync } from "../decorators/session-sync-observable";
import { Account } from "../models/account";
import { BrowserComponentState } from "../models/browserComponentState";
import { BrowserGroupingsComponentState } from "../models/browserGroupingsComponentState";
import { BrowserSendComponentState } from "../models/browserSendComponentState";

import { BrowserStateService as StateServiceAbstraction } from "./abstractions/browser-state.service";

@browserSession
export class BrowserStateService
  extends BaseStateService<GlobalState, Account>
  implements StateServiceAbstraction
{
  @sessionSync({
    initializer: Account.fromJSON as any, // TODO: Remove this any when all any types are removed from Account
    initializeAs: "record",
  })
  protected accountsSubject: BehaviorSubject<{ [userId: string]: Account }>;
  @sessionSync({ ctor: String })
  protected activeAccountSubject: BehaviorSubject<string>;
  @sessionSync({ ctor: Boolean })
  protected activeAccountUnlockedSubject: BehaviorSubject<boolean>;
  @sessionSync({
    initializer: Account.fromJSON as any, // TODO: Remove this any when all any types are removed from Account
    initializeAs: "record",
  })
  protected accountDiskCache: BehaviorSubject<Record<string, Account>>;

  protected accountDeserializer = Account.fromJSON;

  async hasInSessionMemory(key: string): Promise<boolean> {
    return await this.memoryStorageService.has(key);
  }

  async getFromSessionMemory<T>(key: string, deserializer?: (obj: Jsonify<T>) => T): Promise<T> {
    return this.memoryStorageService instanceof AbstractCachedStorageService
      ? await this.memoryStorageService.getBypassCache<T>(key, { deserializer: deserializer })
      : await this.memoryStorageService.get<T>(key);
  }

  async setInSessionMemory(key: string, value: any): Promise<void> {
    await this.memoryStorageService.save(key, value);
  }

  async addAccount(account: Account) {
    // Apply browser overrides to default account values
    account = new Account(account);
    await super.addAccount(account);
  }

  async getIsAuthenticated(options?: StorageOptions): Promise<boolean> {
    // Firefox Private Mode can clash with non-Private Mode because they both read from the same onDiskOptions
    // Check that there is an account in memory before considering the user authenticated
    return (
      (await super.getIsAuthenticated(options)) &&
      (await this.getAccount(await this.defaultInMemoryOptions())) != null
    );
  }

  async getBrowserGroupingComponentState(
    options?: StorageOptions
  ): Promise<BrowserGroupingsComponentState> {
    return (
      await this.getAccount(this.reconcileOptions(options, await this.defaultInMemoryOptions()))
    )?.groupings;
  }

  async setBrowserGroupingComponentState(
    value: BrowserGroupingsComponentState,
    options?: StorageOptions
  ): Promise<void> {
    const account = await this.getAccount(
      this.reconcileOptions(options, await this.defaultInMemoryOptions())
    );
    account.groupings = value;
    await this.saveAccount(
      account,
      this.reconcileOptions(options, await this.defaultInMemoryOptions())
    );
  }

  async getBrowserVaultItemsComponentState(
    options?: StorageOptions
  ): Promise<BrowserComponentState> {
    return (
      await this.getAccount(this.reconcileOptions(options, await this.defaultInMemoryOptions()))
    )?.ciphers;
  }

  async setBrowserVaultItemsComponentState(
    value: BrowserComponentState,
    options?: StorageOptions
  ): Promise<void> {
    const account = await this.getAccount(
      this.reconcileOptions(options, await this.defaultInMemoryOptions())
    );
    account.ciphers = value;
    await this.saveAccount(
      account,
      this.reconcileOptions(options, await this.defaultInMemoryOptions())
    );
  }

  async getBrowserSendComponentState(options?: StorageOptions): Promise<BrowserSendComponentState> {
    return (
      await this.getAccount(this.reconcileOptions(options, await this.defaultInMemoryOptions()))
    )?.send;
  }

  async setBrowserSendComponentState(
    value: BrowserSendComponentState,
    options?: StorageOptions
  ): Promise<void> {
    const account = await this.getAccount(
      this.reconcileOptions(options, await this.defaultInMemoryOptions())
    );
    account.send = value;
    await this.saveAccount(
      account,
      this.reconcileOptions(options, await this.defaultInMemoryOptions())
    );
  }

  async getBrowserSendTypeComponentState(options?: StorageOptions): Promise<BrowserComponentState> {
    return (
      await this.getAccount(this.reconcileOptions(options, await this.defaultInMemoryOptions()))
    )?.sendType;
  }

  async setBrowserSendTypeComponentState(
    value: BrowserComponentState,
    options?: StorageOptions
  ): Promise<void> {
    const account = await this.getAccount(
      this.reconcileOptions(options, await this.defaultInMemoryOptions())
    );
    account.sendType = value;
    await this.saveAccount(
      account,
      this.reconcileOptions(options, await this.defaultInMemoryOptions())
    );
  }
}
