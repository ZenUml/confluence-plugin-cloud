import Vue from 'vue'
import GraphMacro from "@/model/GraphMacro.ts";
import SaveAndGoBackButtonGraph from "@/components/SaveAndGoBackButtonGraph.vue";
// @ts-ignore
import Va from 'vue-atlas'
import 'vue-atlas/dist/vue-atlas.css'
import './assets/tailwind.css'

import ApWrapper2 from "@/model/ApWrapper2";
import AP from "@/model/AP";
Vue.use(Va, 'en')

new Vue({
  render: h => h(SaveAndGoBackButtonGraph)
}).$mount('#save-and-go-back');
async function initializeMacro() {
  const apWrapper = new ApWrapper2(AP);
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