<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

interface Line {
  prefix?: string
  prefixClass?: string
  text: string
  textClass?: string
}

const lines: Line[] = [
  { prefix: '$', prefixClass: 'prompt', text: 'spec-ade open my-project', textClass: 'cmd' },
  { prefix: '◆', prefixClass: 'claude', text: 'Claude  Reading your codebase…', textClass: 'agent' },
  { prefix: '◆', prefixClass: 'claude', text: "Claude  I'll add a login page with JWT auth. Starting now.", textClass: 'agent' },
  { text: 'M  src/pages/Login.vue', textClass: 'git-modified' },
  { text: 'A  src/stores/auth.ts', textClass: 'git-added' },
  { text: 'A  src/api/auth.rs', textClass: 'git-added' },
  { prefix: '✓', prefixClass: 'success', text: 'Done · 3 files · 0 conflicts · tests passing', textClass: 'success-text' },
  { prefix: '$', prefixClass: 'prompt', text: '_', textClass: 'cursor' },
]

const visibleCount = ref(0)
let timer: ReturnType<typeof setTimeout> | undefined

function step() {
  if (visibleCount.value < lines.length) {
    visibleCount.value++
    const delay = visibleCount.value === lines.length ? 2400 : 480 + Math.random() * 360
    timer = setTimeout(step, delay)
  } else {
    // Reset for loop
    timer = setTimeout(() => {
      visibleCount.value = 0
      step()
    }, 4000)
  }
}

onMounted(() => {
  // Use IntersectionObserver to delay until visible — saves CPU on long pages
  const root = document.querySelector('[data-terminal-demo]')
  if (!root) {
    step()
    return
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          step()
          io.disconnect()
        }
      }
    },
    { rootMargin: '0px' }
  )
  io.observe(root)
})

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer)
})
</script>

<template>
  <div class="terminal" data-terminal-demo data-testid="terminal-demo" aria-hidden="true">
    <header class="terminal-bar" aria-hidden="true">
      <span class="dot dot-red" />
      <span class="dot dot-amber" />
      <span class="dot dot-green" />
      <span class="terminal-title">~/projects/my-project · spec-ade</span>
    </header>
    <div class="terminal-body">
      <div
        v-for="(line, i) in lines.slice(0, visibleCount)"
        :key="i"
        class="line"
      >
        <span v-if="line.prefix" class="prefix" :class="line.prefixClass">{{ line.prefix }}</span>
        <span :class="line.textClass">{{ line.text }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.terminal {
  background: var(--color-surface);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-lg);
  overflow: hidden;
  font-family: var(--font-mono);
  font-size: 13.5px;
  line-height: 1.75;
  width: 100%;
  max-width: 640px;
  transition: border-color 300ms var(--ease-out-soft);
}

.terminal:hover {
  border-color: var(--color-accent);
}

.terminal-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 16px;
  background: var(--color-raised);
  border-bottom: 1px solid var(--color-border-strong);
  user-select: none;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  transition: transform 150ms var(--ease-out-soft);
}

.terminal-bar:hover .dot {
  transform: scale(1.1);
}

.dot-red { background: #ff5f57; }
.dot-amber { background: #febc2e; }
.dot-green { background: #28c840; }

.terminal-title {
  margin-left: 14px;
  font-size: 11px;
  font-weight: 500;
  color: var(--color-text-secondary);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.terminal-body {
  padding: 20px;
  min-height: 280px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: color-mix(in srgb, var(--color-bg) 20%, var(--color-surface));
}

.line {
  display: flex;
  gap: 10px;
  align-items: baseline;
  animation: line-in 350ms var(--ease-out-soft);
  white-space: pre-wrap;
  word-break: break-word;
}

@keyframes line-in {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.prefix {
  flex-shrink: 0;
  width: 16px;
  text-align: center;
  font-weight: 600;
}

.prompt { color: var(--color-text-muted); }
.claude { color: var(--color-claude); }
.auggie { color: var(--color-auggie); }
.success { color: var(--color-success); }

.cmd { color: var(--color-text); font-weight: 600; }
.muted { color: var(--color-text-muted); }
.agent { color: var(--color-text); }
.git-modified { color: var(--color-git-modified); font-weight: 500; }
.git-added { color: var(--color-git-added); font-weight: 500; }
.success-text { color: var(--color-success); font-weight: 500; }
.cursor {
  color: var(--color-accent);
  animation: blink 1.2s steps(2, jump-none) infinite;
}

@keyframes blink {
  50% { opacity: 0.15; }
}

@media (prefers-reduced-motion: reduce) {
  .line {
    animation: none;
  }
  .cursor {
    animation: none;
  }
  .dot {
    transform: none !important;
  }
}
</style>
