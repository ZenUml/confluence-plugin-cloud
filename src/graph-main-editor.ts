import Vue from 'vue'
import MockApConfluence from './utils/model/MockApConfluence'
import GraphMacroEditor from './utils/GraphMacroEditor'
import SaveAndGoBackButtonGraph from "@/components/SaveAndGoBackButtonGraph.vue";
// @ts-ignore
import Va from 'vue-atlas'
import 'vue-atlas/dist/vue-atlas.css'
Vue.use(Va, 'en')

if (window.location.href.includes('localhost')) {
  // eslint-disable-next-line
  console.log('You are using a mocked AP.confluence')
  // @ts-ignore
    window.AP = {
    confluence: new MockApConfluence()
  }
}
new Vue({
  render: h => h(SaveAndGoBackButtonGraph)
}).$mount('#save-and-go-back');
async function initializeMacro() {
  // @ts-ignore
  const macro = new GraphMacroEditor(AP);


  // @ts-ignore
  window.macro = macro;
  const {graphXml} = await macro.load();

  if(graphXml) {
    // set diagram content
    await (async () => {
      console.log("Waiting for EditorUi.init");
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