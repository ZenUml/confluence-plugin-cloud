import Vue from 'vue'
import Vuex from 'vuex'
import ExtendedStore from './model/Store'
import SwaggerUIBundle from 'swagger-ui'
import SpecListener from './utils/spec-listener'
import AP from "@/model/AP";
import './assets/tailwind.css'

import OpenApiExample from '@/model/OpenApi/OpenApiExample'
import createAttachmentIfContentChanged from "@/model/Attachment";
import {trackEvent} from "@/utils/window";
import {DiagramType} from "@/model/Diagram/Diagram";
import globals from '@/model/globals';
import defaultContentProvider from "@/model/ContentProvider/CompositeContentProvider";
import ApWrapper2 from "@/model/ApWrapper2";
import OpenApiViewer from "@/components/Viewer/OpenApiViewer.vue";
import EventBus from './EventBus'

Vue.config.productionTip = false
Vue.use(Vuex)

const store = new Vuex.Store(ExtendedStore);
let render = (h: Function) => h(OpenApiViewer);

if(document.getElementById('app')) {
  // @ts-ignore
  new Vue({
    store,
    render // with this method, we don't need to use full version of vue
  }).$mount('#app')
}

// @ts-ignore
window.SwaggerUIBundle = SwaggerUIBundle;

function initSwaggerUi() {
  const elementId = 'swagger-ui';
  const element = document.getElementById(elementId);
  if(element && element.innerHTML.trim()) {
    element.innerHTML = '';
  }

  const ui = SwaggerUIBundle({
    // url: "https://petstore.swagger.io/v2/swagger.json",
    dom_id: `#${elementId}`,
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
}

async function loadDiagram() {
  const compositeContentProvider = defaultContentProvider(new ApWrapper2(AP));
  const {doc} = await compositeContentProvider.load();

  // eslint-disable-next-line
  // @ts-ignore
  window.updateSpec(doc?.code || OpenApiExample);

  setTimeout(async function () {
    AP.resize();
    try {
      if(await globals.apWrapper.canUserEdit()) {
        trackEvent(DiagramType.OpenApi, 'before_create_attachment', 'info');
        await createAttachmentIfContentChanged(doc?.code);
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

async function initializeMacro() {
  await globals.apWrapper.initializeContext();

  initSwaggerUi();

  await loadDiagram();
}

initializeMacro();

EventBus.$on('edit', () => {
  // @ts-ignore
  AP.dialog.create(
    {
      key: 'zenuml-content-openapi-editor-dialog',
        chrome: false,
        width: "100%",
        height: "100%",
    }).on('close', loadDiagram);
});

EventBus.$on('fullscreen', () => {
  // @ts-ignore
  AP.dialog.create(
    {
      key: 'zenuml-content-openapi-viewer-dialog',
      chrome: true,
      width: "100%",
      height: "100%",
    });
});
