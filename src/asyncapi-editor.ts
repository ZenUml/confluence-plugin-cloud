import Vue from 'vue'
import SaveAndGoBackButton from "@/components/SaveAndGoBackButton.vue";
// @ts-ignore
import './assets/tailwind.css'

import globals from '@/model/globals';
import AP from "@/model/AP";
import defaultContentProvider from "@/model/ContentProvider/CompositeContentProvider";
import { DiagramType } from "@/model/Diagram/Diagram";
import { saveToPlatform } from "@/model/ContentProvider/Persistence";
import ApWrapper2 from "@/model/ApWrapper2";
import './utils/IgnoreEsc.ts'
import { encode } from 'js-base64';

const compositeContentProvider = defaultContentProvider(new ApWrapper2(AP));

new Vue({
  render: h => h(SaveAndGoBackButton, {
    props: {
      saveAndExit: async () => {
        // @ts-ignore
        window.diagram = Object.assign(window.diagram || {}, 
          { diagramType: DiagramType.AsyncApi, code: localStorage.document });

        // @ts-ignore
        await saveToPlatform(window.diagram);
        AP.dialog.close();
      }
    }
  })
}).$mount('#save-and-go-back');

function loadMainFrame(data: string) {
  const e = document.getElementById('mainFrame');
  if (e) {
    const base64 = encode(data);
    // @ts-ignore
    e.src = `asyncapi-studio/index.html?base64=${base64}`;
  }
}

async function initializeMacro() {
  const apWrapper = globals.apWrapper;
  await apWrapper.initializeContext();

  const { doc } = await compositeContentProvider.load();

  // @ts-ignore
  window.diagram = doc;
  // @ts-ignore
  loadMainFrame(doc.code);

}

initializeMacro();