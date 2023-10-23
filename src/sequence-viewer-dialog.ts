import ApWrapper2 from "@/model/ApWrapper2";
import defaultContentProvider from "@/model/ContentProvider/CompositeContentProvider";
import globals from '@/model/globals';

import DiagramPortal from "@/components/DiagramPortal.vue";
import {mountRoot} from "@/mount-root";

import './assets/tailwind.css'
import AP from "./model/AP";
import EventBus from "./EventBus";
import { saveToPlatform } from "./model/ContentProvider/Persistence";
import { Diagram } from "./model/Diagram/Diagram";

async function main() {
  await globals.apWrapper.initializeContext();
  const compositeContentProvider = defaultContentProvider(globals.apWrapper as ApWrapper2);
  let {doc} = await compositeContentProvider.load();
  mountRoot(doc, DiagramPortal);
}

// We do not have to export main(), but otherwise IDE shows a warning
export default main();


EventBus.$on('updateContent', async (diagram: Diagram) => {
  if (await globals.apWrapper.canUserEdit()) {
    saveToPlatform(diagram)
  } else {
    AP.messages.info('Your changes cannot be persistent as you are not authorized to edit.');
  }
});
