import run from './runner.mjs'
import concise from './report-concise.mjs'
import verbose from './report-verbose.mjs'

run('./test/fixtures/', concise).then(() => run('./test/fixtures/', verbose))
