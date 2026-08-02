const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
  
  await page.setRequestInterception(true);
  page.on('request', req => {
    if (['media', 'image', 'font'].includes(req.resourceType())) {
      req.abort();
    } else {
      req.continue();
    }
  });

  try {
    await page.goto('http://localhost:8089/', { waitUntil: 'domcontentloaded', timeout: 5000 });
  } catch (e) {}

  const result = await page.evaluate(() => {
    function getDetails(id) {
      const el = document.getElementById(id);
      if (!el) return `${id} NOT FOUND`;
      return {
        display: window.getComputedStyle(el).display,
        offsetHeight: el.offsetHeight
      };
    }
    
    return {
      services: getDetails('services'),
      testimonials: getDetails('testimonials'),
      methodology: getDetails('methodology'),
      solutions: getDetails('solutions'),
      faq: getDetails('faq-section')
    };
  });

  console.log(JSON.stringify(result, null, 2));
  await browser.close();
})();
