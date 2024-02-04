<template>
  <div class="absolute flex h-8 w-[100vw] bg-[#f1f3f4] pl-[10px] py-1">
    <div class="flex items-center text-lg cursor-pointer" @click="handleEditTitle">
      <div>{{ title }}</div>
      <IconEdit class="text-gray-600 pl-1"  />
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import IconEdit from "@/components/icons/IconEdit.vue";

export default defineComponent({
  components: {
    IconEdit,
  },
  props: {
    title: {
      type: String,
      default: "",
    },
  },
  methods: {
    handleEditTitle() {
      this.$emit("editTitle");
    },
  },
});
</script>

<style scoped></style>
