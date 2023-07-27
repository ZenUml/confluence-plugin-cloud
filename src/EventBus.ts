import { reactive, readonly } from 'vue'

const state = reactive(new Map())

export function EventBus() {
  const $emit = (event: any, ...args: any) => {
    const callbacks = state.get(event)
    if (callbacks) {
      callbacks.forEach((callback: Function) => callback(...args))
    }
  }

  const $on = (event: any, callback: Function) => {
    const callbacks = state.get(event) || new Set()
    callbacks.add(callback)
    state.set(event, callbacks)
  }

  const $off = (event: any, callback: Function) => {
    const callbacks = state.get(event)
    if (callbacks) {
      callbacks.delete(callback)
    }
  }

  return {
    $emit,
    $on,
    $off,
    state: readonly(state)
  }
}

export default EventBus()
