//var ConvertLib = artifacts.require('./ConvertLib.sol')
var insurance = artifacts.require('./Insurance_purchase.sol')
//var Test = artifacts.require('./contracts/Test.sol')

module.exports = function (deployer) {
  //deployer.deploy(ConvertLib)
  //deployer.link(ConvertLib, MetaCoin)
  deployer.deploy(insurance, {gas:6721975, from:"0xff697c26f79c7b5213f5703a340d0f7fd42afe62"})
  //deployer.deploy(Test)
}
