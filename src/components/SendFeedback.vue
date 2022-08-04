<template>
<div class="send-feedback">
  <a target="_blank" href="https://github.com/ZenUml/vue-sequence/discussions/352">
    <svg class="w-5 h-5" viewBox="0 0 24 24"><path d="M0 0h24v24H0z"/><path d="M10 3v2H5v14h14v-5h2v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h6zm7.586 2H13V3h8v8h-2V6.414l-7 7L10.586 12l7-7z"/></svg>
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