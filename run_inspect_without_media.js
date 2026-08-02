const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
  
  await page.setRequestInterception(true);
  page.on('request', req => {
    if (req.resourceType() === 'media' || req.resourceType() === 'image') {
      req.abort();
    } else {
      req.continue();
    }
  });

  await page.goto('http://localhost:8089/', { waitUntil: 'domcontentloaded' }).catch(() => {});

  const result = await page.evaluate(() => {
    function getChain(id) {
      var el = document.getElementById(id);
      if (!el) return { error: id + ' not found' };
      var chain = [];
      var parent = el.parentElement;
      while (parent) {
        chain.push({
          tag: parent.tagName,
          id: parent.id,
          className: parent.className,
          display: window.getComputedStyle(parent).display
        });
        parent = parent.parentElement;
      }
      return {
        id: el.id,
        display: window.getComputedStyle(el).display,
        offsetHeight: el.offsetHeight,
        chain: chain
      };
    }
    
    return {
      testimonials: getChain('testimonials'),
      methodology: getChain('methodology'),
      faq: getChain('faq-section')
    };
  });

  console.log(JSON.stringify(result, null, 2));
  await browser.close();
})();
