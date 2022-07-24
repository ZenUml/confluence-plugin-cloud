// Note MacroData does store the content property key. It is a calculated value.
export interface IMacroData {
  uuid?: string;            // It is introduced by us. It is required.
  customContentId?: string; // It does not exist for macro stored with content property
  customContentType?: string; // It does not exist for macro stored with content property
  updatedAt?: Date;         // This is maintained by the confluence server
}