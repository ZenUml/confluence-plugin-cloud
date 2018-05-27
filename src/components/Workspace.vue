<template>
  <div class="workspace">
    <div id="workspace-left" class="split">
      <editor/>
    </div>
    <div id="workspace-right" class="split">
      <seq-diagram/>
    </div>
  </div>
</template>

<script>
  import Editor from './Editor.vue'
  import { SeqDiagram, Store } from 'vue-sequence'
  import Split from 'split.js'

  export default {
    name: 'Workspace',
    props: {
      msg: String
    },
    mounted () {
      Split(['#workspace-left', '#workspace-right'], { sizes: [35, 65]})
    },
    components: {
      Editor,
      SeqDiagram
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .workspace {
    height: 100%;
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
    height: 480px;
    margin-top: -10px;
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
    background-color: #f5f5f5;
  }
</style>
