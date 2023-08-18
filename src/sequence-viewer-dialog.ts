import ApWrapper2 from "@/model/ApWrapper2";
import defaultContentProvider from "@/model/ContentProvider/CompositeContentProvider";
import globals from '@/model/globals';

import DiagramPortal from "@/components/DiagramPortal.vue";
import {mountRoot} from "@/mount-root";

import './assets/tailwind.css'
import '@zenuml/core/dist/style.css'

async function main() {
  await globals.apWrapper.initializeContext();
  const compositeContentProvider = defaultContentProvider(globals.apWrapper as ApWrapper2);
  let {doc} = await compositeContentProvider.load();
  mountRoot(doc, DiagramPortal);
}

// We do not have to export main(), but otherwise IDE shows a warning
export default main();
