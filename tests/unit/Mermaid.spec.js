import {mount} from '@vue/test-utils'
import Mermaid from '../../src/components/Mermaid'

describe('Mermaid', () => {
  it('should render a mermaid diagram', () => {
    const mermaid = mount(Mermaid)
    const exist = mermaid.find('div')
    expect(exist).toBeTruthy()
    expect(mermaid.text()).toContain('Mermaid Diagram')
  })
})