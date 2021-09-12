// Each iFrame provides context for only one macro.
// getMacroData returns the macro data for the CURRENT macro.
// ApWrapper2 converts callback to Promise and also encapsulates
export interface ICallback {
  (data: any): void
}