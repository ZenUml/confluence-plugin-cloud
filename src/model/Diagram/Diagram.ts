export enum DataSource {
  MacroBody = 'macro-body',
  ContentProperty = 'content-property',
  ContentPropertyOld = 'content-property-old',
  CustomContent = 'custom-content',
  Example = 'example',
  Unknown = 'unknown',
}

export enum DiagramType {
  Sequence = 'sequence',
  Mermaid = 'mermaid',
  Graph = 'graph',
  OpenApi = 'OpenAPI',
  Unknown = 'unknown'
}

export interface Diagram {
  // id is used only for debugging and for display only. It is NOT saved in custom content or content property.
  id?: string; // custom content id or content property id or uuid
  isCopy?: boolean;
  diagramType: DiagramType,
  code?: string,
  title?: string,
  styles?: object,
  mermaidCode?: string,
  graphXml?: string,
  compressed?: boolean,
  source?: DataSource,
}

const NULL_DIAGRAM = {
    id: '',
    diagramType: DiagramType.Unknown,
    code: '',
    title: '',
    styles: {},
    mermaidCode: '',
    graphXml: '',
    compressed: false,
    source: DataSource.Unknown,
    payload: undefined
  } as const;


export {NULL_DIAGRAM};