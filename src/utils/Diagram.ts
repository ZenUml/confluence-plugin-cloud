export enum DataSource {
  MacroBody,
  ContentProperty,
  CustomContent,
  Example
}
export interface Diagram {
  code: string | undefined,
  source: DataSource
}