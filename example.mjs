import run from './runner.mjs'
import crawl from './crawler.mjs'
import concise from './report-concise.mjs'
import verbose from './report-verbose.mjs'

const fixtures = crawl('./test/fixtures/')

fixtures
  .then(fixtures => {
    return run(fixtures, concise)
  })
  .then(fixtures => {
    return run(fixtures, verbose)
  })
