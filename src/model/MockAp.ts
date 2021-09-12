import MockApConfluence from "@/model/MockApConfluence.ts";
import {IAp} from "@/model/IAp";

export default class MockAp implements IAp{
  public confluence: any

  constructor() {
    this.confluence = new MockApConfluence();
    this.requestFn = _ => {}
  }

  dialog: any;
  navigator: any;
  requestFn: { (req: IApRequest): any };
  user: any;
}