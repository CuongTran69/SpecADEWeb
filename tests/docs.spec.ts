import { test, expect } from '@playwright/test'

const BASE_URL = 'http://localhost:4321'

test.describe('Docs Section', () => {
  test('smoke: EN docs root loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/docs/`)
    await expect(page).toHaveTitle(/Introduction.*Spec ADE/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    const h1 = page.locator('h1')
    await expect(h1).toBeVisible()
  })

  test('smoke: VI docs root loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/vi/docs/`)
    await expect(page).toHaveTitle(/Giới thiệu.*Spec ADE/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'vi')
    const h1 = page.locator('h1')
    await expect(h1).toBeVisible()
  })

  test('sidebar navigation: click link changes URL and updates active state', async ({ page }) => {
    await page.goto(`${BASE_URL}/docs/`)
    const quickstartLink = page.locator('a[href="/docs/quickstart/"]')
    await quickstartLink.click()
    await expect(page).toHaveURL(/\/docs\/quickstart\//)
    await expect(quickstartLink).toHaveClass(/active/)
  })

  test('language switch: deep slug swaps locale', async ({ page }) => {
    await page.goto(`${BASE_URL}/docs/quickstart/`)
    const viLink = page.locator('[data-testid="lang-switch"]')
    await viLink.click()
    await expect(page).toHaveURL(/\/vi\/docs\/quickstart\//)
    await expect(page.locator('html')).toHaveAttribute('lang', 'vi')
  })

  test('theme toggle: persists across reload', async ({ page }) => {
    await page.goto(`${BASE_URL}/docs/`)
    const themeToggle = page.locator('[data-testid="theme-toggle"]')
    const htmlBefore = page.locator('html')
    const themeBefore = await htmlBefore.getAttribute('data-theme')

    await themeToggle.click()
    await page.waitForTimeout(200)

    const themeAfter = await htmlBefore.getAttribute('data-theme')
    expect(themeAfter).not.toBe(themeBefore)

    await page.reload()
    const themeAfterReload = await htmlBefore.getAttribute('data-theme')
    expect(themeAfterReload).toBe(themeAfter)
  })

  test('search: Cmd+K opens modal, query and enter navigate', async ({ page }) => {
    await page.goto(`${BASE_URL}/docs/`)
    await page.keyboard.press('Control+K')
    const modal = page.locator('.modal-bg')
    await expect(modal).toBeVisible()

    const input = page.locator('.modal-search input')
    await input.fill('git')
    await page.waitForTimeout(200)

    const firstResult = page.locator('.sresult').first()
    await expect(firstResult).toBeVisible()

    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/\/docs\/git\//)
  })

  test('TOC anchor scroll: click heading jumps to section', async ({ page }) => {
    await page.goto(`${BASE_URL}/docs/introduction/`)
    const tocLink = page.locator('.toc a').first()
    const href = await tocLink.getAttribute('href')

    if (href && href !== '#') {
      await tocLink.click()
      await page.waitForTimeout(200)

      const heading = page.locator(`#${href.slice(1)}`)
      const headingBox = await heading.boundingBox()
      expect(headingBox?.y).toBeLessThan(200)
    }
  })

  test('mobile drawer: toggle opens/closes at 375px viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto(`${BASE_URL}/docs/`)

    const menuToggle = page.locator('[data-menu-toggle]')
    const sidebar = page.locator('.sidebar')
    const scrim = page.locator('.scrim')

    await expect(sidebar).not.toHaveClass(/open/)
    await expect(scrim).not.toHaveClass(/open/)

    await menuToggle.click()
    await expect(sidebar).toHaveClass(/open/)
    await expect(scrim).toHaveClass(/open/)

    await page.keyboard.press('Escape')
    await expect(sidebar).not.toHaveClass(/open/)
    await expect(scrim).not.toHaveClass(/open/)
  })

  test('code copy: clipboard copy works', async ({ page }) => {
    await page.goto(`${BASE_URL}/docs/quickstart/`)
    const codeBlock = page.locator('.codeblock').first()
    await expect(codeBlock).toBeVisible()

    const copyButton = codeBlock.locator('.code-copy')
    await copyButton.click()

    await page.waitForTimeout(100)
    const buttonText = await copyButton.locator('span').textContent()
    expect(buttonText).toMatch(/Copied|Đã chép/)
  })
})
