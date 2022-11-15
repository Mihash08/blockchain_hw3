require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");

require("dotenv").config();

const privateKey = process.env.PRIVATE_KEY;
const endpoint = process.env.URL;
const apiKey = process.env.API;

module.exports = {
  solidity: "0.8.8",
  networks: {
    goerli: {
      url: `${endpoint}${apiKey}`,
      accounts: [privateKey]
    }
  }
}