<template>
  <va-button class="save-and-exit" type="primary" icon-before="angle-left" @click="saveAndExit">Save and Go back to Confluence</va-button>
</template>

<script>
export default {
  name: "SaveAndGoBackButton",
  props: ['saveAndExit'],
}
</script>

<style scoped>

</style>