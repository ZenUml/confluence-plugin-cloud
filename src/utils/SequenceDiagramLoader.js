export default class SequenceDiagramLoader {
  apWrapper;

  constructor(apWrapper) {
    this.apWrapper = apWrapper;
  }

  async load() {
    let content = await this.apWrapper.getContentProperty2();
    console.log('loaded content from content property', content)
    if(!content) {
      content = await this.apWrapper.getMacroBody();
    }
    return {code: content.code};
  }
}