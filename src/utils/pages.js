import { promises as fs } from 'fs'

export async function getStaticPage (page) {
  return {
    ...page,
    content: page.source
      ? await fs.readFile(`./src/locales/${page.source}`, 'utf8')
      : page.content
  }
}
