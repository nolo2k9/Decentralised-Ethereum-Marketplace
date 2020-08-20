import React, { Component } from 'react'
import Web3 from 'web3'

import './App.css'
import Marketplace from '../abis/Marketplace.json'
import Navbar from './Navbar'
import Main from './Main'

class App extends Component {
  componentDidMount() {
    document.title = 'Blockchain Marketplace'
  }
  //runs when load web3 is created
  async componentWillMount() {
    await this.loadWeb3()
    //load
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      //connect to blockchain
      window.web3 = new Web3(window.ethereum)
      //enable
      await window.ethereum.enable()
    }
    //legacy broswer
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    //if neither exist
    else {
      window.alert(
        'Non-Ethereum browser detected. You should consider trying MetaMask!',
      )
    }
  }
  //load accounts from blockchain
  async loadBlockchainData() {
    const web3 = window.web3
    //load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    //logging abi and network address
    const networkid = await web3.eth.net.getId()
    const networkData = Marketplace.networks[networkid]

    if (networkData) {
      const marketplace = new web3.eth.Contract(
        Marketplace.abi,
        networkData.address,
      )
      this.setState({ marketplace: marketplace })
      const productCount = await marketplace.methods.productCount().call()
      console.log(productCount.toString())
      this.setState({ loading: false })
    } else {
      window.alert('Marketplace contract not deployed to a dedicated networka')
    }
  }
  constructor(props) {
    super(props)
    this.state = {
      account: '',
      productCount: 0,
      products: [],
      loading: true,
    }
    this.createProduct = this.createProduct.bind(this)
  }
  createProduct(name, price){
    this.setState({loading: true})
    this.state.marketplace.methods.createProduct(name, price).send({from: this.state.account}).once('receipt', (receipt)=>{
      this.setState({loading: false})
    })
  }
  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              {this.state.loading ? <div id ="loader" className="text-center"><p className = "text-center"> Loading...</p> </div> 
              : <Main createProduct={this.createProduct}/> }
            </main>
          </div>
        </div>
      </div>
    )
  }
}

export default App
