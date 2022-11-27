require("dotenv").config();
const Web3 = require("web3");
const fs = require("fs");

const tokenAddress = process.env.TOKEN_ADDRESS;
const url = process.env.URL_INF

const abi = JSON.parse(
  fs.readFileSync("artifacts/contracts/Game.sol/Game.json")
).abi;

var web3 = new Web3(new Web3.providers.HttpProvider(url));


const myContract = new web3.eth.Contract(abi, tokenAddress);

myContract.methods
  .test()
  .call()
  .then((result) => {
    console.log(result);
  });

  