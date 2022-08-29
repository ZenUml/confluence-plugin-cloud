import Vue from 'vue'
import SaveAndGoBackButton from "@/components/SaveAndGoBackButton.vue";
// @ts-ignore
import './assets/tailwind.css'

import globals from '@/model/globals';
import AP from "@/model/AP";
import defaultContentProvider from "@/model/ContentProvider/CompositeContentProvider";
import {decompress} from "@/utils/compress";
import {DiagramType} from "@/model/Diagram/Diagram";
import {MacroIdProvider} from "@/model/ContentProvider/MacroIdProvider";
import {CustomContentStorageProvider} from "@/model/ContentProvider/CustomContentStorageProvider";

const compositeContentProvider = defaultContentProvider(AP);

new Vue({
  render: h => h(SaveAndGoBackButton, {
    props: {
      saveAndExit: async () => {
        // @ts-ignore
        const graphXml = getGraphXml();
        const customContentStorageProvider = new CustomContentStorageProvider(AP);
        const id = await customContentStorageProvider.save({diagramType: DiagramType.Graph, graphXml: graphXml});
        const macroIdProvider = new MacroIdProvider(AP);
        await macroIdProvider.save(id);
        /* eslint-disable no-undef */
        AP.dialog.close();
      }
    }
  })
}).$mount('#save-and-go-back');
async function initializeMacro() {
  const apWrapper = globals.apWrapper;
  await apWrapper.initializeContext();

  const {doc} = await compositeContentProvider.load();
  let graphXml = doc.graphXml;
  if (doc?.compressed) {
    graphXml = decompress(doc.graphXml);
  }

  if(graphXml) {
    // set diagram content
    await (async () => {
      console.debug("Waiting for EditorUi.init");
      // eslint-disable-next-line no-prototype-builtins
      while (!window.hasOwnProperty("setGraphXml")) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      // @ts-ignore
      if (typeof setGraphXml === "function") {
        // @ts-ignore
        setGraphXml(graphXml);
      }
    })();

  }
}

initializeMacro();