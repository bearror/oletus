# ▶ oletus

[![Build Status](https://travis-ci.org/bearror/oletus.svg?branch=master)](https://travis-ci.org/bearror/oletus)

A zero configuration, zero dependency test runner for ECMAScript Modules—made specifically for getting started quick. Painless migration to the bigger guns if you end up needing them.

## Features

- **Native ECMAScript Modules support**.
- **Simple**: No configuration. No test timeouts. No global scope pollution. No runner hooks. No compilation step. No source maps.
- **Super fast**: Asynchronous tests run concurrently, individual modules run concurrently using multiple CPUs, no overhead from compilation.

## Usage

### Test Syntax

```js
import test from 'oletus'

// this should look pretty familiar
test('arrays are equal', t => {
  t.deepEqual([1, 2], [1, 2])
})

// you can use async functions or otherwise return Promises
test('bar', async t => {
  const bar = Promise.resolve('bar')
  t.equal(await bar, 'bar')
})
```

### Add oletus to your project

Install it with npm:

```bash
npm install --save-dev oletus
```

Modify the `test` script in your `package.json`:

```json
{
  "test": "oletus"
}
```

### Older versions of Node

On Node 12 you need to pass [`--experimental-modules`](https://nodejs.org/dist/latest-v12.x/docs/api/esm.html#esm_enabling):

```json
{
  "test": "node --experimental-modules --no-warnings -- ./node_modules/.bin/oletus"
}
```

For even older Node versions, use [esm](https://github.com/standard-things/esm#esm):

```json
{
  "test": "node -r esm -- ./node_modules/.bin/oletus"
}
```

### Test locations

By default, Oletus runs all files that exist in your `/test` directory.
Alternatively, you can specify a list of files to run. Note that the glob
pattern in the example below is handled by your shell, not by Oletus.

```json
{
  "test": "oletus test.js src/**/*.test.mjs"
}
```

## Reporters

Oletus has a *concise reporter* on local runs and a *verbose reporter* on CI environments.

<img src="./oletus-reporters.png">

## API

### `test :: (String, StrictAssertModule -> Promise?) -> Promise TestResult`

The `test` function, which is the default export from Oletus, takes the following arguments:

- `title`: A String describing the test case.
- `implementation`: A function that runs your assertions. The implementation has a single parameter (`t`, for example) that gets passed the [strict node assertion](https://nodejs.org/api/assert.html#assert_strict_mode) module. If this function returns a Promise, Oletus awaits the result to know if your test
passes. Otherwise the test is assumed to pass if it doesn't throw.

The return value from `test` function is a Promise of an object with the following shape `{ didPass, title, location, message }`. Note that for most cases, you don't actually need to do anything with the returned Promise, but for reference, this is what its resolution value looks like:

- `didPass`: A boolean to indicate whether the test has passed.
- `title`: The title of the test.
- `location`: The stack trace for the failure reason, or an empty string if `didPass` was `true`.
- `message` The failure reason, or an empty string if `didPass` was `true`.

## Examples

### Code coverage

Oletus works great together with [`c8`](https://github.com/bcoe/c8). C8 is a tool for running code coverage natively using the V8 built-in code coverage functionality. The reason this pairs well with Oletus is because with Oletus, you tend to run your ESM code natively, and no other coverage tools can deal with that. Set it up like this:

```json
{
  "test": "c8 oletus test.js src/**/*.test.mjs"
}
```

### Using Oletus for testing CommonJS modules

Your codebase doesn't need to be written as EcmaScript 6 modules to use Oletus. The only part of your code that really needs to contain es6 modules is your tests themselves. But you're free to import CommonJS modules via [CommonJS Interoperability](https://nodejs.org/dist/latest/docs/api/esm.html#esm_interoperability_with_commonjs):

```js
import test from 'oletus'
import myCJSModule from '../src/index.js'

test ('my export', t => {
  t.equals (myCJSModule.myExportedAnswer, 42)
})
```

### Running tests in sequence instead of parallely

Because the `test` function returns a Promise, it's quite straight-forward to
modify the execution order or rewire things any other way:

```js
const runTests = async () => {
  await test('foo', async t => {
    const foo = Promise.resolve('foo')
    t.equal(await foo, 'foo')
  })

  await test('bar', async t => {
    const bar = Promise.resolve('bar')
    t.equal(await bar, 'bar')
  })
}

runTests()
```

### Setup and teardown

Because the `test` function returns a Promise, it's quite straight-forward to
wrap a test in setup and teardown logic:

```js
const testWithDatabase = async (title, implementation) => {
  const database = await setupDatabase()
  await test (title, t => implementation(t, database))
  await teardownDatabase()
}

testWithDatabase ('has users', async (t, database) => {
  const users = await database.queryUsers()
  t.equals (users, [{ name: 'bob' }])
})
```

### Programmatic use

Besides the CLI, there's also an interface for programmatic use:

```js
import run from 'oletus/runner.mjs'
import concise from 'oletus/report-concise.mjs'

const { passed, failed, crashed } = await run(['test/index.mjs'], concise)

console.log (
  '%s tests passed, %s tests failed, and %s files crashed',
  passed, failed, crashed
)
```

## Author

Joonatan Vuorinen ([@bearror](https://twitter.com/bearror))
