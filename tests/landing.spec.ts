import { test, expect, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

// The site is served from root on Cloudflare Pages; the helper stays in case base changes.
const BASE = ''
const url = (path: string = '/') => `${BASE}${path === '/' ? '/' : path}`

async function setTheme(page: Page, theme: 'dark' | 'light') {
  await page.addInitScript((t) => {
    try {
      window.localStorage.setItem('spec-ade-web:theme', t)
    } catch {}
  }, theme)
}

// ─── Homepage smoke tests ────────────────────────────────────────────────────

test('/ returns 200, hero heading visible, primary CTA points to /install', async ({ page }) => {
  const response = await page.goto(url('/'))
  expect(response?.status()).toBe(200)

  const heading = page.getByRole('heading', { level: 1 })
  await expect(heading).toBeVisible()
  await expect(heading).toContainText('Spec ADE')

  const cta = page.getByTestId('hero-primary-cta')
  await expect(cta).toBeVisible()
  await expect(cta).toHaveAttribute('href', url('/install'))
})

test('/vi/ returns 200, hero heading visible (Vietnamese)', async ({ page }) => {
  const response = await page.goto(url('/vi/'))
  expect(response?.status()).toBe(200)

  const heading = page.getByRole('heading', { level: 1 })
  await expect(heading).toBeVisible()
  await expect(heading).toContainText('Spec ADE')
})

// ─── Theme toggle ────────────────────────────────────────────────────────────

test('theme toggle switches data-theme attribute on click', async ({ page }) => {
  await setTheme(page, 'dark')
  await page.goto(url('/'))
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')

  const toggle = page.locator('[data-testid="theme-toggle"][data-hydrated="true"]')
  await expect(toggle).toBeVisible()
  await toggle.click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')

  await toggle.click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
})

// ─── Language switcher ───────────────────────────────────────────────────────

test('language switcher link points to correct alternate', async ({ page }) => {
  await page.goto(url('/'))
  const langSwitch = page.getByTestId('lang-switch')
  await expect(langSwitch).toBeVisible()
  await expect(langSwitch).toHaveAttribute('href', url('/vi/'))

  await page.goto(url('/vi/'))
  const langSwitchVi = page.getByTestId('lang-switch')
  await expect(langSwitchVi).toBeVisible()
  await expect(langSwitchVi).toHaveAttribute('href', url('/'))
})

// ─── Accessibility ───────────────────────────────────────────────────────────

test('axe-core scan on / — no critical violations', async ({ page }) => {
  await page.goto(url('/'))
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
  const critical = results.violations.filter((v) => v.impact === 'critical')
  expect(critical, `Critical a11y violations: ${JSON.stringify(critical, null, 2)}`).toHaveLength(0)
})

test('axe-core scan on /vi/ — no critical violations', async ({ page }) => {
  await page.goto(url('/vi/'))
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
  const critical = results.violations.filter((v) => v.impact === 'critical')
  expect(critical, `Critical a11y violations: ${JSON.stringify(critical, null, 2)}`).toHaveLength(0)
})

// ─── Visual regression — 3 viewports × 2 themes × 2 routes ───────────────────

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
        await page.goto(url(route))
        await page.waitForTimeout(300)
        await page.evaluate(() => window.scrollTo(0, 0))

        await expect(page).toHaveScreenshot(snapshotName, {
          fullPage: false,
          maxDiffPixelRatio: 0.02,
        })
      })
    }
  }
}

// ─── Homepage key features grid ──────────────────────────────────────────────

test('homepage shows 6 key feature cards linking to /features', async ({ page }) => {
  await page.goto(url('/'))
  for (const id of ['multi-agent', 'goal', 'port', 'claw', 'db', 'design']) {
    const card = page.getByTestId(`key-feature-${id}`)
    await expect(card).toBeVisible()
  }
})

// ─── Pricing section ─────────────────────────────────────────────────────────

test('homepage pricing section is visible with two plan cards', async ({ page }) => {
  await page.goto(url('/'))
  await page.locator('#pricing').scrollIntoViewIfNeeded()
  await expect(page.locator('#pricing')).toBeVisible()
  await expect(page.locator('.pricing-card')).toHaveCount(2)
})

// ─── Sub-pages ───────────────────────────────────────────────────────────────

test('/faq returns 200 and shows all FAQ items', async ({ page }) => {
  const response = await page.goto(url('/faq'))
  expect(response?.status()).toBe(200)

  const heading = page.getByRole('heading', { level: 1 })
  await expect(heading).toBeVisible()

  for (let i = 0; i < 8; i++) {
    const item = page.getByTestId(`faq-item-${i}`)
    await expect(item).toBeVisible()
  }
})

test('/install returns 200 and shows the install command', async ({ page }) => {
  const response = await page.goto(url('/install'))
  expect(response?.status()).toBe(200)

  const heading = page.getByRole('heading', { level: 1 })
  await expect(heading).toBeVisible()

  const installCommand = page.locator('pre code').first()
  await expect(installCommand).toBeVisible()
  await expect(installCommand).toContainText('npx -y @spec-ade/cli@latest')
})

test('/features returns 200 and renders the feature recap and showcase sections', async ({ page }) => {
  const response = await page.goto(url('/features'))
  expect(response?.status()).toBe(200)

  await expect(page.getByTestId('features-recap')).toBeVisible()
  await expect(page.locator('#multi-agent')).toBeVisible()
  await expect(page.locator('#goal-showcase')).toBeVisible()
  await expect(page.locator('#port-forwarding')).toBeVisible()
  await expect(page.locator('#claw')).toBeVisible()
  await expect(page.locator('#db')).toBeVisible()
  await expect(page.locator('#design')).toBeVisible()
})

test('/vi/features returns 200 and renders the same sections', async ({ page }) => {
  const response = await page.goto(url('/vi/features'))
  expect(response?.status()).toBe(200)
  await expect(page.getByTestId('features-recap')).toBeVisible()
})

// ─── Goal Showcase interactivity ─────────────────────────────────────────────

test('Goal Showcase: scenario selector updates goal text & milestones', async ({ page }) => {
  await page.goto(url('/features'))

  const section = page.locator('#goal-showcase')
  await expect(section).toBeVisible()

  await expect(section.locator('.goal-input-text')).toContainText('Add JWT authentication with database storage.')
  await expect(section.locator('#loop-step-c1 .milestone-text')).toContainText('1. Database migration for users table')

  await section.locator('.goal-select-btn[data-goal-id="cache"]').click()
  await expect(section.locator('.goal-input-text')).toContainText('Optimize database query times with Redis caching.')
  await expect(section.locator('#loop-step-c1 .milestone-text')).toContainText('1. Profile DB queries & find bottleneck')

  await section.locator('.goal-select-btn[data-goal-id="testing"]').click()
  await expect(section.locator('.goal-input-text')).toContainText('Write unit and integration tests for payment flow.')
  await expect(section.locator('#loop-step-c1 .milestone-text')).toContainText('1. Mock Stripe gateway requests')
})

test('Goal Showcase: simulation runs to completion', async ({ page }) => {
  test.setTimeout(15000)
  await page.goto(url('/features'))

  const section = page.locator('#goal-showcase')
  const startBtn = section.locator('#loop-btn-start')
  await expect(startBtn).toBeVisible()
  await startBtn.click()

  const successBanner = section.locator('#loop-success-banner')
  await expect(successBanner).toBeVisible({ timeout: 12000 })
})
