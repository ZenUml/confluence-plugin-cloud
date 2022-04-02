<template>
  <div v-show="debug">
    <div class="px-4 py-5 sm:p-6">
      <dt class="text-blue-600 hover:text-blue-800 visited:text-purple-600">
        HOST: {{ app.host }}
      </dt>
      <dd class="mt-1">
        <div class="flex items-baseline font-mono text-indigo-600">
          {{ shortUuid }} {{ diagram.source }}:{{diagram.id}}
        </div>
      </dd>
    </div>
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
    },
    shortUuid() {
      return this.macro?._uuid?.substring(0, 8);
    }

  }
}
</script>

<style scoped>

</style>