<template>
  <div v-show="debug">
    Host: {{app.host}} <br>
    Macro: {{macro._uuid}}
    Data source: {{diagram.source}} {{diagram.id}}
  </div>

</template>

<script>
import App from "@/model/app/App";

export default {
  name: "Debug",
  computed: {
    debug() {
      return !!localStorage.zenumlDebug;
    },
    app() {
      return new App();
    },
    diagram() {
      return this.$store.state.macro._diagram || {};
    },
    macro() {
      return this.$store.state.macro;
    }

  }
}
</script>

<style scoped>

</style>