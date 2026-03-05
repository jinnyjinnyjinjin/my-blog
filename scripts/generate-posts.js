import { readdir, readFile, writeFile, stat } from 'fs/promises'
import { join, basename } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const postsDir = join(__dirname, '../public/posts')
const isDev = process.env.NODE_ENV === 'development'

function parseFrontmatter(raw) {
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
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1).split(',').map(s => s.trim()).filter(Boolean)
    }
    else if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    meta[key] = value
  })
  return { meta, content: content.trim() }
}

// Recursively scan directory for .md files
async function scanDirectory(dir, basePath = '') {
  const entries = await readdir(dir)
  const posts = []

  for (const entry of entries) {
    const fullPath = join(dir, entry)
    const relativePath = basePath ? `${basePath}/${entry}` : entry
    const stats = await stat(fullPath)

    if (stats.isDirectory()) {
      // Recursively scan subdirectories
      const subPosts = await scanDirectory(fullPath, relativePath)
      posts.push(...subPosts)
    } else if (entry.endsWith('.md')) {
      const slug = basename(entry, '.md')
      const path = relativePath.replace('.md', '')
      const raw = await readFile(fullPath, 'utf-8')
      const { meta, content } = parseFrontmatter(raw)

      const draft = meta.draft === 'true' || meta.draft === true
      if (draft && !isDev) continue

      const words = content.split(/\s+/).filter(Boolean).length
      const readingTime = Math.ceil(words / 200) || 1

      posts.push({
        slug,
        path,
        title: meta.title || slug,
        excerpt: meta.excerpt || content.slice(0, 150).replace(/[#*`\n]/g, ' ').trim() + '...',
        date: meta.date || new Date().toISOString().split('T')[0],
        category: meta.category || '',
        tags: Array.isArray(meta.tags) ? meta.tags : (meta.tags ? [meta.tags] : []),
        readingTime,
        ...(draft && { draft: true }),
      })
    }
  }

  return posts
}

async function generateManifest() {
  console.log('Scanning posts directory...')

  const posts = await scanDirectory(postsDir)
  posts.sort((a, b) => new Date(b.date) - new Date(a.date))

  await writeFile(
    join(postsDir, 'posts.json'),
    JSON.stringify(posts, null, 2)
  )

  console.log(`Generated posts.json with ${posts.length} posts:`)
  posts.forEach(p => console.log(`  - ${p.path}`))
}

generateManifest().catch(console.error)
