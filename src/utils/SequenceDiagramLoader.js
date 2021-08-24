export class SequenceDiagramLoader {
  apWrapper;

  constructor(apWrapper) {
    this.apWrapper = apWrapper;
  }

  async load() {
    let code = await this.apWrapper.getMacroBody();
    return {code};
  }
}