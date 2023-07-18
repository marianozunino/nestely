import { Inject } from '@nestjs/common';
import { KYSELY_CONNECTION_TOKEN } from '../constants';

export const InjectKysely = (): ReturnType<typeof Inject> => {
  return Inject(KYSELY_CONNECTION_TOKEN);
};
