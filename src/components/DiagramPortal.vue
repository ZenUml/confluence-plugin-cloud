<template>
  <generic-viewer :wide="diagramType==='mermaid'">
    <mermaid v-if="diagramType==='mermaid'"></mermaid>
    <sequence v-if="diagramType==='sequence'"></sequence>
  </generic-viewer>
</template>
<script>
import GenericViewer from "@/components/Viewer/GenericViewer.vue";
import Sequence from "@/components/Sequence.vue";
import Mermaid from "@/components/Mermaid.vue";

export default {
  name: "DiagramPortal",
  components: {Mermaid, Sequence, GenericViewer},
  computed: {
    diagramType() {
      return this.$store.state.diagram.diagramType;
    }
  }
}

</script>
