import assert, { AssertionError } from 'assert'
import { stripCwd } from './util.mjs'

/**
 * Custom stack trace formatter for overriding `Error.prepareStackTrace` to
 * generate a more readable stack trace.
 * @param {Error} e The error related to a failing test.
 * @param {NodeJS.CallSite[]} stack The raw v8 stack.
 */
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

/**
 * Extracts location information from the stack trace of a failed test.
 * @param {number} size The number of stack frames collected.
 * @param {function} f The function acting as a stack trace frame boundary.
 * @returns {(string|void)} The location information if it could be extracted.
 */
function getLocation (size, f) {
  const originalPrepareStackTrace = Error.prepareStackTrace
  const originalStackTraceLimit = Error.stackTraceLimit

  const trace = {}

  // Capture the stack trace with the custom location formatting.
  Error.prepareStackTrace = customPrepareStackTrace
  Error.stackTraceLimit = size
  Error.captureStackTrace(trace, f)

  const location = trace.stack

  // Restore the constructor to avoid altering behaviour in user code.
  Error.prepareStackTrace = originalPrepareStackTrace
  Error.stackTraceLimit = originalStackTraceLimit

  return location
}

/**
 * Formats a stack trace string in a case where the raw v8 stack cannot be
 * be captured with `Error.captureStackTrace`. E.g. errors thrown from `async`
 * tests.
 * @param {string} stack The stack trace to be extracted.
 */
function extractTraceFallback (stack) {
  return stack
    .split('\n')
    .filter(line => line.startsWith('    at '))
    .map(line => stripCwd(line.replace('    at ', '')))
    .join('\n')
}

/**
 * Wraps _the user code to be tested_, reporting back to the test runner.
 * @param {string} title The title of the test.
 * @param {function(typeof assert):void} implementation The implemented test.
 * @example
 * test('arrays are equal', t => {
 *   t.deepEqual([1, 2], [1, 2])
 * })
 */
export default async function test (title, implementation) {
  let didPass = true
  let location = ''
  let message = ''

  try {
    await implementation(assert.strict)
  } catch (e) {
    didPass = false // any uncaught error in `implementation` counts as a fail
    location = getLocation(5, test) || extractTraceFallback(e.stack)
    message = e.message

    // Omit the verbose assertion boilerplate from reporting.
    if (e instanceof AssertionError) {
      message = e.message.split('\n').slice(2).join('\n')
    }
  }

  // Report the status of a completed test back to the `runner`...
  if (process.send) process.send({ didPass, title, location, message })
  return { didPass, title, location, message } // ...and direct assertions
}
