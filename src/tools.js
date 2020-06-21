const Apify = require('apify');
const { EnumURLTypes } = require('./constants');

const { log } = Apify.utils;
log.setLevel(log.LEVELS.DEBUG);

exports.log = log;

exports.splitUrl = (url) => url.split('?')[0];

exports.goToNextPage = async ({ requestQueue, page, request, itemCount, maxItems }) => {
    log.debug('Max items before go to next page:', maxItems, itemCount);
    if (itemCount >= maxItems) {
        return;
    }

    const doesNotHaveNextPage = await page.$eval('.pagination-next', (pagination) => {
        return Array.from(pagination.classList).includes('disabled');
    });

    console.log('Has next:', !doesNotHaveNextPage);

    if (doesNotHaveNextPage) {
        return;
    }

    const searchParams = new URLSearchParams(request.url);
    const pageNumber = Number(searchParams.get('page')) || 1;

    searchParams.set('page', pageNumber + 1);

    await requestQueue.addRequest({ url: unescape(searchParams.toString()) });
};

exports.getUrlType = (url = '') => {
    let type = null;

    if (url.match(/upwork\.com\/*$/)) {
        type = EnumURLTypes.START_URL;
    }

    if (url.match(/upwork\.com\/hire.+/)) {
        type = EnumURLTypes.CATEGORY;
    }

    if (url.match(/upwork\.com\/search\/profiles.+/)) {
        type = EnumURLTypes.PROFILE_SEARCH;
    }

    if (url.match(/upwork\.com\/search\/jobs.+/)) {
        type = EnumURLTypes.JOB_SEARCH;
    }

    if (url.match(/upwork\.com\/o\/profiles\/users.+/)) {
        type = EnumURLTypes.PROFILE;
    }

    return type;
};
