<template>
  <button
    class="px-4 py-2 rounded-[18px] border-[1px] border-solid border-[#EAECF0] text-sm font-medium text-gray-700 focus:outline-none focus:border-[#004EEB] transition-colors duration-200 ease-in-out whitespace-nowrap"
    :class="{
      'text-[#004EEB] bg-[#D1E0FF] border-[#004EEB]': active,
      'hover:bg-[#EAECF0]': !active,
    }"
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

defineProps({
  active: Boolean,
});
const emit = defineEmits(["click"]);

const handleClick = (e: Event) => {
  emit("click", e);
};
</script>
