import test from '../oletus.mjs'
import assert from 'assert'

function fail (e) {
  console.error(e.toString())
  process.exit(1)
}

function resolveAfter (time) {
  return new Promise(resolve => setTimeout(() => resolve('resolved'), time))
}

test('equal pass', t => t.equal('a', 'a'))
  .then(({ status, title, location, message }) => {
    assert.strict.equal(status, 'passed')
    assert.strict.equal(title, 'equal pass')
    assert.strict.equal(location, '')
    assert.strict.equal(message, '')
  })
  .catch(e => fail(e))

test('equal fail', t => t.equal('a', 'b'))
  .then(({ status, title, location, message }) => {
    assert.strict.equal(status, 'failed')
    assert.strict.equal(title, 'equal fail')
    assert.strict.equal(location, '/test/test.mjs:22')
    assert.strict.equal(typeof message, 'string')
  })
  .catch(e => fail(e))

test('ok pass', t => t.ok(true))
  .then(({ status, title, location, message }) => {
    assert.strict.equal(status, 'passed')
    assert.strict.equal(title, 'ok pass')
    assert.strict.equal(location, '')
    assert.strict.equal(message, '')
  })
  .catch(e => fail(e))

test('ok fail', t => t.ok(false))
  .then(({ status, title, location, message }) => {
    assert.strict.equal(status, 'failed')
    assert.strict.equal(title, 'ok fail')
    assert.strict.equal(location, '/test/test.mjs:40')
    assert.strict.equal(message.split('\n').length, 1)
  })
  .catch(e => fail(e))

test('deepEqual pass', t => t.deepEqual({ a: { b: 42 } }, { a: { b: 42 } }))
  .then(({ status, title, location, message }) => {
    assert.strict.equal(status, 'passed')
    assert.strict.equal(title, 'deepEqual pass')
    assert.strict.equal(location, '')
    assert.strict.equal(message, '')
  })
  .catch(e => fail(e))

test('deepEqual fail', t => t.deepEqual({ a: { b: 42 } }, { a: { B: 42 } }))
  .then(({ status, title, location, message }) => {
    assert.strict.equal(status, 'failed')
    assert.strict.equal(title, 'deepEqual fail')
    assert.strict.equal(location, '/test/test.mjs:58')
    assert.strict.equal(typeof message, 'string')
  })
  .catch(e => fail(e))

test('async pass', async t => t.equal(await resolveAfter(500), 'resolved'))
  .then(({ status, title, location, message }) => {
    assert.strict.equal(status, 'passed')
    assert.strict.equal(title, 'async pass')
    assert.strict.equal(location, '')
    assert.strict.equal(message, '')
  })
  .catch(e => fail(e))

test('async fail', async t => t.equal(await resolveAfter(777), ''))
  .then(({ status, title, location, message }) => {
    assert.strict.equal(status, 'failed')
    assert.strict.equal(title, 'async fail')
    assert.strict.ok(location.includes('/test/test.mjs:76:33'))
    assert.strict.equal(typeof message, 'string')
  })
  .catch(e => fail(e))

test('promise pass', t => resolveAfter(100).then(result => t.equal(result, 'resolved')))
  .then(({ status, title, location, message }) => {
    assert.strict.equal(status, 'passed')
    assert.strict.equal(title, 'promise pass')
    assert.strict.equal(location, '')
    assert.strict.equal(message, '')
  })
  .catch(e => fail(e))

test('promise fail', t => resolveAfter(100).then(result => t.equal(result, '')))
  .then(({ status, title, location, message }) => {
    assert.strict.equal(status, 'failed')
    assert.strict.equal(title, 'promise fail')
    assert.strict.ok(location.includes('/test/test.mjs:94:62'))
    assert.strict.equal(typeof message, 'string')
  })
  .catch(e => fail(e))
