const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('https://portfolio.vyshnavpc.com/blogs/nodejs-event-loop');
  await page.waitForTimeout(2000);
  
  const nodes = await page.$$eval('.lp', els => els.map(el => ({
    text: el.innerText.replace(/\n/g, ' '),
    left: el.style.left,
    top: el.style.top
  })));
  
  console.log('Production Nodes:', nodes);
  
  const ring = await page.$eval('.loop-ring', el => ({
    width: el.clientWidth,
    height: el.clientHeight,
    maxWidth: window.getComputedStyle(el).maxWidth
  }));
  
  console.log('Production Ring:', ring);
  
  await browser.close();
})();
