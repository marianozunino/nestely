/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, beforeEach, it, expect } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { InjectKysely, NestelyModule } from '../src';

import { INestApplication } from '@nestjs/common';

import { CamelCasePlugin, Kysely, SqliteDialect, sql } from 'kysely';
import SQLite from 'better-sqlite3';
import { KYSELY_CONNECTION_TOKEN } from '../src/constants';

class TestService {
  constructor(@InjectKysely() private readonly kysely: Kysely<any>) {}

  getKysely() {
    return this.kysely;
  }
}

describe('Nestely Module', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const dialect = new SqliteDialect({
      database: new SQLite(':memory:'),
    });

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        NestelyModule.register({
          plugins: [new CamelCasePlugin()],
          dialect: dialect,
          isGlobal: true,
        }),
      ],
      providers: [TestService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  it('should be able to inject Kysely', () => {
    const kysely = app.get(KYSELY_CONNECTION_TOKEN);
    expect(kysely).toBeDefined();
  });

  it('should be able to inject Kysely using the @InjectKysely decorator', () => {
    const testService = app.get(TestService);
    expect(testService.getKysely()).toBeDefined();
  });

  it('the module should be global', () => {
    const kysely = app.get(KYSELY_CONNECTION_TOKEN);
    expect(kysely).toBeDefined();
  });

  it('the service should be able to query 1+1', async () => {
    const testService = app.get(TestService);
    const db = testService.getKysely();
    expect(db).toBeDefined();

    const result = await sql`select 1+1 as result`.execute(db);

    expect(result).toEqual({ rows: [{ result: 2 }] });
  });

  it('the module should be local', async () => {
    class ModuleAService {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      constructor(@InjectKysely() _kysely: Kysely<any>) {}
    }

    class ModuleA {
      static register() {
        return {
          module: ModuleA,
          providers: [ModuleAService],
          exports: [ModuleAService],
        };
      }
    }

    class ModuleBService {
      constructor(@InjectKysely() _kysely: Kysely<any>) {}
    }

    class ModuleB {
      static register() {
        return {
          imports: [
            NestelyModule.registerAsync({
              useFactory: () => ({
                dialect: new SqliteDialect({
                  database: new SQLite(':memory:'),
                }),
                plugins: [new CamelCasePlugin()],
              }),
              isGlobal: false,
            }),
          ],
          module: ModuleB,
          providers: [ModuleBService],
          exports: [ModuleBService],
        };
      }
    }

    expect.assertions(1);
    try {
      await Test.createTestingModule({
        imports: [ModuleB.register(), ModuleA.register()],
      }).compile();
    } catch (error) {
      expect(error.message).toContain(
        'Please make sure that the argument Symbol(KYSELY_CONNECTION_TOKEN) at index [0] is available in the ModuleA context.',
      );
    }
  });
});
