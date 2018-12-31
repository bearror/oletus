import test from '../oletus'
import assert from 'assert'

function fail (e) {
  console.error(e.toString())
  process.exit(1)
}

function resolveAfter (time) {
  return new Promise(resolve => setTimeout(() => resolve('resolved'), time))
}

test('equal pass', t => t.equal('a', 'a'))
  .then(({ didPass, title, location, message, teardownCalled }) => {
    assert.strict.equal(didPass, true)
    assert.strict.equal(title, 'equal pass')
    assert.strict.equal(location, '')
    assert.strict.equal(message, '')
    assert.strict.equal(teardownCalled, false)
  })
  .catch(e => fail(e))

test('equal fail', t => t.equal('a', 'b'))
  .then(({ didPass, title, location, message, teardownCalled }) => {
    assert.strict.equal(didPass, false)
    assert.strict.equal(title, 'equal fail')
    assert.strict.equal(location, 'test.mjs:23')
    assert.strict.equal(message.split('\n').length, 2)
    assert.strict.equal(teardownCalled, false)
  })
  .catch(e => fail(e))

test('ok pass', t => t.ok(true))
  .then(({ didPass, title, location, message, teardownCalled }) => {
    assert.strict.equal(didPass, true)
    assert.strict.equal(title, 'ok pass')
    assert.strict.equal(location, '')
    assert.strict.equal(message, '')
    assert.strict.equal(teardownCalled, false)
  })
  .catch(e => fail(e))

test('ok fail', t => t.ok(false))
  .then(({ didPass, title, location, message, teardownCalled }) => {
    assert.strict.equal(didPass, false)
    assert.strict.equal(title, 'ok fail')
    assert.strict.equal(location, 'test.mjs:43')
    assert.strict.equal(message.split('\n').length, 1)
    assert.strict.equal(teardownCalled, false)
  })
  .catch(e => fail(e))

test('deepEqual pass', t => t.deepEqual({ a: { b: 42 } }, { a: { b: 42 } }))
  .then(({ didPass, title, location, message, teardownCalled }) => {
    assert.strict.equal(didPass, true)
    assert.strict.equal(title, 'deepEqual pass')
    assert.strict.equal(location, '')
    assert.strict.equal(message, '')
    assert.strict.equal(teardownCalled, false)
  })
  .catch(e => fail(e))

test('deepEqual fail', t => t.deepEqual({ a: { b: 42 } }, { a: { B: 42 } }))
  .then(({ didPass, title, location, message, teardownCalled }) => {
    assert.strict.equal(didPass, false)
    assert.strict.equal(title, 'deepEqual fail')
    assert.strict.equal(location, 'test.mjs:63')
    assert.strict.equal(message.split('\n').length, 6)
    assert.strict.equal(teardownCalled, false)
  })
  .catch(e => fail(e))

test('async pass', async t => t.equal(await resolveAfter(500), 'resolved'))
  .then(({ didPass, title, location, message, teardownCalled }) => {
    assert.strict.equal(didPass, true)
    assert.strict.equal(title, 'async pass')
    assert.strict.equal(location, '')
    assert.strict.equal(message, '')
    assert.strict.equal(teardownCalled, false)
  })
  .catch(e => fail(e))

test('async fail', async t => t.equal(await resolveAfter(777), ''))
  .then(({ didPass, title, location, message, teardownCalled }) => {
    assert.strict.equal(didPass, false)
    assert.strict.equal(title, 'async fail')
    assert.strict.equal(location, 'test.mjs:83')
    assert.strict.equal(message.split('\n').length, 2)
    assert.strict.equal(teardownCalled, false)
  })
  .catch(e => fail(e))

test('promise pass', t => resolveAfter(100).then(result => t.equal(result, 'resolved')))
  .then(({ didPass, title, location, message, teardownCalled }) => {
    assert.strict.equal(didPass, true)
    assert.strict.equal(title, 'promise pass')
    assert.strict.equal(location, '')
    assert.strict.equal(message, '')
    assert.strict.equal(teardownCalled, false)
  })
  .catch(e => fail(e))

test('promise fail', t => resolveAfter(100).then(result => t.equal(result, '')))
  .then(({ didPass, title, location, message, teardownCalled }) => {
    assert.strict.equal(didPass, false)
    assert.strict.equal(title, 'promise fail')
    assert.strict.equal(location, 'test.mjs:103')
    assert.strict.equal(message.split('\n').length, 2)
    assert.strict.equal(teardownCalled, false)
  })
  .catch(e => fail(e))

test('teardown called', (t, teardown) => {
  const checkings = {}
  teardown(() => {
    checkings.teardownCalled = true;
  });
})
.then(({ didPass, title, location, message, teardownCalled }) => {
  assert.strict.equal(didPass, true)
  assert.strict.equal(title, 'teardown called')
  assert.strict.equal(location, '')
  assert.strict.equal(message, '')
  assert.strict.equal(teardownCalled, true)
})