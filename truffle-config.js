require('dotenv').config()
const TruffleConfig = require('@aragon/truffle-config-v5/truffle-config')
const HDWalletProvider = require('@truffle/hdwallet-provider')


const MNEMONIC = process.env.MNEMONIC
// See <http://truffleframework.com/docs/advanced/configuration>
// to customize your Truffle configuration!

TruffleConfig.networks.development = {
    host: 'localhost',
    port: 7545,
    network_id: '*',
    gas: 8000000,
    gasPrice: 1000000000, // web3.eth.gasPrice
};

TruffleConfig.networks.xdai = {
   provider: function() {
       return new HDWalletProvider(
           process.env.MNEMONIC,
           "https://rpc.xdaichain.com/"
       )
   },
   network_id: 100,
   gas: 2000000
}

TruffleConfig.networks.rinkeby.skipDryRun = true;
TruffleConfig.networks.rinkeby.gasPrice = 2e11; // 100 Gwei

// UPDATE TO AN ACCEPTABLE GAS PRICE
TruffleConfig.networks.mainnet.gasPrice = 2e11; // 100 Gwei

TruffleConfig.compilers = {
    solc: {
        version: '0.5.12',
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            }
        }
    }
};

TruffleConfig.mocha = { // https://github.com/cgewecke/eth-gas-reporter
    reporter: 'eth-gas-reporter',
    reporterOptions : {
        currency: 'USD',
        gasPrice: 10,
        onlyCalledMethods: true,
        showTimeSpent: true,
        excludeContracts: ['Migrations']
    }
};

TruffleConfig.plugins = ['truffle-plugin-verify'];

TruffleConfig.api_keys = {
    etherscan: "Etherscan API Key"
};

module.exports = TruffleConfig;

