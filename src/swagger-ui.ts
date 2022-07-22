import SwaggerUIBundle from 'swagger-ui'
import SpecListener from './utils/spec-listener'
import AP from "@/model/AP";
import './assets/tailwind.css'

import '@/components/Debug/DebugMounter.ts'
import Example from '@/model/OpenApi/OpenApiExample'
import createAttachmentIfContentChanged from "@/model/Attachment";
import {trackEvent} from "@/utils/window";
import {DiagramType} from "@/model/Diagram";
import globals from '@/model/globals';

// @ts-ignore
window.SwaggerUIBundle = SwaggerUIBundle;

async function initializeMacro() {
  const apWrapper = globals.apWrapper;
  const macro = globals.macro;
  await macro.initializeContext();

  const {code} = await macro.load();

  // @ts-ignore
  window.updateSpec(code || Example);

  setTimeout(async function () {
    AP.resize();
    try {
      if(await apWrapper.canUserEdit()) {
        trackEvent(DiagramType.OpenApi, 'before_create_attachment', 'info');
        await createAttachmentIfContentChanged(code);
      } else {
        trackEvent(DiagramType.OpenApi, 'skip_create_attachment', 'warning');
      }
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