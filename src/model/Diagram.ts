export enum DataSource {
  MacroBody,
  ContentProperty,
  CustomContent,
  Example
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