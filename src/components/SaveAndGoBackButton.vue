<template>
  <div class="save-and-exit inline-block">
    <button class="flex items-center bg-blue-700 px-2 py-1 text-white text-sm font-semibold rounded" @click="saveAndExit">
      <span>
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
      </span>
      <span>Save and Go back to Confluence</span>
    </button>
  </div>
</template>

<script>
export default {
  name: "SaveAndGoBackButton",
  props: ['saveAndExit'],
}
</script>
