<template>
  <generic-viewer>
    <mermaid v-if="diagramType==='mermaid'">mermaid viewer</mermaid>
    <sequence-canvas v-if="diagramType==='sequence'"></sequence-canvas>
  </generic-viewer>
</template>
<script>
import GenericViewer from "@/components/Viewer/GenericViewer.vue";
import SequenceCanvas from "@/components/SequenceCanvas.vue";
import Mermaid from "@/components/Mermaid.vue";

export default {
  name: "DiagramPortal",
  components: {Mermaid, SequenceCanvas, GenericViewer},
  computed: {
    diagramType() {
      return this.$store.state.diagram.diagramType;
    }
  }
}

</script>
