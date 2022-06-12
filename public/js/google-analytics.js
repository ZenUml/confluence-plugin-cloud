window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }

//custom dimensions are defined in Google Analytics console
const customDimensions = {dimension14: 'client_domain', dimension15: 'user_account_id', dimension16: 'confluence_space'};

gtag('js', new Date());
gtag('config', 'UA-114996686-1', {cookie_flags: 'max-age=63072000;secure;samesite=none', custom_map: customDimensions});