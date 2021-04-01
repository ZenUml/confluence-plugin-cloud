<template>
  <div class="content">
    <Header />
    <div class="workspace">
      <div id="workspace-left" class="split editor">
        <editor/>
      </div>
      <div id="workspace-right" class="split diagram">
        <Viewer />
        <div class="get-support-container">
          <get-support/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Editor from './Editor.vue'
  import GetSupport from './GetSupport'
  import Split from 'split.js'
  import Header from "@/components/Header";
  import Viewer from "@/components/Viewer";

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
      Header,
      GetSupport,
      Editor,
      Viewer
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

.content {
  height: 100%;
}

.workspace {
  height: calc(100% - 50px);
  margin-top: 5px;
}

#workspace-right .get-support-container {
  display: block;
  position: absolute;
  bottom: 5px;
  left: 11px;
}

#workspace-right {
  position: relative;
}

.gutter {
  background-color: #eee;
  background-repeat: no-repeat;
  background-position: 50%;
}

.gutter.gutter-horizontal {
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==');
  cursor: ew-resize;
}

.split, .gutter.gutter-horizontal {
  float: left;
  height: 100%;
}

.split {
  overflow-y: auto;
  overflow-x: auto;
}

/*Do not show get support icon in view mode.*/
.view #workspace-right .get-support-container {
  display: none;
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

</style>
