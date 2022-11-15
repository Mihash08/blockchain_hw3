const { expect } = require("chai");
const { ethers } = require("hardhat");

const Player = {
  Unknown: 0,
  PlayerOne: 1,
  PlayerTwo: 2,
};

const Move = {
  NoMove: 0,
  Rock: 1,
  Paper: 2,
  Scissors: 3,
};

const Result = {
  InProgress: 0,
  PlayerOneWin: 1,
  PlayerTwoWin: 2,
  Draw: 3,
};


describe("Game.sol", () => {
  let game;
  let alice;
  let aliceAddress;
  let bob;
  let bobAddress;

  beforeEach(async () => {
    [owner, alice, bob] = await ethers.getSigners();
    aliceAddress = await alice.getAddress();
    bobAddress = await bob.getAddress();
    gameFactory = await ethers.getContractFactory("Game");
    game = await gameFactory.deploy();
  });

  describe("gameStart", () => {
    it("should start game and assign player numbers", async () => {
      await game.connect(alice).gameStart(bobAddress);
      let aliceNum = await game.connect(alice).getPlayer(bobAddress);
      let bobNum = await game.connect(bob).getPlayer(aliceAddress);
      expect(aliceNum).to.equal(Player.PlayerOne);
      expect(bobNum).to.equal(Player.PlayerTwo);
    });
    it("players unknown if game is not started", async () => {
      let aliceNum = await game.connect(alice).getPlayer(bobAddress);
      let bobNum = await game.connect(bob).getPlayer(aliceAddress);
      expect(aliceNum).to.equal(Player.Unknown);
      expect(bobNum).to.equal(Player.Unknown);
    });
    it("should fail if game already started", async () => {
      await game.connect(alice).gameStart(bobAddress);
      await expect(
        game.connect(alice).gameStart(bobAddress)
      ).to.be.revertedWith("Game already is progress");
      await expect(
        game.connect(bob).gameStart(aliceAddress)
      ).to.be.revertedWith("Game already is progress");
    });
    it("should fail by trying to start against yourself", async () => {
      await expect(
        game.connect(alice).gameStart(aliceAddress)
      ).to.be.revertedWith("Invalid opponent (can't play with self)");
    });
  });

  describe("makeMove", () => {
    describe("basic moves", () => {
      it("works correctly in playerOne did nothing", async () => {
        await game.connect(alice).gameStart(bobAddress);
        await game.connect(bob).makeMove(aliceAddress, Move.Rock);
        let winnerAliceSide = await game.connect(alice).getWinner(bobAddress);
        let winnerBobSide = await game.connect(bob).getWinner(aliceAddress);
        expect(winnerAliceSide).to.equal(Result.InProgress);
        expect(winnerBobSide).to.equal(Result.InProgress);
      });
      it("works correctly if playerTwo did nothing", async () => {
        await game.connect(alice).gameStart(bobAddress);
        await game.connect(alice).makeMove(bobAddress, Move.Rock);
        let winnerAliceSide = await game.connect(alice).getWinner(bobAddress);
        let winnerBobSide = await game.connect(bob).getWinner(aliceAddress);
        expect(winnerAliceSide).to.equal(Result.InProgress);
        expect(winnerBobSide).to.equal(Result.InProgress);
      });

      it("rock vs paper is playerTwo win", async () => {
        await game.connect(alice).gameStart(bobAddress);
        await game.connect(alice).makeMove(bobAddress, Move.Rock);
        await game.connect(bob).makeMove(aliceAddress, Move.Paper);
        let winnerAliceSide = await game.connect(alice).getWinner(bobAddress);
        let winnerBobSide = await game.connect(bob).getWinner(aliceAddress);
        expect(winnerAliceSide).to.equal(Result.PlayerTwoWin);
        expect(winnerBobSide).to.equal(Result.PlayerTwoWin);
      });
      it("rock vs scissors is playerOne win", async () => {
        await game.connect(alice).gameStart(bobAddress);
        await game.connect(alice).makeMove(bobAddress, Move.Rock);
        await game.connect(bob).makeMove(aliceAddress, Move.Scissors);
        let winnerAliceSide = await game.connect(alice).getWinner(bobAddress);
        let winnerBobSide = await game.connect(bob).getWinner(aliceAddress);
        expect(winnerAliceSide).to.equal(Result.PlayerOneWin);
        expect(winnerBobSide).to.equal(Result.PlayerOneWin);
      });
      it("rock vs rock is draw", async () => {
        await game.connect(alice).gameStart(bobAddress);
        await game.connect(alice).makeMove(bobAddress, Move.Rock);
        await game.connect(bob).makeMove(aliceAddress, Move.Rock);
        let winnerAliceSide = await game.connect(alice).getWinner(bobAddress);
        let winnerBobSide = await game.connect(bob).getWinner(aliceAddress);
        expect(winnerAliceSide).to.equal(Result.Draw);
        expect(winnerBobSide).to.equal(Result.Draw);
      });

      it("paper vs rock is playerOne win", async () => {
        await game.connect(alice).gameStart(bobAddress);
        await game.connect(alice).makeMove(bobAddress, Move.Paper);
        await game.connect(bob).makeMove(aliceAddress, Move.Rock);
        let winnerAliceSide = await game.connect(alice).getWinner(bobAddress);
        let winnerBobSide = await game.connect(bob).getWinner(aliceAddress);
        expect(winnerAliceSide).to.equal(Result.PlayerOneWin);
        expect(winnerBobSide).to.equal(Result.PlayerOneWin);
      });
      it("paper vs scissors is playerTwo win", async () => {
        await game.connect(alice).gameStart(bobAddress);
        await game.connect(alice).makeMove(bobAddress, Move.Paper);
        await game.connect(bob).makeMove(aliceAddress, Move.Scissors);
        let winnerAliceSide = await game.connect(alice).getWinner(bobAddress);
        let winnerBobSide = await game.connect(bob).getWinner(aliceAddress);
        expect(winnerAliceSide).to.equal(Result.PlayerTwoWin);
        expect(winnerBobSide).to.equal(Result.PlayerTwoWin);
      });
      it("paper vs paper is draw", async () => {
        await game.connect(alice).gameStart(bobAddress);
        await game.connect(alice).makeMove(bobAddress, Move.Paper);
        await game.connect(bob).makeMove(aliceAddress, Move.Paper);
        let winnerAliceSide = await game.connect(alice).getWinner(bobAddress);
        let winnerBobSide = await game.connect(bob).getWinner(aliceAddress);
        expect(winnerAliceSide).to.equal(Result.Draw);
        expect(winnerBobSide).to.equal(Result.Draw);
      });
      
      it("scissors vs rock is playerTwo win", async () => {
        await game.connect(alice).gameStart(bobAddress);
        await game.connect(alice).makeMove(bobAddress, Move.Scissors);
        await game.connect(bob).makeMove(aliceAddress, Move.Rock);
        let winnerAliceSide = await game.connect(alice).getWinner(bobAddress);
        let winnerBobSide = await game.connect(bob).getWinner(aliceAddress);
        expect(winnerAliceSide).to.equal(Result.PlayerTwoWin);
        expect(winnerBobSide).to.equal(Result.PlayerTwoWin);
      });
      it("scissors vs paper is playerOne win", async () => {
        await game.connect(alice).gameStart(bobAddress);
        await game.connect(alice).makeMove(bobAddress, Move.Scissors);
        await game.connect(bob).makeMove(aliceAddress, Move.Paper);
        let winnerAliceSide = await game.connect(alice).getWinner(bobAddress);
        let winnerBobSide = await game.connect(bob).getWinner(aliceAddress);
        expect(winnerAliceSide).to.equal(Result.PlayerOneWin);
        expect(winnerBobSide).to.equal(Result.PlayerOneWin);
      });
      it("scissors vs scissors is draw", async () => {
        await game.connect(alice).gameStart(bobAddress);
        await game.connect(alice).makeMove(bobAddress, Move.Scissors);
        await game.connect(bob).makeMove(aliceAddress, Move.Scissors);
        let winnerAliceSide = await game.connect(alice).getWinner(bobAddress);
        let winnerBobSide = await game.connect(bob).getWinner(aliceAddress);
        expect(winnerAliceSide).to.equal(Result.Draw);
        expect(winnerBobSide).to.equal(Result.Draw);
      });
    });
    it("should fail if game not started", async () => {
      await expect(
        game.connect(alice).makeMove(bobAddress, Move.Paper)
      ).to.be.revertedWith("Game not started");
    });
    it("should fail if invalide makeMove", async () => {
      await game.connect(alice).gameStart(bobAddress);
      await expect(
        game.connect(alice).makeMove(bobAddress, Move.NoMove)
      ).to.be.revertedWith("Invalid makeMove");
    });
  });
});
