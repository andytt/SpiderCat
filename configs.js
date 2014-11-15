(function () {
    var configs = {},
        fs      = require('fs'),
        Lazy    = require('lazy.js');

    const validators = {
        Twitter: ['key', 'secret'],
        URL: ['baseurl', 'URI']
    };

    const envFileName = '.env.json';

    if (!fs.existsSync(envFileName)) {
        console.log('Environment file not exists.');
        process.exit(1);
    }

    var envConfigs = JSON.parse(fs.readFileSync(envFileName, 'utf8'));

    validateConfigs(envConfigs)

    configs = envConfigs;

    module.exports = configs;

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
