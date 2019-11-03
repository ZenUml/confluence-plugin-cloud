<template>
  <div id="app">
    <Workspace/>
  </div>
</template>

<script>
import Workspace from './components/Workspace'

export default {
  name: 'app',
  components: {
    Workspace
  }
}
</script>

<style>
 #app {
   height: 300px;
 }
</style>
