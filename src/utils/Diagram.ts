export enum DataSource {
  MacroBody,
  ContentProperty,
  CustomContent
}
export interface Diagram {
  code: string | undefined,
  source: DataSource
}