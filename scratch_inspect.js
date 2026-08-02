const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // viewport removed
  
  page.on('console', msg => {
    console.log(`BROWSER CONSOLE: [${msg.type()}] ${msg.text()}`);
  });
  
  page.on('pageerror', err => {
    console.log(`BROWSER ERROR: ${err.message}`);
  });

  console.log('Navigating to http://127.0.0.1:8089/...');
  try {
    await page.goto('http://localhost:8089/', { waitUntil: 'domcontentloaded', timeout: 10000 });
  } catch (e) {
    console.log('Navigation warning/error:', e.message);
  }
  
  // Wait a moment for dynamic rendering scripts to execute
  await new Promise(r => setTimeout(r, 2000));
  
  const result = await page.evaluate(() => {
    var t = document.getElementById('testimonials');
    if (!t) return { error: 'Testimonials element not found' };
    
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
    
    return {
      id: t.id,
      className: t.className,
      display: styles.display,
      visibility: styles.visibility,
      opacity: styles.opacity,
      height: t.offsetHeight,
      cardCount: cardCount,
      trackHeight: trackHeight,
      parentChain: parentChain
    };
  });
  
  console.log('EVALUATION RESULT:');
  console.log(JSON.stringify(result, null, 2));
  await browser.close();
})();
