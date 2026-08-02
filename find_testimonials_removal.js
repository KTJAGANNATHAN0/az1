const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });

  // Load page
  await page.goto('http://localhost:8089/', { waitUntil: 'domcontentloaded' }).catch(() => {});

  // 1. Immediately check
  const check1 = await page.evaluate(() => {
    var t = document.getElementById('testimonials');
    return t ? 'Present' : 'Missing';
  });
  console.log('Immediately after domcontentloaded:', check1);

  // 2. Wait 500ms and check
  await new Promise(r => setTimeout(r, 500));
  const check2 = await page.evaluate(() => {
    var t = document.getElementById('testimonials');
    return t ? 'Present' : 'Missing';
  });
  console.log('After 500ms:', check2);

  // 3. Wait 2000ms and check
  await new Promise(r => setTimeout(r, 1500));
  const check3 = await page.evaluate(() => {
    var t = document.getElementById('testimonials');
    return t ? 'Present' : 'Missing';
  });
  console.log('After 2000ms:', check3);

  await browser.close();
})();
