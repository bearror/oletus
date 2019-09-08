import run from '../runner.mjs'
import crawl from '../crawler.mjs'
import assert from 'assert'

function fail (e) {
  console.error(e.toString())
  process.exit(1)
}

crawl('./test/fixtures/')
  .then(run)
  .then(({ passed, failed }) => {
    assert.strict.equal(passed, 6)
    assert.strict.equal(failed, 4)
  })
  .catch(e => fail(e))
