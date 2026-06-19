const { chromium } = require('playwright');

(async () => {
  console.log("Starting Chromium...");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  try {
    console.log("Navigating to Zlink...");
    await page.goto('https://zlink.minervaiot.com/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(5000);
    
    // Dump HTML of the form or body
    const bodyHtml = await page.evaluate(() => {
      const form = document.querySelector('form') || document.querySelector('.login-form') || document.querySelector('[class*="login"]') || document.body;
      return form.outerHTML;
    });
    
    console.log("\n--- LOGIN FORM HTML ---");
    console.log(bodyHtml.slice(0, 8000));
    console.log("-----------------------\n");
    
  } catch (e) {
    console.error("Error:", e);
  } finally {
    await browser.close();
  }
})();
