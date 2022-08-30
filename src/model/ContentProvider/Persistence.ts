import {Diagram} from "@/model/Diagram/Diagram";
import {CustomContentStorageProvider} from "@/model/ContentProvider/CustomContentStorageProvider";
import AP from "@/model/AP";
import {MacroIdProvider} from "@/model/ContentProvider/MacroIdProvider";
import {trackEvent} from "@/utils/window";
import ApWrapper2 from "@/model/ApWrapper2";

export async function saveToPlatform(diagram: Diagram) {
  const customContentStorageProvider = new CustomContentStorageProvider(new ApWrapper2(AP));
  const id = await customContentStorageProvider.save(diagram);
  const macroIdProvider = new MacroIdProvider(new ApWrapper2(AP));
  await macroIdProvider.save(id);
  trackEvent(diagram.diagramType, 'save_macro', 'custom_content');
  return id;
}
