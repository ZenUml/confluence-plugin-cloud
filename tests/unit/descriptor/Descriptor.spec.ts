import Base from './atlassian-connect.base.json'
import Full from './atlassian-connect.full.json';

class DescriptorBuilder {
  private _base?: object;
  private _version?: string;

  from(base: object) {
    this._base = base;
    return this;
  }

  public forVersion(version: string) {
    this._version = version;
    return this;
  }

  full() {
    let stringBase = JSON.stringify(this._base);
    let stringFull = stringBase.replace(/__VERSION__/g, this._version || '');
    return JSON.parse(stringFull);
  }
}

describe("Descriptor", () => {
  it("should generate a full descriptor", () => {
    let descriptorBuilder = new DescriptorBuilder();
    descriptorBuilder.from(Base)
      .forVersion('2021.11');
    let full = descriptorBuilder.full();
    expect(full).toBe(Full);
  })
})