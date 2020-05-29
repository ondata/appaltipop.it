import { promises as fs} from 'fs'

export async function getStaticPage(lang, page) {
    return fs.readFile(`./src/static/${lang}/${page}.md`, "utf8")
}
