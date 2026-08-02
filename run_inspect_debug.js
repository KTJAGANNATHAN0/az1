const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });

  try {
    await page.goto('http://localhost:8089/', { waitUntil: 'domcontentloaded' });
    console.log('Page loaded.');
  } catch (e) {
    console.log('Page load error/warning:', e.message);
  }

  // Get info
  const info = await page.evaluate(() => {
    var t = document.getElementById('testimonials');
    if (!t) {
      return { html: document.body.innerHTML.substring(0, 1000), error: 'Testimonials not found' };
    }
    var styles = window.getComputedStyle(t);
    var parent = t.parentElement;
    var parentChain = [];
    while (parent) {
      var parentStyles = window.getComputedStyle(parent);
      parentChain.push({
        tag: parent.tagName,
        id: parent.id,
        className: parent.className,
        display: parentStyles.display,
        visibility: parentStyles.visibility,
        opacity: parentStyles.opacity,
        height: parent.offsetHeight
      });
      parent = parent.parentElement;
    }
    return {
      id: t.id,
      className: t.className,
      display: styles.display,
      visibility: styles.visibility,
      opacity: styles.opacity,
      height: t.offsetHeight,
      parentChain: parentChain
    };
  });

  console.log(JSON.stringify(info, null, 2));
  await browser.close();
})();
