import {Diagram} from "@/model/Diagram/Diagram";

export interface StorageProvider {
  getDiagram(id: string | undefined): Promise<Diagram>;
}