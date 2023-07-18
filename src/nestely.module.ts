import { Module } from '@nestjs/common';
import { ConfigurableModuleClass } from './nestely.module-definition';
import { createKyselyProvider } from './kysely.factory';

@Module({
  providers: [createKyselyProvider()],
  exports: [createKyselyProvider()],
})
export class NestelyModule extends ConfigurableModuleClass {}
