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
    await withNewPage(async () => {
      
      await assertFrame({frameSelector: `//iframe[contains(@id, "zenuml-sequence-macro${getModuleKeySuffix()}")]`,
        contentXpath: '//*[contains(text(), "Order Service (Demonstration only)")]'});

      await assertFrame({frameSelector: `//iframe[contains(@id, "zenuml-graph-macro${getModuleKeySuffix()}")]`,
        contentXpath: '//*[contains(text(), "Lamp doesn\'t work")]'});

      await assertFrame({frameSelector: `//iframe[contains(@id, "zenuml-openapi-macro${getModuleKeySuffix()}")]`,
        contentXpath: '//span[text()="/users"]'});

      await assertFrame({frameSelector: `//iframe[contains(@id, "zenuml-embed-macro${getModuleKeySuffix()}")]`,
      contentXpath: '//*[contains(text(), "Order Service (Demonstration only)")]'});

      // await assertFrame({frameSelector: '#Demo4---Mermaid ~ div iframe', contentXpath: '//*[text()="A Gantt Diagram"]'});
    });
  } finally {
    await browser.close();
  }

  async function withNewPage(callback) {
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

      return await callback();
    } finally {
      const deleteResult = await page.evaluate(inBrowserFunction, {action: 'deletePage', pageId: createResult.id});

      if(deleteResult?.status === 'trashed') {
        console.log(`Deleted page with id: ${deleteResult.id}`);
      } else {
        console.log('deletePage result:\n', deleteResult);
      }
    }
  }

  async function inBrowserFunction({action, spaceKey, isLite, pageId}) {
    const baseUrl = '/wiki/rest/api/content';
    const contentType = 'application/json';
    const addonKey = 'com.zenuml.confluence-addon';
    const customContentType = `ac:${addonKey}:zenuml-content-graph`;

    async function createPage(title) {
      const page = await createDraft(title);

      try {
        const [sequence, graph, openapi] = await Promise.all([
          createCustomContent(`Sequence custom content of page ${title}`, demoSequenceContent, page.id),
          createCustomContent(`Graph custom content of page ${title}`, demoGraphContent, page.id),
          createCustomContent(`OpenAPI custom content of page ${title}`, demoOpenAPIContent, page.id),
        ]);

        const body = JSON.stringify(demoPageContent)
          .replaceAll('$$_SEQUENCE_CONTENT_ID', sequence.id)
          .replaceAll('$$_GRAPH_CONTENT_ID', graph.id)
          .replaceAll('$$_OPENAPI_CONTENT_ID', openapi.id)
          ;

        const data = { type: 'page', title, status: 'current', space: { key: spaceKey }, version: { number: page.version.number }, body: { atlas_doc_format: { value: body, representation: 'atlas_doc_format' } } };
        return await updateContent(page.id, data);
      }
      catch (e) {
        await updateContent(page.id, Object.assign({}, page, { status: 'trashed' }));
        return `createPage error: ${JSON.stringify(e)}`;
      }
    }

    async function createDraft(title) {
      const data = { type: 'page', title, status: 'draft', space: { key: spaceKey }, body: { raw: { value: '', representation: 'raw' } } };
      return await createContent(data);
    }

    async function createCustomContent(title, body, containerId) {
      const data = { type: customContentType, title, container: { id: containerId, type: 'page' }, space: { key: spaceKey }, body: { raw: { value: JSON.stringify(body), representation: 'raw' } } };

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

    const demoGraphContent = {
      "diagramType": "graph",
      "graphXml": "<mxGraphModel dx=\"1426\" dy=\"694\" grid=\"1\" gridSize=\"10\" guides=\"1\" tooltips=\"1\" connect=\"1\" arrows=\"1\" fold=\"1\" page=\"1\" pageScale=\"1\" pageWidth=\"827\" pageHeight=\"1169\"><root><mxCell id=\"WIyWlLk6GJQsqaUBKTNV-0\"/><mxCell id=\"WIyWlLk6GJQsqaUBKTNV-1\" parent=\"WIyWlLk6GJQsqaUBKTNV-0\"/><mxCell id=\"WIyWlLk6GJQsqaUBKTNV-2\" value=\"\" style=\"rounded=0;html=1;jettySize=auto;orthogonalLoop=1;fontSize=11;endArrow=block;endFill=0;endSize=8;strokeWidth=1;shadow=0;labelBackgroundColor=none;edgeStyle=orthogonalEdgeStyle;\" parent=\"WIyWlLk6GJQsqaUBKTNV-1\" source=\"WIyWlLk6GJQsqaUBKTNV-3\" target=\"WIyWlLk6GJQsqaUBKTNV-6\" edge=\"1\"><mxGeometry relative=\"1\" as=\"geometry\"/></mxCell><mxCell id=\"WIyWlLk6GJQsqaUBKTNV-3\" value=\"Lamp doesn't work\" style=\"rounded=1;whiteSpace=wrap;html=1;fontSize=12;glass=0;strokeWidth=1;shadow=0;\" parent=\"WIyWlLk6GJQsqaUBKTNV-1\" vertex=\"1\"><mxGeometry x=\"160\" y=\"80\" width=\"120\" height=\"40\" as=\"geometry\"/></mxCell><mxCell id=\"WIyWlLk6GJQsqaUBKTNV-4\" value=\"Yes\" style=\"rounded=0;html=1;jettySize=auto;orthogonalLoop=1;fontSize=11;endArrow=block;endFill=0;endSize=8;strokeWidth=1;shadow=0;labelBackgroundColor=none;edgeStyle=orthogonalEdgeStyle;\" parent=\"WIyWlLk6GJQsqaUBKTNV-1\" source=\"WIyWlLk6GJQsqaUBKTNV-6\" target=\"WIyWlLk6GJQsqaUBKTNV-10\" edge=\"1\"><mxGeometry y=\"20\" relative=\"1\" as=\"geometry\"><mxPoint as=\"offset\"/></mxGeometry></mxCell><mxCell id=\"WIyWlLk6GJQsqaUBKTNV-5\" value=\"No\" style=\"edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;jettySize=auto;orthogonalLoop=1;fontSize=11;endArrow=block;endFill=0;endSize=8;strokeWidth=1;shadow=0;labelBackgroundColor=none;\" parent=\"WIyWlLk6GJQsqaUBKTNV-1\" source=\"WIyWlLk6GJQsqaUBKTNV-6\" target=\"WIyWlLk6GJQsqaUBKTNV-7\" edge=\"1\"><mxGeometry y=\"10\" relative=\"1\" as=\"geometry\"><mxPoint as=\"offset\"/></mxGeometry></mxCell><mxCell id=\"WIyWlLk6GJQsqaUBKTNV-6\" value=\"Lamp&lt;br&gt;plugged in?\" style=\"rhombus;whiteSpace=wrap;html=1;shadow=0;fontFamily=Helvetica;fontSize=12;align=center;strokeWidth=1;spacing=6;spacingTop=-4;\" parent=\"WIyWlLk6GJQsqaUBKTNV-1\" vertex=\"1\"><mxGeometry x=\"170\" y=\"170\" width=\"100\" height=\"80\" as=\"geometry\"/></mxCell><mxCell id=\"WIyWlLk6GJQsqaUBKTNV-7\" value=\"Plug in lamp\" style=\"rounded=1;whiteSpace=wrap;html=1;fontSize=12;glass=0;strokeWidth=1;shadow=0;\" parent=\"WIyWlLk6GJQsqaUBKTNV-1\" vertex=\"1\"><mxGeometry x=\"320\" y=\"190\" width=\"120\" height=\"40\" as=\"geometry\"/></mxCell><mxCell id=\"WIyWlLk6GJQsqaUBKTNV-8\" value=\"No\" style=\"rounded=0;html=1;jettySize=auto;orthogonalLoop=1;fontSize=11;endArrow=block;endFill=0;endSize=8;strokeWidth=1;shadow=0;labelBackgroundColor=none;edgeStyle=orthogonalEdgeStyle;\" parent=\"WIyWlLk6GJQsqaUBKTNV-1\" source=\"WIyWlLk6GJQsqaUBKTNV-10\" target=\"WIyWlLk6GJQsqaUBKTNV-11\" edge=\"1\"><mxGeometry x=\"0.3333\" y=\"20\" relative=\"1\" as=\"geometry\"><mxPoint as=\"offset\"/></mxGeometry></mxCell><mxCell id=\"WIyWlLk6GJQsqaUBKTNV-9\" value=\"Yes\" style=\"edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;jettySize=auto;orthogonalLoop=1;fontSize=11;endArrow=block;endFill=0;endSize=8;strokeWidth=1;shadow=0;labelBackgroundColor=none;\" parent=\"WIyWlLk6GJQsqaUBKTNV-1\" source=\"WIyWlLk6GJQsqaUBKTNV-10\" target=\"WIyWlLk6GJQsqaUBKTNV-12\" edge=\"1\"><mxGeometry y=\"10\" relative=\"1\" as=\"geometry\"><mxPoint as=\"offset\"/></mxGeometry></mxCell><mxCell id=\"WIyWlLk6GJQsqaUBKTNV-10\" value=\"Bulb&lt;br&gt;burned out?\" style=\"rhombus;whiteSpace=wrap;html=1;shadow=0;fontFamily=Helvetica;fontSize=12;align=center;strokeWidth=1;spacing=6;spacingTop=-4;\" parent=\"WIyWlLk6GJQsqaUBKTNV-1\" vertex=\"1\"><mxGeometry x=\"170\" y=\"290\" width=\"100\" height=\"80\" as=\"geometry\"/></mxCell><mxCell id=\"WIyWlLk6GJQsqaUBKTNV-11\" value=\"Repair Lamp\" style=\"rounded=1;whiteSpace=wrap;html=1;fontSize=12;glass=0;strokeWidth=1;shadow=0;\" parent=\"WIyWlLk6GJQsqaUBKTNV-1\" vertex=\"1\"><mxGeometry x=\"160\" y=\"430\" width=\"120\" height=\"40\" as=\"geometry\"/></mxCell><mxCell id=\"WIyWlLk6GJQsqaUBKTNV-12\" value=\"Replace Bulb\" style=\"rounded=1;whiteSpace=wrap;html=1;fontSize=12;glass=0;strokeWidth=1;shadow=0;\" parent=\"WIyWlLk6GJQsqaUBKTNV-1\" vertex=\"1\"><mxGeometry x=\"320\" y=\"310\" width=\"120\" height=\"40\" as=\"geometry\"/></mxCell></root></mxGraphModel>"
    };

    const demoOpenAPIContent = {
      "title": "",
      "code": "openapi: 3.0.0\ninfo:\n  title: Sample API\n  description: Optional multiline or single-line description in [CommonMark](http://commonmark.org/help/) or HTML.\n  version: 0.1.9\nservers:\n  - url: http://api.example.com/v1\n    description: Optional server description, e.g. Main (production) server\n  - url: http://staging-api.example.com\n    description: Optional server description, e.g. Internal staging server for testing\npaths:\n  /users:\n    get:\n      summary: Returns a list of users.\n      description: Optional extended description in CommonMark or HTML.\n      responses:\n        '200':    # status code\n          description: A JSON array of user names\n          content:\n            application/json:\n              schema:\n                type: array\n                items:\n                  type: string",
      "styles": "",
      "mermaidCode": "",
      "source": "CustomContent"
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
        },
        {
          "type": "extension",
          "attrs": {
            "layout": "default",
            "extensionType": "com.atlassian.confluence.macro.core",
            "extensionKey": `zenuml-graph-macro${getModuleKeySuffix()}`,
            "parameters": {
              "macroParams": {
                "uuid": {
                  "value": uuidv4()
                },
                "customContentId": {
                  "value": "$$_GRAPH_CONTENT_ID"
                },
                "updatedAt": {
                  "value": "2022-08-21T06:12:37Z"
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
                "title": "ZenUML Graph"
              }
            },
            "localId": ""
          }
        },
        {
          "type": "extension",
          "attrs": {
            "layout": "default",
            "extensionType": "com.atlassian.confluence.macro.core",
            "extensionKey": `zenuml-openapi-macro${getModuleKeySuffix()}`,
            "parameters": {
              "macroParams": {
                "uuid": {
                  "value": uuidv4()
                },
                "customContentId": {
                  "value": "$$_OPENAPI_CONTENT_ID"
                },
                "updatedAt": {
                  "value": "2022-08-14T12:34:06Z"
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
                "title": "ZenUML OpenAPI"
              }
            },
            "localId": ""
          }
        },
        {
          "type": "extension",
          "attrs": {
            "layout": "default",
            "extensionType": "com.atlassian.confluence.macro.core",
            "extensionKey": `zenuml-embed-macro${getModuleKeySuffix()}`,
            "parameters": {
              "macroParams": {
                "uuid": {
                  "value": uuidv4()
                },
                "customContentId": {
                  "value": "$$_SEQUENCE_CONTENT_ID"
                },
                "updatedAt": {
                  "value": "2022-08-14T12:17:08Z"
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
                "title": "Embed ZenUML Diagram"
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
        return await createPage(`E2E test page at ${new Date()} - ${uuidv4()}`);
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
      console.log(`Found ${contentXpath} in frame ${frameSelector}`);
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
