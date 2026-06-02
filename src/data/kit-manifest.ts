import manifest from './kit-manifest.json'

export type KitSubagentHighlight = {
  title: string
  bullets: string[]
}

export type KitSubagent = {
  name: string
  description: string
  model: string
  color: string
  role: string
  input: string
  output: string
  invokedBy: string[]
  gateRules: string[]
  highlights: KitSubagentHighlight[]
  bodyMarkdown: string
}

export type KitSkillCategory = 'planning' | 'pipeline' | 'utility' | 'internal'

export type KitSkill = {
  id: string
  name: string
  category: KitSkillCategory
  command: string
  description: string
  role: string
  notes: string[]
  delegates: string[]
  loadsSkills: string[]
  highlights: KitSubagentHighlight[]
  bodyMarkdown: string
}

export type KitManifest = {
  syncedAt: string
  subagents: KitSubagent[]
  skills: KitSkill[]
}

export const kitManifest = manifest as KitManifest

export function getKitSubagents(): KitSubagent[] {
  return kitManifest.subagents
}

export function getKitSkills(): KitSkill[] {
  return kitManifest.skills
}

export function getKitSkillsByCategory(category: KitSkillCategory): KitSkill[] {
  return kitManifest.skills.filter((s) => s.category === category)
}

export const SKILL_CATEGORY_ORDER: KitSkillCategory[] = [
  'planning',
  'pipeline',
  'utility',
  'internal',
]

export function skillCategoryLabel(category: KitSkillCategory, lang: 'en' | 'vi'): string {
  const labels: Record<KitSkillCategory, Record<'en' | 'vi', string>> = {
    planning: { en: 'Planning commands', vi: 'Planning commands' },
    pipeline: { en: 'Pipeline skills', vi: 'Pipeline skills' },
    utility: { en: 'Utility skills', vi: 'Utility skills' },
    internal: { en: 'Internal (auto-loaded)', vi: 'Internal (tự load)' },
  }
  return labels[category][lang]
}

export function modelChipClass(model: string): string {
  const m = model.toLowerCase()
  if (m.includes('opus')) return 'kit-chip-opus'
  if (m.includes('4.5') || m.includes('sonnet4')) return 'kit-chip-sonnet45'
  if (m.includes('sonnet')) return 'kit-chip-sonnet'
  return 'kit-chip-default'
}

export function agentColorBar(color: string): string {
  const map: Record<string, string> = {
    purple: '#9c27b0',
    blue: '#2196f3',
    green: '#4caf50',
    orange: '#ff9800',
    red: '#f44336',
    teal: '#009688',
  }
  return map[color] ?? map.purple
}

export function subagentSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
}

export function skillSlug(id: string): string {
  return `skill-${id.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
}

export function skillCategoryColor(category: KitSkillCategory): string {
  const map: Record<KitSkillCategory, string> = {
    planning: '#2196f3',
    pipeline: '#7b1fa2',
    utility: '#00897b',
    internal: '#607d8b',
  }
  return map[category]
}

export function skillCategoryChipClass(category: KitSkillCategory): string {
  const map: Record<KitSkillCategory, string> = {
    planning: 'kit-chip-planning',
    pipeline: 'kit-chip-pipeline',
    utility: 'kit-chip-utility',
    internal: 'kit-chip-internal',
  }
  return map[category]
}
