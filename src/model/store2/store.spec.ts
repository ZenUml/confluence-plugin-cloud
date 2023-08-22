import store from './index';

describe('Store', function () {
  it('should have default values', function () {
    expect(store.state.diagram.mermaidCode).toBe('');
  });

  it('can update mermaid code', () => {
    store.commit('updateMermaidCode', 'graph TD; A1-->B1;');
    expect(store.state.diagram.mermaidCode).toBe('graph TD; A1-->B1;');
  })
});
