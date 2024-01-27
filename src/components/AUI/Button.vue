<template>
  <button
    class="text-white px-3 py-1 rounded-[3px]"
    :style="{ backgroundColor: bgColor, color: textColor }"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    type: {
      type: String,
      default: 'default',
      validator: (value: string): boolean => ['default', 'primary', 'warning', 'danger'].includes(value),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    bgColor(): string {
      const colors: Record<string, string> = {
        default: "#091e4224",
        primary: "#0C66E4",
        warning: "#E2B203",
        danger: "#CA3521",
        disabled: "#091E4208"
      };
      return colors[(this.disabled && "disabled") || this.type];
    },
    textColor(): string {
      const colors: Record<string, string> = {
        default: "#172B4D",
        primary: "#fff",
        warning: "#172B4D",
        danger: "#fff",
        disabled: "#091E424F"
      };
      return colors[(this.disabled && "disabled") || this.type];
    },
  },
  methods: {
    handleClick() {
      this.$emit('click');
    },
  },
});
</script>