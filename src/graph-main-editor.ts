import Vue from 'vue'
import SaveAndGoBackButton from "@/components/SaveAndGoBackButton.vue";
// @ts-ignore
import './assets/tailwind.css'

import globals from '@/model/globals';
import AP from "@/model/AP";
import defaultContentProvider from "@/model/ContentProvider/CompositeContentProvider";
import {decompress} from "@/utils/compress";
import {DiagramType} from "@/model/Diagram/Diagram";
import {saveToPlatform} from "@/model/ContentProvider/Persistence";
import ApWrapper2 from "@/model/ApWrapper2";
import './utils/IgnoreEsc.ts'

const compositeContentProvider = defaultContentProvider(new ApWrapper2(AP));

new Vue({
  render: h => h(SaveAndGoBackButton, {
    props: {
      saveAndExit: async () => {
        // @ts-ignore
        const graphXml = getGraphXml();

        // @ts-ignore
        window.diagram = Object.assign(window.diagram || {}, {diagramType: DiagramType.Graph, graphXml: graphXml});

        // @ts-ignore
        await saveToPlatform(window.diagram);
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

  // @ts-ignore
  window.diagram = doc;

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