#! /usr/bin/env node
import run from './runner.mjs'
import concise from './report-concise.mjs'
import verbose from './report-verbose.mjs'
import crawl from './crawler.mjs'

crawl('./test/')
  .then(files => run(files, process.env.CI ? verbose : concise))
  .then(({ passed, failed }) => failed ? process.exit(1) : process.exit(0))
  .catch(err => {
    process.stderr.write(err.toString())
    process.exit(1)
  })
