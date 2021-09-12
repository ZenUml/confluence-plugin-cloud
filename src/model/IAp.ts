import {IConfluence} from "@/model/IConfluence";

export interface IAp {
  confluence: IConfluence;
  request: {
    (req: IApRequest): any
  };
  navigator: any;
  dialog: any;
  user: any;
}