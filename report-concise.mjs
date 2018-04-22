import perfHooks from 'perf_hooks'

export default function concise ({ title, location, message, timestamp, passed, failed, isComplete }) {
  let str = '\r'

  if (message) str += `\x1b[31m\x1b[1m✖ ${title.padEnd(40)}\x1b[0m\n\x1b[2m${location}\x1b[0m\n${message}\n\n`
  if (passed) str += `\x1b[30m\x1b[42m ${passed} passed \x1b[0m`
  if (failed) str += `\x1b[30m\x1b[41m ${failed} failed \x1b[0m`

  str += `\x1b[36m in ${((perfHooks.performance.now() - timestamp) / 1000).toFixed(3)}s\x1b[0m`
  if (isComplete) str += '\n'

  process.stdout.write(str)
}
