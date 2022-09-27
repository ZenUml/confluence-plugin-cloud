import {
  Description,
  Documentation,
  DynamicContentMacro,
  Editor,
  Icon,
  Name,
  Parameter,
  RenderModes
} from "atlassian-descriptor";

export class DynamicContentMacroImpl implements DynamicContentMacro {
  key: string;
  name: Name;
  description: Description;
  editor: Editor;
  renderModes: RenderModes;
  icon: Icon = {width: 16, height: 16, url: "image/zenuml_logo.png"};
  documentation: Documentation = {url: "https://zenuml.atlassian.net/wiki/spaces/Doc/overview"};
  parameters: Parameter[] = [
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

  ];
  bodyType: string = 'plain-text';
  categories: string[] = ['visuals'];
  featured: boolean = true;
  outputType: string = 'block';
  url: string;


  constructor(key: string, name: string, description: string, editorUrl: string, attachmentUrl: string, viewerUrl: string) {
    this.key = key;
    this.name = {value: name};
    this.description = {value: description};
    this.editor = {
      url: editorUrl,
      editTitle: {value: `Edit ${name}`},
      insertTitle: {value: `Insert ${name}`},
      width: "100%",
      height: "100%",
      cacheable: true,
    };
    this.renderModes = {
      default: {
        url: attachmentUrl,
      }
    };
    this.url = viewerUrl;
  }

  public static SequenceDiagramMacro = new DynamicContentMacroImpl("zenuml-sequence-macro",
    "ZenUML Diagram",
    "Create a ZenUML Sequence Diagram",
    "/sequence-editor.html",
    "/attachment",
    "/sequence-viewer.html"
    );

  public static GraphMacro = new DynamicContentMacroImpl("zenuml-graph-macro",
    "ZenUML Graph",
    "Create a ZenUML Graph",
    "/drawio/editor.html",
    "/attachment",
    "/drawio/viewer.html"
    );

  public static OpenApiMacro = new DynamicContentMacroImpl("zenuml-openapi-macro",
    "ZenUML OpenAPI",
    "Create a ZenUML OpenAPI Document",
    "/swagger-editor.html",
    "/attachment",
    "/swagger-ui.html"
    );

  public static EmbedMacro = new DynamicContentMacroImpl("zenuml-embed-macro",
    "Embed a ZenUML Diagram or API Spec (Beta)",
    "Embed ZenUML Diagram",
    "/embed-editor.html",
    "/attachment",
    "/embed-viewer.html"
    );
}