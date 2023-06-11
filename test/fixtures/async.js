import test from '../../oletus.js'

function resolveAfter (time) {
  return new Promise(resolve => setTimeout(() => resolve('resolved'), time))
}

test('short async pass', async t => t.equal(await resolveAfter(100), 'resolved'))
test('longer async pass', async t => t.equal(await resolveAfter(500), 'resolved'))
test('longest async pass', async t => t.equal(await resolveAfter(2000), 'resolved'))
test('async fail', async t => t.equal(await resolveAfter(777), ''))
