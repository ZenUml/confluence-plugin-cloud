const puppeteer = require("puppeteer");

const spaceKey = 'ZS';
const baseUrl = `https://zenuml-stg.atlassian.net/wiki/spaces/${spaceKey}`;
const title = 'ZenUML add-on Demo Page';
const searchUri = `/wiki/rest/api/content/search?cql=(title="${title}" and space=${spaceKey})`;

(async () => {
  const browser = await puppeteer.launch({headless: process.env.CI === "true"});
  const page = await browser.newPage();
  await page.goto(`${baseUrl}/overview`);

  const username = process.env.ZENUML_STAGE_USERNAME;
  await page.$eval('input[name=username]', (el, value) => el.value = value, username);
  await page.click("#login-submit");
  
  const password = process.env.ZENUML_STAGE_PASSWORD;
  await page.$eval('input[name=password]', (el, value) => el.value = value, password);
  await page.waitForXPath('//span[text() = "Log in"]');
  await page.click("#login-submit");
  await page.waitForSelector('#title-text');

  console.log(await page.title());

  const pageId = await page.$eval('head', (e, uri) => 
    fetch(uri).then(r => r.json()).then(d => {
      console.log(d);
      return d.size && d.results[0].id;
    }), searchUri
  );
  console.log(`Found "${title}" pageId`, pageId);
  if(pageId) {
    await page.goto(`${baseUrl}/pages/${pageId}`);
    await page.waitForSelector('#title-text');

    const macroFrame = await page.waitForSelector('div[data-layout-section=true] iframe');
    const frame = await macroFrame.contentFrame();
    frame.waitForSelector('.diagram-title');
    const title = await frame.$eval('.diagram-title', e => e.innerText);
    if(title !== 'Order Service (Demonstration only)') {
      throw `Assertion failed: Actual diagram title "${title}" is not equal to "Order Service (Demonstration only)"`
    }
  }

  await browser.close();
})();