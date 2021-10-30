<template>
  <va-button class="save-and-exit" type="primary" icon-before="angle-left" @click="saveAndExit">Save and Go back to Confluence</va-button>
</template>

<script>
import EventBus from '../EventBus'

export default {
  name: "SaveAndGoBackButton",
  methods: {
    saveAndExit: function () {
      EventBus.$emit('save');
    }
  }
}
</script>

<style scoped>

</style>