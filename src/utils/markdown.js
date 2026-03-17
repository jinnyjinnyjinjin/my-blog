import { marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import markedKatex from 'marked-katex-extension'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import python from 'highlight.js/lib/languages/python'
import bash from 'highlight.js/lib/languages/bash'
import html from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'
import json from 'highlight.js/lib/languages/json'
import java from 'highlight.js/lib/languages/java'
import kotlin from 'highlight.js/lib/languages/kotlin'
import sql from 'highlight.js/lib/languages/sql'
import yaml from 'highlight.js/lib/languages/yaml'
import markdown from 'highlight.js/lib/languages/markdown'
import go from 'highlight.js/lib/languages/go'
import rust from 'highlight.js/lib/languages/rust'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('js', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('ts', typescript)
hljs.registerLanguage('python', python)
hljs.registerLanguage('py', python)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('sh', bash)
hljs.registerLanguage('shell', bash)
hljs.registerLanguage('html', html)
hljs.registerLanguage('xml', html)
hljs.registerLanguage('vue', html)
hljs.registerLanguage('css', css)
hljs.registerLanguage('json', json)
hljs.registerLanguage('java', java)
hljs.registerLanguage('kotlin', kotlin)
hljs.registerLanguage('sql', sql)
hljs.registerLanguage('yaml', yaml)
hljs.registerLanguage('yml', yaml)
hljs.registerLanguage('markdown', markdown)
hljs.registerLanguage('go', go)
hljs.registerLanguage('rust', rust)

// Configure marked with highlight.js
marked.use(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const plainLangs = ['text', 'plain', 'plaintext', 'txt']
      if (lang && plainLangs.includes(lang.toLowerCase())) {
        return code
      }
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(code, { language: lang }).value
        } catch (e) {}
      }
      return hljs.highlightAuto(code).value
    }
  })
)

marked.use(markedKatex({ throwOnError: false }))

marked.setOptions({
  breaks: true,
  gfm: true,
})

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/[^\w\s가-힣]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

// Custom renderer for task lists and headings
const renderer = {
  heading({ tokens, depth }) {
    const text = this.parser.parseInline(tokens)
    const id = slugify(text)
    return `<h${depth} id="${id}">${text}</h${depth}>\n`
  },
  listitem(token) {
    let text = ''
    if (token.tokens) {
      for (const t of token.tokens) {
        if (t.type === 'list') {
          text += this.parser.parse([t])
        } else {
          text += this.parser.parseInline([t])
        }
      }
    }

    if (token.task) {
      return `<li class="task-list-item"><input type="checkbox" ${token.checked ? 'checked' : ''} disabled> ${text}</li>\n`
    }
    return `<li>${text}</li>\n`
  }
}
marked.use({ renderer })

export function extractHeadings(content) {
  const headings = []
  const lines = content.split('\n')
  let inCodeBlock = false
  for (const line of lines) {
    if (line.trimStart().startsWith('```')) {
      inCodeBlock = !inCodeBlock
      continue
    }
    if (inCodeBlock) continue
    const match = line.match(/^(#{1,3})\s+(.+)$/)
    if (match) {
      const level = match[1].length
      const text = match[2].trim()
      headings.push({ level, text, id: slugify(text) })
    }
  }
  return headings
}

export function parseMarkdown(content) {
  if (!content) return ''
  return marked.parse(content)
}

export function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (!match) return { meta: {}, content: raw }
  
  const frontmatter = match[1]
  const content = match[2]
  const meta = {}
  
  frontmatter.split('\n').forEach(line => {
    const colonIdx = line.indexOf(':')
    if (colonIdx === -1) return
    const key = line.slice(0, colonIdx).trim()
    let value = line.slice(colonIdx + 1).trim()
    
    // Parse arrays like tags: [vue, javascript]
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1).split(',').map(s => s.trim()).filter(Boolean)
    }
    // Parse quoted strings (only if not already converted to array)
    else if ((value.startsWith('"') && value.endsWith('"')) ||
             (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    
    meta[key] = value
  })
  
  return { meta, content: content.trim() }
}
