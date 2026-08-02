const puppeteer = require('puppeteer');

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.setRequestInterception(true);
  page.on('request', req => {
    if (['media', 'image', 'font'].includes(req.resourceType())) {
      req.abort();
    } else {
      req.continue();
    }
  });

  console.log('Navigating...');
  try {
    await page.goto('http://localhost:8089/', { waitUntil: 'domcontentloaded', timeout: 5000 });
  } catch (e) {
    console.log('Goto warning:', e.message);
  }

  const result = await page.evaluate(() => {
    function getParentChain(id) {
      const el = document.getElementById(id);
      if (!el) return 'NOT_FOUND';
      const chain = [];
      let p = el.parentElement;
      while (p) {
        chain.push(`${p.tagName}${p.className ? '.' + p.className.split(' ').join('.') : ''}`);
        p = p.parentElement;
      }
      return chain.join(' -> ');
    }
    return {
      testimonials: getParentChain('testimonials'),
      methodology: getParentChain('methodology')
    };
  });

  console.log('RESULT:', result);
  await browser.close();
})();
