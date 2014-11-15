(function () {
    const envFileName = '.env.json';
    const validators = {
        Twitter: ['key', 'secret'],
        URL: ['baseurl', 'URI']
    };

    var Lazy = require('lazy.js');

    try {
        var envConfigs = require('./' + envFileName);
    } catch (e) {
        console.log('Environment file', envFileName, 'not exists.');
        process.exit(1);
    }

    validateConfigs(envConfigs)

    module.exports = envConfigs;

    function validateConfigs(envConfigs)
    {
        Lazy(validators).keys().each(function (key) {
            if (!envConfigs[key]) {
                console.log('You have to provide', key, 'in', envFileName);
                process.exit(1);
            }

            var validatorsRemained = Lazy(validators[key]).without(Lazy(envConfigs[key]).keys());
            if (validatorsRemained.size()) {
                console.log('You have to provide', validatorsRemained.join(', '), 'in', key);
                process.exit(1);
            }
        });
    }
})();
