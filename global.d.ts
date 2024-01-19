declare module 'global' {
  global {
    interface Window {
      specListeners?: Array<(spec: string) => void>;
      specContent?: string;
      diagram?: Diagram;
      editor?: SwaggerEditorBundle;
    }
  }
}
