const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log(`CONSOLE: [${msg.type()}] ${msg.text()}`);
  });
  
  page.on('pageerror', err => {
    console.log(`PAGE ERROR: ${err.message}`);
  });

  page.on('requestfailed', req => {
    console.log(`REQUEST FAILED: ${req.url()} (${req.failure().errorText})`);
  });

  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });

  try {
    console.log('Navigating...');
    await page.goto('http://localhost:8089/', { waitUntil: 'domcontentloaded' });
    console.log('Navigated.');
  } catch (e) {
    console.log('Navigation failed:', e.message);
  }

  console.log('Final URL:', page.url());
  await browser.close();
})();
