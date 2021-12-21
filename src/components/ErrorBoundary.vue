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
        <svg class="-ml-0.5 mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24"
             xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
             width="15" height="15"
             style=" fill:#FFFFFF;"><path d="M 7.5 1 C 6.6274862 1 5.7932031 1.1755485 5.0332031 1.4882812 L 3.6445312 2.0585938 L 7.5859375 6 L 6 7.5859375 L 2.0585938 3.6445312 L 1.4882812 5.0332031 C 1.1755484 5.7932031 1 6.6274862 1 7.5 C 1 11.078268 3.9217323 14 7.5 14 C 8.11867 14 8.6809561 13.816598 9.2480469 13.654297 L 18.15625 22.560547 C 18.734417 23.138714 19.699176 23.138714 20.277344 22.560547 L 22.5625 20.273438 C 23.136532 19.696462 23.137552 18.731255 22.560547 18.154297 L 13.654297 9.2480469 C 13.816352 8.6810027 14 8.1186541 14 7.5 C 14 3.9217323 11.078268 1 7.5 1 z M 7.5 3 C 9.9977323 3 12 5.0022677 12 7.5 C 12 8.1069469 11.878016 8.6818072 11.660156 9.2128906 L 11.408203 9.8300781 L 20.792969 19.214844 L 19.216797 20.792969 L 9.8300781 11.40625 L 9.2128906 11.660156 C 8.6825114 11.878548 8.1081276 12 7.5 12 C 5.0022677 12 3 9.9977323 3 7.5 C 3 7.47441 3.0132432 7.4532073 3.0136719 7.4277344 L 6 10.414062 L 10.414062 6 L 7.4277344 3.0136719 C 7.4532073 3.0132432 7.47441 3 7.5 3 z"></path></svg>
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