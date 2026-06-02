<template>
  <div style="display: none" :aria-label="lang === 'vi' ? 'Hành động sao chép' : 'Copy actions'">
    <!-- Island for clipboard copy handling -->
  </div>
</template>

<script setup lang="ts">
import type { DocLang } from '~/i18n/docs'
import { onMounted, ref } from 'vue'

interface Props {
  lang: DocLang
}

defineProps<Props>()

const copiedId = ref<string | null>(null)

onMounted(() => {
  document.addEventListener('click', handleCopyClick)

  return () => {
    document.removeEventListener('click', handleCopyClick)
  }
})

async function handleCopyClick(e: Event) {
  const button = (e.target as HTMLElement).closest('[data-clipboard]') as HTMLButtonElement | null
  if (!button) return

  e.preventDefault()

  // Find the code block and active pane
  const codeblock = button.closest('[data-cb]') as HTMLElement | null
  if (!codeblock) return

  const activePaneCode = codeblock.querySelector('.code-pane.on > code') as HTMLElement | null
  if (!activePaneCode) return

  const text = activePaneCode.textContent || ''

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text)
    } else {
      // Fallback for older browsers
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }

    // Show success state
    const span = button.querySelector('span')
    const originalText = span?.textContent
    if (span) {
      span.textContent = props.lang === 'vi' ? 'Đã chép' : 'Copied'
    }

    button.classList.add('done')

    // Announce for assistive tech
    const live = document.createElement('div')
    live.setAttribute('aria-live', 'polite')
    live.setAttribute('role', 'status')
    live.textContent = props.lang === 'vi' ? 'Đã sao chép vào clipboard' : 'Copied to clipboard'
    live.style.position = 'absolute'
    live.style.left = '-10000px'
    document.body.appendChild(live)

    setTimeout(() => {
      if (span) {
        span.textContent = originalText || (props.lang === 'vi' ? 'Sao chép' : 'Copy')
      }
      button.classList.remove('done')
      document.body.removeChild(live)
    }, 1600)
  } catch (err) {
    console.error('Copy failed:', err)
  }
}
</script>

<style scoped>
/* Styles are in DocsCodeBlock component */
</style>
