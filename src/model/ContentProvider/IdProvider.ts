export interface IdProvider {
  getId(): Promise<string|undefined>
}
