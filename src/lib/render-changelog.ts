export type ChangelogEntry = {
  id: string
  date: string
  title: string
  html: string
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function renderInline(text: string): string {
  let out = escapeHtml(text)
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>')
  return out
}

const SECTION_HEADING =
  /^(FILES MODIFIED(?: \(and why\))?|FILES CREATED|FILES DELETED|FILES NOT MODIFIED(?: \(and why\))?|CHANGES|DESIGN DECISIONS|COMPATIBILITY|NEXT STEPS)$/i

function renderList(lines: string[]): string {
  const items: string[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    const topMatch = line.match(/^- (.+)$/)
    if (!topMatch) {
      i++
      continue
    }

    const nested: string[] = []
    let j = i + 1
    while (j < lines.length && lines[j].match(/^  - /)) {
      nested.push(`<li>${renderInline(lines[j].slice(4))}</li>`)
      j++
    }

    const nestedHtml =
      nested.length > 0 ? `<ul class="cl-ul">${nested.join('')}</ul>` : ''
    items.push(`<li>${renderInline(topMatch[1])}${nestedHtml}</li>`)
    i = j > i + 1 ? j : i + 1
  }

  if (!items.length) return ''
  return `<ul class="cl-ul">${items.join('')}</ul>`
}

function renderBlock(block: string): string {
  const trimmed = block.trim()
  if (!trimmed) return ''

  if (trimmed.startsWith('```')) {
    const code = trimmed.replace(/^```[^\n]*\n?/, '').replace(/\n?```$/, '')
    return `<pre class="cl-pre"><code>${escapeHtml(code)}</code></pre>`
  }

  const lines = trimmed.split('\n')
  const first = lines[0]?.trim() ?? ''

  if (first.startsWith('### ')) {
    const heading = first.slice(4)
    const rest = lines.slice(1)
    return `<h4 class="cl-h4">${renderInline(heading)}</h4>${renderList(rest) || renderBlock(rest.join('\n').trim())}`
  }

  if (SECTION_HEADING.test(first)) {
    const rest = lines.slice(1)
    const listHtml = renderList(rest)
    if (listHtml) {
      return `<h4 class="cl-h4">${escapeHtml(first)}</h4>${listHtml}`
    }
  }

  if (lines.every((l) => l.match(/^- /) || l.match(/^  - /) || l.trim() === '')) {
    return renderList(lines.filter((l) => l.trim()))
  }

  return `<p class="cl-p">${renderInline(trimmed.replace(/\n/g, ' '))}</p>`
}

export function renderChangelogBody(body: string): string {
  const blocks = body.split(/\n\n+/).filter(Boolean)
  return blocks.map(renderBlock).join('')
}

export function parseChangelogMarkdown(markdown: string): ChangelogEntry[] {
  const normalized = markdown.replace(/^#\s+OpenSpec Friendly Kit Changelog\s*/i, '').trim()
  const chunks = normalized.split(/\n(?=## \[)/).filter(Boolean)

  return chunks.map((chunk, index) => {
    const firstLine = chunk.split('\n')[0] ?? ''
    const match = firstLine.match(/^## \[([^\]]+)\]\s*-\s*(.+)$/)
    const date = match?.[1] ?? `entry-${index}`
    const title = match?.[2]?.trim() ?? firstLine.replace(/^##\s*/, '')
    const body = chunk.slice(firstLine.length).trim()
    const id = `${date}-${index}`.replace(/[^\w-]+/g, '-').toLowerCase()

    return {
      id,
      date,
      title,
      html: renderChangelogBody(body),
    }
  })
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function changelogSectionId(lang: 'en' | 'vi'): string {
  return lang === 'vi' ? 'nhat-ky-thay-doi' : 'changelog'
}

export { slugify }
