// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.9.0;

import "../libs/GameLogic.sol";

interface IRPS {
    event EndGame(
        address indexed playerOne,
        address indexed playerTwo,
        Winner result
    );

    function gameStart(address _opponentAddress) external;

    function getPlayer(address _opponentAddress) external view returns (Player);

    function makeMove(address _opponentAddress, Move _move) external;

    function getWinner(address _opponentAddress) external view returns (Winner);

}
