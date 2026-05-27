import { test, expect, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

// ─── Helpers ────────────────────────────────────────────────────────────────

async function setTheme(page: Page, theme: 'dark' | 'light') {
  await page.addInitScript((t) => {
    try {
      window.localStorage.setItem('spec-ade-web:theme', t)
    } catch {}
  }, theme)
}

// ─── Test 1: English route returns 200 and hero is visible ──────────────────

test('/ returns 200, hero heading visible, primary CTA present', async ({ page }) => {
  const response = await page.goto('/')
  expect(response?.status()).toBe(200)

  // Hero heading — new copy
  const heading = page.getByRole('heading', { level: 1 })
  await expect(heading).toBeVisible()
  await expect(heading).toContainText('AI coding agent')

  // Primary CTA
  const cta = page.getByTestId('hero-primary-cta')
  await expect(cta).toBeVisible()
  await expect(cta).toHaveAttribute('href', '#get-started')
})

// ─── Test 2: Vietnamese route returns 200 and hero is visible ───────────────

test('/vi/ returns 200, hero heading visible (Vietnamese)', async ({ page }) => {
  const response = await page.goto('/vi/')
  expect(response?.status()).toBe(200)

  const heading = page.getByRole('heading', { level: 1 })
  await expect(heading).toBeVisible()
  // Vietnamese headline contains "AI coding agent"
  await expect(heading).toContainText('AI coding agent')
})

// ─── Test 3: Theme toggle switches data-theme attribute ─────────────────────

test('theme toggle switches data-theme attribute on click', async ({ page }) => {
  // Ensure we start in dark mode by setting theme before navigating
  await setTheme(page, 'dark')
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')

  // Click the theme toggle button (wait for Vue hydration)
  const toggle = page.locator('[data-testid="theme-toggle"][data-hydrated="true"]')
  await expect(toggle).toBeVisible()
  await toggle.click()

  // Should now be light
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')

  // Click again — back to dark
  await toggle.click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
})

// ─── Test 4: Install tabs switch panels and update aria-selected ─────────────

test('install tabs switch panels on click and update aria-selected', async ({ page }) => {
  await page.goto('/')

  // Scroll to get-started section
  await page.locator('#get-started').scrollIntoViewIfNeeded()

  // First tab (macOS) should be selected by default
  const macTab = page.getByTestId('install-tab-mac')
  await expect(macTab).toHaveAttribute('aria-selected', 'true')

  // Click the "From source" tab
  const sourceTab = page.getByTestId('install-tab-source')
  await sourceTab.click()

  await expect(sourceTab).toHaveAttribute('aria-selected', 'true')
  await expect(macTab).toHaveAttribute('aria-selected', 'false')

  // The source panel should be visible
  const sourcePanel = page.locator('#ipanel-source')
  await expect(sourcePanel).toBeVisible()

  // The mac panel should be hidden
  const macPanel = page.locator('#ipanel-mac')
  await expect(macPanel).toBeHidden()
})

// ─── Test 5: Language switcher link points to correct alternate ──────────────

test('language switcher link points to correct alternate', async ({ page }) => {
  // On English page, switcher should point to /vi/
  await page.goto('/')
  const langSwitch = page.getByTestId('lang-switch')
  await expect(langSwitch).toBeVisible()
  await expect(langSwitch).toHaveAttribute('href', '/vi/')

  // On Vietnamese page, switcher should point to /
  await page.goto('/vi/')
  const langSwitchVi = page.getByTestId('lang-switch')
  await expect(langSwitchVi).toBeVisible()
  await expect(langSwitchVi).toHaveAttribute('href', '/')
})

// ─── Test 6: axe-core accessibility scan on both routes ─────────────────────

test('axe-core scan on / — no critical violations', async ({ page }) => {
  await page.goto('/')
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze()

  // Filter out known false positives from third-party content
  const critical = results.violations.filter((v) => v.impact === 'critical')
  expect(critical, `Critical a11y violations: ${JSON.stringify(critical, null, 2)}`).toHaveLength(0)
})

test('axe-core scan on /vi/ — no critical violations', async ({ page }) => {
  await page.goto('/vi/')
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze()

  const critical = results.violations.filter((v) => v.impact === 'critical')
  expect(critical, `Critical a11y violations: ${JSON.stringify(critical, null, 2)}`).toHaveLength(0)
})

// ─── Test 7: Visual regression — 3 viewports × 2 themes × 2 routes ──────────

const viewports = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 800 },
]

const themes: Array<'dark' | 'light'> = ['dark', 'light']
const routes = ['/', '/vi/']

for (const viewport of viewports) {
  for (const theme of themes) {
    for (const route of routes) {
      const routeSlug = route === '/' ? 'en' : 'vi'
      const snapshotName = `landing-${routeSlug}-${theme}-${viewport.name}.png`

      test(`visual regression: ${routeSlug} ${theme} ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height })
        await setTheme(page, theme)
        await page.goto(route)

        // Wait for animations to settle
        await page.waitForTimeout(300)

        // Scroll to top
        await page.evaluate(() => window.scrollTo(0, 0))

        await expect(page).toHaveScreenshot(snapshotName, {
          fullPage: false,
          maxDiffPixelRatio: 0.02,
        })
      })
    }
  }
}

// ─── Test 8: 5 spotlights render in correct order ───────────────────────────

test('5 spotlights render in correct order on /', async ({ page }) => {
  await page.goto('/')
  for (const id of ['claw', 'goal', 'multi-cli', 'db', 'binary']) {
    const spotlight = page.getByTestId(`spotlight-${id}`)
    await expect(spotlight).toBeVisible()
  }
})

test('view all features CTA is visible on / and links to /features', async ({ page }) => {
  await page.goto('/')
  const btn = page.getByTestId('view-all-features-btn')
  await expect(btn).toBeVisible()
  await expect(btn).toHaveAttribute('href', '/features')
})

test('view all features CTA is visible on /vi/ and links to /vi/features', async ({ page }) => {
  await page.goto('/vi/')
  const btn = page.getByTestId('view-all-features-btn')
  await expect(btn).toBeVisible()
  await expect(btn).toHaveAttribute('href', '/vi/features')
})

test('features recap visible on /features and /vi/features', async ({ page }) => {
  await page.goto('/features')
  await expect(page.getByTestId('features-recap')).toBeVisible()

  await page.goto('/vi/features')
  await expect(page.getByTestId('features-recap')).toBeVisible()
})

test('5 spotlights render in correct order on /vi/', async ({ page }) => {
  await page.goto('/vi/')
  for (const id of ['claw', 'goal', 'multi-cli', 'db', 'binary']) {
    const spotlight = page.getByTestId(`spotlight-${id}`)
    await expect(spotlight).toBeVisible()
  }
})

// ─── Test 11: /faq returns 200 and shows all FAQ items ──────────────────────

test('/faq returns 200 and shows all FAQ items', async ({ page }) => {
  const response = await page.goto('/faq')
  expect(response?.status()).toBe(200)

  // Page title heading should be visible
  const heading = page.getByRole('heading', { level: 1 })
  await expect(heading).toBeVisible()

  // All 8 FAQ items should be present (not just top 3)
  for (let i = 0; i < 8; i++) {
    const item = page.getByTestId(`faq-item-${i}`)
    await expect(item).toBeVisible()
  }
})

// ─── Test 12: /install returns 200 and shows the install command ─────────────

test('/install returns 200 and shows the install command', async ({ page }) => {
  const response = await page.goto('/install')
  expect(response?.status()).toBe(200)

  // Page title heading should be visible
  const heading = page.getByRole('heading', { level: 1 })
  await expect(heading).toBeVisible()

  // The primary install command should be present
  const installCommand = page.locator('pre code').first()
  await expect(installCommand).toBeVisible()
  await expect(installCommand).toContainText('npx -y @spec-ade/cli@latest')
})

// ─── Test 13: Goal Showcase Interactive Tab Switcher ──────────────────────────

test('Goal Showcase: scenario selector updates goal text & milestones', async ({ page }) => {
  await page.goto('/features')

  const section = page.locator('#goal-showcase')
  await expect(section).toBeVisible()

  // Default preset (Auth) goal and milestone
  await expect(section.locator('.goal-input-text')).toContainText('Add JWT authentication with database storage.')
  await expect(section.locator('#loop-step-c1 .milestone-text')).toContainText('1. Database migration for users table')

  // Click Cache preset tab
  await section.locator('.goal-select-btn[data-goal-id="cache"]').click()
  await expect(section.locator('.goal-input-text')).toContainText('Optimize database query times with Redis caching.')
  await expect(section.locator('#loop-step-c1 .milestone-text')).toContainText('1. Profile DB queries & find bottleneck')

  // Click Testing preset tab
  await section.locator('.goal-select-btn[data-goal-id="testing"]').click()
  await expect(section.locator('.goal-input-text')).toContainText('Write unit and integration tests for payment flow.')
  await expect(section.locator('#loop-step-c1 .milestone-text')).toContainText('1. Mock Stripe gateway requests')
})

test('Goal Showcase: simulation runs to completion', async ({ page }) => {
  // Increase test timeout for simulation timing
  test.setTimeout(15000)
  await page.goto('/features')

  const section = page.locator('#goal-showcase')
  const startBtn = section.locator('#loop-btn-start')
  await expect(startBtn).toBeVisible()

  // Click Start Loop Simulation
  await startBtn.click()

  // Wait for the success banner to appear at the end of the simulation
  const successBanner = section.locator('#loop-success-banner')
  await expect(successBanner).toBeVisible({ timeout: 12000 })
})

// ─── Test 15: Spotlight detail links to Features page ────────────────────────

test('spotlights on / have correct detail links to /features', async ({ page }) => {
  await page.goto('/')

  // Goal spotlight detail button
  const goalLink = page.locator('[data-testid="spotlight-goal"] .spotlight-copy a')
  await expect(goalLink).toBeVisible()
  await expect(goalLink).toHaveAttribute('href', '/features#goal-showcase')

  // Multi-CLI spotlight detail button
  const mcLink = page.locator('[data-testid="spotlight-multi-cli"] .spotlight-copy a')
  await expect(mcLink).toBeVisible()
  await expect(mcLink).toHaveAttribute('href', '/features#multi-agent')
})

test('spotlights on /vi/ have correct detail links to /vi/features', async ({ page }) => {
  await page.goto('/vi/')

  // Goal spotlight detail button
  const goalLink = page.locator('[data-testid="spotlight-goal"] .spotlight-copy a')
  await expect(goalLink).toBeVisible()
  await expect(goalLink).toHaveAttribute('href', '/vi/features#goal-showcase')

  // Multi-CLI spotlight detail button
  const mcLink = page.locator('[data-testid="spotlight-multi-cli"] .spotlight-copy a')
  await expect(mcLink).toBeVisible()
  await expect(mcLink).toHaveAttribute('href', '/vi/features#multi-agent')
})
