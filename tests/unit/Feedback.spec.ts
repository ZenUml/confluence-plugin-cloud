import { shallowMount } from '@vue/test-utils'
import GetSupport from '@/components/SendFeedback.vue'

describe('SendFeedback.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'Send feedback'
    const wrapper = shallowMount(GetSupport, {
      propsData: { msg }
    })
    expect(wrapper.text()).toMatch(msg)
  })
})
