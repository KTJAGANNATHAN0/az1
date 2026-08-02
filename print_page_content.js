const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log(`CONSOLE: ${msg.text()}`);
  });
  
  page.on('pageerror', err => {
    console.log(`ERROR: ${err.message}`);
  });

  try {
    console.log('Navigating...');
    await page.goto('http://localhost:8089/', { waitUntil: 'domcontentloaded' });
    console.log('Navigated successfully.');
  } catch (e) {
    console.log('Navigation failed:', e.message);
  }
  
  const content = await page.content();
  console.log('HTML length:', content.length);
  console.log('HTML snippet:', content.substring(0, 500));
  await browser.close();
})();
