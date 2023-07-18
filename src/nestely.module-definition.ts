import { ConfigurableModuleBuilder } from '@nestjs/common';
import { NestelyModuleOptions } from './nestely.module-options';

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  ASYNC_OPTIONS_TYPE,
  OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<NestelyModuleOptions>()
  .setExtras(
    {
      isGlobal: true,
    },
    (definition, extras) => {
      return {
        ...definition,
        global: extras.isGlobal,
      };
    },
  )
  .build();
