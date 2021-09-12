import {IConfluence} from "@/model/IConfluence";

export interface IAp {
  confluence: IConfluence;
  requestFn: {
    (req: IApRequest): any
  };
  navigator: any;
  dialog: any;
  user: any;
}