import Viewer from "@/components/Viewer/Viewer.vue";
import defaultContentProvider from "@/model/ContentProvider/CompositeContentProvider";
import globals from "@/model/globals";
import {mountApp} from "@/mount-app";
import './assets/tailwind.css'

async function main() {
  const compositeContentProvider = defaultContentProvider(globals.apWrapper);
  let {doc} = await compositeContentProvider.load();
  await globals.apWrapper.initializeContext();
  mountApp(Viewer, doc);
  // @ts-ignore
  setTimeout(window.AP?.resize, 1500)
}

export default main();
