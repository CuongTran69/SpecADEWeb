import type { Lang } from './strings'

export function pathFor(lang: Lang, path: string = '/'): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  if (lang === 'en') return cleanPath
  return `/vi${cleanPath === '/' ? '/' : cleanPath}`
}

export function altLang(lang: Lang): Lang {
  return lang === 'en' ? 'vi' : 'en'
}

/**
 * Swap the language prefix in a path.
 * Strips a leading /vi if present, then prefixes /vi if target === 'vi'.
 * Normalises so / and /vi/ are the home pages.
 */
export function swapLangPath(currentPath: string, target: Lang): string {
  // Strip leading /vi prefix
  const stripped = currentPath.replace(/^\/vi(\/|$)/, '/') || '/'
  if (target === 'vi') {
    // /  → /vi/   other paths → /vi/path
    return stripped === '/' ? '/vi/' : `/vi${stripped}`
  }
  return stripped
}
