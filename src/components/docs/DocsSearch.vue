<template>
  <div>
    <div v-if="isOpen" class="modal-bg" @click="closeModal">
      <div class="modal" @click.stop>
        <div class="modal-search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            ref="searchInput"
            v-model="query"
            type="text"
            :placeholder="lang === 'vi' ? 'Tìm kiếm...' : 'Search...'"
            @keydown="handleKeydown"
          />
          <span class="esc">Esc</span>
        </div>

        <div class="modal-results">
          <template v-if="results.length > 0">
            <div
              v-for="(r, idx) in results"
              :key="`${r.slug}-${r.anchor || 'page'}`"
              :class="['sresult', { sel: idx === selected }]"
              @click="selectResult(idx)"
              @mousemove="selected = idx"
            >
              <div class="sr-grp">{{ r.group }}</div>
              <div class="sr-ttl" v-html="highlightMatch(r.title)"></div>
              <div v-if="r.excerpt" class="sr-ex" v-html="highlightMatch(r.excerpt)"></div>
            </div>
          </template>
          <template v-else-if="query.length > 0">
            <div class="sempty">{{ lang === 'vi' ? 'Không tìm thấy kết quả nào' : 'No results found' }}</div>
          </template>
          <template v-else>
            <div
              v-for="(p, idx) in allPages.slice(0, 12)"
              :key="p.slug"
              :class="['sresult', { sel: idx === selected }]"
              @click="selectResult(idx)"
              @mousemove="selected = idx"
            >
              <div class="sr-grp">{{ p.group }}</div>
              <div class="sr-ttl">{{ p.title }}</div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { DocLang } from '~/i18n/docs'
import { DOCS_PAGES, DOCS_NAV, headingId, tx } from '~/i18n/docs'
import { pathFor } from '~/i18n/utils'
import { norm } from '~/lib/docs-render'

interface Props {
  lang: DocLang
  currentPath: string
}

interface SearchResult {
  slug: string
  anchor?: string
  group: string
  title: string
  excerpt?: string
  score: number
}

const props = defineProps<Props>()

const isOpen = ref(false)
const query = ref('')
const selected = ref(0)
const searchInput = ref<HTMLInputElement | null>(null)
const results = ref<SearchResult[]>([])
let allPages: SearchResult[] = []
let index: SearchResult[] = []

const getGroupTitle = (slug: string): string => {
  const group = DOCS_NAV.find(g => g.items.includes(slug))
  return group ? tx(group.title, props.lang) : ''
}

onMounted(() => {
  // Build search index
  Object.entries(DOCS_PAGES).forEach(([slug, page]) => {
    const groupTitle = getGroupTitle(slug)
    const pageTitle = tx(page.title, props.lang)

    const blockText = page.blocks
      .map(b => {
        if (b.t === 'p' || b.t === 'lede') return tx(b.x, props.lang)
        if (b.t === 'h2' || b.t === 'h3') return tx(b.x, props.lang)
        if (b.t === 'callout') return tx(b.x, props.lang)
        return ''
      })
      .join(' ')

    allPages.push({
      slug,
      group: groupTitle,
      title: pageTitle,
      excerpt: blockText.slice(0, 100),
      score: 0,
    })

    index.push({
      slug,
      group: groupTitle,
      title: pageTitle,
      excerpt: blockText,
      score: 0,
    })

    // Heading entries
    page.blocks.forEach((b) => {
      if ((b.t === 'h2' || b.t === 'h3') && 'x' in b) {
        const textEn = typeof b.x === 'string' ? b.x : b.x.en
        const text = tx(b.x, props.lang)
        const id = headingId(textEn)
        index.push({
          slug,
          anchor: id,
          group: pageTitle,
          title: text,
          score: 0,
        })
      }
    })
  })

  // Listen for Cmd+K / Ctrl+K
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      isOpen.value = true
      setTimeout(() => searchInput.value?.focus(), 0)
    }

    // Listen for /
    if (
      e.key === '/' &&
      !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
    ) {
      e.preventDefault()
      isOpen.value = true
      setTimeout(() => searchInput.value?.focus(), 0)
    }
  })

  // Listen for search trigger button
  const searchBtn = document.querySelector('[data-search-trigger]') as HTMLElement | null
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      isOpen.value = true
      setTimeout(() => searchInput.value?.focus(), 0)
    })
  }
})

const search = () => {
  if (!query.value.trim()) {
    results.value = allPages.slice(0, 12)
    selected.value = 0
    return
  }

  const q = norm(query.value)
  const scored = index.map((entry) => {
    const titleNorm = norm(entry.title)
    const excerptNorm = norm(entry.excerpt || '')

    let score = 0
    if (titleNorm === q) score = -1000
    else if (titleNorm.includes(q)) score = 0
    else if (excerptNorm.includes(q)) score = 100 + excerptNorm.indexOf(q)
    else score = 10000

    return { ...entry, score }
  })

  results.value = scored
    .filter(r => r.score < 10000)
    .sort((a, b) => a.score - b.score)
    .slice(0, 12)

  selected.value = 0
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    closeModal()
    return
  }

  if (e.key === 'ArrowDown') {
    e.preventDefault()
    selected.value = Math.min(selected.value + 1, results.value.length - 1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    selected.value = Math.max(selected.value - 1, 0)
  } else if (e.key === 'Enter') {
    e.preventDefault()
    selectResult(selected.value)
  } else {
    search()
  }
}

const selectResult = (idx: number) => {
  const result = results.value[idx] || allPages[idx]
  if (!result) return

  const path = pathFor(
    props.lang,
    `/docs/${result.slug === 'introduction' ? '' : result.slug + '/'}`
  ) + (result.anchor ? '#' + result.anchor : '')

  window.location.href = path
}

const highlightMatch = (text: string): string => {
  if (!query.value) return text
  const q = query.value.toLowerCase()
  const regex = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}

const closeModal = () => {
  isOpen.value = false
  query.value = ''
  selected.value = 0
}
</script>

<style scoped>
.modal-bg {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: color-mix(in srgb, #000 55%, transparent);
  backdrop-filter: blur(3px);
  display: none;
  align-items: flex-start;
  justify-content: center;
  padding-top: 12vh;
}

.modal-bg[v-if] {
  display: flex;
}

.modal {
  width: min(92vw, 580px);
  background: var(--color-bg);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-lg);
  overflow: hidden;
  max-height: 70vh;
  display: flex;
  flex-direction: column;
}

.modal-search {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--color-border);
}

.modal-search svg {
  width: 18px;
  height: 18px;
  color: var(--color-text-muted);
  flex: none;
}

.modal-search input {
  flex: 1;
  background: transparent;
  border: 0;
  outline: 0;
  font-family: var(--font-sans);
  font-size: 16px;
  color: var(--color-text);
}

.modal-search input::placeholder {
  color: var(--color-text-muted);
}

.modal-search .esc {
  font: 500 11px / 1 var(--font-mono);
  color: var(--color-text-muted);
  border: 1px solid var(--color-border-strong);
  padding: 4px 6px;
  border-radius: var(--radius-xs);
}

.modal-results {
  overflow-y: auto;
  padding: 8px;
}

.sresult {
  display: block;
  padding: 10px 12px;
  border-radius: var(--radius-md);
  cursor: pointer;
}

.sresult:hover,
.sresult.sel {
  background: var(--color-surface);
}

.sr-grp {
  font: 500 11px / 1 var(--font-mono);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.sr-ttl {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text);
  margin-top: 3px;
}

.sr-ex {
  font-size: 12.5px;
  color: var(--color-text-secondary);
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

:deep(mark) {
  background: var(--color-accent-soft);
  color: var(--color-accent);
  border-radius: 2px;
}

.sempty {
  padding: 30px;
  text-align: center;
  color: var(--color-text-muted);
  font-size: 14px;
}
</style>
