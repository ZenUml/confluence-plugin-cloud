import Base from './atlassian-connect.base.json'
import Full from './atlassian-connect.full.json';
import Lite from './atlassian-connect.lite.json';
import {IDescriptor} from "@/descriptor/Descriptor.interfaces";
import {DescriptorBuilder} from "./DescriptorBuilder";

describe("Descriptor", () => {
  it("should generate a full descriptor", () => {
    let base: IDescriptor = JSON.parse(JSON.stringify(Base));
    let descriptorBuilder = new DescriptorBuilder(base);
    descriptorBuilder
      .forVersion('2021.11');
    let full = descriptorBuilder.full();
    expect(full).toStrictEqual(Full);
  })

  it("should generate a lite descriptor", () => {
    let base: IDescriptor = JSON.parse(JSON.stringify(Base));
    let descriptorBuilder = new DescriptorBuilder(base);
    descriptorBuilder
      .forVersion('2021.11');
    const lite = descriptorBuilder.lite();
    expect(lite).toStrictEqual(Lite);
  })
})