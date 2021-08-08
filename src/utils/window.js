const gtag = window.gtag;

export function getUrlParam (param) {
    const matches = (new RegExp(param + '=([^&]*)')).exec(window.location.search);
    return matches && matches[1] && decodeURIComponent(matches[1]);
}

export function trackEvent(pageId, event, category) {
    /* eslint-disable no-undef */
    gtag && gtag('event', event, {'event_category': category, 'event_label' : pageId});
}