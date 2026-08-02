const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.setRequestInterception(true);
  page.on('request', req => {
    if (['media', 'image', 'font'].includes(req.resourceType())) {
      req.abort();
    } else {
      req.continue();
    }
  });

  await page.goto('http://localhost:8089/', { waitUntil: 'domcontentloaded' }).catch(() => {});
  await new Promise(r => setTimeout(r, 1000));

  const result = await page.evaluate(() => {
    function getParentInfo(id) {
      const el = document.getElementById(id);
      if (!el) return `${id} not found`;
      
      const chain = [];
      let p = el.parentElement;
      while (p) {
        chain.push(`${p.tagName}${p.id ? '#' + p.id : ''}${p.className ? '.' + p.className.split(' ').join('.') : ''}`);
        p = p.parentElement;
      }
      return `${id} parents: ${chain.join(' -> ')}`;
    }
    
    return {
      testimonials: getParentInfo('testimonials'),
      methodology: getParentInfo('methodology'),
      faq: getParentInfo('faq-section')
    };
  });

  console.log('DOM PARENT HIERARCHIES:');
  console.log(result);
  
  await browser.close();
})();
