import {IDescriptor} from "@/descriptor/Descriptor.interfaces";

export class DescriptorBuilder {
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

  full() {
    this._base?.modules?.dynamicContentMacros.forEach(macro => {
      const contentKey = this.getCustomContentKeyForModule(macro.key);
      this.replaceUrl(macro, contentKey);
      this.replaceUrl(macro.editor, contentKey);
      this.replaceUrl(macro.renderModes?.default, contentKey);
    });

    this._base?.modules?.generalPages?.forEach(page => {
      const contentKey = this.getCustomContentKeyForModule(page.key);
      this.replaceUrl(page, contentKey);
    })

    let stringBase = JSON.stringify(this._base);
    let stringFull = stringBase
      .replace(/__VERSION__/g, this._version || '')
      .replace(/__ADDON_KEY__/g, 'com.zenuml.confluence-addon')
    return JSON.parse(stringFull);
  }

  private getCustomContentKeyForModule = (moduleKey: any) => {
    const moduleType = moduleKey.includes('sequence') ? 'sequence' : 'graph';
    let customContentArray = this._base?.modules?.customContent;
    const result = customContentArray?.filter((c: any) => c.key.includes(moduleType));
    if (!result || result?.length === 0) {
      console.log(`Custom content not found for module ${moduleKey} in ${customContentArray?.map((c: any) => c.key)}`);
      return 'custom_content_undefined';
    } else {
      return result[0].key;
    }
  }

  private replaceUrl(field: { url: string } | undefined, contentKey: string) {
    if(field?.url) {
      field.url = field.url.replace('__CONTENT_KEY__', contentKey);
    }
  }
}