<template>
  <div class="send-feedback inline-block">
    <a class="flex items-center px-2 py-1 text-sm rounded-md inline-block"
       target="_blank" href="https://github.com/ZenUml/vue-sequence/discussions/352">
      <span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </span>
      <span class="leading-none">Feedback on the new layout engine</span>
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