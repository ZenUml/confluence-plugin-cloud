export default {
    "bodyType": "plain-text",
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
            "value": "Insert ZenUML Graph"
        },
        "url": "/drawio/editor.html",
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
            "url": "/attachment"
        }
    },
    "url": "/drawio/viewer.html"
}