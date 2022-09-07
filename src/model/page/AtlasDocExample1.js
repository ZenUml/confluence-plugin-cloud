export default {
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
                              "href": "https://marketplace.atlassian.com/apps/1218380/zenuml-diagrams-for-confluence-freemium?hosting=cloud&tab=overview"
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
                              "href": "https://marketplace.atlassian.com/apps/1218380/zenuml-diagrams-for-confluence-freemium?hosting=cloud&tab=support"
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
                  "macroParams": {
                      "_parentId": {
                          "value": "433979735"
                      }
                  },
                  "macroMetadata": {
                      "macroId": {
                          "value": ""
                      },
                      "schemaVersion": {
                          "value": "1"
                      },
                      "title": "Table of Contents"
                  }
              }
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
                              "extensionKey": "zenuml-sequence-macro",
                              "parameters": {
                                  "macroParams": {
                                      "_parentId": {
                                          "value": "433979735"
                                      },
                                      "uuid": {
                                          "value": "81ec2f4b-24c1-490c-b937-b1b51446fdc7"
                                      },
                                      "customContentId": {
                                          "value": "434045192"
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
                                          "value": "a908aa5f-cbd4-4d19-b7a3-93eefb8bca48"
                                      },
                                      "schemaVersion": {
                                          "value": "1"
                                      },
                                      "placeholder": [
                                          {
                                              "type": "icon",
                                              "data": {
                                                  "url": "https://confluence-plugin-dev-4840c.web.app/image/zenuml_logo.png"
                                              }
                                          }
                                      ],
                                      "title": "ZenUML Diagram"
                                  }
                              }
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
                              "href": "/wiki/plugins/servlet/ac/com.zenuml.confluence-addon/onboarding-page"
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
              "extensionKey": "zenuml-graph-macro",
              "parameters": {
                  "macroParams": {
                      "_parentId": {
                          "value": "433979735"
                      },
                      "uuid": {
                          "value": "2304de8a-a97b-40dd-a2ad-bfae3ba132af"
                      },
                      "customContentId": {
                          "value": "434110642"
                      },
                      "updatedAt": {
                          "value": "2022-08-21T06:12:37Z"
                      }
                  },
                  "macroMetadata": {
                      "macroId": {
                          "value": "1b953473-01bf-4c70-88fe-4830e2c30b33"
                      },
                      "schemaVersion": {
                          "value": "1"
                      },
                      "placeholder": [
                          {
                              "type": "icon",
                              "data": {
                                  "url": "https://confluence-plugin-dev-4840c.web.app/image/zenuml_logo.png"
                              }
                          }
                      ],
                      "title": "ZenUML Graph"
                  }
              }
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
              "extensionKey": "zenuml-openapi-macro",
              "parameters": {
                  "macroParams": {
                      "_parentId": {
                          "value": "433979735"
                      },
                      "uuid": {
                          "value": "dd751786-9468-4807-9966-68264a1a8579"
                      },
                      "customContentId": {
                          "value": "434012469"
                      },
                      "updatedAt": {
                          "value": "2022-08-14T12:34:06Z"
                      }
                  },
                  "macroMetadata": {
                      "macroId": {
                          "value": "761217f0-53a4-4e32-a809-fa273b576092"
                      },
                      "schemaVersion": {
                          "value": "1"
                      },
                      "placeholder": [
                          {
                              "type": "icon",
                              "data": {
                                  "url": "https://confluence-plugin-dev-4840c.web.app/image/zenuml_logo.png"
                              }
                          }
                      ],
                      "title": "ZenUML OpenAPI"
                  }
              }
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
              "extensionKey": "zenuml-sequence-macro",
              "parameters": {
                  "macroParams": {
                      "_parentId": {
                          "value": "433979735"
                      },
                      "uuid": {
                          "value": "11a03251-cfb2-4f26-a185-1e80947d19b9"
                      },
                      "customContentId": {
                          "value": "433979722"
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
                          "value": "4d1c6b26-d8d7-429c-b339-9037a84095f7"
                      },
                      "schemaVersion": {
                          "value": "1"
                      },
                      "placeholder": [
                          {
                              "type": "icon",
                              "data": {
                                  "url": "https://confluence-plugin-dev-4840c.web.app/image/zenuml_logo.png"
                              }
                          }
                      ],
                      "title": "ZenUML Diagram"
                  }
              }
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
              "extensionKey": "zenuml-embed-macro",
              "parameters": {
                  "macroParams": {
                      "customContentType": {
                          "value": "ac:com.zenuml.confluence-addon:zenuml-content-sequence"
                      },
                      "_parentId": {
                          "value": "433979735"
                      },
                      "uuid": {
                          "value": "5e60fe7c-0881-4c6c-aece-36e6ab0de96e"
                      },
                      "customContentId": {
                          "value": "434045192"
                      },
                      "updatedAt": {
                          "value": "2022-08-14T12:17:08Z"
                      }
                  },
                  "macroMetadata": {
                      "macroId": {
                          "value": "271ffbdc-7718-45d9-9f68-60b5a642a6a1"
                      },
                      "schemaVersion": {
                          "value": "1"
                      },
                      "placeholder": [
                          {
                              "type": "icon",
                              "data": {
                                  "url": "https://confluence-plugin-dev-4840c.web.app/image/zenuml_logo.png"
                              }
                          }
                      ],
                      "title": "Embed ZenUML Diagram"
                  }
              }
          }
      }
  ],
  "version": 1
}