export default {
    "bodyType": "plain-text",
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
            "value": "Edit Embed a ZenUML Diagram or API Spec (Beta)"
        },
        "height": "100%",
        "insertTitle": {
            "value": "Insert Embed a ZenUML Diagram or API Spec (Beta)"
        },
        "url": "/embed-editor.html",
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
            "url": "/attachment"
        }
    },
    "url": "/embed-viewer.html"
}