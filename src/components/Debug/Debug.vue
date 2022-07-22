<template>
  <div v-show="debug">
    <div class="flex gap-7 flex-wrap m-2">
      <div class="flex gap-2 item-left max-w-xs">
        <img :src="hostIcon" alt="Host Icon" class="object-contain h-6 w-6o" />
        {{ app.host }}
      </div>
      <div class="flex gap-2 items-center">
        <div class="text-sm leading-none text-gray-600">
          {{ shortUuid }} {{ diagram.source }}:{{diagram.id}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import App from "@/model/app/App";
import HostIcon from '@/assets/server-svgrepo-com.svg'
import globals from '@/model/globals';

export default {
  name: "Debug",
  data() {
    return {
      hostIcon: HostIcon
    }
  },
  computed: {
    debug() {
      return !!localStorage.zenumlDebug;
    },
    app() {
      return new App();
    },
    diagram() {
      return globals.macro._diagram || {};
    },

    shortUuid() {
      return globals.macro?._uuid?.substring(0, 8);
    }

  }
}
</script>

<style scoped>

</style>