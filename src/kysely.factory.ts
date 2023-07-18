import { Provider } from '@nestjs/common';
import { Kysely } from 'kysely';
import { NestelyModuleOptions } from './nestely.module-options';
import { KYSELY_CONNECTION_TOKEN } from './constants';
import { MODULE_OPTIONS_TOKEN } from './nestely.module-definition';

export const createKyselyProvider = (): Provider => ({
  provide: KYSELY_CONNECTION_TOKEN,
  useFactory: (config: NestelyModuleOptions): Kysely<unknown> => {
    return new Kysely(config);
  },
  inject: [MODULE_OPTIONS_TOKEN],
});
