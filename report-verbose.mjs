import perfHooks from 'perf_hooks'

export default function verbose ({ didPass, title, location, message, timestamp, file, passed, failed, isComplete }) {
  let str = '\r'

  if (didPass) str += `\x1b[32m✔\x1b[0m ${file.substr(0, file.indexOf('.'))} \x1b[2m›\x1b[0m ${title.padEnd(40)}\n`
  if (message) str += `${' '.padEnd(40)}\n\x1b[31m\x1b[1m✖ ${title}\x1b[0m\n\x1b[2m${location}\x1b[0m\n${message}\n\n`
  if (isComplete) str += `${' '.padEnd(40)}\n`
  if (passed) str += `\x1b[30m\x1b[42m ${passed} passed \x1b[0m`
  if (failed) str += `\x1b[30m\x1b[41m ${failed} failed \x1b[0m`

  str += `\x1b[36m in ${((perfHooks.performance.now() - timestamp) / 1000).toFixed(3)}s\x1b[0m`
  if (isComplete) str += '\n'

  process.stdout.write(str)
}
