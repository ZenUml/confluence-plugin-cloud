<template>
<generic-viewer>
  <div id="graph"></div>
</generic-viewer>
</template>

<script>
import GenericViewer from "@/components/Viewer/GenericViewer.vue";
import AP from "@/model/AP";
import {trackEvent} from "@/utils/window";
import defaultContentProvider from "@/model/ContentProvider/CompositeContentProvider";
import ApWrapper2 from "@/model/ApWrapper2";
import {decompress} from "@/utils/compress";
function renderGraph(graphXml) {
  const element = document.getElementById('graph');
  if(element && element.innerHTML.trim()) {
    element.innerHTML = '';
  }

  // eslint-disable-next-line no-undef
  const graph = new Graph(element);
  graph.resizeContainer = true;
  graph.setEnabled(false);

  // setGraphStyle is only available on viewer and maybe should only be used on viewer.
  // eslint-disable-next-line no-undef
  setGraphStyle && setGraphStyle('styles/default.xml', graph);
  // eslint-disable-next-line no-undef
  setGraphXml(graphXml, graph);
}

async function loadDiagram() {
  const compositeContentProvider = defaultContentProvider(new ApWrapper2(AP));
  const {doc} = await compositeContentProvider.load();
  let graphXml = doc.graphXml;
  if (doc?.compressed) {
    trackEvent('compressed_field_viewer', 'load', 'warning');
    if (!graphXml?.startsWith('<mxGraphModel')) {
      graphXml = decompress(doc.graphXml);
      trackEvent('compressed_content_viewer', 'load', 'warning');
    }
  }
  console.debug('doc', doc);
  if(graphXml) {
    renderGraph(graphXml);
  }
}


export default {
  name: "GraphViewer",
  components: {
    GenericViewer
  },
  mounted() {
    loadDiagram();
  }
}
</script>
