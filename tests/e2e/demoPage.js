const puppeteer = require("puppeteer");

const spaceKey = 'ZS';
const baseUrl = `https://zenuml-stg.atlassian.net/wiki/spaces/${spaceKey}`;
const demoPageTitle = 'ZenUML add-on Demo Page';
const searchUri = `/wiki/rest/api/content/search?cql=(title="${demoPageTitle}" and space="${spaceKey}")`;

(async () => {
  const browser = await puppeteer.launch({headless: process.env.CI === "true", 
    args: ['--disable-web-security', '--disable-features=IsolateOrigins,site-per-process']});
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
  console.log(`Found "${demoPageTitle}" pageId`, pageId);
  if(pageId) {
    await page.goto(`${baseUrl}/pages/${pageId}`);
    await page.waitForSelector('#title-text');

    await assertFrame({frameSelector: '#Demo1---Sequence-Diagram ~ div iframe',
      frameContentReadySelector: '.occurrence', contentSelector: 'div.diagram-title',
      expectedContentText: 'Order Service (Demonstration only)'});

    await assertFrame({frameSelector: '#Demo2---Graph ~ div iframe',
      frameContentReadySelector: '#graph svg', contentXpath: '//*[contains(text(), "Lamp doesn\'t work")]'});

    await assertFrame({frameSelector: '#Demo3---OpenAPI ~ div iframe',
      frameContentReadySelector: '#swagger-ui .scheme-container', contentXpath: '//span[text()="/users"]'});

    await assertFrame({frameSelector: '#Demo4---Mermaid ~ div iframe',
      frameContentReadySelector: '.viewer svg[role=img]', contentXpath: '//*[text()="A Gantt Diagram"]'});
      
    await assertFrame({frameSelector: '#Demo5---Embedding-an-existing-diagram-or-OpenAPI-spec ~ div iframe',
    frameContentReadySelector: '.occurrence', contentSelector: 'div.diagram-title',
    expectedContentText: 'Order Service (Demonstration only)'});
  }

  await browser.close();

  async function assertFrame({frameSelector, frameContentReadySelector, contentSelector, expectedContentText, contentXpath}) {
    const iframe = await waitForSelector(page, frameSelector);
    console.log(`Found ${frameSelector}`);

    const frame = await iframe.contentFrame();
    if(frameContentReadySelector) {
      await waitForSelector(frame, frameContentReadySelector, {timeout: 30 * 1000});
    }

    if(contentSelector) {
      await waitForSelector(frame, contentSelector);
      const contentText = await frame.$eval(contentSelector, e => e.innerText);
      log('Content text', contentText);
      if(contentText !== expectedContentText) {
        throw `Assertion failed: Actual content text "${contentText}" is not equal to "${expectedContentText}"`
      }
    }

    if(contentXpath) {
      await waitForSelector(frame, contentXpath);
    }
  }

  async function waitForSelector(page, selector, options) {
    try {
      const isXpath = selector.indexOf('/') === 0;
      return await (isXpath ? page.waitForXPath(selector, options) : page.waitForSelector(selector, options));
    } catch(e) {
      try {
        const html = await page.$eval('html', e => e.innerHTML);
        const url = await page.$eval('html', e => window.location.href);
        console.log(`Selector "${selector}" not found in ${url}:\n`, html);
      } catch(e2) {}
      throw e;
    }
  }

  function log(title, ...args) {
    console.log(`===== ${title} =====\n`, ...args);
  }
})();
