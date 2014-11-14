var url = require('url'),
    querystring = require('querystring'),
    http = require('restler'),
    Lazy = require('lazy.js'),
    Twitter = require('twitter-js-client').Twitter,
    configs = require('./configs.js');

if (process.argv.length < 3) {
    console.log('You must provide a Twitter screen name.');
    process.exit(1);
}

var client = new Twitter({
    consumerKey: configs.key,
    consumerSecret: configs.secret
});

var screenName = process.argv[2],
    error = function (err) {
        console.log('Error', err);
    },
    success = function (data) {
        var urls = [];

        JSON.parse(data).forEach(function (status) {
            if (!status.entities.media) return false;
            urls = urls.concat(Lazy(status.entities.media).pluck('media_url').toArray());
        });

        urls = Lazy(urls).chunk(10).toArray();

        var saveUrls = function (urls) {
            return http.post('http://lin.andytt.org:1337/url/new', {
                data: {
                    urls: urls
                }
            });
        };

        var cfn = function (rep) {
            if (!urls.length) return true;

            saveUrls(urls.pop()).on('complete', cfn);
        };

        saveUrls(urls.pop()).on('complete', cfn);
    };

client.getUserTimeline({
    screen_name: screenName,
    count: 200,
    include_rts: true
}, error, success);
