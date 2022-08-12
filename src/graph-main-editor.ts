import Vue from 'vue'
import SaveAndGoBackButton from "@/components/SaveAndGoBackButton.vue";
// @ts-ignore
import './assets/tailwind.css'

import globals from '@/model/globals';
import AP from "@/model/AP";
import defaultCompositeContentProvider from "@/model/ContentProvider/CompositeContentProvider";
import {decompress} from "@/utils/compress";

new Vue({
  render: h => h(SaveAndGoBackButton, {
    props: {
      saveAndExit: async () => {
        // eslint-disable-next-line no-undef
        // @ts-ignore
        await window.macro.save2(getGraphXml());
        /* eslint-disable no-undef */
        AP.dialog.close();
      }
    }
  })
}).$mount('#save-and-go-back');
async function initializeMacro() {
  const apWrapper = globals.apWrapper;
  await apWrapper.initializeContext();

  const compositeContentProvider = defaultCompositeContentProvider(AP);
  const {content} = await compositeContentProvider.load();
  let graphXml = content.graphXml;
  if (content?.compressed) {
    graphXml = decompress(content.graphXml);
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