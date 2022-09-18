import {Diagram} from "@/model/Diagram/Diagram";
import {CustomContentStorageProvider} from "@/model/ContentProvider/CustomContentStorageProvider";
import AP from "@/model/AP";
import {trackEvent} from "@/utils/window";
import ApWrapper2 from "@/model/ApWrapper2";
import uuidv4 from "@/utils/uuid";

export async function saveToPlatform(diagram: Diagram) {
  const apWrapper = new ApWrapper2(AP);
  const customContentStorageProvider = new CustomContentStorageProvider(apWrapper);
  const id = await customContentStorageProvider.save(diagram);
  const macroData = await apWrapper.getMacroData();
  const uuid = macroData?.uuid || uuidv4();
  const body = diagram.getCoreData ? diagram.getCoreData() : '';
  const params = { uuid, customContentId: id, updatedAt: new Date() };
  apWrapper.saveMacro(params, body);
  trackEvent(diagram.diagramType, 'save_macro', 'custom_content');
  return id;
}
