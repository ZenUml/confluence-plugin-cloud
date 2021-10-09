export enum DataSource {
  MacroBody = 'macro-body',
  ContentProperty = 'content-property',
  ContentPropertyOld = 'content-property-old',
  CustomContent = 'custom-content',
  Example = 'example'
}

export enum DiagramType {
  Sequence = 'sequence',
  Mermaid = 'mermaid',
  Graph = 'graph'
}

export interface Diagram {
  diagramType: DiagramType,
  code?: string,
  title?: string,
  styles?: object,
  mermaidCode?: string,
  graphXml?: string,
  compressed?: boolean,
  source: DataSource
}