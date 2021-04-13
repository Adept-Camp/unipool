const UnipoolFactory = artifacts.require('./UnipoolFactory.sol');
const Unipool = artifacts.require('./Unipool.sol');
const UnipoolMock = artifacts.require('./UnipoolMock.sol');
const UnipoolForeignPairMock = artifacts.require('./UnipoolMock.sol');
const HoneyTokenMock = artifacts.require('./HoneyTokenMock.sol');
const AC_TOKEN_XDAI_ADDRESS = '0x5f1F81de1D21b97a5d0D5d62d89BDE9DdEc27325';
const OtherTokenMock = artifacts.require('./UniswapTokenMock.sol');
const AnotherTokenMock = artifacts.require('./UniswapTokenMock.sol');
const UniswapPairMock = artifacts.require('./UniswapPairMock.sol');
const UniswapForeignPairMock = artifacts.require('./UniswapPairMock.sol');
const UniswapRouterMock = artifacts.require('./UniswapRouterMock.sol');

const argValue = (arg, defaultValue) => process.argv.includes(arg) ? process.argv[process.argv.indexOf(arg) + 1] : defaultValue;
const network = () => argValue('--network', 'xdai');

module.exports = async function (deployer) {
    if (network() === 'xdai') {
        await deployer.deploy(UnipoolFactory);
    } else {
        const senderAccount = (await web3.eth.getAccounts())[0];
        const BN = web3.utils.toBN;
        await deployer.deploy(Migrations);
        await deployer.deploy(UnipoolFactory, AC_TOKEN_XDAI_ADDRESS);
        await deployer.deploy(HoneyTokenMock, senderAccount);
        await deployer.deploy(OtherTokenMock);
        await deployer.deploy(UniswapPairMock, HoneyTokenMock.address, OtherTokenMock.address);

        const uniswapToken = await UniswapPairMock.at(UniswapPairMock.address);
        await uniswapToken.mint(senderAccount, BN(1000).mul(BN(10).pow(BN(18))));

        await deployer.deploy(AnotherTokenMock);
        await deployer.deploy(UniswapForeignPairMock, AnotherTokenMock.address, OtherTokenMock.address);
        const uniswapToken2 = await UniswapForeignPairMock.at(UniswapForeignPairMock.address);
        await uniswapToken2.mint(senderAccount, BN(1000).mul(BN(10).pow(BN(18))));

        await deployer.deploy(UniswapRouterMock);

        await deployer.deploy(UnipoolMock, uniswapToken.address, HoneyTokenMock.address, UniswapRouterMock.address);
        await deployer.deploy(UnipoolForeignPairMock, uniswapToken2.address, HoneyTokenMock.address, UniswapRouterMock.address);
       
    }
};
