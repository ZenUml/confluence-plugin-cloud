import MockApConfluence from "@/model/MockApConfluence.ts";
import {IAp} from "@/model/IAp";

export default class MockAp implements IAp{
  public confluence: any

  constructor() {
    this.confluence = new MockApConfluence();
    this.navigator = {
      getLocation: (_: any) => {}
    }
    this.request = _ => {}
  }

  request: (req: IApRequest) => any;

  dialog: any;
  navigator: any;
  user: any;
}