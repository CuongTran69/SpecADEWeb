import http from 'http';
import fs from 'fs';
import path from 'path';
import { chromium } from '@playwright/test';

// 1. Simple static server for 'dist' folder
const serveDir = './dist';
const server = http.createServer((req, res) => {
  let filePath = path.join(serveDir, req.url === '/' ? 'index.html' : req.url);
  if (req.url === '/features') {
    filePath = path.join(serveDir, 'features/index.html');
  } else if (req.url === '/vi/features') {
    filePath = path.join(serveDir, 'vi/features/index.html');
  }

  // Basic content types
  const ext = path.extname(filePath);
  let contentType = 'text/html';
  if (ext === '.css') contentType = 'text/css';
  else if (ext === '.js') contentType = 'application/javascript';
  else if (ext === '.png') contentType = 'image/png';
  else if (ext === '.svg') contentType = 'image/svg+xml';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end('Not Found');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(3013, async () => {
  console.log('Server running on port 3013');

  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('http://localhost:3013/features');

    // Wait for page load
    await page.waitForTimeout(500);

    // Bounding box of #goal-showcase
    const showcase = page.locator('#goal-showcase');
    const box = await showcase.boundingBox();
    console.log('#goal-showcase bounding box on features page:', box);

    // Take screenshot of State 1 (Idle/Ready to Start)
    const ssPath1 = '/Users/cuongtran/.gemini/antigravity-ide/brain/9efd2b49-0616-4a37-9776-58fe9fe95b89/scratch/goal_loop_setup.png';
    await showcase.screenshot({ path: ssPath1 });
    console.log('State 1 (Idle) screenshot saved to:', ssPath1);

    // Click "Start Loop Simulation"
    console.log('Clicking Start Loop Simulation...');
    const startBtn = page.locator('#loop-btn-start');
    await startBtn.click();

    // Wait for simulation to run for a bit
    await page.waitForTimeout(5000);

    // Take screenshot of State 2 (Active Loop Running)
    const ssPath2 = '/Users/cuongtran/.gemini/antigravity-ide/brain/9efd2b49-0616-4a37-9776-58fe9fe95b89/scratch/goal_loop_running.png';
    await showcase.screenshot({ path: ssPath2 });
    console.log('State 2 (Running) screenshot saved to:', ssPath2);

    await browser.close();
  } catch (err) {
    console.error(err);
  } finally {
    server.close();
  }
});
