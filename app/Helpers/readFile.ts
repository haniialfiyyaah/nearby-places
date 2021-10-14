import { promises as fs } from 'fs'

export default async (PATH) =>
  JSON.parse((await fs.readFile(PATH)).toString()).data
