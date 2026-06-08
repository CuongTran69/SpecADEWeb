import { expect, test } from '@playwright/test'
import { injectAxe, checkA11y } from 'axe-playwright'

test.describe('Context Engine Page', () => {
  test('GET /context-engine returns 200', async ({ page }) => {
    const response = await page.goto('/context-engine')
    expect(response?.status()).toBe(200)
  })

  test('GET /vi/context-engine returns 200', async ({ page }) => {
    const response = await page.goto('/vi/context-engine')
    expect(response?.status()).toBe(200)
  })

  test('English context-engine page shows hero heading', async ({ page }) => {
    await page.goto('/context-engine')
    const heading = page.locator('h2:has-text("Local-first code context engine for AI agents")')
    await expect(heading).toBeVisible()
  })

  test('Vietnamese context-engine page shows hero heading', async ({ page }) => {
    await page.goto('/vi/context-engine')
    const heading = page.locator('h2:has-text("Công cụ ngữ cảnh code local-first dành cho AI agents")')
    await expect(heading).toBeVisible()
  })

  test('Context Engine page has GitHub link to repo', async ({ page }) => {
    await page.goto('/context-engine')
    const link = page.locator('a[href*="vibervn-context-engine"]').first()
    await expect(link).toHaveAttribute('href', /vibervn-context-engine/)
  })

  test('Header desktop nav contains context-engine link', async ({ page }) => {
    await page.goto('/')
    const navLink = page.locator('.nav-links a[href*="/context-engine"]')
    await expect(navLink).toBeVisible()
  })

  test('Context Engine nav link has active state on context-engine route', async ({ page }) => {
    await page.goto('/context-engine')
    const navLink = page.locator('.nav-links a[href*="/context-engine"]')
    await expect(navLink).toHaveClass(/nav-link--active/)
  })

  test('Vietnamese context engine page has alternate hreflang link', async ({ page }) => {
    await page.goto('/context-engine')
    const alternate = page.locator('link[rel="alternate"][hreflang="vi"]')
    await expect(alternate).toHaveAttribute('href', /vi\/context-engine/)
  })

  test('Mobile nav includes context-engine link', async ({ page }) => {
    await page.goto('/context-engine')
    await page.setViewportSize({ width: 375, height: 667 })
    // Open mobile menu first
    await page.click('[data-testid="nav-toggle"]')
    const mobileLink = page.locator('[data-testid="mobile-nav-link-context-engine"]')
    await expect(mobileLink).toBeVisible()
  })

  test('Context Engine page has no horizontal overflow at 375px', async ({ page }) => {
    await page.goto('/context-engine')
    await page.setViewportSize({ width: 375, height: 812 })
    const bodyWidth = await page.evaluate(() => document.body.offsetWidth)
    const windowWidth = await page.evaluate(() => window.innerWidth)
    expect(bodyWidth).toBeLessThanOrEqual(windowWidth + 1) // +1 for rounding
  })

  test('Footer includes context-engine link', async ({ page }) => {
    await page.goto('/context-engine')
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    const footerLink = page.locator('footer a[href*="/context-engine"]')
    await expect(footerLink).toBeVisible()
  })
})

