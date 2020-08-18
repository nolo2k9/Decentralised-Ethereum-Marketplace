import React, { Component } from 'react';
import Web3 from 'web3';
import logo from '../logo.png';
import './App.css';

class App extends Component {
    //runs when load web3 is created
    async componentWillMount(){
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
          window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
      }
      //load accounts from blockchain
      async loadBlockchainData(){
        const web3 = window.web3
        //load account
        const accounts = await web3.eth.getAccounts()
        this.setState({ account: accounts[0] })
      }
      constructor(props){
          super(props)
          this.state = {
              account: ''
          }
      }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
          >
            Blockchain Marketplace
          </a>
          <ul className="navbar-nav px-3">
              <li className="nav-item text-nowrap d-none d-smnone d-sm-block">
                  <small className="text-white"><span id="account"><b>ACCOUNT:</b>   {this.state.account}</span></small>
              </li>
          </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={logo} className="App-logo" alt="logo" />
                </a>
                <h1></h1>
                <p>
                  Edit <code>src/components/App.js</code> and save to reload.
                </p>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;