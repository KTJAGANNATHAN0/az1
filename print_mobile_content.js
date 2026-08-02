const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });

  try {
    await page.goto('http://localhost:8089/', { waitUntil: 'domcontentloaded' });
  } catch (e) {
    console.log('Error:', e.message);
  }
  
  const content = await page.content();
  console.log('Is "testimonials" in HTML?', content.includes('id="testimonials"') || content.includes('testimonials'));
  console.log('Is "Hear from Our Clients" in HTML?', content.includes('Hear from Our Clients'));
  console.log('Mobile HTML length:', content.length);
  console.log('Mobile HTML snippet:', content.substring(0, 1000));
  await browser.close();
})();
