import fs from 'fs'
import util from 'util'
import path from 'path'

const readdir = util.promisify(fs.readdir)

export default function crawl (dir) {
  return readdir(dir)
    .then(files => files.map(file => path.resolve(dir, file)))
}
