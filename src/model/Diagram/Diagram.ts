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


  public getCoreData?(): string{
    let body;
    switch (this.diagramType) {
      case DiagramType.Sequence:
        body = this.code || '';
        break;
      case DiagramType.Mermaid:
        body = this.mermaidCode || '';
        break;
      case DiagramType.Graph:
        body = this.graphXml || '';
        break;
    }
    return body || '';
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