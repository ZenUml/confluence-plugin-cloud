// This DebugMounter show a Debug widget on the page.
// 1. Add an element with id #debug
// 2. import this file with `import '@/components/Debug/DebugMounter.ts'`

import Vue from 'vue'
import Debug from './Debug.vue'

new Vue({
  render: h => h(Debug)
}).$mount('#debug');
