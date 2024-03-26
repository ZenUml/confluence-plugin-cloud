<template>
  <div v-text="desc || 'Unknown'" class="py-1 px-2 rounded-full text-xs" :class="[colors, bgColors]" />
</template>

<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps({
  type: {
    type: String,
    required: true,
  },
});

const desc = {
  sequence: "Sequence",
  mermaid: "Mermaid",
  graph: "Graph",
  OpenAPI: "OpenAPI",
}[props.type];
const colors = {
  sequence: "text-[#536FFF]",
  mermaid: "text-[#DE517B]",
  graph: "text-[#955102]",
  OpenAPI: "text-[#08895A]",
}[props.type];
const bgColors = {
  sequence: "bg-[#D1E0FF80]",
  mermaid: "bg-[#FFEBF1]",
  graph: "bg-[#FFF7ED]",
  OpenAPI: "bg-[#ECFDF5]",
}[props.type];
</script>
