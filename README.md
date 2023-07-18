[![build-deploy](https://github.com/marianozunino/nestely/actions/workflows/release.yaml/badge.svg)](https://github.com/marianozunino/nestely/actions/workflows/release.yaml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Coverage Status](https://coveralls.io/repos/github/marianozunino/nestely/badge.svg)](https://coveralls.io/github/marianozunino/nestely)
![npm type definitions](https://img.shields.io/npm/types/nestely4j)
[![current-version](https://img.shields.io/badge/dynamic/json?label=current-version&query=%24.version&url=https%3A%2F%2Fraw.githubusercontent.com%2Fmarianozunino%2Fnestely%2Fmaster%2Fpackage.json)](https://npmjs.com/package/nestely4j)
<a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="25" alt="Nest Logo" /></a>

### Table of Contents
- [Nestely](#nestely)
  + [About](#about)
- [Installation](#installation)
- [NestJs Configuration <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="25" alt="Nest Logo" /></a>](#nestjs-configuration--a-href--http---nestjscom---target--blank---img-src--https---nestjscom-img-logo-smallsvg--width--25--alt--nest-logo------a-)
  + [Using the Kysely instance](#using-the-kysely-instance)

<small><i><a href='http://ecotrust-canada.github.io/markdown-toc/'>Table of contents generated with markdown-toc</a></i></small>


# Nestely

### About
Nestely is a NestJs module that integrates [Kysely](kysely.dev/) into your [NestJs](https://nestjs.com) application.

> What else does this module do?

Nothing else really. It just provides a way to inject the Kysely instance into your services/controllers/repositories.
I created this module just to avoid the same boilerplate code in every NestJs project I create.


This project has been tested with

> - Kysely 0.24
> - SQLite3

# Installation

Install the latest version of Nestely using npm:

```sh
npm install nestely
```

# NestJs Configuration <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="25" alt="Nest Logo" /></a>

In order to configure the module with your [NestJs](https://nestjs.com) application, you need to import the `NestelyModule` into your `AppModule` (or any other module).

```ts
import { Module } from '@nestjs/common';
import { NestelyModule } from 'nestely';

@Module({
  imports: [
    NestelyModule.register({
      plugins: [new CamelCasePlugin()],
      dialect: new SqliteDialect({
        database: new SQLite(':memory:'),
      }),
      isGlobal: true,
    }),
    // Asynchronous configuration
    NestelyModule.registerAsync({
      useFactory: () => ({
        dialect: new SqliteDialect({
          database: new SQLite(':memory:'),
        }),
        plugins: [new CamelCasePlugin()],
      }),
      isGlobal: false, // default is true
    }),
  ],
})
export class AppModule {}
```

#### Using the Kysely instance

Once the module is configured, you can inject the `Kysely` instance into your services/controllers/repositories using the `@InjectKysely()` decorator.

```ts
import { Injectable } from '@nestjs/common';
import { InjectKysely, Kysely } from 'nestely';
import { DB } from './db.interface';

@Injectable()
export class AppService {
  // provide the DB interface
  constructor(@InjectKysely() private readonly kysely: Kysely<DB>) {}

  async findAll(): Promise<void> {
    const result = await sql`select 1+1 as result`.execute(this.kysely);
    console.log(result); // { rows: [ { result: 2 } ] }
  }
}
```


