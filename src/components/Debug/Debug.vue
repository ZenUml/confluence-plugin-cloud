<template>
  <div v-show="debug">
    <div class="flex flex-nowrap m-2 text-sm">
      <div class="text-xs inline-flex items-center font-bold leading-sm px-3 py-1 bg-blue-200 text-blue-700 rounded-full">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"></path></svg>
        <span class="inline-block px-2">{{ app.host }}</span>
      </div>
      <div
        class="ml-4 text-xs inline-flex items-center font-bold leading-sm px-3 py-1 bg-green-200 text-green-700 rounded-full"
      >
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="3" x2="6" y2="15"></line><circle cx="18" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><path d="M18 9a9 9 0 0 1-9 9"></path></svg>
        <span class="inline-block px-2">{{gitBranch || gitTag}}:{{commitHash}}</span>
      </div>
      <div class="flex gap-2 items-center">
        <div class="ml-4 text-xs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 bg-yellow-200 text-yellow-700 rounded-full">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          <span class="inline-block px-2">[{{ shortUuid || 'macro uuid' }}]:{{contentId}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import App from "@/model/app/App";
import HostIcon from '@/assets/server-svgrepo-com.svg'
import {MacroIdProvider} from "@/model/ContentProvider/MacroIdProvider";
import AP from "@/model/AP";
import ApWrapper2 from "@/model/ApWrapper2";

const commitHash = process.env.VUE_APP_GIT_HASH;
const gitBranch = process.env.VUE_APP_GIT_BRANCH;
const gitTag = process.env.VUE_APP_GIT_TAG;
export default {
  name: "Debug",
  data() {
    return {
      hostIcon: HostIcon,
      commitHash,
      gitBranch,
      gitTag,
      shortUuid: '',
      contentId: ''
    }
  },
  computed: {
    debug() {
      return !!localStorage.zenumlDebug;
    },
    app() {
      return new App();
    },
  },
  async mounted() {
    const macroIdProvider = new MacroIdProvider(new ApWrapper2(AP));
    this.shortUuid = (await macroIdProvider.getUuid())?.substring(0, 8);
    this.contentId = await macroIdProvider.getId();
  }
}
</script>

<style scoped>

</style>