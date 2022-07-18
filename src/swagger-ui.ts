import SwaggerUIBundle from 'swagger-ui'
import SpecListener from './utils/spec-listener'
import BaseMacro2 from "./model/BaseMacro2";
import ApWrapper2 from "@/model/ApWrapper2";
import AP from "@/model/AP";
import './assets/tailwind.css'

import '@/components/Debug/DebugMounter.ts'
import Example from '@/model/OpenApi/OpenApiExample'
import createAttachmentIfContentChanged from "@/model/Attachment";
import {trackEvent} from "@/utils/window";

// eslint-disable-next-line
// @ts-ignore
window.SwaggerUIBundle = SwaggerUIBundle;

async function initializeMacro() {
  const apWrapper = new ApWrapper2(AP);
  await apWrapper.initializeContext();

  const macro = new BaseMacro2(apWrapper);

  // @ts-ignore
  window.macro = macro;
  const {code} = await macro.load();

  // eslint-disable-next-line
  // @ts-ignore
  window.updateSpec(code || Example);

  setTimeout(async function () {
    AP.resize();
    try {
      await createAttachmentIfContentChanged(code);
    } catch (e) {
      // Do not re-throw the error
      console.error('Error when creating attachment', e);
      trackEvent(JSON.stringify(e), 'create_attachment', 'error');
    }

  }, 1500);
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