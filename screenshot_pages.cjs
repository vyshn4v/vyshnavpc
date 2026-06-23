const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  
  await page.goto('http://localhost:3000/journey');
  await page.screenshot({ path: 'journey.png', fullPage: true });
  
  await page.goto('http://localhost:3000/blogs');
  await page.screenshot({ path: 'blogs.png', fullPage: true });

  await page.goto('http://localhost:3000/blogs/node-event-loop-internals');
  await page.screenshot({ path: 'post.png', fullPage: true });

  await browser.close();
})();
