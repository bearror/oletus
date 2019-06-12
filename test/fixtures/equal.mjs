import test from '../../oletus.mjs'

test('equal pass', t => t.equal('a', 'a'))
test('equal fail', t => t.equal(1, 2))
test('other fail', t => t.equal('a', 'b'))
