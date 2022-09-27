export default {
    "bodyType": "plain-text",
    "categories": [
        "visuals"
    ],
    "description": {
        "value": "Create a ZenUML OpenAPI Document"
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
            "value": "Insert ZenUML OpenAPI"
        },
        "url": "/swagger-editor.html",
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
            "url": "/attachment"
        }
    },
    "url": "/swagger-ui.html"
}