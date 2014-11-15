(function () {
    var configs = require('../configs.js'),
        http = require('restler');

    var replaceRegex = /^\/|\/$/g;

    const targetURL = [
        configs.URL.baseurl.trim().replace(replaceRegex, ''),
        configs.URL.URI.trim().replace(replaceRegex, '')
    ].join('/');

    var service = {};

    service.save = function (urls) {
        return http.post(targetURL, {
            data: {
                urls: urls
            }
        });
    };

    module.exports = service;
})();
