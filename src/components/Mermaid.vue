<template>
  <div>
    {{code}}
  </div>
</template>

<script>
  export default {
    computed: {
      code() {
        return this.$store.state.mermaidCode
      }
    },
  }
</script>

<style scoped>

</style>