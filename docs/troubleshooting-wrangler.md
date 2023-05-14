
## Warning: The compatibility_date has not been defined.
It is important to note that Pages and Workers are separate things,
and the `wrangler init` command does not apply to Pages. Instead of 
using a wrangler.toml configuration file, Pages should be configured, 
including setting a compatibility date, via the Cloudflare dashboard. 
When running Pages locally, the `--compatibility-date` flag should be 
used. For more information and assistance, please refer to the 
wrangler pages dev --help command.
