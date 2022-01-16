window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }

const customDimensions = {dimension1: 'client_domain', dimension2: 'user_account_id', dimension3: 'confluence_space'};

gtag('js', new Date());
gtag('config', 'UA-114996686-1', {cookie_flags: 'max-age=7200;secure;samesite=none', custom_map: customDimensions});