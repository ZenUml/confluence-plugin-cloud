import Base from './atlassian-connect.base.json'
import Full from './atlassian-connect.full.json';
import {IDescriptor} from "@/descriptor/Descriptor.interfaces";
import {DescriptorBuilder} from "./DescriptorBuilder";

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