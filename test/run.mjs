import run from '../runner.mjs'
import crawl from '../crawler.mjs'
import assert from 'assert'

function fail (e) {
  console.error(e.toString())
  process.exit(1)
}

crawl('./test/fixtures/')
  .then(run)
  .then(({ passed, failed, pending, crashed }) => {
    assert.strict.equal(passed, 6)
    assert.strict.equal(failed, 4)
    assert.strict.equal(pending, 1)
    assert.strict.equal(crashed, 1)
  })
  .catch(e => fail(e))
