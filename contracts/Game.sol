pragma solidity >=0.6.0 <0.9.0;

import "../libs/GameLogic.sol";
import "../interfaces/IRPS.sol";

contract Game is IRPS {
    using GameLogic for Move;

    mapping(address => mapping(address => Player)) private players;
    mapping(address => mapping(address => Winner)) private winners;
    mapping(address => mapping(address => Move)) private moves;

    function test() public view returns (string memory) {
        return "test works";
    }
    function gameStart(address _opponentAddress) external
        isGameStarted(_opponentAddress) correctAddress(_opponentAddress) {
        players[msg.sender][_opponentAddress] = Player.PlayerOne;
        players[_opponentAddress][msg.sender] = Player.PlayerTwo;
    }

    function getPlayer(address _opponentAddress) external view
        correctAddress(_opponentAddress) returns (Player) {
        return players[msg.sender][_opponentAddress];
    }

    function makeMove(address _opponentAddress, Move _move) external 
    correctMove(_move) correctAddress(_opponentAddress) hasNum(_opponentAddress) {
        clearWinners(_opponentAddress);
        moves[msg.sender][_opponentAddress] = _move;
        bool senderIsPlayerOne = players[msg.sender][_opponentAddress] ==
            Player.PlayerOne;
        if (senderIsPlayerOne) {
            winners[msg.sender][_opponentAddress] = moves[msg.sender][
                _opponentAddress
            ].getWinner(moves[_opponentAddress][msg.sender]);
            winners[_opponentAddress][msg.sender] = winners[msg.sender][
                _opponentAddress
            ];
        } else {
            winners[msg.sender][_opponentAddress] = moves[_opponentAddress][
                msg.sender
            ].getWinner(moves[msg.sender][_opponentAddress]);
            winners[_opponentAddress][msg.sender] = winners[msg.sender][
                _opponentAddress
            ];
        }
        if (winners[msg.sender][_opponentAddress] != Winner.InProgress) {
            clearMoves(_opponentAddress);
            if (senderIsPlayerOne) {
                emit EndGame(
                    msg.sender,
                    _opponentAddress,
                    winners[msg.sender][_opponentAddress]
                );
            } else {
                emit EndGame(
                    _opponentAddress,
                    msg.sender,
                    winners[msg.sender][_opponentAddress]
                );
            }
        }
    }

    function getWinner(address _opponentAddress) external view
        correctAddress(_opponentAddress) returns (Winner) {
        return winners[msg.sender][_opponentAddress];
    }

    function clearWinners(address _opponentAddress) private {
        winners[msg.sender][_opponentAddress] = Winner.InProgress;
        winners[_opponentAddress][msg.sender] = Winner.InProgress;
    }

    function clearMoves(address _opponentAddress) private {
        moves[msg.sender][_opponentAddress] = Move.NoMove;
        moves[_opponentAddress][msg.sender] = Move.NoMove;
    }

    modifier isGameStarted(address _opponentAddress) {
        require(
            players[msg.sender][_opponentAddress] == Player.Unknown ||
                players[_opponentAddress][msg.sender] == Player.Unknown,
            "Game already is progress"
        );
        _;
    }

    modifier hasNum(address _opponentAddress) {
        require(
            players[msg.sender][_opponentAddress] != Player.Unknown,
            "Game not started"
        );
        _;
    }

    modifier correctAddress(address _opponentAddress) {
        require(
            msg.sender != _opponentAddress,
            "Invalid opponent (can't play with self)"
        );
        _;
    }
    
    modifier correctMove(Move _move) {
        require(_move != Move.NoMove, "Invalid makeMove");
        _;
    }
}
