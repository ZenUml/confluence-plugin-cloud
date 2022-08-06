<template>
<div class="send-feedback">
  <a target="_blank" href="https://github.com/ZenUml/vue-sequence/discussions/352">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
    Feedback on the new layout engine
    <span class="inline-block w-2 h-2 mr-2 bg-red-600 rounded-full"></span>
  </a>
</div>
</template>

<script>
    export default {
        name: "SendFeedback"
    }
</script>

<style scoped>

  .send-feedback {
    border-radius: 3px;
    min-height: 34px;
    line-height: 2.3em;
    padding: 0 9px;
    background-color: #f3f4f6;
    color: #505e77;
  }

  svg {
    display: inline-block;
  }
  a {
    text-decoration: none;
    font-family: Helvetica,Verdana,serif;
  }
</style>