<template>
  <va-button class="save-and-exit fixed right-3 top-1 z-50" type="primary" icon-before="angle-left" @click="saveAndExit">Save and Go back to Confluence</va-button>
</template>

<script>
export default {
  name: "SaveAndGoBackButton",
  props: ['saveAndExit'],
}
</script>

<style scoped>

</style>