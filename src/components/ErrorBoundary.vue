<template>
<div>
  <div v-show="error" class="px-4 py-3 rounded relative">
    <div class="p-4 mb-4 bg-red-100 rounded-lg dark:bg-red-200">
      <div class="flex items-center">
        <h1 class="font-bold">Error</h1>
      </div>
      <div class="text-sm text-red-700 dark:text-red-800">
        <p class="sm:inline">{{error && error.message}}</p>
        <p class="code">{{error && error.data}}</p>
        <p class="code">{{error && error.stack}}</p>
      </div>
    </div>
    <p>* Please include the above error message in your ticket. </p>

    <div class="flex">
      <button type="button" class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-xs px-3 py-1.5 mr-2 text-center inline-flex items-center dark:bg-red-800 dark:hover:bg-red-900">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
        <a target="_blank" href="https://zenuml.atlassian.net/servicedesk/customer/portals">Submit a ticket</a>
      </button>
    </div>
    <h2>Please also include (if applicable):</h2>
    <ol class="list-disc px-4">
      <li>Is this error happening only on one page or on all pages?</li>
      <li>Is this error happening to one diagram or all diagrams?</li>
    </ol>
  </div>
  <div v-show="!error">
    <slot></slot>
  </div>
</div>
</template>

<script>
export default {
  name: "ErrorBoundary",
  computed: {
    error() {
      return this.$store.state.error;
    }
  }
}
</script>

<style scoped>

</style>