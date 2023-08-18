import ApWrapper2 from "@/model/ApWrapper2";
import defaultContentProvider from "@/model/ContentProvider/CompositeContentProvider";
import globals from "@/model/globals";

import Workspace from './components/Workspace.vue'
import {mountRoot} from "@/mount-root";

import store from './model/store2'
import EventBus from './EventBus'
import {CustomContentStorageProvider} from "@/model/ContentProvider/CustomContentStorageProvider";
import AP from "@/model/AP";
import {DataSource} from "@/model/Diagram/Diagram";
import {MacroIdProvider} from "@/model/ContentProvider/MacroIdProvider";
import './utils/IgnoreEsc.ts'

import '@zenuml/core/dist/style.css'
import './assets/tailwind.css'

async function main() {
  await globals.apWrapper.initializeContext();
  const compositeContentProvider = defaultContentProvider(globals.apWrapper as ApWrapper2);
  let {doc} = await compositeContentProvider.load();
  mountRoot(doc, Workspace);
}

// We do not have to export main(), but otherwise IDE shows a warning
export default main();

EventBus.$on('save', async () => {
  const apWrapper = new ApWrapper2(AP);
  const idProvider = new MacroIdProvider(apWrapper);
  // @ts-ignore

  const value = {id: await idProvider.getId(),code: store.state.code, styles: store.state.styles, mermaidCode: store.state.mermaidCode, diagramType: store.state.diagramType, title: store.getters.title, source: DataSource.CustomContent} as Diagram;
  const customContentStorageProvider = new CustomContentStorageProvider(apWrapper);
  await customContentStorageProvider.save(value);
  // @ts-ignore
  AP.dialog.close();
});
