export interface ICustomContent {
  id?: string;
  version?: { number: number };
  title?: string;
  type?: string;
  value: { code: string | undefined };
}