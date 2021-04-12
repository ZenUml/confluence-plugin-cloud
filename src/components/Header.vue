<template>
  <div class="toolbar header">
    <va-radio-group :vertical="false" v-model="diagramType">
      <va-radio-btn label="zenuml">ZenUML</va-radio-btn>
      <va-radio-btn label="mermaid">Mermaid (Beta)</va-radio-btn>
    </va-radio-group>

    <a class="help" target="_blank" :href="helpUrl">
      <va-button round type="default"><va-icon type="question-circle" /></va-button>
    </a>
    <save-and-go-back-button />
  </div>
</template>

<script>
// import Macro from "@/utils/Macro";
import {mapState} from 'vuex';
import SaveAndGoBackButton from "@/components/SaveAndGoBackButton";
export default {
  name: "Header",
  components: {SaveAndGoBackButton},
  data() {
    return {
      helpUrl: 'https://zenuml.atlassian.net/wiki/spaces/Doc/overview',
    }
  },
  computed: {
    ...mapState(['code', 'styles', 'mermaidCode', 'diagramType']),
    diagramType: {
      set(type) {
        this.$store.dispatch('updateDiagramType', type)
        if (type === 'zenuml') {
          this.$store.dispatch('reloadZenUML')
        }
      },
      get() {
        return this.$store.state.diagramType || 'zenuml'
      }
    }
  },
}
</script>

<style scoped>
.header {
  display: flex;
  padding: 5px;
  background: #FFF;
  box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.2);
}

.header svg {
  margin-right: 8px;
  cursor: pointer;
}

.header .save-and-exit {
  margin-left: auto;
  text-decoration: none;
}
</style>
<style>
.view .toolbar.header {
  visibility: hidden;
}
</style>