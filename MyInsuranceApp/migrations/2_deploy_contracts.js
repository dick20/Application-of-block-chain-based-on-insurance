//var ConvertLib = artifacts.require('./ConvertLib.sol')
var insurance = artifacts.require('./Insurance_purchase')
//var Test = artifacts.require('./contracts/Test.sol')

module.exports = function (deployer) {
  //deployer.deploy(ConvertLib)
  //deployer.link(ConvertLib, MetaCoin)
  deployer.deploy(insurance(
	{_insurance_id:[1,2],
	 _insurance_name:['0x11','0x22'],
	 _purchase_amount:[10000,20000],
	 _compensation:[100000,300000]
	}
  	))
  //deployer.deploy(Test)
}
