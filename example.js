import run from './runner.js'
import crawl from './crawler.js'
import concise from './report-concise.js'
import verbose from './report-verbose.js'

const fixtures = crawl('./test/fixtures/')

fixtures
  .then(async fixtures => {
    await run(fixtures, concise)

    return fixtures
  })
  .then(fixtures => {
    return run(fixtures, verbose)
  })
