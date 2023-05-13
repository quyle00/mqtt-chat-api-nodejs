const _ = require('lodash');
const dayjs = require('dayjs');
const dayjsPluginUTC = require('dayjs-plugin-utc');
dayjs.extend(dayjsPluginUTC.default);
const aqp = require('api-query-params');

/**
 * 2020-05-08: Fix bug filter in sub table & pagination
 */

/**
 *
 * @param filter and paging
 * @param rootQuery
 * @returns {{hasPaging: boolean, query: *}}
 */
module.exports = async (params, rootQuery = {}) => {
    if (_.has(params, 'id')) {
        params._id = params.id;
        delete params.id;
    }
    if (_.has(params, 'limit') && _.has(params, 'page')) {
        params.skip = params.limit * (params.page - 1);
        delete params.page;
    }
    let result = await aqp(params);
    result.hasPaging = false;
    if (result.limit != undefined) {
        result.hasPaging = true;
        if (result.skip == undefined) {
            result.skip = 0;
        }
    }
    return result;
};
