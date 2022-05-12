import perfHooks from 'perf_hooks'

export default function verbose ({ type, timestamp, passed, failed, pending, payload }) {
  let str = '\r'

  switch (type) {
    case 'Pass':
      str += `\x1b[32m✔\x1b[0m ${payload.file.substr(0, payload.file.indexOf('.'))} \x1b[2m›\x1b[0m ${payload.title.padEnd(45)}\n`
      break

    case 'Fail':
      str += `${' '.padEnd(45)}\n\x1b[31m\x1b[1m✖ ${payload.title}\x1b[0m\n\x1b[2m${payload.location}\x1b[0m\n${payload.message}\n\n`
      break

    case 'File':
      if (payload.stderr.length > 0) {
        str += `\x1b[33;1m⚠ ${payload.file} had output on stderr:\x1b[0m`
        str += `\n\x1b[2m${Buffer.concat(payload.stderr).toString('utf8')}\x1b[0m\n`
      }
      if (payload.running.size > 0) {
        str += `\x1b[31m✖ ${payload.file} exited with ${payload.running.size} test(s) still pending:\x1b[0m`
        str += `\n${Array.from(payload.running.values()).map(title => `    \x1b[2m- ${title}\x1b[0m\n`).join('')}\n`
      }
      break

    case 'Crash': {
      const error = Buffer.concat(payload.stderr).toString('utf8')
      str += `\x1b[31m✖ ${payload.file} crashed with status code ${payload.code}!\x1b[0m`
      if (error) str += `\n\x1b[2m${Buffer.concat(payload.stderr).toString('utf8')}\x1b[0m`
      str += '\n'
      break
    }

    case 'Completion':
      str += `${' '.padEnd(45)}\n`
      break
  }

  str += `\x1b[30m\x1b[42m ${passed} passed \x1b[0m`
  str += `\x1b[30m\x1b[41m ${failed} failed \x1b[0m`
  str += `\x1b[30m\x1b[43m ${pending} pending \x1b[0m`
  str += `\x1b[36m in ${((perfHooks.performance.now() - timestamp) / 1000).toFixed(3)}s\x1b[0m`
  str += ' '.padEnd(5)

  if (type === 'Completion') str += '\n'

  process.stdout.write(str)
}
