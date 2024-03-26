<template>
  <div class="flex">
    <a
      v-for="contributor in contributors.slice(
        0,
        contributors.length > 3 ? 2 : 3
      )"
      :key="contributor.id"
      :href="contributor.link"
      :title="contributor.name"
      target="_blank"
    >
      <div
        class="w-7 h-7 rounded-full border-2 border-solid border-white ml-[-8px] overflow-hidden"
      >
        <img :src="contributor.avatar" @error="loadDefaultAvatar" class="" />
      </div>
    </a>
    <div
      v-if="contributors.length > 3"
      class="w-7 h-7 rounded-full border-2 border-solid border-white ml-[-8px] bg-gray-50 text-xs font-bold text-gray-600"
    >
      <div
        class="w-full h-full border-box rounded-full border-[1px] border-solid border-gray-300 flex items-center justify-center"
      >
        +{{ contributors.length - 2 }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

defineProps({
  contributors: {
    type: Array<{
      id?: string;
      name?: string;
      avatar?: string;
      link?: string;
    }>,
    required: true,
  },
});
const loadDefaultAvatar = (e: Event) => {
  if (!e.target) return;
  console.debug({
    action: "loadDefaultAvatar",
    url: (e.target as HTMLImageElement).src,
  });
  (e.target as HTMLImageElement).src = "/image/default_avatar.png";
};
</script>
