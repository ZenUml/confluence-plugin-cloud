<template>
<generic-viewer>
  <div id="swagger-ui"></div>
</generic-viewer>
</template>

<script>
import GenericViewer from "@/components/Viewer/GenericViewer.vue";

export default {
  name: "OpenApiViewer",
  components: {
    GenericViewer
  }
}
</script>
