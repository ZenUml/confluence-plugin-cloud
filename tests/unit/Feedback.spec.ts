import { shallowMount } from '@vue/test-utils'
import SendFeedback from '@/components/SendFeedback.vue'
import { trackEvent } from '@/utils/window'
import {vi} from "vitest";

vi.mock('@/utils/window', () => ({
  trackEvent: vi.fn()
}))

describe('SendFeedback.vue', () => {
  it('renders the element with the "discussion" class', () => {
    const wrapper = shallowMount(SendFeedback)
    expect(wrapper.find('.discussion').exists()).toBe(true)
  })

  it('emits a trackClickEvent method when clicked', async () => {
    const wrapper = shallowMount(SendFeedback)
    await wrapper.find('.discussion').trigger('click')
    expect(trackEvent).toHaveBeenCalledWith('discussion', 'click', 'help')
  })
})
