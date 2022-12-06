const { expect } = require("chai");
const { ethers } = require("hardhat");

const Player = {
  Unknown: 0,
  PlayerOne: 1,
  PlayerTwo: 2,
};

describe("Gamer.sol", () => {
  let game;
  let alice;
  let aliceAddress;
  let gamer;

  beforeEach(async () => {
    [owner, alice] = await ethers.getSigners();
    aliceAddress = await alice.getAddress();

    const gameFactory = await ethers.getContractFactory("Game");
    game = await gameFactory.deploy();

    const gamerFactory = await ethers.getContractFactory("Gamer");
    gamer = await gamerFactory.deploy(game.address);
  });

  describe("gameStart", () => {
    it("should start game and assign player numbers", async () => {
      await gamer.gameStart(aliceAddress);
      let playerRole = await game.connect(gamer.address).getPlayer(aliceAddress);
      let aliceRole = await game.connect(aliceAddress).getPlayer(gamer.address);
      expect(playerRole).to.equal(Player.PlayerOne);
      expect(aliceRole).to.equal(Player.PlayerTwo);
    });
  });
});