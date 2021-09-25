# Pre-release check
1. https://zenuml-stg.atlassian.net/wiki/spaces/ZS/pages/33152/Testing+Lite+1
   1. All content loads properly except for the second one.
2. (Lite) https://zenuml-stg.atlassian.net/wiki/display/ZS/customcontent/list/ac%3Acom.zenuml.confluence-addon-lite%3Azenuml-content-sequence
   1. Open a diagram and it should load fine
3. (Lite) https://zenuml-stg.atlassian.net/wiki/display/ZS/customcontent/list/ac%3Acom.zenuml.confluence-addon-lite%3Azenuml-content-graph
   1. Open a draw io diagram and it should load fine
4. (Full) https://zenuml-stg.atlassian.net/wiki/display/ZS/customcontent/list/ac%3Acom.zenuml.confluence-addon%3Azenuml-content-sequence
   1. Open a diagram and it should load fine
5. (Full) https://zenuml-stg.atlassian.net/wiki/display/ZS/customcontent/list/ac%3Acom.zenuml.confluence-addon%3Azenuml-content-graph
   1. Open a draw io diagram and it should load fine
6. https://zenuml-stg.atlassian.net/wiki/spaces/ZS/pages/31260964/VVVff
   1. Some diagrams have data source as content-property
7. Create a new page and add a sequence, a mermaid, a draw io diagram
# Development
## How to do integration test?
1. Start firebase functions + hosting at 5000: `yarn firebase:serve`
2. Start vue server at 8080 and proxy to 5000 for descriptor: `yarn start:sit`
3. Expose 8080 on air.zenuml.com: `yarn cloudflare:8080`
4. Install https://air.zenuml.com/atlassian-connect.json
5. Open the page with ZenUML macro
   
> We need two commands `start:local` and `start:sit` because hot-reload works 
> only on one domain.

# Errors
## Addon not registered; no compatible hosts detected
Check the sub code.

### upm.pluginInstall.error.ssl
Just re-register should fix it in most times.

### connect.install.error.remote.host.bad.response.401
401 is Unauthorized (or actually means Unauthenticated). It does not make sense as all content
is public. Simply restarting fixes this issue.

### Error: Please install sqlite3 package manually
1. rm -rf node_modules
2. yarn install

### Other errors
1. Get the descriptor
1. Validate the descriptor at https://atlassian-connect-validator.herokuapp.com/validate
1. Read the schema doc with: https://json-schema.app/view/%23?url=https%3A%2F%2Fbitbucket.org%2Fatlassian%2Fconnect-schemas%2Fraw%2Fmaster%2Fconfluence-global-schema.json
