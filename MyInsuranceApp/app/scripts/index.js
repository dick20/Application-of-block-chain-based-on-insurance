// Import the page's CSS. Webpack will know what to do with it.
import '../styles/app.css'

// Import libraries we need.
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import Insurance_purchaseArtifact from '../../build/contracts/Insurance_purchase.json'

// InsurancePurchase is our usable abstraction, which we'll use through the code below.
const InsurancePurchase = contract(Insurance_purchaseArtifact)

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
let accounts
let account

const App = {
  start: function () {
    const self = this

    // Bootstrap the InsurancePurchase abstraction for Use.
    InsurancePurchase.setProvider(window.web3.currentProvider)

    // Get the initial account balance so it can be displayed.
    window.web3.eth.getAccounts(function (err, accs) {
      if (err != null) {
        alert('There was an error fetching your accounts.')
        return
      }

      if (accs.length === 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.")
        return
      }

      accounts = accs
      account = accounts[0]
      document.getElementById('account-address').innerHTML = account;
    })

    console.log(window.web3.isConnected())
  },

  confirmCompany: function () {
    const self = this

    let meta
    InsurancePurchase.deployed().then(function (instance) {
      meta = instance
      console.log(meta)
      meta.ComfirmCompany.call(account[0], {from: account[0], value: 999999999999999999999999999999})
    }).catch(function (e) {
      console.log(e)
    })
  },

  setStatus: function (message) {
    const status = document.getElementById('status')
    status.innerHTML = message
  },

  sendCoin: function () {
    const self = this

    const amount = parseInt(document.getElementById('amount').value)
    const receiver = document.getElementById('receiver').value

    this.setStatus('Initiating transaction... (please wait)')

    let meta
    InsurancePurchase.deployed().then(function (instance) {
      meta = instance
      return meta.sendCoin(receiver, amount, { from: account })
    }).then(function () {
      self.setStatus('Transaction complete!')
      self.refreshBalance()
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error sending coin; see log.')
    })
  },

  changeAccount: function (){
    const self = this

    const account_id = parseInt(document.getElementById('account-input').value)
    if (account_id < 10 && account_id > 0) 
    {
      account = accounts[account_id]
      document.getElementById('account-address').innerHTML = account;
    }
    else{
      document.getElementById('account-address').innerHTML = "no such an account!";
    }
    console.log('changeAccount')
  },

  buyInsurance: function(){
    const self = this

    const insurance_id = parseInt(document.getElementById('buy-insurance-id').value)

    let meta
    InsurancePurchase.deployed().then(function (instance) {
      meta = instance
      console.log('BuyInsurance')
      return meta.BuyInsurance(insurance_id)
    }).then(function () {
      self.setStatus('You have purchased the No.'+ insurance_id + ' insurance!')
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error sending coin; see log.')
    })
  },

  comfirmHospital: function(){
    const self = this

    const hospital_address = document.getElementById('hospital-address').value

    let meta
    InsurancePurchase.deployed().then(function (instance) {
      meta = instance
      console.log('comfirmHospital')
      return meta.BuyInsurance(hospital_address)
    }).then(function () {
      self.setStatus('You have comfirm the '+ hospital_address + ' hospital!')
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error sending coin; see log.')
    })
  },

  createInsurance: function(){
    const self = this

    const insurance_id = parseInt(document.getElementById('create-insurance-id').value)
    const insurance_name = document.getElementById('create-insurance-name').value
    const insurance_price = parseInt(document.getElementById('create-insurance-price').value)
    const insurance_compensation = parseInt(document.getElementById('create-insurance-compensation').value)

    let meta
    InsurancePurchase.deployed().then(function (instance) {
      meta = instance
      console.log('createInsurance')
      return meta.CreateInsurance(insurance_id,insurance_name,insurance_price,insurance_compensation)
    }).then(function () {
      self.setStatus('You have purchased the No.'+ insurance_id + ' insurance!')
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error sending coin; see log.')
    })
  },

  expiredInsurance:function(){
    const self = this

    const purchaser_address = document.getElementById('purchaser-address').value

    let meta
    InsurancePurchase.deployed().then(function (instance) {
      meta = instance
      console.log('expiredInsurance')
      return meta.ExpiredInsurance(purchaser_address)
    }).then(function () {
      self.setStatus('The insurance of' + purchaser_address +' has expired!')
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error sending coin; see log.')
    })
  },

  getCompensation:function(){
    const self = this

    const pacient_address = document.getElementById('pacient-address').value

    let meta
    InsurancePurchase.deployed().then(function (instance) {
      meta = instance
      console.log('getCompensation')
      return meta.GetCompensation(pacient_address)
    }).then(function () {
      self.setStatus('The ' +hospital_address +' pacient have got the compensation!')
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error sending coin; see log.')
    })
  },

  returnInsurance:function(){
    const self = this

    const insurance_id = parseInt(document.getElementById('return-insurance-id').value)

    let meta
    InsurancePurchase.deployed().then(function (instance) {
      meta = instance
      console.log('returnInsurance')
      return meta.ReturnInsurance(insurance_id)
    }).then(function () {
      self.setStatus('You have returned the No.'+ insurance_id + ' insurance!')
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error sending coin; see log.')
    })
  }

}

window.App = App

window.addEventListener('load', function () {
  window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'))
  console.log(window.web3.isConnected())
  App.start()
  console.log(window.web3.isConnected())
})
