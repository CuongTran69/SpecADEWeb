# Sync kit manifest (`npm run sync:kit-manifest`)

The OpenSpec Friendly Kit page (`/kits`, `/vi/kits`) renders **Skills** and **Subagents** from a static JSON file, not from `~/.claude` at runtime. The sync script refreshes that file from your local Claude kit install.

## Command

```bash
npm run sync:kit-manifest
```

Equivalent:

```bash
node scripts/sync-kit-manifest.mjs
```

`npm run build` runs this automatically via the `prebuild` script in `package.json`.

## What it reads

| Source | Content |
|--------|---------|
| `~/.claude/agents/osf-*.md` | Subagent frontmatter + full prompt body |
| `~/.claude/skills/<id>/SKILL.md` | Skill frontmatter + full prompt body |

Skill IDs are defined in `scripts/sync-kit-manifest.mjs` (`KIT_SKILLS`) — the same list exposed by the `/osf` dispatcher.

## What it writes

**`src/data/kit-manifest.json`**

Each subagent entry includes: `name`, `description`, `model`, `color`, `role`, `input`, `output`, `invokedBy`, `highlights`, `bodyMarkdown`.

Each skill entry includes: `id`, `name`, `category`, `command`, `description`, `role`, `notes`, `delegates`, `loadsSkills`, `highlights`, `bodyMarkdown`.

The file also stores `syncedAt` (ISO timestamp of the last successful sync).

## Typical workflow

1. Install or update the OpenSpec Friendly Kit locally (see `/kits` → Setup).
2. Edit subagent or skill files under `~/.claude/agents/` or `~/.claude/skills/`.
3. Run `npm run sync:kit-manifest` from the SpecADEWeb repo root.
4. Review changes to `src/data/kit-manifest.json` and commit if the public docs should reflect the update.
5. Run `npm run build` and verify `/kits`.

## CI and production builds

Cloudflare Pages, VPS, and other CI environments usually **do not** have `~/.claude` or the OpenSpec Friendly Kit installed. The sync script detects this and **keeps the committed** `src/data/kit-manifest.json` instead of overwriting it with empty entries.

You do **not** need to run `bunx @dccxx/auggiegw@latest kit …` on the build server. Install the kit only on a dev machine when you want to refresh manifest content, then commit the updated JSON.

**Commit `src/data/kit-manifest.json`** whenever you sync from a machine that has the kit installed.

## Related files

| File | Role |
|------|------|
| `scripts/sync-kit-manifest.mjs` | Sync implementation |
| `src/data/kit-manifest.json` | Generated data (committed) |
| `src/data/kit-manifest.ts` | Types + helpers |
| `src/components/kits/KitSkillsGrid.astro` | Skills UI |
| `src/components/kits/KitSubagentsGrid.astro` | Subagents UI |
| `src/lib/render-agent-md.ts` | Markdown → HTML for prompt bodies |

## Troubleshooting

**Skills/subagents look stale on the site**

- On a dev machine with the kit installed: run `npm run sync:kit-manifest`, commit `src/data/kit-manifest.json`, push.

**Build on VPS/CI shows empty skills or subagents**

- Usually caused by an older sync script overwriting the manifest during `prebuild`. Update to the latest code — sync now skips when `~/.claude` is missing and keeps the committed JSON.

**Sync warns about missing skill paths**

- Ensure the kit is installed and the skill folder exists under `~/.claude/skills/`.

**Empty subagents after sync on CI**

- The agents directory was unreadable; restore from git or run sync on a machine with the kit installed.
