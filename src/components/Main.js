import React, { Component } from 'react'
import logo from '../logo.png'

class Main extends Component {
  render() {
    return (
      <div id="content">
        <img
          src={logo}
          className="App-logo"
          alt="logo"
          height="100px"
          width="250px"
        />
        <br></br>
        <h1>Add a product</h1>
      </div>
    )
  }
}

export default Main
