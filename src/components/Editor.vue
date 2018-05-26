<template>
    <codemirror
            :code="code"
            :options="editorOptions"
            @change="onEditorCodeChange">
    </codemirror>
</template>

<script>
  import 'codemirror/keymap/sublime';
  export default {
    name: 'editor',
    data() {
      return {
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