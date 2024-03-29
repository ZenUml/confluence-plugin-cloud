import globals from "@/model/globals";
import AP from "@/model/AP";
import defaultContentProvider from "@/model/ContentProvider/CompositeContentProvider";
import { decompress } from "@/utils/compress";
import { DiagramType } from "@/model/Diagram/Diagram";
import { saveToPlatform } from "@/model/ContentProvider/Persistence";
import ApWrapper2 from "@/model/ApWrapper2";
import "./utils/IgnoreEsc";
import { trackEvent } from "@/utils/window";
import MacroUtil from "@/model/MacroUtil";
import "./assets/tailwind.css";
import { createApp } from "vue";
import DrawIoExtension from "@/components/DrawIoExtension/DrawIoExtension.vue";

const compositeContentProvider = defaultContentProvider(new ApWrapper2(AP));

async function saveAndExit(graphXml: string) {
  // @ts-ignore
  window.diagram = Object.assign(window.diagram || {}, {
    diagramType: DiagramType.Graph,
    graphXml
  });

  // @ts-ignore
  await saveToPlatform(window.diagram);
  // @ts-ignore
  console.log("Save and exit", window.diagram);
  /* eslint-disable no-undef */
  AP.dialog.close();
}

// @ts-ignore
window.saveAndExit = saveAndExit;

async function initializeMacro() {
  const apWrapper = globals.apWrapper;
  await apWrapper.initializeContext();

  const { doc } = await compositeContentProvider.load();
  let graphXml = doc.graphXml;

  // @ts-ignore
  window.diagram = doc;

  if (doc?.compressed) {
    trackEvent("compressed_field_editor", "load", "warning");
    if (!graphXml?.startsWith("<mxGraphModel")) {
      graphXml = decompress(doc.graphXml);
      trackEvent("compressed_content_editor", "load", "warning");
    }
    delete doc.compressed;
    console.debug("delete doc.compressed");
  }

  if (graphXml) {
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
  const header = createApp(DrawIoExtension, {
    doc
  });
  header.mount("#drawioExtension");

  if (await MacroUtil.isCreateNew()) {
    trackEvent("", "create_macro_begin", "graph");
  }
}

initializeMacro();
