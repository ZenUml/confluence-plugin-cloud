Error running install script for optional dependency: "/Users/pengxiao/workspaces/zenuml/confluence-plugin/node_modules/fsevents:


Some old verson of `fsevent` is not compatible with Node ^10. But why this happends only after we added typescript?
I do not know.


Cannot find module 'eslint-plugin-@typescript-eslint'
Update eslint to ^7.

# TS2351: This expression is not constructable.
Type 'typeof import("/Users/pengxiao/workspaces/zenuml/zenuml-core/types/index")' has no construct signatures.

Add `export default ZenUml;` to index.d.ts.
