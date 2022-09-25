<template>
  <div>
    <div class="mermaid" v-html="svg"></div>
  </div>
</template>

<script>
import mermaid from 'mermaid'

mermaid.mermaidAPI.initialize({
  startOnLoad:true
})

export default {
  name: "Mermaid",
  data() {
    return {
      svg: 'Empty'
    }
  },
  computed: {
    code() {
      // if we do not use `diagramType === 'mermaid' &&` this value will not change when we switch the tabs
      // we cannot use mounted to initialise svg either (see comments in `mounted`).
      return this.$store.state.diagramType === 'mermaid' && this.$store.state.mermaidCode;
    }
  },
  async mounted() {
    // When it is firstly mounted, if diagramType !== 'mermaid', v-html will not inject the svg even if svg has value.
    // This is because its parent has 'display:none'. So we cannot use mounted to inject svg node.
  },
  updated() {
    // `updated` is also not triggered when diagramType changes, even after we mapped state `diagramType` to computed properties.
  },
  watch: {
    // watch in general is not a good idea, but it seems that this is the only native way to trigger reactivity.
    // another way would be use the https://www.npmjs.com/package/vue-async-computed
    async code() {
      if (!this.code) return;
      this.svg = await this.render(this.code);
    }
  },
  methods: {
    async render(code) {
      return new Promise(resolve => {
        mermaid.mermaidAPI.render('any-id',
          code,
          (svg) => {
            resolve(svg)
          })
      })
    }
  }
}
</script>