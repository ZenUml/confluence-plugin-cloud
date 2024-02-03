<template>
  <div class="absolute top-0 left-0">
    <DrawIoHeader :title="title" @editTitle="handleEdit" />
    <CreateGraph
      :defaultTitle="doc?.title"
      :visible="modalVisible"
      :forEnforceTitle="Boolean(doc?.id)"
      :onConfirm="handleConfirm"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import CreateGraph from "./components/CreateGraph.vue";
import DrawIoHeader from "./components/DrawIoHeader.vue";
export default defineComponent({
  components: {
    CreateGraph,
    DrawIoHeader
  },
  props: {
    doc: {
      type: Object
    }
  },
  setup(props) {
    const modalVisible = ref(false);
    const title = ref("Untitled");
    const handleEdit = () => {
      modalVisible.value = true;
    };
    const handleConfirm = (value: string) => {
      modalVisible.value = false;
      title.value = value;
      window.diagram.title = value;
    };
    onMounted(() => {
      if (props.doc?.id) {
        if (!props.doc.title) return
        title.value = props.doc.title;
      } else {
        modalVisible.value = true;
      }
    });
    return {
      modalVisible,
      title,
      handleEdit,
      handleConfirm
    };
  }
});
</script>

<style scoped></style>
