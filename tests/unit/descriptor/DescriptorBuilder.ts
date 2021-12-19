import {IDescriptor} from "@/descriptor/Descriptor.interfaces";

export class DescriptorBuilder {
  private readonly _base: IDescriptor;
  private _version?: string;

  constructor(base: IDescriptor) {
    this._base = JSON.parse(JSON.stringify(base));
  }

  public forVersion(version: string) {
    this._version = version;
    return this;
  }

  full() {
    this.replaceUrls();
    return this._base;
  }

  lite() {
    this.updateKeyNameDescriptionsForLite();
    return this.full();
  }

  private updateKeyNameDescriptionsForLite() {
    let liteKeySuffix = '-lite';
    this._base.key = `${this._base.key}${liteKeySuffix}`;
    this._base.name = "ZenUML Lite";
    this._base.description = "ZenUML Lite add-on";
    this._base.enableLicensing = false;
    this._base.links.self = `/atlassian-connect${liteKeySuffix}.json`;
    this._base.modules.dynamicContentMacros.forEach(macro => {
      if (macro.key === 'zenuml-sequence-macro') {
        macro.name.value = 'ZenUML Sequence Lite';
      } else if (macro.key === 'zenuml-graph-macro') {
        macro.name.value = 'ZenUML Graph Lite';
      }
      macro.key = `${macro.key}${liteKeySuffix}`;
    });

    if (this._base.modules.customContent) {
      this._base.modules.customContent.forEach(content => {
        if (content.name && content.name.value) {
          content.name.value = `${content.name.value} Lite`;
        }
      });
    }
  }

  private replaceUrls() {
    this._base?.modules?.dynamicContentMacros.forEach(macro => {
      const contentKey = this.getCustomContentKeyForModule(macro.key);
      this.updateUrl(macro, contentKey);
      this.updateUrl(macro.editor, contentKey);
      this.updateUrl(macro.renderModes?.default, contentKey);
    });

    this._base?.modules?.generalPages?.forEach(page => {
      const contentKey = this.getCustomContentKeyForModule(page.key);
      this.updateUrl(page, contentKey);
    })
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

  private updateUrl(field: { url: string } | undefined, contentKey: string) {
    if(field) {
      field.url = field.url.replace('__CONTENT_KEY__', contentKey)
        .replace('__ADDON_KEY__', this._base.key)
        .replace('__VERSION__', this._version || '');
    }
  }
}