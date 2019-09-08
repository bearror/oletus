import assert from 'assert'

const cwd = `file://${process.cwd()}`

function stripCwd (str) {
  return str.replace(cwd, '')
}

function customPrepareStackTrace (e, stack) {
  return stack
    .filter(frame => !frame.isNative())
    .filter(frame => !frame.getFileName().startsWith('internal/'))
    .map(frame => `${stripCwd(frame.getFileName())}:${frame.getLineNumber()}`)
    .join('\n')
}

function extractTraceFallback (trace) {
  return trace
    .split('\n')
    .filter(line => line.startsWith('    at '))
    .map(line => stripCwd(line.replace('    at ', '')))
    .join('\n')
}

export default async function test (title, implementation) {
  let location = ''
  let lines = []
  let message = ''

  try {
    await implementation(assert.strict)
  } catch (e) {
    const originalPrepareStackTrace = Error.prepareStackTrace
    const originalStackTraceLimit = Error.stackTraceLimit
    Error.prepareStackTrace = customPrepareStackTrace
    Error.stackTraceLimit = 5
    const trace = {}
    Error.captureStackTrace(trace, test)
    location = trace.stack || extractTraceFallback(e.stack)
    lines = e.message.split('\n')
    Error.prepareStackTrace = originalPrepareStackTrace
    Error.stackTraceLimit = originalStackTraceLimit

    if (lines[0].startsWith('AssertionError [ERR_ASSERTION]: Input A expected to ')) lines.splice(0, 3)

    message = lines.join('\n')
  }

  const didPass = lines.length === 0

  if (process.send) process.send({ didPass, title, location, message })

  return { didPass, title, location, message }
}
