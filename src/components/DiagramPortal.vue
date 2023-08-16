<template>
  <div>
    <div v-if="diagramType==='mermaid'">mermaid viewer</div>
    <div v-if="diagramType==='sequence'">sequence viewer</div>
  </div>
</template>
<script>
export default {
  name: "DiagramPortal",
  computed: {
    diagramType() {
      return this.$store.state.diagram.diagramType;
    }
  }
}

</script>
