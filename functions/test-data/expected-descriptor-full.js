export default {
  "key": "com.zenuml.confluence-addon",
  "name": "ZenUML Sequence Diagram",
  "description": "ZenUML Sequence Diagram add-on",
  "baseUrl": "https://application/json/",
  "authentication": {
    "type": "none"
  },
  "lifecycle": {
    "installed": "/installed?version=2022.07",
    "uninstalled": "/uninstalled?version=2022.07"
  },
  "enableLicensing": true,
  "links": {
    "self": "/resource",
    "homepage": "https://www.zenuml.com"
  },
  "scopes": [
    "READ",
    "WRITE"
  ],
  "modules": {
    "dynamicContentMacros": [
      {
        "key": "zenuml-sequence-macro",
        "name": {
          "value": "ZenUML Diagram"
        },
        "renderModes": {
          "default": {
            "url": "/attachment?version=2022.07&spaceKey={space.key}&pageId={page.id}&pageVersion={page.version}&macroId={macro.id}&uuid={uuid}&addonKey=com.zenuml.confluence-addon&contentKey=zenuml-content-sequence"
          }
        },
        "url": "/sequence-viewer.html?version=2022.07&spaceKey={space.key}&pageId={page.id}&pageVersion={page.version}&macroId={macro.id}&uuid={uuid}&outputType={output.type}&addonKey=com.zenuml.confluence-addon&contentKey=zenuml-content-sequence",
        "description": {
          "value": "Create a ZenUML Sequence Diagram"
        },
        "outputType": "block",
        "bodyType": "plain-text",
        "editor": {
          "url": "/sequence-editor.html?version=2022.07&update=202103291207&addonKey=com.zenuml.confluence-addon&contentKey=zenuml-content-sequence",
          "width": "100%",
          "height": "100%",
          "cacheable": true
        },
        "icon": {
          "width": 16,
          "height": 16,
          "url": "image/zenuml_logo.png"
        },
        "documentation": {
          "url": "https://zenuml.atlassian.net/wiki/spaces/Doc/overview"
        },
        "categories": [
          "visuals"
        ],
        "featured": true,
        "parameters": [
          {
            "identifier": "diagramName",
            "name": {
              "value": "Diagram name (do not change)",
              "i18n": "diagramName"
            },
            "type": "string",
            "required": true,
            "multiple": false,
            "defaultValue": "None"
          }
        ]
      },
      {
        "key": "zenuml-mermaid-macro",
        "name": {
          "value": "ZenUML Mermaid"
        },
        "renderModes": {
          "default": {
            "url": "/attachment?version=2022.07&spaceKey={space.key}&pageId={page.id}&pageVersion={page.version}&macroId={macro.id}&uuid={uuid}&addonKey=com.zenuml.confluence-addon&contentKey=zenuml-content-graph"
          }
        },
        "url": "/sequence-viewer.html?version=2022.07&spaceKey={space.key}&pageId={page.id}&pageVersion={page.version}&macroId={macro.id}&uuid={uuid}&outputType={output.type}&addonKey=com.zenuml.confluence-addon&contentKey=zenuml-content-graph",
        "description": {
          "value": "Create a ZenUML Sequence Diagram"
        },
        "outputType": "block",
        "bodyType": "plain-text",
        "editor": {
          "url": "/mermaid/mermaid-editor.html?version=2022.07&update=202103291207&addonKey=com.zenuml.confluence-addon&contentKey=zenuml-content-graph",
          "width": "100%",
          "height": "100%",
          "cacheable": true
        },
        "icon": {
          "width": 16,
          "height": 16,
          "url": "image/zenuml_logo.png"
        },
        "documentation": {
          "url": "https://zenuml.atlassian.net/wiki/spaces/Doc/overview"
        },
        "categories": [
          "visuals"
        ],
        "featured": true,
        "parameters": [
          {
            "identifier": "diagramName",
            "name": {
              "value": "Diagram name (do not change)",
              "i18n": "diagramName"
            },
            "type": "string",
            "required": true,
            "multiple": false,
            "defaultValue": "None"
          }
        ]
      },
      {
        "key": "zenuml-graph-macro",
        "name": {
          "value": "ZenUML Graph"
        },
        "renderModes": {
          "default": {
            "url": "/attachment?version=2022.07&spaceKey={space.key}&pageId={page.id}&pageVersion={page.version}&macroId={macro.id}&uuid={uuid}&addonKey=com.zenuml.confluence-addon&contentKey=zenuml-content-graph"
          }
        },
        "url": "/drawio/viewer.html?version=2022.07&spaceKey={space.key}&pageId={page.id}&pageVersion={page.version}&macroId={macro.id}&uuid={uuid}&outputType={output.type}&addonKey=com.zenuml.confluence-addon&contentKey=zenuml-content-graph",
        "description": {
          "value": "Create a ZenUML Graph"
        },
        "outputType": "block",
        "bodyType": "none",
        "editor": {
          "url": "/drawio/editor.html?version=2022.07&addonKey=com.zenuml.confluence-addon&contentKey=zenuml-content-graph",
          "editTitle": {
            "value": "Edit ZenUML Graph"
          },
          "insertTitle": {
            "value": "Create ZenUML Graph"
          },
          "width": "100%",
          "height": "100%",
          "cacheable": true
        },
        "icon": {
          "width": 16,
          "height": 16,
          "url": "image/zenuml_logo.png"
        },
        "documentation": {
          "url": "https://zenuml.atlassian.net/wiki/spaces/Doc/overview"
        },
        "categories": [
          "visuals"
        ],
        "featured": true,
        "parameters": [
          {
            "identifier": "diagramName",
            "name": {
              "value": "Diagram name (do not change)",
              "i18n": "diagramName"
            },
            "type": "string",
            "required": true,
            "multiple": false,
            "defaultValue": "None"
          }
        ]
      },
      {
        "key": "zenuml-openapi-macro",
        "name": {
          "value": "ZenUML OpenAPI"
        },
        "renderModes": {
          "default": {
            "url": "/attachment?version=2022.07&spaceKey={space.key}&pageId={page.id}&pageVersion={page.version}&macroId={macro.id}&uuid={uuid}&addonKey=com.zenuml.confluence-addon&contentKey=zenuml-content-graph"
          }
        },
        "url": "/swagger-ui.html?version=2022.07&spaceKey={space.key}&pageId={page.id}&pageVersion={page.version}&macroId={macro.id}&uuid={uuid}&outputType={output.type}&addonKey=com.zenuml.confluence-addon&contentKey=zenuml-content-graph",
        "description": {
          "value": "Create a ZenUML OpenAPI"
        },
        "outputType": "block",
        "bodyType": "none",
        "editor": {
          "url": "/swagger-editor.html?version=2022.07&addonKey=com.zenuml.confluence-addon&contentKey=zenuml-content-graph",
          "editTitle": {
            "value": "Edit ZenUML OpenAPI"
          },
          "insertTitle": {
            "value": "Create ZenUML OpenAPI"
          },
          "width": "100%",
          "height": "100%",
          "cacheable": true
        },
        "icon": {
          "width": 16,
          "height": 16,
          "url": "image/zenuml_logo.png"
        },
        "documentation": {
          "url": "https://zenuml.atlassian.net/wiki/spaces/Doc/overview"
        },
        "categories": [
          "visuals"
        ],
        "featured": true,
        "parameters": [
          {
            "identifier": "diagramName",
            "name": {
              "value": "Diagram name (do not change)",
              "i18n": "diagramName"
            },
            "type": "string",
            "required": true,
            "multiple": false,
            "defaultValue": "None"
          }
        ]
      },
      {
        "key": "zenuml-embed-macro",
        "name": {
          "value": "Embed a ZenUML Diagram or API Spec (Beta)"
        },
        "renderModes": {
          "default": {
            "url": "/attachment?version=2022.07&spaceKey={space.key}&pageId={page.id}&pageVersion={page.version}&macroId={macro.id}&uuid={uuid}&addonKey=com.zenuml.confluence-addon"
          }
        },
        "url": "/embed-viewer.html?version=2022.07&spaceKey={space.key}&pageId={page.id}&pageVersion={page.version}&macroId={macro.id}&uuid={uuid}&outputType={output.type}&addonKey=com.zenuml.confluence-addon",
        "description": {
          "value": "Embed ZenUML Diagram"
        },
        "outputType": "block",
        "bodyType": "none",
        "editor": {
          "url": "/embed-editor.html?version=2022.07&addonKey=com.zenuml.confluence-addon",
          "editTitle": {
            "value": "Edit Embedded ZenUML Diagram"
          },
          "insertTitle": {
            "value": "Embed ZenUML Diagram"
          },
          "width": "100%",
          "height": "100%",
          "cacheable": true
        },
        "icon": {
          "width": 16,
          "height": 16,
          "url": "image/zenuml_logo.png"
        },
        "documentation": {
          "url": "https://zenuml.atlassian.net/wiki/spaces/Doc/overview"
        },
        "categories": [
          "visuals"
        ],
        "featured": true,
        "parameters": [
          {
            "identifier": "diagramName",
            "name": {
              "value": "Diagram name (do not change)",
              "i18n": "diagramName"
            },
            "type": "string",
            "required": true,
            "multiple": false,
            "defaultValue": "None"
          }
        ]
      }
    ],
    "customContent": [
      {
        "uiSupport": {
          "contentViewComponent": {
            "moduleKey": "zenuml-content-sequence-viewer"
          },
          "icons": {
            "item": {
              "width": 16,
              "height": 16,
              "url": "image/zenuml_logo.png"
            }
          }
        },
        "apiSupport": {
          "bodyType": "raw",
          "supportedContainerTypes": [
            "page",
            "blogpost",
            "comment"
          ],
          "supportedChildTypes": [
            "attachment",
            "comment"
          ],
          "indexing": {
            "enabled": true
          }
        },
        "name": {
          "value": "ZenUML Sequence Diagram"
        },
        "key": "zenuml-content-sequence"
      },
      {
        "uiSupport": {
          "contentViewComponent": {
            "moduleKey": "zenuml-content-graph-viewer"
          },
          "icons": {
            "item": {
              "width": 16,
              "height": 16,
              "url": "image/zenuml_logo.png"
            }
          }
        },
        "apiSupport": {
          "bodyType": "raw",
          "supportedContainerTypes": [
            "page",
            "blogpost",
            "comment"
          ],
          "supportedChildTypes": [
            "attachment",
            "comment"
          ],
          "indexing": {
            "enabled": true
          }
        },
        "name": {
          "value": "ZenUML Graph"
        },
        "key": "zenuml-content-graph"
      }
    ],
    "generalPages": [
      {
        "key": "zenuml-content-sequence-viewer-dialog",
        "location": "none",
        "url": "/sequence-viewer-dialog.html?version=2022.07&addonKey=com.zenuml.confluence-addon&contentKey=zenuml-content-sequence",
        "name": {
          "value": "ZenUML Sequence Viewer Dialog"
        }
      },
      {
        "key": "zenuml-content-sequence-viewer",
        "location": "none",
        "url": "/sequence-viewer.html?version=2022.07&rendered.for=custom-content-native&spaceKey={space.key}&content.id={content.id}&content.version={content.version}&addonKey=com.zenuml.confluence-addon&contentKey=zenuml-content-sequence",
        "name": {
          "value": "ZenUML Sequence Viewer"
        }
      },
      {
        "key": "zenuml-content-sequence-editor-dialog",
        "location": "none",
        "url": "/sequence-editor-dialog.html?version=2022.07&spaceKey={space.key}&content.id={content.id}&content.version={content.version}&addonKey=com.zenuml.confluence-addon&contentKey=zenuml-content-sequence",
        "name": {
          "value": "ZenUML Sequence Editor"
        }
      },
      {
        "key": "zenuml-content-graph-viewer",
        "location": "none",
        "url": "/drawio/viewer.html?version=2022.07&rendered.for=custom-content-native&spaceKey={space.key}&content.id={content.id}&content.version={content.version}&addonKey=com.zenuml.confluence-addon&contentKey=zenuml-content-graph",
        "name": {
          "value": "ZenUML Graph Viewer"
        }
      }
    ],
    "postInstallPage": {
      "key": "onboarding-page",
      "name": {
        "value": "Get Started"
      },
      "url": "/get-started.html?version=2022.07"
    },
    "webPanels": [
      {
        "url": "/onboarding-panel.html?version=2022.07&addonKey=com.zenuml.confluence-addon&postInstallPageKey=onboarding-page",
        "location": "atl.footer",
        "layout": {
          "width": "0px",
          "height": "0px"
        },
        "weight": 50,
        "supportsNative": false,
        "name": {
          "value": "Onboarding Panel"
        },
        "key": "onboarding-panel",
        "conditions": [
          {
            "condition": "has_page_permission",
            "params": {
              "permission": "EDIT"
            }
          }
        ]
      }
    ]
  },
  "apiMigrations": {
    "gdpr": true
  },
  "vendor": {
    "name": "ZenUML",
    "url": "https://www.zenuml.com/"
  }
}