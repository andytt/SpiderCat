(function () {
    var url = require('url'),
        querystring = require('querystring'),
        Lazy = require('lazy.js'),
        Twitter = require('twitter-js-client').Twitter,
        configs = require('./configs.js'),
        URL = require('./services/URL.js'),
        async = require('async');

    if (process.argv.length < 3) {
        console.log('You must provide a Twitter screen name.');
        process.exit(1);
    }

    var client = new Twitter({
        consumerKey: configs.Twitter.key,
        consumerSecret: configs.Twitter.secret
    });

    var screenName = process.argv[2],
        error = function (err) {
            console.log(err);
        },
        success = function (data) {
            var urls = [];

            JSON.parse(data).forEach(function (status) {
                if (!status.entities.media) return false;
                urls = urls.concat(Lazy(status.entities.media).pluck('media_url').toArray());
            });

            urls = Lazy(urls).chunk(10).toArray();

            async.eachSeries(urls, function (url, callback) {
                URL.save(url).on('complete', function (rep) {
                    callback();
                });
            });
        };

    client.getUserTimeline({
        screen_name: screenName,
        count: 200,
        include_rts: true
    }, error, success);
})();
