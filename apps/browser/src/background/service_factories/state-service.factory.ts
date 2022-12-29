import { StateFactory } from "@bitwarden/common/factories/stateFactory";
import { GlobalState } from "@bitwarden/common/models/domain/global-state";

import { Account } from "../../models/account";
import { BrowserStateService } from "../../services/browser-state.service";

import { CachedServices, factory, FactoryOptions } from "./factory-options";
import { logServiceFactory, LogServiceInitOptions } from "./log-service.factory";
import {
  stateMigrationServiceFactory,
  StateMigrationServiceInitOptions,
} from "./state-migration-service.factory";
import {
  diskStorageServiceFactory,
  secureStorageServiceFactory,
  memoryStorageServiceFactory,
  DiskStorageServiceInitOptions,
  SecureStorageServiceInitOptions,
  MemoryStorageServiceInitOptions,
} from "./storage-service.factory";

type StateServiceFactoryOptions = FactoryOptions & {
  stateServiceOptions: {
    useAccountCache?: boolean;
    stateFactory: StateFactory<GlobalState, Account>;
  };
};

export type StateServiceInitOptions = StateServiceFactoryOptions &
  DiskStorageServiceInitOptions &
  SecureStorageServiceInitOptions &
  MemoryStorageServiceInitOptions &
  LogServiceInitOptions &
  StateMigrationServiceInitOptions;

export async function stateServiceFactory(
  cache: { stateService?: BrowserStateService } & CachedServices,
  opts: StateServiceInitOptions
): Promise<BrowserStateService> {
  const service = await factory(
    cache,
    "stateService",
    opts,
    async () =>
      await new BrowserStateService(
        await diskStorageServiceFactory(cache, opts),
        await secureStorageServiceFactory(cache, opts),
        await memoryStorageServiceFactory(cache, opts),
        await logServiceFactory(cache, opts),
        await stateMigrationServiceFactory(cache, opts),
        opts.stateServiceOptions.stateFactory,
        opts.stateServiceOptions.useAccountCache
      )
  );
  service.init();
  return service;
}
