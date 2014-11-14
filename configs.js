(function () {
    var configs = {},
        fs      = require('fs'),
        Lazy    = require('lazy.js');

    const validators = {
        Twitter: ['key', 'secret']
    };

    const envFileName = '.env.json',
        currentFileName = Lazy(process.argv[1]).split('/').last(),
        currentSpiderName = Lazy(currentFileName).split('.').first();

    if (!fs.existsSync(envFileName)) {
        console.log('Environment file not exists.');
        process.exit(1);
    }

    var envConfigs = JSON.parse(fs.readFileSync(envFileName, 'utf8'));

    validateConfigs(envConfigs)

    configs = envConfigs[currentSpiderName];

    module.exports = configs;

    function validateConfigs(envConfigs)
    {
        var currentSpiderConfigs = Lazy(envConfigs[currentSpiderName]).keys(),
            validatorsRemain = Lazy(validators[currentSpiderName]).without(currentSpiderConfigs);

        if (validatorsRemain.size()) {
            console.log('You have to provide these configs:', validatorsRemain.join(', '), 'in', currentSpiderName);
            process.exit(1);
        }
    }
})();
