export interface StorageProvider {
  getContent(id: string | undefined): Object | undefined;
}