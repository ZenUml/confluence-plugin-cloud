import ApWrapper2 from "@/model/ApWrapper2";
import defaultContentProvider from "@/model/ContentProvider/CompositeContentProvider";
import globals from "@/model/globals";

import Workspace from '@/components/Workspace.vue'
import {mountRoot} from "@/mount-root";

import '@/assets/tailwind.css'

async function main() {
  await globals.apWrapper.initializeContext();
  const compositeContentProvider = defaultContentProvider(globals.apWrapper as ApWrapper2);
  let {doc} = await compositeContentProvider.load();
  mountRoot(doc, Workspace);
}

// We do not have to export main(), but otherwise IDE shows a warning
export default main();
