export enum DataSource {
  MacroBody = 'macro-body',
  ContentProperty = 'content-property',
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
  styles?: object,
  mermaidCode?: string,
  graphXml?: string,
  compressed?: boolean,
  source: DataSource
}