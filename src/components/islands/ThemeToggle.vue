<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Moon, Sun } from 'lucide-vue-next'

const STORAGE_KEY = 'spec-ade-web:theme'
type Theme = 'dark' | 'light'

const theme = ref<Theme>('dark')

onMounted(() => {
  const root = document.documentElement
  const current = (root.getAttribute('data-theme') as Theme) || 'dark'
  theme.value = current
})

function toggle() {
  const next: Theme = theme.value === 'dark' ? 'light' : 'dark'
  theme.value = next
  document.documentElement.setAttribute('data-theme', next)
  try {
    localStorage.setItem(STORAGE_KEY, next)
  } catch {
    // ignore quota / privacy mode errors
  }
}

const label = computed(() => (theme.value === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'))
</script>

<template>
  <button
    type="button"
    class="theme-toggle"
    :aria-label="label"
    :title="label"
    :aria-pressed="theme === 'light' ? 'true' : 'false'"
    data-testid="theme-toggle"
    @click="toggle"
  >
    <Sun v-if="theme === 'dark'" :size="16" :stroke-width="1.75" />
    <Moon v-else :size="16" :stroke-width="1.75" />
  </button>
</template>

<style scoped>
.theme-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: background 200ms var(--ease-out-soft), color 200ms var(--ease-out-soft),
    border-color 200ms var(--ease-out-soft);
}

.theme-toggle:hover {
  color: var(--color-text);
  background: var(--color-raised);
  border-color: var(--color-border-strong);
}

.theme-toggle:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
</style>
