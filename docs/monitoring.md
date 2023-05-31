We have four monitoring tools:
1. Google Analytics (to be deprecated);
2. Sentry (to be deprecated);
3. Cloudflare Zaraz;
4. Persistent events in Cloudflare R2.

In this document, we will discuss how to use Cloudflare Zaraz and R2.

## Cloudflare Zaraz

## Cloudflare R2

### Create a R2 bucket

Dashboard -> R2 -> Create a bucket ("atlassian-events")

### Bind it to Pages Functions

Dashboard -> Workers & Pages -> Overview

Bind the bucket to the following sites:
1. conf-stg-full
2. conf-stg-lite
3. conf-full
4. conf-lite

Site name -> Settings -> Functions -> R2 bucket bindings.

Use the following settings:
1. Variable name: `EVENT_BUCKET`
2. R2 bucket: `atlassian-events`

Add it for both "Production" and "Preview" to avoid surprises.
