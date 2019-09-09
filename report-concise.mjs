import perfHooks from 'perf_hooks'

export default function concise ({ type, timestamp, passed, failed, payload }) {
  let str = '\r'

  switch (type) {
    case 'Fail':
      str += `\x1b[31m\x1b[1m✖ ${payload.title.padEnd(40)}\x1b[0m\n\x1b[2m${payload.location}\x1b[0m\n${payload.message}\n\n`
      break

    case 'File':
      if (payload.stderr.length > 0) {
        str += `\x1b[33;1m⚠ ${payload.file} had output on stderr:\x1b[0m`
        str += `\n\x1b[2m${Buffer.concat(payload.stderr).toString('utf8')}\x1b[0m\n`
      }
      break

    case 'Crash': {
      const error = Buffer.concat(payload.stderr).toString('utf8')
      str += `\x1b[31m✖ ${payload.file} crashed with status code ${payload.code}!\x1b[0m`
      if (error) str += `\n\x1b[2m${Buffer.concat(payload.stderr).toString('utf8')}\x1b[0m`
      str += '\n'
      break
    }
  }

  str += `\x1b[30m\x1b[42m ${passed} passed \x1b[0m`
  str += `\x1b[30m\x1b[41m ${failed} failed \x1b[0m`
  str += `\x1b[36m in ${((perfHooks.performance.now() - timestamp) / 1000).toFixed(3)}s\x1b[0m`

  if (type === 'Completion') str += '\n'

  process.stdout.write(str)
}
