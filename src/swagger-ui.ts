import SwaggerUIBundle from 'swagger-ui'
import SpecListener from './utils/spec-listener'
import BaseMacro2 from "./model/BaseMacro2";
import ApWrapper2 from "@/model/ApWrapper2";
import AP from "@/model/AP";

// eslint-disable-next-line
// @ts-ignore
window.SwaggerUIBundle = SwaggerUIBundle;

async function initializeMacro() {
  const apWrapper = new ApWrapper2(AP);
  await apWrapper.initializeContext();
  
  const macro = new BaseMacro2(apWrapper);
  // await macro.load();

  // @ts-ignore
  window.macro = macro;
  const {code} = await macro.load();
  console.debug('-------------- loaded spec:', code)
  // let code = 'OpenAPI Example'

  if(code) {
    // eslint-disable-next-line
    // @ts-ignore
    window.updateSpec(code);
    console.debug('-------------- updateSpec with:', code)

    setTimeout(function () {
      // eslint-disable-next-line
      // @ts-ignore
      window.AP.resize();
    }, 1500);
  }
}


window.onload = function () {
  // Build a system
  const ui = SwaggerUIBundle({
    // url: "https://petstore.swagger.io/v2/swagger.json",
    dom_id: "#swagger-ui",
    presets: [
      SwaggerUIBundle.presets.apis,
      // SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl,
      SpecListener
    ],
    // requestSnippetsEnabled: true,
    // layout: "StandaloneLayout"
  })

  // eslint-disable-next-line
  // @ts-ignore
  window.ui = ui

  initializeMacro();
}