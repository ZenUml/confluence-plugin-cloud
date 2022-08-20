Init self test is a process that tests the system for basic functionality.
The first reason to add this is to ensure that all clients can access our new subdomain - https://conf-full.zenuml.com.
However, it may not be a practical solution. So that we can test the new subdomain, we need to deploy this to the old
domain.

# Necessity
This is a you-never-know-until-it-is-reported scenario. If the new subdomain is not accessible, we will not know it has
happened unless the client let us know as what MA did.

The chance is very low though.

# Steps
1. Find the last version (`cc90a`) we deployed for the Full license App.
2. Create a branch `test-conf-full-zenuml-com` from there.
3. At google-analytics.js, add a method to fetch from the new subdomain.
4. If it fails, track the event.
5. Deploy branch `test-conf-full` to the old domain for the Full license App.
6. Wait for a week and make sure no errors are reported.
7. Deploy to the new subdomain.

# Complexity

We will need to discard this change later as it test