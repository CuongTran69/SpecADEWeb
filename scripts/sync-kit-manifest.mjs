#!/usr/bin/env node
/**
 * Sync OpenSpec Friendly Kit manifest from ~/.claude/agents and ~/.claude/skills.
 * Writes src/data/kit-manifest.json for static site build (CI-safe fallback).
 *
 * Usage:
 *   npm run sync:kit-manifest
 *   node scripts/sync-kit-manifest.mjs
 *
 * Docs: docs/sync-kit-manifest.md
 */
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const outPath = join(root, 'src/data/kit-manifest.json')

const CLAUDE_DIR = join(homedir(), '.claude')
const AGENTS_DIR = join(CLAUDE_DIR, 'agents')
const SKILLS_DIR = join(CLAUDE_DIR, 'skills')

/** Skills exposed by /osf dispatcher (see ~/.claude/skills/osf/SKILL.md) */
const KIT_SKILLS = [
  { id: 'feat', category: 'planning', command: '/osf feat' },
  { id: 'fix', category: 'planning', command: '/osf fix' },
  { id: 'chore', category: 'planning', command: '/osf chore' },
  { id: 'refactor', category: 'planning', command: '/osf refactor' },
  { id: 'perf', category: 'planning', command: '/osf perf' },
  { id: 'docs', category: 'planning', command: '/osf docs' },
  { id: 'test', category: 'planning', command: '/osf test' },
  { id: 'ci', category: 'planning', command: '/osf ci' },
  { id: 'docker', category: 'planning', command: '/osf docker' },
  { id: 'explore', category: 'internal', command: '(auto-loaded)' },
  { id: 'proposal', category: 'pipeline', command: '/osf proposal' },
  { id: 'apply', category: 'pipeline', command: '/osf apply' },
  { id: 'verify', category: 'pipeline', command: '/osf verify' },
  { id: 'archive', category: 'pipeline', command: '/osf archive' },
  { id: 'autopilot', category: 'pipeline', command: '/osf autopilot' },
  { id: 'setup', category: 'utility', command: '/osf setup' },
  { id: 'explain', category: 'utility', command: '/osf explain' },
  { id: 'analyze', category: 'utility', command: '/osf analyze' },
  { id: 'review', category: 'utility', command: '/osf review' },
  { id: 'git', category: 'utility', command: '/osf git' },
  { id: 'browser', category: 'utility', command: '/osf browser' },
  { id: 'research', category: 'utility', command: '/osf research' },
  { id: 'discuss', category: 'utility', command: '/osf discuss' },
  { id: 'uiux-design', category: 'utility', command: '/osf uiux-design' },
  { id: 'clean-room', category: 'utility', command: '/osf clean-room' },
]

const INVOKED_BY = {
  'osf-analyze': [
    '/osf analyze',
    'Plan phase (auto when structural insight needed)',
    '/osf autopilot',
  ],
  'osf-apply': [
    '/osf apply',
    'After plan on feat/fix/chore/refactor/perf',
    'Auto-chain after proposal',
    '/osf autopilot',
  ],
  'osf-verify': [
    '/osf verify',
    'Auto-verify after apply (high-risk work)',
    '/osf autopilot verify-fix loop',
  ],
  'osf-archive': ['/osf archive', '/osf autopilot (final step)'],
  'osf-researcher': ['/osf research', 'Plan phase (on demand)'],
  'osf-uiux-designer': ['/osf uiux-design', 'Plan phase (on demand)'],
  'osf-browser-automation': ['/osf browser', 'Browser automation tasks'],
  'osf-clean-room': ['/osf clean-room', 'Port external feature from spec'],
}

const GATE_RULES = [
  'Worker subagent — not a command router',
  'No Skill tool, no nested subagents',
  'Complete assigned task and return results to caller',
]

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return { fm: {}, body: content }
  const fm = {}
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    let val = line.slice(idx + 1).trim()
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1)
    }
    fm[key] = val
  }
  const body = content.slice(match[0].length).replace(/^\s+/, '')
  return { fm, body }
}

function stripGateSection(body) {
  let cleaned = body.replace(/^[^\n]*:\s*\r?\n\r?\n/m, '')
  cleaned = cleaned.replace(
    /^#{0,2}\s*SUBAGENT EXECUTION GATE[\s\S]*?\r?\n---\r?\n\r?\n?/m,
    '',
  )
  return cleaned.replace(/\r\n/g, '\n').trim()
}

function extractField(body, label) {
  const normalized = body.replace(/\r\n/g, '\n')
  const re = new RegExp(
    `\\*\\*${label}\\*\\*:([\\s\\S]*?)(?=\\n\\*\\*[A-Z][A-Z]|\\n## |\\n---\\s*$|$)`,
    'i',
  )
  const match = normalized.match(re)
  return match ? match[1].trim() : ''
}

function extractRole(body) {
  const stripped = stripGateSection(body)
  const paras = stripped.split(/\n\n+/)
  for (const para of paras) {
    const line = para.trim().split('\n')[0]?.trim() ?? ''
    if (line.startsWith('You are ') && !line.includes('worker subagent')) {
      return line
    }
    if (line.startsWith('You automate ') || line.startsWith('You receive ')) {
      return line
    }
  }
  for (const para of paras) {
    const line = para.trim().split('\n')[0]?.trim() ?? ''
    if (line.startsWith('You ')) return line
  }
  return ''
}

function extractHighlights(body) {
  const normalized = stripGateSection(body)
  return extractSectionHighlights(normalized)
}

function extractSectionHighlights(body) {
  const highlights = []
  const parts = body.split(/\n(?=## )/)

  for (const part of parts) {
    if (!part.startsWith('## ')) continue
    const newline = part.indexOf('\n')
    const title = part.slice(3, newline).trim()
    if (/SUBAGENT EXECUTION GATE/i.test(title)) continue
    const content = part.slice(newline + 1)
    const bullets = content
      .split('\n')
      .filter((l) => l.match(/^- /))
      .slice(0, 5)
      .map((l) => l.replace(/^- /, '').trim())
    if (bullets.length) {
      highlights.push({ title, bullets })
    }
  }

  return highlights.slice(0, 4)
}

const OSF_SUBAGENTS = [
  'osf-analyze',
  'osf-apply',
  'osf-archive',
  'osf-verify',
  'osf-researcher',
  'osf-uiux-designer',
  'osf-browser-automation',
  'osf-clean-room',
]

function normalizeBody(body) {
  return body.replace(/\r\n/g, '\n').trim()
}

function extractSkillRole(body) {
  const intro = normalizeBody(body).split(/\n---\n/)[0]
  for (const para of intro.split(/\n\n+/)) {
    const line = para.trim().split('\n')[0]?.trim() ?? ''
    if (!line || line.startsWith('#') || line.startsWith('>')) continue
    if (line.startsWith('You ') || line.startsWith('This skill')) return line
  }
  return ''
}

function extractSkillNotes(body) {
  const notes = []
  const normalized = normalizeBody(body)
  const beforeDivider = normalized.split(/\n---\n/)[0]
  for (const para of beforeDivider.split(/\n\n+/)) {
    const t = para.trim()
    if (t.startsWith('BEFORE PROCEEDING:') || t.startsWith('RUNTIME GUARD:')) {
      notes.push(t.replace(/\n/g, ' '))
    }
  }
  return notes.slice(0, 2)
}

function extractDelegates(body) {
  return OSF_SUBAGENTS.filter((name) => body.includes(name))
}

function extractLoadedSkills(body, selfId) {
  const loaded = new Set()
  const re = /invoke [`"']([a-z0-9-]+)[`"']/gi
  let match
  while ((match = re.exec(body))) {
    if (match[1] !== selfId) loaded.add(match[1])
  }
  return [...loaded].sort()
}

async function loadSubagents() {
  let files
  try {
    files = (await readdir(AGENTS_DIR)).filter((f) => f.startsWith('osf-') && f.endsWith('.md'))
  } catch {
    console.warn(`Warning: cannot read ${AGENTS_DIR}, keeping existing subagents in manifest`)
    return null
  }

  const subagents = []
  for (const file of files.sort()) {
    const content = await readFile(join(AGENTS_DIR, file), 'utf8')
    const { fm, body } = parseFrontmatter(content)
    const name = fm.name || file.replace(/\.md$/, '')
    const docBody = stripGateSection(body)

    subagents.push({
      name,
      description: fm.description || '',
      model: fm.model || 'inherit',
      color: fm.color || 'purple',
      role: extractRole(body),
      input: extractField(body, 'INPUT'),
      output: extractField(body, 'OUTPUT'),
      invokedBy: INVOKED_BY[name] ?? [],
      gateRules: GATE_RULES,
      highlights: extractHighlights(docBody),
      bodyMarkdown: docBody,
    })
  }
  return subagents
}

async function loadSkills() {
  const skills = []
  for (const entry of KIT_SKILLS) {
    const skillPath = join(SKILLS_DIR, entry.id, 'SKILL.md')
    let description = ''
    let name = entry.id
    let role = ''
    let notes = []
    let delegates = []
    let loadsSkills = []
    let highlights = []
    let bodyMarkdown = ''
    try {
      const content = await readFile(skillPath, 'utf8')
      const { fm, body } = parseFrontmatter(content)
      name = fm.name || entry.id
      description = fm.description || ''
      bodyMarkdown = normalizeBody(body)
      role = extractSkillRole(body)
      notes = extractSkillNotes(body)
      delegates = extractDelegates(body)
      loadsSkills = extractLoadedSkills(body, entry.id)
      highlights = extractSectionHighlights(bodyMarkdown)
    } catch {
      console.warn(`Warning: missing skill ${entry.id} at ${skillPath}`)
    }
    skills.push({
      ...entry,
      name,
      description,
      role,
      notes,
      delegates,
      loadsSkills,
      highlights,
      bodyMarkdown,
    })
  }
  return skills
}

async function main() {
  const [subagents, skills] = await Promise.all([loadSubagents(), loadSkills()])

  let existing = {}
  try {
    existing = JSON.parse(await readFile(outPath, 'utf8'))
  } catch {
    /* first run */
  }

  const manifest = {
    syncedAt: new Date().toISOString(),
    subagents: subagents ?? existing.subagents ?? [],
    skills,
  }

  await writeFile(outPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')
  console.log(
    `Wrote ${outPath} — ${manifest.subagents.length} subagents, ${manifest.skills.length} skills`,
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
