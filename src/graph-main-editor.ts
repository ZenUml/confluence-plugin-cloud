import Vue from 'vue'
import GraphMacro from "@/model/GraphMacro";
import SaveAndGoBackButton from "@/components/SaveAndGoBackButton.vue";
// @ts-ignore
import Va from 'vue-atlas'
import 'vue-atlas/dist/vue-atlas.css'
import './assets/tailwind.css'

import globals from '@/model/globals';
import AP from "@/model/AP";

Vue.use(Va, 'en')

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

  const macro = new GraphMacro(apWrapper);

  // @ts-ignore
  window.macro = macro;
  const {graphXml} = await macro.load();

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