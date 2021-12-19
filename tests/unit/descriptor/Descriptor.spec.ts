import Base from './atlassian-connect.base.json'
import Full from './atlassian-connect.full.json';
import Lite from './atlassian-connect.lite.json';
import {DescriptorBuilder} from "./DescriptorBuilder";

describe("Descriptor", () => {
  it("should generate a full descriptor", () => {
    let descriptorBuilder = new DescriptorBuilder(Base);
    descriptorBuilder.forVersion('2021.11');
    expect(descriptorBuilder.full()).toStrictEqual(Full);
  })

  it("should generate a lite descriptor", () => {
    let descriptorBuilder = new DescriptorBuilder(Base);
    descriptorBuilder.forVersion('2021.11');
    expect(descriptorBuilder.lite()).toStrictEqual(Lite);
  })
})