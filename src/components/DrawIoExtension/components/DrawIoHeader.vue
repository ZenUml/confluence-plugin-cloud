<template>
  <div class="absolute h-8 w-[100vw] bg-[#f1f3f4] pl-[10px] py-1">
    <div class="text-lg cursor-pointer" @click="handleEditTitle">
      {{ title }}
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    title: {
      type: String,
      default: ""
    }
  },
  methods: {
    handleEditTitle() {
      this.$emit("editTitle");
    }
  }
});
</script>

<style scoped></style>
