const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({headless: process.env.CI === "true"});
  const page = await browser.newPage();
  await page.goto("https://zenuml-stg.atlassian.net/wiki/spaces/ZS/overview");

  const username = process.env.ZENUML_STAGE_USERNAME;
  await page.$eval('input[name=username]', (el, value) => el.value = value, username);
  await page.click("#login-submit");
  
  const password = process.env.ZENUML_STAGE_PASSWORD;
  await page.$eval('input[name=password]', (el, value) => el.value = value, password);
  await page.waitForXPath('//span[text() = "Log in"]');
  await page.click("#login-submit");
  await page.waitForSelector('#title-text');

  console.log(await page.title());

  await browser.close();
})();