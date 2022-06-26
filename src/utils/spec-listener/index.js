// eslint-disable-next-line
// @ts-ignore
window.specContent = '';

export const updateSpec = (ori) => (...args) => {
  let [spec] = args
  ori(...args)

  console.log('---------- spec:', spec)
  window.specContent = spec;
}

export default function(system) {
  console.log('---------- system.specActions.updateSpec:', system.specActions.updateSpec)
  window.updateSpec = system.specActions.updateSpec;

  return {
    statePlugins: {
      spec: {
        wrapActions: {
          updateSpec
        }
      }
    }
  }
}
