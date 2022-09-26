export default {
  "apiMigrations": {
    "gdpr": true
  },
  "authentication": {
    "type": "none"
  },
  "baseUrl": "https://fake-host/",
  "description": "ZenUML Sequence Diagram add-on",
  "enableLicensing": true,
  "key": "com.zenuml.confluence-addon",
  "lifecycle": {
    "installed": "/installed?version=2022.07",
    "uninstalled": "/uninstalled?version=2022.07"
  },
  "links": {
    "homepage": "https://www.zenuml.com",
    "self": "fake-url"
  },
  "modules": {
    "customContent": [
      {
        "apiSupport": {
          "bodyType": "raw",
          "indexing": {
            "enabled": true
          },
          "supportedChildTypes": [
            "attachment",
            "comment"
          ],
          "supportedContainerTypes": [
            "page",
            "blogpost",
            "comment"
          ]
        },
        "key": "zenuml-content-sequence",
        "name": {
          "value": "ZenUML Sequence Diagram"
        },
        "uiSupport": {
          "contentViewComponent": {
            "moduleKey": "zenuml-content-sequence-viewer"
          },
          "icons": {
            "item": {
              "height": 16,
              "url": "image/zenuml_logo.png",
              "width": 16
            }
          }
        }
      },
      {
        "apiSupport": {
          "bodyType": "raw",
          "indexing": {
            "enabled": true
          },
          "supportedChildTypes": [
            "attachment",
            "comment"
          ],
          "supportedContainerTypes": [
            "page",
            "blogpost",
            "comment"
          ]
        },
        "key": "zenuml-content-graph",
        "name": {
          "value": "ZenUML Graph"
        },
        "uiSupport": {
          "contentViewComponent": {
            "moduleKey": "zenuml-content-graph-viewer"
          },
          "icons": {
            "item": {
              "height": 16,
              "url": "image/zenuml_logo.png",
              "width": 16
            }
          }
        }
      }
    ],
    "dynamicContentMacros": [
      {
        "bodyType": "plain-text",
        "categories": [
          "visuals"
        ],
        "description": {
          "value": "Create a ZenUML Sequence Diagram"
        },
        "documentation": {
          "url": "https://zenuml.atlassian.net/wiki/spaces/Doc/overview"
        },
        "editor": {
          "cacheable": true,
          "height": "100%",
          "url": "/sequence-editor.html?version=2022.07&update=202103291207&addonKey=com.zenuml.confluence-addon&contentKey=zenuml-content-sequence",
          "width": "100%"
        },
        "featured": true,
        "icon": {
          "height": 16,
          "url": "image/zenuml_logo.png",
          "width": 16
        },
        "key": "zenuml-sequence-macro",
        "name": {
          "value": "ZenUML Diagram"
        },
        "outputType": "block",
        "parameters": [
          {
            "defaultValue": "None",
            "identifier": "diagramName",
            "multiple": false,
            "name": {
              "i18n": "diagramName",
              "value": "Diagram name (do not change)"
            },
            "required": true,
            "type": "string"
          }
        ],
        "renderModes": {
          "default": {
            "url": "/attachment?version=2022.07&spaceKey={space.key}&pageId={page.id}&pageVersion={page.version}&macroId={macro.id}&uuid={uuid}&addonKey=com.zenuml.confluence-addon&contentKey=zenuml-content-sequence"
          }
        },
        "url": "/sequence-viewer.html?version=2022.07&spaceKey={space.key}&pageId={page.id}&pageVersion={page.version}&macroId={macro.id}&uuid={uuid}&outputType={output.type}&addonKey=com.zenuml.confluence-addon&contentKey=zenuml-content-sequence"
      },
      {
        "bodyType": "plain-text",
        "categories": [
          "visuals"
        ],
        "description": {
          "value": "Create a ZenUML Sequence Diagram"
        },
        "documentation": {
          "url": "https://zenuml.atlassian.net/wiki/spaces/Doc/overview"
        },
        "editor": {
          "cacheable": true,
          "height": "100%",
          "url": "/mermaid/mermaid-editor.html?version=2022.07&update=202103291207&addonKey=com.zenuml.confluence-addon&contentKey=zenuml-content-graph",
          "width": "100%"
        },
        "featured": true,
        "icon": {
          "height": 16,
          "url": "image/zenuml_logo.png",
          "width": 16
        },
        "key": "zenuml-mermaid-macro",
        "name": {
          "value": "ZenUML Mermaid"
        },
        "outputType": "block",
        "parameters": [
          {
            "defaultValue": "None",
            "identifier": "diagramName",
            "multiple": false,
            "name": {
              "i18n": "diagramName",
              "value": "Diagram name (do not change)"
            },
            "required": true,
            "type": "string"
          }
        ],
        "renderModes": {
          "default": {
            "url": "/attachment?version=2022.07&spaceKey={space.key}&pageId={page.id}&pageVersion={page.version}&macroId={macro.id}&uuid={uuid}&addonKey=com.zenuml.confluence-addon&contentKey=zenuml-content-graph"
          }
        },
        "url": "/sequence-viewer.html?version=2022.07&spaceKey={space.key}&pageId={page.id}&pageVersion={page.version}&macroId={macro.id}&uuid={uuid}&outputType={output.type}&addonKey=com.zenuml.confluence-addon&contentKey=zenuml-content-graph"
      },
      {
        "bodyType": "none",
        "categories": [
          "visuals"
        ],
        "description": {
          "value": "Create a ZenUML Graph"
        },
        "documentation": {
          "url": "https://zenuml.atlassian.net/wiki/spaces/Doc/overview"
        },
        "editor": {
          "cacheable": true,
          "editTitle": {
            "value": "Edit ZenUML Graph"
          },
          "height": "100%",
          "insertTitle": {
            "value": "Create ZenUML Graph"
          },
          "url": "/drawio/editor.html?version=2022.07&addonKey=com.zenuml.confluence-addon&contentKey=zenuml-content-graph",
          "width": "100%"
        },
        "featured": true,
        "icon": {
          "height": 16,
          "url": "image/zenuml_logo.png",
          "width": 16
        },
        "key": "zenuml-graph-macro",
        "name": {
          "value": "ZenUML Graph"
        },
        "outputType": "block",
        "parameters": [
          {
            "defaultValue": "None",
            "identifier": "diagramName",
            "multiple": false,
            "name": {
              "i18n": "diagramName",
              "value": "Diagram name (do not change)"
            },
            "required": true,
            "type": "string"
          }
        ],
        "renderModes": {
          "default": {
            "url": "/attachment?version=2022.07&spaceKey={space.key}&pageId={page.id}&pageVersion={page.version}&macroId={macro.id}&uuid={uuid}&addonKey=com.zenuml.confluence-addon&contentKey=zenuml-content-graph"
          }
        },
        "url": "/drawio/viewer.html?version=2022.07&spaceKey={space.key}&pageId={page.id}&pageVersion={page.version}&macroId={macro.id}&uuid={uuid}&outputType={output.type}&addonKey=com.zenuml.confluence-addon&contentKey=zenuml-content-graph"
      },
      {
        "bodyType": "none",
        "categories": [
          "visuals"
        ],
        "description": {
          "value": "Create a ZenUML OpenAPI"
        },
        "documentation": {
          "url": "https://zenuml.atlassian.net/wiki/spaces/Doc/overview"
        },
        "editor": {
          "cacheable": true,
          "editTitle": {
            "value": "Edit ZenUML OpenAPI"
          },
          "height": "100%",
          "insertTitle": {
            "value": "Create ZenUML OpenAPI"
          },
          "url": "/swagger-editor.html?version=2022.07&addonKey=com.zenuml.confluence-addon&contentKey=zenuml-content-graph",
          "width": "100%"
        },
        "featured": true,
        "icon": {
          "height": 16,
          "url": "image/zenuml_logo.png",
          "width": 16
        },
        "key": "zenuml-openapi-macro",
        "name": {
          "value": "ZenUML OpenAPI"
        },
        "outputType": "block",
        "parameters": [
          {
            "defaultValue": "None",
            "identifier": "diagramName",
            "multiple": false,
            "name": {
              "i18n": "diagramName",
              "value": "Diagram name (do not change)"
            },
            "required": true,
            "type": "string"
          }
        ],
        "renderModes": {
          "default": {
            "url": "/attachment?version=2022.07&spaceKey={space.key}&pageId={page.id}&pageVersion={page.version}&macroId={macro.id}&uuid={uuid}&addonKey=com.zenuml.confluence-addon&contentKey=zenuml-content-graph"
          }
        },
        "url": "/swagger-ui.html?version=2022.07&spaceKey={space.key}&pageId={page.id}&pageVersion={page.version}&macroId={macro.id}&uuid={uuid}&outputType={output.type}&addonKey=com.zenuml.confluence-addon&contentKey=zenuml-content-graph"
      },
      {
        "bodyType": "none",
        "categories": [
          "visuals"
        ],
        "description": {
          "value": "Embed ZenUML Diagram"
        },
        "documentation": {
          "url": "https://zenuml.atlassian.net/wiki/spaces/Doc/overview"
        },
        "editor": {
          "cacheable": true,
          "editTitle": {
            "value": "Edit Embedded ZenUML Diagram"
          },
          "height": "100%",
          "insertTitle": {
            "value": "Embed ZenUML Diagram"
          },
          "url": "/embed-editor.html?version=2022.07&addonKey=com.zenuml.confluence-addon",
          "width": "100%"
        },
        "featured": true,
        "icon": {
          "height": 16,
          "url": "image/zenuml_logo.png",
          "width": 16
        },
        "key": "zenuml-embed-macro",
        "name": {
          "value": "Embed a ZenUML Diagram or API Spec (Beta)"
        },
        "outputType": "block",
        "parameters": [
          {
            "defaultValue": "None",
            "identifier": "diagramName",
            "multiple": false,
            "name": {
              "i18n": "diagramName",
              "value": "Diagram name (do not change)"
            },
            "required": true,
            "type": "string"
          }
        ],
        "renderModes": {
          "default": {
            "url": "/attachment?version=2022.07&spaceKey={space.key}&pageId={page.id}&pageVersion={page.version}&macroId={macro.id}&uuid={uuid}&addonKey=com.zenuml.confluence-addon"
          }
        },
        "url": "/embed-viewer.html?version=2022.07&spaceKey={space.key}&pageId={page.id}&pageVersion={page.version}&macroId={macro.id}&uuid={uuid}&outputType={output.type}&addonKey=com.zenuml.confluence-addon"
      }
    ],
    "generalPages": [
      {
        "key": "zenuml-content-sequence-viewer-dialog",
        "location": "none",
        "name": {
          "value": "ZenUML Sequence Viewer Dialog"
        },
        "url": "/sequence-viewer-dialog.html?version=2022.07&addonKey=com.zenuml.confluence-addon&contentKey=zenuml-content-sequence"
      },
      {
        "key": "zenuml-content-sequence-viewer",
        "location": "none",
        "name": {
          "value": "ZenUML Sequence Viewer"
        },
        "url": "/sequence-viewer.html?version=2022.07&rendered.for=custom-content-native&spaceKey={space.key}&content.id={content.id}&content.version={content.version}&addonKey=com.zenuml.confluence-addon&contentKey=zenuml-content-sequence"
      },
      {
        "key": "zenuml-content-sequence-editor-dialog",
        "location": "none",
        "name": {
          "value": "ZenUML Sequence Editor"
        },
        "url": "/sequence-editor-dialog.html?version=2022.07&spaceKey={space.key}&content.id={content.id}&content.version={content.version}&addonKey=com.zenuml.confluence-addon&contentKey=zenuml-content-sequence"
      },
      {
        "key": "zenuml-content-graph-viewer",
        "location": "none",
        "name": {
          "value": "ZenUML Graph Viewer"
        },
        "url": "/drawio/viewer.html?version=2022.07&rendered.for=custom-content-native&spaceKey={space.key}&content.id={content.id}&content.version={content.version}&addonKey=com.zenuml.confluence-addon&contentKey=zenuml-content-graph"
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
        "conditions": [
          {
            "condition": "has_page_permission",
            "params": {
              "permission": "EDIT"
            }
          }
        ],
        "key": "onboarding-panel",
        "layout": {
          "height": "0px",
          "width": "0px"
        },
        "location": "atl.footer",
        "name": {
          "value": "Onboarding Panel"
        },
        "supportsNative": false,
        "url": "/onboarding-panel.html?version=2022.07&addonKey=com.zenuml.confluence-addon&postInstallPageKey=onboarding-page",
        "weight": 50
      }
    ]
  },
  "name": "ZenUML Sequence Diagram",
  "scopes": [
    "READ",
    "WRITE"
  ],
  "vendor": {
    "name": "ZenUML",
    "url": "https://www.zenuml.com/"
  }
}