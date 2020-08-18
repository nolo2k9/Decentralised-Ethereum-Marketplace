import React, { Component } from 'react'


class Navbar extends Component {
  

  render() {
    return (
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <small className="text-white">
            <a>
              <b>Blockchain Marketplace</b>
            </a>
          </small>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-smnone d-sm-block">
              <small className="text-white">
                <span id="account">
                  <b>ACCOUNT:</b> {this.props.account}
                </span>
              </small>
            </li>
          </ul>
        </nav>
     
    )
  }
}

export default Navbar
