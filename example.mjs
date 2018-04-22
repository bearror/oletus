import run from './runner'
import concise from './report-concise'
import verbose from './report-verbose'

run('./test/fixtures/', concise).then(() => run('./test/fixtures/', verbose))
