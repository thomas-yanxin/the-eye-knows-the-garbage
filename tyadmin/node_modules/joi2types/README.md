# joi2types

[![codecov](https://codecov.io/gh/ycjcl868/joi2Types/branch/master/graph/badge.svg)](https://codecov.io/gh/ycjcl868/joi2Types) [![NPM version](https://img.shields.io/npm/v/joi2types.svg?style=flat)](https://npmjs.org/package/joi2types) [![NPM downloads](http://img.shields.io/npm/dm/joi2types.svg?style=flat)](https://npmjs.org/package/joi2types) [![CircleCI](https://circleci.com/gh/ycjcl868/joi2types/tree/master.svg?style=svg)](https://circleci.com/gh/ycjcl868/joi2types/tree/master) [![Install size](https://badgen.net/packagephobia/install/joi2types)](https://packagephobia.now.sh/result?p=joi2types)

> a converter transforms @hapi/joi schema into TypeScript types.

[Online demo](https://runkit.com/ycjcl868/joi2types)

## Quick start

Install

```ts
$ npm i joi2types @hapi/joi -S
```

use in your project

```ts
const Joi = require("@hapi/joi");
const joi2Types = require("joi2types").default;

// example for react-router-config
const schema = Joi.array().items(
  Joi.object({
    path: Joi.string().description("Any valid URL path"),
    component: Joi.string().description(
      "A React component to render only when the location matches."
    ),
    redirect: Joi.string().description("navigate to a new location"),
    exact: Joi.boolean().description(
      "When true, the active class/style will only be applied if the location is matched exactly."
    )
  }).unknown()
);

(async () => {
  const types = await joi2Types(schema, {
    bannerComment: "/** comment for test */",
    interfaceName: "IRoute"
  });
  console.log('types', types)
})();
```

It will convert into types as follows:

```ts
/** comment for test */

export type IRoute = {
  /**
   * Any valid URL path
   */
  path?: string;
  /**
   * A React component to render only when the location matches.
   */
  component?: string;
  /**
   * navigate to a new location
   */
  redirect?: string;
  /**
   * When true, the active class/style will only be applied if the location is matched exactly.
   */
  exact?: boolean;
  [k: string]: any;
}[];
```

## TODO

- [ ] support custom type definitions using `tsType`
