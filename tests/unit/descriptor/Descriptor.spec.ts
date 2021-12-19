import Base from './atlassian-connect.base.json'
import Full from './atlassian-connect.full.json';

interface IDynamicContentMacro {
  url: string
  editor?: {
    url: string
  }
  renderModes?: {
    default: {
      url: string
    }
  }
}

interface IGeneralPage {
  url: string
}

interface IDescriptor {
  modules: {
    dynamicContentMacros: Array<IDynamicContentMacro>
    generalPages: Array<IGeneralPage>
  }
}

class DescriptorBuilder {
  private _base?: IDescriptor;
  private _version?: string;

  from(base: IDescriptor) {
    this._base = base;
    return this;
  }

  public forVersion(version: string) {
    this._version = version;
    return this;
  }

  getCustomContentKeyForModule = (module: any, modules: any) => {
    const macroType = module.key.includes('sequence') ? 'sequence' : 'graph';
    const result = modules.customContent.filter((c:any) => c.key.includes(macroType));
    if(result.length === 0) {
      console.log(`Custom content not found for module ${module.key} in ${modules.customContent.map((c: any) => c.key)}`);
    } else {
      return result[0].key;
    }
  }
  full() {
    this._base?.modules?.dynamicContentMacros.forEach(macro => {
      const contentKey = this.getCustomContentKeyForModule(macro, this._base?.modules);
      macro.url = macro.url.replace('__CONTENT_KEY__', contentKey);
      if (macro.editor) {
        macro.editor.url = macro.editor?.url.replace('__CONTENT_KEY__', contentKey);
      }

      if(macro.renderModes && macro.renderModes.default && macro.renderModes.default.url) {
        macro.renderModes.default.url = macro.renderModes.default.url.replace('__CONTENT_KEY__', contentKey);
      }
    });

    this._base?.modules?.generalPages?.forEach(page => {
      const contentKey = this.getCustomContentKeyForModule(page, this._base?.modules);
      page.url = page.url.replace('__CONTENT_KEY__', contentKey);
    })

    let stringBase = JSON.stringify(this._base);
    let stringFull = stringBase
      .replace(/__VERSION__/g, this._version || '')
      .replace(/__ADDON_KEY__/g, 'com.zenuml.confluence-addon')
    return JSON.parse(stringFull);
  }
}

describe("Descriptor", () => {
  it("should generate a full descriptor", () => {
    let descriptorBuilder = new DescriptorBuilder();
    let base: IDescriptor = Base;
    descriptorBuilder.from(base)
      .forVersion('2021.11');
    let full = descriptorBuilder.full();
    expect(full).toStrictEqual(Full);
  })
})