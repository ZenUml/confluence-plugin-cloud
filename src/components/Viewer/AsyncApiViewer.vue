<template>
<generic-viewer :wide="true">
  <iframe id="mainFrame" width="100%" height="100%" onload="iframeLoaded()">
</generic-viewer>
</template>

<script>
import GenericViewer from "@/components/Viewer/GenericViewer.vue";

export default {
  name: "AsyncApiViewer",
  components: {
    GenericViewer
  }
}
</script>
