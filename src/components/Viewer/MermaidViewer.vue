<template>
<generic-viewer>
  <mermaid/>
</generic-viewer>
</template>

<script>
import GenericViewer from "@/components/Viewer/GenericViewer.vue";
import Mermaid from '../Mermaid.vue';

export default {
  name: "MermaidViewer",
  components: {
    GenericViewer,
    Mermaid
  }
}
</script>
