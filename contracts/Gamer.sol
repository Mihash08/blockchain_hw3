pragma solidity = 0.8.17;


import "../libs/GameLogic.sol";
import "../interfaces/IRPS.sol";

contract Gamer {
    IRPS gameContract;

    constructor(IRPS _gameContract) {
        gameContract = _gameContract;
    }

    function gameStart(address _opponentAddress) external {
        gameContract.gameStart(_opponentAddress);
    }
}