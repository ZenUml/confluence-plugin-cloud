const puppeteer = require("puppeteer");

const testDomain = process.env.ZENUML_DOMAIN || 'zenuml-stg.atlassian.net';
const spaceKey = process.env.ZENUML_SPACE || 'ZS';
const baseUrl = `https://${testDomain}/wiki/spaces/${spaceKey}`;
const isLite = process.env.IS_LITE === 'true';

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

  try {
    const createResult = await page.evaluate(inBrowserFunction, {action: 'createPage', spaceKey, isLite});
    if(!createResult?.id) {
      console.log(createResult);
      return;
    }

    console.log(`Created page with id: ${createResult.id}, title: ${createResult.title}`);

    try {
      const pageUrl = `${baseUrl}/pages/${createResult.id}`;
      await page.goto(pageUrl);
      console.log(`Navigated to ${pageUrl}`)
      await page.waitForSelector('#title-text');

      await assertFrame({frameSelector: `//iframe[contains(@id, "zenuml-sequence-macro${getModuleKeySuffix()}")]`,
        contentXpath: '//*[contains(text(), "Order Service (Demonstration only)")]'});

      // await assertFrame({frameSelector: '#Demo2---Graph ~ div iframe',
      //   frameContentReadySelector: '#graph svg', contentXpath: '//*[contains(text(), "Lamp doesn\'t work")]'});

      // await assertFrame({frameSelector: '#Demo3---OpenAPI ~ div iframe',
      //   frameContentReadySelector: '#swagger-ui .scheme-container', contentXpath: '//span[text()="/users"]'});

      // await assertFrame({frameSelector: '#Demo4---Mermaid ~ div iframe', contentXpath: '//*[text()="A Gantt Diagram"]'});
        
      // await assertFrame({frameSelector: '#Demo5---Embedding-an-existing-diagram-or-OpenAPI-spec ~ div iframe',
      // frameContentReadySelector: '.occurrence', contentSelector: 'div.diagram-title',
      // expectedContentText: 'Order Service (Demonstration only)'});
    } finally {
      const deleteResult = await page.evaluate(inBrowserFunction, {action: 'deletePage', pageId: createResult.id});

      if(deleteResult?.status === 'trashed') {
        console.log(`Deleted page with id: ${deleteResult.id}`);
      } else {
        console.log('deletePage result:\n', deleteResult);
      }
    }
  } finally {
    await browser.close();
  }

  async function inBrowserFunction({action, spaceKey, isLite, pageId}) {
    const baseUrl = '/wiki/rest/api/content';
    const contentType = 'application/json';
    const addonKey = 'com.zenuml.confluence-addon';
    const customContentType = `ac:${addonKey}:zenuml-content-graph`;

    async function createPage(space, title) {
      const page = await createDraft(space, title);

      try {
        const [sequence] = await Promise.all([
          createCustomContent(`Custom content of page ${title}`, demoSequenceContent, page.id)
        ]);

        const body = JSON.stringify(demoPageContent)
          .replaceAll('$$_SEQUENCE_CONTENT_ID', sequence.id);

        const data = { type: 'page', title, status: 'current', space: { key: space }, version: { number: page.version.number }, body: { atlas_doc_format: { value: body, representation: 'atlas_doc_format' } } };
        return await updateContent(page.id, data);
      }
      catch (e) {
        await updateContent(page.id, Object.assign({}, page, { status: 'trashed' }));
        return `createPage error: ${JSON.stringify(e)}`;
      }
    }

    async function createDraft(space, title) {
      const data = { type: 'page', title, status: 'draft', space: { key: space }, body: { raw: { value: '', representation: 'raw' } } };
      return await createContent(data);
    }

    async function createCustomContent(space, title, body, containerId) {
      const data = { type: customContentType, title, container: { id: containerId, type: 'page' }, space: { key: space }, body: { raw: { value: JSON.stringify(body), representation: 'raw' } } };

      return await request({ type: 'POST', contentType, data: JSON.stringify(data), url: baseUrl });
    }
    
    async function getContent(id) {
      const url = `${baseUrl}/${id}`;
      return await request({ type: 'GET', contentType, url });
    }

    async function createContent(data) {
      return await request({ type: 'POST', contentType, data: JSON.stringify(data), url: baseUrl });
    }

    async function updateContent(id, data) {
      const url = `${baseUrl}/${id}`;
      return await request({ type: 'PUT', contentType, data: JSON.stringify(data), url });
    }

    async function deletePage(pageId) {
      const data = await getContent(pageId);
      //We can't use "Delete content" API as it requires Connect app scope: DELETE
      return await updateContent(pageId, Object.assign({}, data, { status: 'trashed', version: {number: data.version.number + 1} }));
    }

    async function request(options) {
      const response = await fetch(options.url, {
        method: options.type,
        headers: { 'Content-Type': options.contentType, 'Accept': contentType }, body: options.data
      });
      return await response.json();
    }

    function uuidv4() {
      return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      );
    }

    function getModuleKeySuffix() {
      return isLite ? '-lite' : '';
    }

    const demoSequenceContent = {
      "title": "Order Service (Demonstration only)",
      "code": "title Order Service (Demonstration only)\n// Styling participants with background colors is an experimental feature.\n// This feature is available for users to test and provide feedback.\n@Actor Client #FFEBE6\n@Boundary OrderController #0747A6\n@EC2 <<BFF>> OrderService #E3FCEF\ngroup BusinessService {\n  @Lambda PurchaseService\n  @AzureFunction InvoiceService\n}\n\n@Starter(Client)\n//`POST /orders`\nOrderController.post(payload) {\n  OrderService.create(payload) {\n    order = new Order(payload)\n    if(order != null) {\n      par {\n        PurchaseService.createPO(order)\n        InvoiceService.createInvoice(order)      \n      }      \n    }\n  }\n}",
      "mermaidCode": "graph TD; A-->B;",
      "diagramType": "sequence"
    };

    const demoPageContent = {
      "type": "doc",
      "content": [
        {
          "type": "extension",
          "attrs": {
            "layout": "default",
            "extensionType": "com.atlassian.confluence.macro.core",
            "extensionKey": `zenuml-sequence-macro${getModuleKeySuffix()}`,
            "parameters": {
              "macroParams": {
                "uuid": {
                  "value": uuidv4()
                },
                "customContentId": {
                  "value": "$$_SEQUENCE_CONTENT_ID"
                },
                "__bodyContent": {
                  "value": "title Order Service (Demonstration only)\n// Styling participants with background colors is an experimental feature.\n// This feature is available for users to test and provide feedback.\n@Actor Client #FFEBE6\n@Boundary OrderController #0747A6\n@EC2 <<BFF>> OrderService #E3FCEF\ngroup BusinessService {\n  @Lambda PurchaseService\n  @AzureFunction InvoiceService\n}\n\n@Starter(Client)\n//`POST /orders`\nOrderController.post(payload) {\n  OrderService.create(payload) {\n    order = new Order(payload)\n    if(order != null) {\n      par {\n        PurchaseService.createPO(order)\n        InvoiceService.createInvoice(order)      \n      }      \n    }\n  }\n}"
                },
                "updatedAt": {
                  "value": "2022-08-14T12:00:03Z"
                }
              },
              "macroMetadata": {
                "macroId": {
                  "value": ""
                },
                "schemaVersion": {
                  "value": "1"
                },
                "placeholder": [
                  {
                    "type": "icon",
                    "data": {
                      "url": "/image/zenuml_logo.png"
                    }
                  }
                ],
                "title": "ZenUML Diagram"
              }
            },
            "localId": ""
          }
        }
      ],
      "version": 1
    };

    try {
      if(action === 'createPage') {
        return await createPage(spaceKey, `E2E test page at ${new Date()} - ${uuidv4()}`);
      }

      if(action === 'deletePage') {
        return await deletePage(pageId);
      }
    } catch(e) {
      console.error(`${action} error:`, e);
    }
  }

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

  function getModuleKeySuffix() {
    return isLite ? '-lite' : '';
  }

  function log(title, ...args) {
    console.log(`===== ${title} =====\n`, ...args);
  }

})();
