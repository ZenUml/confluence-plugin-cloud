<template>
  <generic-viewer>
    <div v-if="diagramType==='mermaid'">mermaid viewer</div>
    <div v-if="diagramType==='sequence'">sequence viewer</div>
  </generic-viewer>
</template>
<script>
import GenericViewer from "@/components/Viewer/GenericViewer.vue";

export default {
  name: "DiagramPortal",
  components: {GenericViewer},
  computed: {
    diagramType() {
      return this.$store.state.diagram.diagramType;
    }
  }
}

</script>
