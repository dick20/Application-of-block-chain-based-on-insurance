//var ConvertLib = artifacts.require('./ConvertLib.sol')
var MetaCoin = artifacts.require('./Test')
//var Test = artifacts.require('./contracts/Test.sol')

module.exports = function (deployer) {
  //deployer.deploy(ConvertLib)
  //deployer.link(ConvertLib, MetaCoin)
  deployer.deploy(MetaCoin)
  //deployer.deploy(Test)
}
