<template>
  <transition name="fade">
    <div
      v-if="open"
      class="fixed max-w-[300px] bottom-4 right-4 z-50 bg-white text-[#172B4D] p-5 rounded-lg drop-shadow-[0_30px_30px_rgba(31,55,121,0.35)]"
    >
      <div class="flex">
        <img
          alt="Peng Xiao, Co-founder @ZenUML"
          class="w-10 h-10 rounded-full border border-[#091e4224] bg-white/20 pointer-events-none select-none"
          src="data:image/jpeg;base64,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"
        />
        <div class="ml-2 font-medium">
          <p class="text-sm">Peng Xiao</p>
          <p class="text-xs opacity-70">Co-founder @ZenUML</p>
        </div>
      </div>
      <p class="font-medium mt-4 after:content-['*'] after:text-red-500">
        How would you rate your overall experience with ZenUML on Confluence?
      </p>
      <div class="mt-3 flex justify-between text-sm">
        <div
          v-for="value in score"
          :key="value"
          @click="handleClick(value)"
          class="bg-[#f1f2f4] w-9 h-9 rounded-lg p-1.5 group hover:bg-[#e4e6ea] duration-200 cursor-pointer"
        >
          <span
            class="text-[#7A869A] border-2 border-[#7A869A] duration-200 flex justify-center items-center rounded-full h-full w-full"
          >
            {{ value }}
          </span>
        </div>
      </div>
      <div class="mt-1 text-xs text-[#172B4D]/70 flex justify-between">
        <span>Very bad</span>
        <span>Very good</span>
      </div>
      <div class="flex text-xs mt-10 justify-between">
        <a
          target="_blank"
          @click="handlePopTooFrequentlyClick"
          data-event-label="csat_too_frequent"
          class="hover:underline"
          href="https://zenuml.atlassian.net/servicedesk/customer/portals"
        >
          Pop too frequently?</a
        >
        <a
          target="_blank"
          @click="handleTellUsMoreClick"
          data-event-label="csat_tell_us_more"
          class="hover:underline"
          href="https://github.com/orgs/ZenUml/discussions"
          >Tell us more</a
        >
      </div>
      <transition name="fade">
        <div
          class="absolute inset-0 bg-inherit rounded-lg flex items-center justify-center"
          v-if="submitted"
        >
          <span class="text-center"> Thanks for your feedback :) </span>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, ref} from "vue";
import useCSATState from "@/hooks/useCSATState";
import { trackEvent } from "@/utils/window";

const score = [1, 2, 3, 4, 5];
const submitted = ref(false);
const open = ref(false);
const { checkStateOfCSAT, updateStateOfCSAT } = useCSATState();

let timer: number;

onMounted(async () => {
  const isPopped = await checkStateOfCSAT();
  if (!isPopped) {
    timer = setTimeout(() => {
      open.value = true;
    }, 1000 * 60)
  }
});

onUnmounted(() => {
  clearTimeout(timer)
});

const handlePopTooFrequentlyClick = () =>
  trackEvent("csat", "csat_too_frequent", "operation");

const handleTellUsMoreClick = () =>
  trackEvent("csat", "csat_tell_us_more", "operation");

const handleClick = (value: number) => {
  setTimeout(() => {
    submitted.value = true;
    trackEvent("csat", "click", "operation", {
      csat_value: value,
    });
  }, 1000);

  setTimeout(() => {
    open.value = false;
    submitted.value = false;
    updateStateOfCSAT();
  }, 3000);
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transition-delay: 1500ms;
}
</style>
