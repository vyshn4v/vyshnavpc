const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  // Open Graph standard dimensions
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  
  await page.goto('http://localhost:3000/blogs/nodejs-event-loop');
  await page.waitForLoadState('networkidle');
  
  // Hide the navbar and anything else to get a clean shot of the new premium hero gradient
  await page.evaluate(() => {
    const nav = document.querySelector('nav');
    if (nav) nav.style.display = 'none';
    
    // Ensure the hero banner perfectly fills the 630px height if it doesn't already
    const banner = document.querySelector('.post-banner');
    if (banner) {
      banner.style.minHeight = '630px';
      banner.style.display = 'flex';
      banner.style.flexDirection = 'column';
      banner.style.justifyContent = 'center';
    }
  });

  // Capture exactly the 1200x630 viewport
  await page.screenshot({ path: 'src/public/og-preview.png', clip: { x: 0, y: 0, width: 1200, height: 630 } });
  await browser.close();
  console.log('Successfully captured new OG preview image!');
})();
