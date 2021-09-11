# Development
## How to do integration test?
1. Start firebase functions + hosting at 5000: `yarn firebase:serve`
2. Expose 5000 on air.zenuml.com: `yarn cloudflare:5000`
3. Install https://air.zenuml.com/atlassian-connect.json
4. Start vue server at 8080: `yarn start:vue`
5. Expose 8080 on air.zenuml.com: `yarn cloudflare:8080`
6. Open the page with ZenUML macro
   
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
