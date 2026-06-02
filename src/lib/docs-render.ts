import type { BiOrStr, DocLang } from '~/i18n/docs'
import { tx } from '~/i18n/docs'

/**
 * Normalize text for search: lowercase + NFD diacritics + strip accents
 */
export function norm(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

/**
 * Render inline markdown:
 * 1. Resolve BiOrStr via tx()
 * 2. HTML escape
 * 3. Backtick code -> <span class="icode">
 * 4. **bold** -> <strong>
 * 5. [label](#/slug) -> rewrite to slugLinker(slug)
 * 6. [label](#anchor) -> keep as-is (in-page)
 * 7. [label](href) -> keep as-is
 * 8. <kbd>...</kbd> (escaped form) -> un-escape to real <kbd>
 */
export function renderInline(
  value: BiOrStr | undefined,
  lang: DocLang,
  slugLinker: (slug: string) => string
): string {
  if (!value) return ''

  // Resolve bilingual
  let text = tx(value, lang)
  if (!text) return ''

  // HTML escape
  text = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

  // Backtick code
  text = text.replace(/`([^`]+)`/g, '<span class="icode">$1</span>')

  // **bold**
  text = text.replace(/\*\*([^\*]+)\*\*/g, '<strong>$1</strong>')

  // [label](#/slug) or [label](#/slug#anchor)
  text = text.replace(/\[([^\]]+)\]\(#\/([a-z-]+)(#[a-z0-9-]*)?\)/g, (match, label, slug, anchor) => {
    const href = slugLinker(slug) + (anchor || '')
    return `<a href="${href}">${label}</a>`
  })

  // [label](#anchor-id) in-page anchors (no slash after #)
  text = text.replace(/\[([^\]]+)\]\(#([a-z0-9-]+)\)/g, '<a href="#$2">$1</a>')

  // [label](href) for other links
  text = text.replace(/\[([^\]]+)\]\(([^#][^\)]*)\)/g, '<a href="$2">$1</a>')

  // <kbd>...</kbd> un-escape (it was escaped above, so we look for the escaped form)
  text = text.replace(/&lt;kbd&gt;([^<]+)&lt;\/kbd&gt;/g, '<kbd>$1</kbd>')

  return text
}

/**
 * Syntax highlighter: escapes input, then wraps tokens in <span class="tok-*">
 */
export function renderHighlight(code: string, lang: string): string {
  // Escape first
  let escaped = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Syntax highlighting by language
  if (lang === 'bash' || lang === 'sh') {
    return highlightBash(escaped)
  } else if (lang === 'json') {
    return highlightJson(escaped)
  } else {
    // Generic fallback
    return highlightGeneric(escaped)
  }
}

function highlightBash(code: string): string {
  // Simple bash highlighter
  let result = code

  // Comments
  result = result.replace(/^(\s*)#[^\n]*/gm, '$1<span class="tok-c">#$&</span>')

  // Keywords
  const keywords = ['if', 'then', 'else', 'fi', 'for', 'do', 'done', 'while', 'case', 'esac']
  keywords.forEach((kw) => {
    const re = new RegExp(`\\b${kw}\\b`, 'g')
    result = result.replace(re, `<span class="tok-k">${kw}</span>`)
  })

  // Strings
  result = result.replace(/'[^']*'/g, (m) => `<span class="tok-s">${m}</span>`)
  result = result.replace(/"[^"]*"/g, (m) => `<span class="tok-s">${m}</span>`)

  // Flags (--flag or -x)
  result = result.replace(/--[a-z-]+|-[a-zA-Z]/g, (m) => `<span class="tok-flag">${m}</span>`)

  // Commands ($ prefix or common commands)
  result = result.replace(/^\$\s/gm, '<span class="tok-cmd">$</span> ')

  return result
}

function highlightJson(code: string): string {
  let result = code

  // Keys: "key"
  result = result.replace(/"([^"]+)"\s*:/g, '<span class="tok-k">"$1"</span>:')

  // Strings: "value"
  result = result.replace(/"([^"]+)"/g, (m, p1) => {
    // Don't double-wrap keys
    if (m.includes(':')) return m
    return `<span class="tok-s">"${p1}"</span>`
  })

  // Numbers
  result = result.replace(/:\s*(-?[\d.]+)(?=[,\}\]])/g, ': <span class="tok-n">$1</span>')

  // Keywords: true, false, null
  result = result.replace(/\b(true|false|null)\b/g, '<span class="tok-k">$1</span>')

  return result
}

function highlightGeneric(code: string): string {
  let result = code

  // Line comments
  result = result.replace(/\/\/[^\n]*/g, (m) => `<span class="tok-c">${m}</span>`)

  // Strings
  result = result.replace(/'[^']*'/g, (m) => `<span class="tok-s">${m}</span>`)
  result = result.replace(/"[^"]*"/g, (m) => `<span class="tok-s">${m}</span>`)

  // Keywords
  const keywords = ['function', 'return', 'if', 'else', 'for', 'while', 'class', 'const', 'let', 'var']
  keywords.forEach((kw) => {
    const re = new RegExp(`\\b${kw}\\b`, 'g')
    result = result.replace(re, `<span class="tok-k">${kw}</span>`)
  })

  return result
}
