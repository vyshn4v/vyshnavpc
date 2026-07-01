const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000');
  // wait for fonts and images
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'debug_screenshot.png', fullPage: true });
  await browser.close();
  console.log('Screenshot saved to debug_screenshot.png');
})();
