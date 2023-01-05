import { remark } from 'remark'
import html from 'remark-html'

type Html = string

export const parseMarkdown = async (markdown: string): Promise<Html> => {
    const processed = await remark().use(html).process(markdown)
    return processed.toString('utf8')
}
