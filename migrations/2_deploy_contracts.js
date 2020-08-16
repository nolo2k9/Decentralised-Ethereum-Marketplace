const Marketplace = artifacts.require("Marketplace");

//deploy to blockchain
module.exports = function(deployer) {
  deployer.deploy(Marketplace);
};
