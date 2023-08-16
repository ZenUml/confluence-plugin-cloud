<template>
  <generic-viewer>
    <div v-if="diagramType==='mermaid'">mermaid viewer</div>
    <sequence-canvas v-if="diagramType==='sequence'"></sequence-canvas>
  </generic-viewer>
</template>
<script>
import GenericViewer from "@/components/Viewer/GenericViewer.vue";
import SequenceCanvas from "@/components/SequenceCanvas.vue";

export default {
  name: "DiagramPortal",
  components: {SequenceCanvas, GenericViewer},
  computed: {
    diagramType() {
      return this.$store.state.diagram.diagramType;
    }
  }
}

</script>
