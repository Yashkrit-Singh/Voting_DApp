const Ballot = artifacts.require("Ballot");

module.exports = function (deployer) {
    // Pass the necessary argument(s) to the contract's constructor
    deployer.deploy(Ballot, 10);
};