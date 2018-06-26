<template>
  <div class="workspace">
    <div id="workspace-left" class="split editor">
      <editor/>
    </div>
    <div id="workspace-right" class="split diagram">
      <seq-diagram/>
    </div>
  </div>
</template>

<script>
  import { SeqDiagram } from 'vue-sequence'
  import Editor from './Editor.vue'
  import Split from 'split.js'

  export default {
    name: 'Workspace',
    props: {
      msg: String
    },
    mounted () {
      if (window.split) {
        Split(['#workspace-left', '#workspace-right'], { sizes: [35, 65]})
      }
    },
    components: {
      Editor,
      SeqDiagram
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .workspace {
    height: 100%;
    width: 100%;
  }

  .gutter {
    background-color: #eee;
    background-repeat: no-repeat;
    background-position: 50%;
  }

  .gutter.gutter-vertical {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFAQMAAABo7865AAAABlBMVEVHcEzMzMzyAv2sAAAAAXRSTlMAQObYZgAAABBJREFUeF5jOAMEEAIEEFwAn3kMwcB6I2AAAAAASUVORK5CYII=')
  }

  .gutter.gutter-horizontal {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==');
    cursor: ew-resize;
  }

  .view .gutter.gutter-horizontal {
    display: none;
  }

  .view .editor {
    display: none;
  }

  .view .diagram {
    width: 100%;
  }

  .split, .gutter.gutter-horizontal {
    float: left;
  }

  .split, .gutter.gutter-horizontal {
    height: 100%;
  }

  .split {
    overflow-y: auto;
    overflow-x: auto;
  }

  .container {
    width: 100%;
  }

  .hint {
    margin-bottom: 5px;
  }

  #diagram {
    /* This should be the same color as .seq-diagram*/
    background-color: #fafafa;
  }

  #editor {
    margin-top: 5px;
  }

  body {
    background-color: #fafafa;
  }
</style>
