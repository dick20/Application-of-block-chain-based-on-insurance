//var ConvertLib = artifacts.require('./ConvertLib.sol')
var insurance = artifacts.require('./Insurance_purchase.sol')
//var Test = artifacts.require('./contracts/Test.sol')

module.exports = function (deployer) {
  //deployer.deploy(ConvertLib)
  //deployer.link(ConvertLib, MetaCoin)
  deployer.deploy(insurance)
  //deployer.deploy(Test)
}
