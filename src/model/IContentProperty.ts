export interface IContentProperty {
  value: {
    styles?: string;
    code: string | undefined;
    mermaidCode?: string | undefined;
    diagramType?: string | undefined;
    graphXml?: string | undefined;
    compressed?: boolean | undefined;
  }
}