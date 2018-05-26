<template>
  <div class="editor">
    <div class="header">
      <span class="prompt">Write you code here.</span>
      <a class="help-link" target="_blank" :href="helpUrl">Help</a>
    </div>
    <codemirror class="dsl-editor"
      :code="code"
      :options="editorOptions"
      @change="onEditorCodeChange">
    </codemirror>
  </div>

</template>

<script>
  import 'codemirror/keymap/sublime';

  export default {
    name: 'editor',
    data() {
      return {
        helpUrl: '',
        editorOptions: {
          tabSize: 4,
          mode: 'text/javascript',
          theme: 'base16-light',
          lineNumbers: true,
          line: true,
          keyMap: "sublime",
          extraKeys: {"Ctrl": "autocomplete"},
          foldGutter: true,
          gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
          styleSelectedText: true,
          highlightSelectionMatches: {showToken: /\w/, annotateScrollbar: true}
        }
      }
    },
    methods: {
      onEditorCodeChange(newCode) {
        this.$store.dispatch('updateCode', {code: newCode})
      }
    },
    computed: {
      editor() {
        return this.$refs.myEditor.Editor
      },
      code() {
        return this.$store.state.code
      }
    }
  }
</script>

<style scoped>
  .editor {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .header {
    display: flex;
    justify-content: space-between;
  }

  .CodeMirror {
    flex-grow: 1;
  }
</style>