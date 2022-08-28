
const demoSequenceTitle = 'ZenUML Sequence Custom Content Demo';
const demoSequenceContent = {
  "title": "Order Service (Demonstration only)",
  "code": "title Order Service (Demonstration only)\n// Styling participants with background colors is an experimental feature.\n// This feature is available for users to test and provide feedback.\n@Actor Client #FFEBE6\n@Boundary OrderController #0747A6\n@EC2 <<BFF>> OrderService #E3FCEF\ngroup BusinessService {\n  @Lambda PurchaseService\n  @AzureFunction InvoiceService\n}\n\n@Starter(Client)\n//`POST /orders`\nOrderController.post(payload) {\n  OrderService.create(payload) {\n    order = new Order(payload)\n    if(order != null) {\n      par {\n        PurchaseService.createPO(order)\n        InvoiceService.createInvoice(order)      \n      }      \n    }\n  }\n}",
  "mermaidCode": "graph TD; A-->B;",
  "diagramType": "sequence"
};

const demoOpenAPITitle = 'ZenUML OpenAPI Custom Content Demo';
const demoOpenAPIContent = {
  "title": "",
  "code": "openapi: 3.0.0\ninfo:\n  title: Sample API\n  description: Optional multiline or single-line description in [CommonMark](http://commonmark.org/help/) or HTML.\n  version: 0.1.9\nservers:\n  - url: http://api.example.com/v1\n    description: Optional server description, e.g. Main (production) server\n  - url: http://staging-api.example.com\n    description: Optional server description, e.g. Internal staging server for testing\npaths:\n  /users:\n    get:\n      summary: Returns a list of users.\n      description: Optional extended description in CommonMark or HTML.\n      responses:\n        '200':    # status code\n          description: A JSON array of user names\n          content:\n            application/json:\n              schema:\n                type: array\n                items:\n                  type: string",
  "styles": "",
  "mermaidCode": "",
  "source": "CustomContent"
};

const demoMermaidTitle = 'ZenUML Mermaid Custom Content Demo';
const demoMermaidContent = {
  "title": "Order Service (Demonstration only)",
  "code": "title Order Service (Demonstration only)\n// Styling participants with background colors is an experimental feature.\n// This feature is available for users to test and provide feedback.\n@Actor Client #FFEBE6\n@Boundary OrderController #0747A6\n@EC2 <<BFF>> OrderService #E3FCEF\ngroup BusinessService {\n  @Lambda PurchaseService\n  @AzureFunction InvoiceService\n}\n\n@Starter(Client)\n//`POST /orders`\nOrderController.post(payload) {\n  OrderService.create(payload) {\n    order = new Order(payload)\n    if(order != null) {\n      par {\n        PurchaseService.createPO(order)\n        InvoiceService.createInvoice(order)      \n      }      \n    }\n  }\n}",
  "mermaidCode": "gantt\n    title A Gantt Diagram\n    dateFormat  YYYY-MM-DD\n    section Section\n    A task           :a1, 2014-01-01, 30d\n    Another task     :after a1  , 20d\n    section Another\n    Task in sec      :2014-01-12  , 12d\n    another task      : 24d\n",
  "diagramType": "mermaid"
};

const demoGraphTitle = 'ZenUML Graph Custom Content Demo';
const demoGraphContent = {
  "diagramType": "graph",
  "graphXml": "<mxGraphModel dx=\"1426\" dy=\"694\" grid=\"1\" gridSize=\"10\" guides=\"1\" tooltips=\"1\" connect=\"1\" arrows=\"1\" fold=\"1\" page=\"1\" pageScale=\"1\" pageWidth=\"827\" pageHeight=\"1169\"><root><mxCell id=\"WIyWlLk6GJQsqaUBKTNV-0\"/><mxCell id=\"WIyWlLk6GJQsqaUBKTNV-1\" parent=\"WIyWlLk6GJQsqaUBKTNV-0\"/><mxCell id=\"WIyWlLk6GJQsqaUBKTNV-2\" value=\"\" style=\"rounded=0;html=1;jettySize=auto;orthogonalLoop=1;fontSize=11;endArrow=block;endFill=0;endSize=8;strokeWidth=1;shadow=0;labelBackgroundColor=none;edgeStyle=orthogonalEdgeStyle;\" parent=\"WIyWlLk6GJQsqaUBKTNV-1\" source=\"WIyWlLk6GJQsqaUBKTNV-3\" target=\"WIyWlLk6GJQsqaUBKTNV-6\" edge=\"1\"><mxGeometry relative=\"1\" as=\"geometry\"/></mxCell><mxCell id=\"WIyWlLk6GJQsqaUBKTNV-3\" value=\"Lamp doesn't work\" style=\"rounded=1;whiteSpace=wrap;html=1;fontSize=12;glass=0;strokeWidth=1;shadow=0;\" parent=\"WIyWlLk6GJQsqaUBKTNV-1\" vertex=\"1\"><mxGeometry x=\"160\" y=\"80\" width=\"120\" height=\"40\" as=\"geometry\"/></mxCell><mxCell id=\"WIyWlLk6GJQsqaUBKTNV-4\" value=\"Yes\" style=\"rounded=0;html=1;jettySize=auto;orthogonalLoop=1;fontSize=11;endArrow=block;endFill=0;endSize=8;strokeWidth=1;shadow=0;labelBackgroundColor=none;edgeStyle=orthogonalEdgeStyle;\" parent=\"WIyWlLk6GJQsqaUBKTNV-1\" source=\"WIyWlLk6GJQsqaUBKTNV-6\" target=\"WIyWlLk6GJQsqaUBKTNV-10\" edge=\"1\"><mxGeometry y=\"20\" relative=\"1\" as=\"geometry\"><mxPoint as=\"offset\"/></mxGeometry></mxCell><mxCell id=\"WIyWlLk6GJQsqaUBKTNV-5\" value=\"No\" style=\"edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;jettySize=auto;orthogonalLoop=1;fontSize=11;endArrow=block;endFill=0;endSize=8;strokeWidth=1;shadow=0;labelBackgroundColor=none;\" parent=\"WIyWlLk6GJQsqaUBKTNV-1\" source=\"WIyWlLk6GJQsqaUBKTNV-6\" target=\"WIyWlLk6GJQsqaUBKTNV-7\" edge=\"1\"><mxGeometry y=\"10\" relative=\"1\" as=\"geometry\"><mxPoint as=\"offset\"/></mxGeometry></mxCell><mxCell id=\"WIyWlLk6GJQsqaUBKTNV-6\" value=\"Lamp&lt;br&gt;plugged in?\" style=\"rhombus;whiteSpace=wrap;html=1;shadow=0;fontFamily=Helvetica;fontSize=12;align=center;strokeWidth=1;spacing=6;spacingTop=-4;\" parent=\"WIyWlLk6GJQsqaUBKTNV-1\" vertex=\"1\"><mxGeometry x=\"170\" y=\"170\" width=\"100\" height=\"80\" as=\"geometry\"/></mxCell><mxCell id=\"WIyWlLk6GJQsqaUBKTNV-7\" value=\"Plug in lamp\" style=\"rounded=1;whiteSpace=wrap;html=1;fontSize=12;glass=0;strokeWidth=1;shadow=0;\" parent=\"WIyWlLk6GJQsqaUBKTNV-1\" vertex=\"1\"><mxGeometry x=\"320\" y=\"190\" width=\"120\" height=\"40\" as=\"geometry\"/></mxCell><mxCell id=\"WIyWlLk6GJQsqaUBKTNV-8\" value=\"No\" style=\"rounded=0;html=1;jettySize=auto;orthogonalLoop=1;fontSize=11;endArrow=block;endFill=0;endSize=8;strokeWidth=1;shadow=0;labelBackgroundColor=none;edgeStyle=orthogonalEdgeStyle;\" parent=\"WIyWlLk6GJQsqaUBKTNV-1\" source=\"WIyWlLk6GJQsqaUBKTNV-10\" target=\"WIyWlLk6GJQsqaUBKTNV-11\" edge=\"1\"><mxGeometry x=\"0.3333\" y=\"20\" relative=\"1\" as=\"geometry\"><mxPoint as=\"offset\"/></mxGeometry></mxCell><mxCell id=\"WIyWlLk6GJQsqaUBKTNV-9\" value=\"Yes\" style=\"edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;jettySize=auto;orthogonalLoop=1;fontSize=11;endArrow=block;endFill=0;endSize=8;strokeWidth=1;shadow=0;labelBackgroundColor=none;\" parent=\"WIyWlLk6GJQsqaUBKTNV-1\" source=\"WIyWlLk6GJQsqaUBKTNV-10\" target=\"WIyWlLk6GJQsqaUBKTNV-12\" edge=\"1\"><mxGeometry y=\"10\" relative=\"1\" as=\"geometry\"><mxPoint as=\"offset\"/></mxGeometry></mxCell><mxCell id=\"WIyWlLk6GJQsqaUBKTNV-10\" value=\"Bulb&lt;br&gt;burned out?\" style=\"rhombus;whiteSpace=wrap;html=1;shadow=0;fontFamily=Helvetica;fontSize=12;align=center;strokeWidth=1;spacing=6;spacingTop=-4;\" parent=\"WIyWlLk6GJQsqaUBKTNV-1\" vertex=\"1\"><mxGeometry x=\"170\" y=\"290\" width=\"100\" height=\"80\" as=\"geometry\"/></mxCell><mxCell id=\"WIyWlLk6GJQsqaUBKTNV-11\" value=\"Repair Lamp\" style=\"rounded=1;whiteSpace=wrap;html=1;fontSize=12;glass=0;strokeWidth=1;shadow=0;\" parent=\"WIyWlLk6GJQsqaUBKTNV-1\" vertex=\"1\"><mxGeometry x=\"160\" y=\"430\" width=\"120\" height=\"40\" as=\"geometry\"/></mxCell><mxCell id=\"WIyWlLk6GJQsqaUBKTNV-12\" value=\"Replace Bulb\" style=\"rounded=1;whiteSpace=wrap;html=1;fontSize=12;glass=0;strokeWidth=1;shadow=0;\" parent=\"WIyWlLk6GJQsqaUBKTNV-1\" vertex=\"1\"><mxGeometry x=\"320\" y=\"310\" width=\"120\" height=\"40\" as=\"geometry\"/></mxCell></root></mxGraphModel>"
};

const demoPageTitle = 'ZenUML add-on Demo Page';

const demoPageContent = {
  "type": "doc",
  "content": [
    {
      "type": "paragraph",
      "content": [
        {
          "text": "This page is created by ",
          "type": "text"
        },
        {
          "text": "ZenUML add-on",
          "type": "text",
          "marks": [
            {
              "type": "link",
              "attrs": {
                "href": getAddOnLink()
              }
            }
          ]
        },
        {
          "text": ". ",
          "type": "text"
        }
      ]
    },
    {
      "type": "bulletList",
      "content": [
        {
          "type": "listItem",
          "content": [
            {
              "type": "paragraph",
              "content": [
                {
                  "text": "This page demonstrates features provided by the add-on.",
                  "type": "text"
                }
              ]
            }
          ]
        },
        {
          "type": "listItem",
          "content": [
            {
              "type": "paragraph",
              "content": [
                {
                  "text": "Please do not change ",
                  "type": "text"
                },
                {
                  "text": "the",
                  "type": "text",
                  "marks": [
                    {
                      "type": "strong"
                    }
                  ]
                },
                {
                  "text": " ",
                  "type": "text"
                },
                {
                  "text": "title or content",
                  "type": "text",
                  "marks": [
                    {
                      "type": "strong"
                    }
                  ]
                },
                {
                  "text": " of this page. If you want to edit to see how it works, make a copy of this page.",
                  "type": "text"
                }
              ]
            }
          ]
        },
        {
          "type": "listItem",
          "content": [
            {
              "type": "paragraph",
              "content": [
                {
                  "text": "If everyone is already familiar with the features, you can archive this page.",
                  "type": "text"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "type": "paragraph",
      "content": [
        {
          "text": "This add-on is developed by P&D Vision, which is an Atlassian partner. P&D Vision provides ",
          "type": "text"
        },
        {
          "text": "support",
          "type": "text",
          "marks": [
            {
              "type": "link",
              "attrs": {
                "href": getSupportLink()
              }
            }
          ]
        },
        {
          "text": " for this add-on.",
          "type": "text"
        }
      ]
    },
    {
      "type": "extension",
      "attrs": {
        "layout": "default",
        "extensionType": "com.atlassian.confluence.macro.core",
        "extensionKey": "toc",
        "parameters": {
          "macroParams": {},
          "macroMetadata": {
            "macroId": {
              "value": ""
            },
            "schemaVersion": {
              "value": "1"
            },
            "title": "Table of Contents"
          }
        },
        "localId": ""
      }
    },
    {
      "type": "heading",
      "attrs": {
        "level": 1
      },
      "content": [
        {
          "text": "Demo1 - Sequence Diagram",
          "type": "text"
        }
      ]
    },
    {
      "type": "paragraph",
      "content": [
        {
          "text": "The diagram on the right is generated from the text on the left:",
          "type": "text"
        }
      ]
    },
    {
      "type": "layoutSection",
      "marks": [
        {
          "type": "breakout",
          "attrs": {
            "mode": "full-width"
          }
        }
      ],
      "content": [
        {
          "type": "layoutColumn",
          "attrs": {
            "width": 33.33
          },
          "content": [
            {
              "type": "codeBlock",
              "content": [
                {
                  "text": "title Order Service (Demonstration only)\n// Styling participants with background colors is an experimental feature.\n// This feature is available for users to test and provide feedback.\n@Actor Client #FFEBE6\n@Boundary OrderController #0747A6\n@EC2 <<BFF>> OrderService #E3FCEF\ngroup BusinessService {\n  @Lambda PurchaseService\n  @AzureFunction InvoiceService\n}\n\n@Starter(Client)\n//`POST /orders`\nOrderController.post(payload) {\n  OrderService.create(payload) {\n    order = new Order(payload)\n    if(order != null) {\n      par {\n        PurchaseService.createPO(order)\n        InvoiceService.createInvoice(order)      \n      }      \n    }\n  }\n}",
                  "type": "text"
                }
              ]
            },
            {
              "type": "paragraph"
            }
          ]
        },
        {
          "type": "layoutColumn",
          "attrs": {
            "width": 66.66
          },
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
          ]
        }
      ]
    },
    {
      "type": "paragraph",
      "content": [
        {
          "text": "See ",
          "type": "text"
        },
        {
          "text": "here",
          "type": "text",
          "marks": [
            {
              "type": "link",
              "attrs": {
                "href": getOnboardingPageLink()
              }
            }
          ]
        },
        {
          "text": " on how to insert a sequence diagram or any macro.",
          "type": "text"
        }
      ]
    },
    {
      "type": "heading",
      "attrs": {
        "level": 1
      },
      "content": [
        {
          "text": "Demo2 - Graph",
          "type": "text"
        }
      ]
    },
    {
      "type": "paragraph",
      "content": [
        {
          "text": "You can use “ZenUML Graph” to draw any diagram such as flowcharts, BPMN2.0, class diagram, etc.",
          "type": "text"
        }
      ]
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
      "type": "heading",
      "attrs": {
        "level": 1
      },
      "content": [
        {
          "text": "Demo3 - OpenAPI",
          "type": "text"
        }
      ]
    },
    {
      "type": "paragraph",
      "content": [
        {
          "text": "You can also document OpenAPI specification, including Swagger2, with realtime preview.",
          "type": "text"
        }
      ]
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
      "type": "heading",
      "attrs": {
        "level": 1
      },
      "content": [
        {
          "text": "Demo4 - Mermaid",
          "type": "text"
        }
      ]
    },
    {
      "type": "paragraph",
      "content": [
        {
          "text": "You can also generate Mermaid diagrams such as flowcharts, class diagram, Gantt diagram, etc.",
          "type": "text"
        }
      ]
    },
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
              "value": "$$_MERMAID_CONTENT_ID"
            },
            "__bodyContent": {
              "value": "gantt\n    title A Gantt Diagram\n    dateFormat  YYYY-MM-DD\n    section Section\n    A task           :a1, 2014-01-01, 30d\n    Another task     :after a1  , 20d\n    section Another\n    Task in sec      :2014-01-12  , 12d\n    another task      : 24d\n"
            },
            "updatedAt": {
              "value": "2022-08-14T12:11:13Z"
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
      "type": "paragraph"
    },
    {
      "type": "heading",
      "attrs": {
        "level": 1
      },
      "content": [
        {
          "text": "Demo5 - Embedding an existing diagram or OpenAPI spec",
          "type": "text"
        }
      ]
    },
    {
      "type": "paragraph",
      "content": [
        {
          "text": "You can embed any of the above diagrams in any page, see ",
          "type": "text"
        },
        {
          "text": "here",
          "type": "text",
          "marks": [
            {
              "type": "link",
              "attrs": {
                "href": "https://zenuml.atlassian.net/wiki/spaces/Doc/pages/1727922177/How+to+embed+existing+macros"
              }
            }
          ]
        },
        {
          "text": " for more details.",
          "type": "text"
        }
      ]
    },
    {
      "type": "extension",
      "attrs": {
        "layout": "default",
        "extensionType": "com.atlassian.confluence.macro.core",
        "extensionKey": `zenuml-embed-macro${getModuleKeySuffix()}`,
        "parameters": {
          "macroParams": {
            "customContentType": {
              "value": "ac:com.zenuml.confluence-addon:zenuml-content-sequence"
            },
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

function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

function getUrlParam (param) {
  let codeParams = (new RegExp(param + '=([^&]*)')).exec(window.location.search);
  if(codeParams && codeParams.length >= 1) {
    const codedParam = codeParams[1];
    return decodeURIComponent(codedParam);
  }
  return null;
}

function addonKey() {
  return getUrlParam('addonKey');
}

function isLite() {
  return addonKey()?.includes('lite');
}

function getAddOnLink() {
  return isLite() 
    ? 'https://marketplace.atlassian.com/apps/1219422/zenuml-diagrams-and-open-api-lite?tab=overview&hosting=cloud'
    : 'https://marketplace.atlassian.com/apps/1218380/zenuml-diagrams-for-confluence-freemium?hosting=cloud&tab=overview';
}

function getSupportLink() {
  return isLite() 
    ? 'https://marketplace.atlassian.com/apps/1219422/zenuml-diagrams-and-open-api-lite?tab=support&hosting=cloud'
    : 'https://marketplace.atlassian.com/apps/1218380/zenuml-diagrams-for-confluence-freemium?hosting=cloud&tab=support';
}

function getOnboardingPageLink() {
  return `/wiki/plugins/servlet/ac/${addonKey()}/onboarding-page`;
}

function getModuleKeySuffix() {
  return isLite() ? '-lite' : '';
}