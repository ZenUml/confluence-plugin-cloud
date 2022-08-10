import {Diagram} from "@/model/Diagram";

export interface StorageProvider {
  getContent(id: string | undefined): Promise<Diagram | undefined>;
}