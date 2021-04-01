# Development
## How to do integration test?
1. Create a tunnel: <br> 
   `cloudflared --hostname air.zenuml.com --url http://localhost:3000`
   <br>Note that a. the local server must be started at port 3000;
   b. it has been given a hostname `air.zenuml.com`.
1. Start the local server with auto-registration:<br>
   `AC_LOCAL_BASE_URL=https://air.zenuml.com npm start`
   
# Errors
## Addon not registered; no compatible hosts detected
Check the sub code.

### upm.pluginInstall.error.ssl
Just re-register should fix it in most times.

### connect.install.error.remote.host.bad.response.401
401 is Unauthorized (or actually means Unauthenticated). It does not make sense as all content
is public. Simply restarting fixes this issue.

### Other errors
1. Get the descriptor
1. Validate the descriptor at https://atlassian-connect-validator.herokuapp.com/validate
1. Read the schema doc with: https://json-schema.app/view/%23?url=https%3A%2F%2Fbitbucket.org%2Fatlassian%2Fconnect-schemas%2Fraw%2Fmaster%2Fconfluence-global-schema.json
