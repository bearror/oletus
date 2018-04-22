import run from '../runner'
import assert from 'assert'

function fail (e) {
  console.error(e.toString())
  process.exit(1)
}

run('./test/fixtures/')
  .then(({ passed, failed }) => {
    assert.strict.equal(passed, 6)
    assert.strict.equal(failed, 4)
  })
  .catch(e => fail(e))
