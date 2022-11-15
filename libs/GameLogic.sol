// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.9.0;

enum Move {
    NoMove,
    Rock,
    Paper,
    Scissors
}

enum Winner {
    InProgress,
    PlayerOneWin,
    PlayerTwoWin,
    Draw
}

enum Player {
    Unknown,
    PlayerOne,
    PlayerTwo
}

library GameLogic {
    function getWinner(Move firstPlayerMove, Move secondPlayerMove)
        internal
        pure
        returns (Winner _result)
    {
        if (firstPlayerMove == Move.NoMove || secondPlayerMove == Move.NoMove) {
            return Winner.InProgress;
        }
        if (firstPlayerMove == Move.Rock) {
            if (secondPlayerMove == Move.Rock) {
                return Winner.Draw;
            }
            if (secondPlayerMove == Move.Paper) {
                return Winner.PlayerTwoWin;
            }
            if (secondPlayerMove == Move.Scissors) {
                return Winner.PlayerOneWin;
            }
        }
        if (firstPlayerMove == Move.Paper) {
            if (secondPlayerMove == Move.Rock) {
                return Winner.PlayerOneWin;
            }
            if (secondPlayerMove == Move.Paper) {
                return Winner.Draw;
            }
            if (secondPlayerMove == Move.Scissors) {
                return Winner.PlayerTwoWin;
            }
        }
        if (firstPlayerMove == Move.Scissors) {
            if (secondPlayerMove == Move.Rock) {
                return Winner.PlayerTwoWin;
            }
            if (secondPlayerMove == Move.Paper) {
                return Winner.PlayerOneWin;
            }
            if (secondPlayerMove == Move.Scissors) {
                return Winner.Draw;
            }
        }
    }
}
