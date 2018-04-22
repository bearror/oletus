import test from '../../oletus'

function resolveAfter (time) {
  return new Promise(resolve => setTimeout(() => resolve('resolved'), time))
}

test('promise support', t => {
  return resolveAfter(100).then(result => t.equal(result, 'resolved'))
})
