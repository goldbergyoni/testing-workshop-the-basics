let configurationData, initialState;

class Configuration {
    // ❗️Fetches config from slow sources like DB, etcd
    async start() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (!configurationData) {
                    configurationData = {
                        allowDiscount: true
                    }
                    initialState = Object.assign({}, configurationData);
                }

                resolve();
            }, 1);
        });
    }

    async stop() {
        // Not doing anything - Used to simulate teardown hook
    }

    restoreToInitialState() {
        configurationData = Object.assign({}, initialState);
    }

    // Example: {allowDiscount: false, maxDiscountAllowed: 0.2}
    getConfig() {
        return configurationData;
    }
}

module.exports = new Configuration();


