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
      nested.length > 0 ? `<ul class="kit-agent-ul">${nested.join('')}</ul>` : ''
    items.push(`<li>${renderInline(topMatch[1])}${nestedHtml}</li>`)
    i = j > i + 1 ? j : i + 1
  }

  if (!items.length) return ''
  return `<ul class="kit-agent-ul">${items.join('')}</ul>`
}

function renderTable(lines: string[]): string {
  const rows = lines.filter((l) => l.trim().startsWith('|'))
  if (rows.length < 2) return ''

  const parseRow = (row: string) =>
    row
      .split('|')
      .slice(1, -1)
      .map((c) => c.trim())

  const header = parseRow(rows[0])
  const bodyRows = rows.slice(2).map(parseRow)

  const thead = `<thead><tr>${header.map((c) => `<th>${renderInline(c)}</th>`).join('')}</tr></thead>`
  const tbody = `<tbody>${bodyRows
    .map(
      (cells) =>
        `<tr>${cells.map((c) => `<td>${renderInline(c)}</td>`).join('')}</tr>`,
    )
    .join('')}</tbody>`

  return `<div class="tablewrap kit-agent-table"><table>${thead}${tbody}</table></div>`
}

function renderBlockquote(lines: string[]): string {
  const text = lines.map((l) => l.replace(/^>\s?/, '')).join('\n').trim()
  if (!text.startsWith('```')) {
    return `<blockquote class="kit-agent-quote"><p>${renderInline(text.replace(/\n/g, ' '))}</p></blockquote>`
  }
  return renderBlock(text)
}

function renderBlock(block: string): string {
  const trimmed = block.trim()
  if (!trimmed) return ''

  if (trimmed.startsWith('```')) {
    const code = trimmed.replace(/^```[^\n]*\n?/, '').replace(/\n?```$/, '')
    return `<pre class="kit-agent-pre"><code>${escapeHtml(code)}</code></pre>`
  }

  const lines = trimmed.split('\n')
  const first = lines[0]?.trim() ?? ''

  if (first.startsWith('## ')) {
    const heading = first.slice(3)
    const rest = lines.slice(1).join('\n').trim()
    return `<h3 class="kit-agent-h3">${renderInline(heading)}</h3>${renderAgentBody(rest)}`
  }

  if (first.startsWith('### ')) {
    const heading = first.slice(4)
    const rest = lines.slice(1).join('\n').trim()
    return `<h4 class="kit-agent-h4">${renderInline(heading)}</h4>${renderAgentBody(rest)}`
  }

  if (lines.every((l) => l.trim().startsWith('|'))) {
    return renderTable(lines)
  }

  if (lines.some((l) => l.match(/^- /)) && lines.every((l) => l.match(/^- /) || l.match(/^  - /) || l.trim() === '')) {
    return renderList(lines.filter((l) => l.trim()))
  }

  if (lines.every((l) => l.startsWith('>') || l.trim() === '')) {
    return renderBlockquote(lines.filter((l) => l.trim()))
  }

  if (/^[A-Z][A-Z0-9 _-]+$/.test(first) && lines.length > 1) {
    const rest = lines.slice(1)
    if (rest.every((l) => l.match(/^- /) || l.match(/^\d+\. /) || l.trim() === '')) {
      return `<h4 class="kit-agent-h4">${escapeHtml(first)}</h4>${renderList(rest.filter((l) => l.trim()))}`
    }
  }

  if (lines.length > 1 && lines.some((l) => l.match(/^- /))) {
    const intro = lines.filter((l) => !l.match(/^- /) && !l.match(/^  - /) && l.trim())
    const listLines = lines.filter((l) => l.match(/^- /) || l.match(/^  - /))
    const introHtml = intro.length
      ? intro.map((l) => `<p class="kit-agent-p">${renderInline(l.trim())}</p>`).join('')
      : ''
    return `${introHtml}${renderList(listLines)}`
  }

  return `<p class="kit-agent-p">${renderInline(trimmed.replace(/\n/g, ' '))}</p>`
}

export function renderAgentBody(body: string): string {
  const normalized = body.replace(/\r\n/g, '\n').trim()
  const blocks = normalized.split(/\n\n+/).filter(Boolean)
  return blocks.map(renderBlock).join('')
}
