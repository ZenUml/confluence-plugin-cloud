<template>
<div>
  <div v-show="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
    <h1 class="font-bold">Error</h1>
    <p class="sm:inline">{{error && error.message}}</p>
    <p class="code">{{error && error.data}}</p>
    <p class="code">{{error && error.stack}}</p>
    <p>To get support, submit a ticket at
      <a target="_blank" class="font-bold underline" href="https://zenuml.atlassian.net/servicedesk/customer/portals">our help desk</a>.
      Please include the above error message in your ticket.
    </p>
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