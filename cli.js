#! /usr/bin/env node
import run from './runner.js'
import concise from './report-concise.js'
import verbose from './report-verbose.js'
import crawl from './crawler.js'

const eventualFiles = process.argv.length > 2
  ? Promise.resolve(process.argv.slice(2))
  : crawl('./test/')

eventualFiles
  .then(files => run(files, process.env.CI ? verbose : concise))
  .then(({ passed, failed, crashed, pending }) => (failed + crashed + pending > 0)
    ? process.exit(1)
    : process.exit(0)
  )
  .catch(err => {
    process.stderr.write(err.toString())
    process.exit(1)
  })
