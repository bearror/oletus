const cwd = `file://${process.cwd()}/`

/**
 * Strips the _current working directory_ from the passed in string.
 * @param {string} str The string to process.
 */
export function stripCwd (str) {
  return str.replace(cwd, '')
}
