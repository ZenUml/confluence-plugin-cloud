export class AtlasDocFormat {
  private value: any;

  constructor(content: string) {
    this.value = JSON.parse(content);
  }

  getMacros(macroKey?: string): Array<AtlasDocElement> {
    const result = [] as Array<AtlasDocElement>;
    const traverse = (node: any) => {
      if(node.type === AtlasDocElementType.Extension
          && node.attrs.extensionType === AtlasDocExtensionType.Macro
          && (!macroKey || node.attrs.extensionKey === macroKey)) {
        result.push(node);
      } else if(node.content) {
        node.content.forEach(traverse);
      }
    };
    traverse(this.value);
    return result;
  }
}

enum AtlasDocElementType {
  Extension = 'extension',
}
enum AtlasDocExtensionType {
  Macro = 'com.atlassian.confluence.macro.core',
}

export interface AtlasDocElement {
  type: AtlasDocElementType;
  attrs: {
    parameters: {
      macroParams: MacroParams;
    }
  };
}

export interface MacroParams {
  customContentId?: {
    value: string;
  }
}