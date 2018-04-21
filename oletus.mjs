import fs from 'fs'
import childProcess from 'child_process'
import perfHooks from 'perf_hooks'
import assert from 'assert'

function report (message, timestamp, passed, failed, clear) {
  let str = ''

  if (message) str += message
  if (passed) str += `\x1b[30m\x1b[42m ${passed} passed \x1b[0m`
  if (failed) str += `\x1b[30m\x1b[41m ${failed} failed \x1b[0m`

  str += `\x1b[36m in ${
    ((perfHooks.performance.now() - timestamp) / 1000).toFixed(3)
  }s\x1b[0m${clear ? '\r' : '\n'}`

  process.stdout.write(str)
}

function run (testDirectory) {
  const timestamp = perfHooks.performance.now()

  fs.readdir(testDirectory, (err, files) => {
    if (err) return console.error(err)

    let passed = 0
    let failed = 0

    Promise.all(files.map(file => {
      return new Promise(resolve => {
        const forked = childProcess.fork(`${testDirectory}${file}`)

        forked.on('message', ({ didPass, message }) => {
          didPass ? passed++ : failed++
          report(message, timestamp, passed, failed, true)
        })
        forked.on('close', () => resolve())
      })
    }))
      .then(results => report('', timestamp, passed, failed, false))
  })
}

if (typeof process.send !== 'function') run('./test/')

async function test (title, implementation) {
  Error.prepareStackTrace = (e, stack) => stack

  let lines = []
  let message = ''

  try {
    await implementation(assert.strict)
  } catch (e) {
    lines = e.toString().split('\n')

    if (lines[0].startsWith('AssertionError [ERR_ASSERTION]: Input A expected to ')) lines.splice(0, 3)

    lines.unshift(
      `\x1b[31m\x1b[1m✖ ${title.padEnd(40)}\x1b[0m`,
      `\x1b[2m${/[^/]*$/.exec(e.stack[0].getFileName())[0]}:${e.stack[0].getLineNumber()}\x1b[0m`)

    message = `${lines.join('\n')}\n\n`
  }

  process.send({ didPass: lines.length === 0, message })
}

export { test as defualt, run }
