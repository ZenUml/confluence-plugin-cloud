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
  AsyncApi = 'AsyncApi',
  Unknown = 'unknown'
}

export function getDiagramData(o: any): string{
  let body;
  switch (o.diagramType) {
    case DiagramType.Sequence:
    case DiagramType.OpenApi:
      body = o.code || '';
      break;
    case DiagramType.Mermaid:
      body = o.mermaidCode || '';
      break;
    case DiagramType.Graph:
      body = o.graphXml || '';
      break;
  }
  return body || '';
}

export class Diagram {
  // id is used only for debugging and for display only. It is NOT saved in custom content or content property.
  id?: string; // custom content id or content property id or uuid
  isCopy?: boolean;
  diagramType: DiagramType = DiagramType.Unknown;
  code?: string = '';
  title?: string = '';
  styles?: object = {};
  mermaidCode?: string = '';
  graphXml?: string = '';
  compressed?: boolean = false;
  source?: DataSource = DataSource.Unknown;

  public getCoreData?(): string {
    return getDiagramData(this);
  }
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
  payload: undefined,
} as Diagram;


export {NULL_DIAGRAM};