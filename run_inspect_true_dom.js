const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });

  console.log('Navigating...');
  try {
    await page.goto('http://localhost:8089/', { waitUntil: 'domcontentloaded', timeout: 15000 });
  } catch (e) {
    console.log('Ignore navigation error:', e.message);
  }

  // Wait 2000ms for scripts to run
  await new Promise(r => setTimeout(r, 2000));

  const result = await page.evaluate(() => {
    var t = document.getElementById('testimonials');
    if (!t) {
      return { html: document.body.innerHTML.substring(0, 1000), error: 'Testimonials element not found in DOM' };
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
    
    var track = document.getElementById('marqueeTrack');
    var cardCount = track ? track.children.length : 0;
    var trackHeight = track ? track.offsetHeight : 0;
    var trackStyles = track ? window.getComputedStyle(track) : null;
    var viewport = document.getElementById('marqueeViewport');
    var viewportStyles = viewport ? window.getComputedStyle(viewport) : null;
    
    return {
      id: t.id,
      className: t.className,
      display: styles.display,
      visibility: styles.visibility,
      opacity: styles.opacity,
      height: t.offsetHeight,
      cardCount: cardCount,
      trackHeight: trackHeight,
      trackDisplay: trackStyles ? trackStyles.display : null,
      viewportDisplay: viewportStyles ? viewportStyles.display : null,
      parentChain: parentChain
    };
  });

  console.log('INSPECTION RESULT:');
  console.log(JSON.stringify(result, null, 2));
  await browser.close();
})();
