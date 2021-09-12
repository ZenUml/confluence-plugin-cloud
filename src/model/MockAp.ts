import MockApConfluence from "@/model/MockApConfluence.ts";

export default class MockAp {
  public confluence: any

  constructor() {
    this.confluence = new MockApConfluence();
  }
}