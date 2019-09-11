import assert from 'assert'

const cwd = `file://${process.cwd()}`

function stripCwd (str) {
  return str.replace(cwd, '')
}

function customPrepareStackTrace (e, stack) {
  return stack
    .filter(frame => !frame.isNative())
    .filter(frame => {
      const file = frame.getFileName()
      return file && !file.startsWith('internal/')
    })
    .map(frame => `${stripCwd(frame.getFileName())}:${frame.getLineNumber()}`)
    .join('\n')
}

function getLocation (size, f) {
  const originalPrepareStackTrace = Error.prepareStackTrace
  const originalStackTraceLimit = Error.stackTraceLimit
  const trace = {}
  Error.prepareStackTrace = customPrepareStackTrace
  Error.stackTraceLimit = size
  Error.captureStackTrace(trace, f)
  const location = trace.stack
  Error.prepareStackTrace = originalPrepareStackTrace
  Error.stackTraceLimit = originalStackTraceLimit
  return location
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
    location = getLocation(5, test) || extractTraceFallback(e.stack)
    lines = e.message.split('\n')

    if (lines[0].startsWith('AssertionError [ERR_ASSERTION]: Input A expected to ')) lines.splice(0, 3)

    message = lines.join('\n')
  }

  const didPass = lines.length === 0

  if (process.send) process.send({ didPass, title, location, message })

  return { didPass, title, location, message }
}
