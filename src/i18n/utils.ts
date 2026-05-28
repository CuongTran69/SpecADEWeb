import type { Lang } from './strings'

// BASE_URL is '/SpecADEWeb/' in production and '/' in dev.
// Strip the trailing slash so we can use it as a plain prefix string.
const base = import.meta.env.BASE_URL.replace(/\/$/, '')

export function pathFor(lang: Lang, path: string = '/'): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  if (lang === 'en') return `${base}${cleanPath}`
  return `${base}/vi${cleanPath === '/' ? '/' : cleanPath}`
}

export function altLang(lang: Lang): Lang {
  return lang === 'en' ? 'vi' : 'en'
}

/**
 * Swap the language prefix in a path.
 * Strips the BASE_URL prefix if present, then strips a leading /vi if present,
 * then prefixes /vi if target === 'vi', and finally re-prepends the base.
 * Normalises so / and /vi/ are the home pages.
 */
export function swapLangPath(currentPath: string, target: Lang): string {
  // Strip base prefix so the rest of the logic is environment-agnostic
  const withoutBase = base && currentPath.startsWith(base)
    ? currentPath.slice(base.length) || '/'
    : currentPath
  // Strip leading /vi prefix
  const stripped = withoutBase.replace(/^\/vi(\/|$)/, '/') || '/'
  if (target === 'vi') {
    // /  → /vi/   other paths → /vi/path
    return `${base}${stripped === '/' ? '/vi/' : `/vi${stripped}`}`
  }
  return `${base}${stripped}`
}
