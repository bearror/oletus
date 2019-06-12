import test from '../../oletus.mjs'

test('deepEqual pass', t => t.deepEqual({ a: { b: 1 } }, { a: { b: 1 } }))
test('deepEqual fail', t => t.deepEqual({ a: { b: 1 } }, { A: { b: 1 } }))
