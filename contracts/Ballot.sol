// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Ballot {
    struct Voter {
        string name;
        string email;
        string phnno;
        uint weight;
        bool voted;
        uint votedTo;
        bool registered;
    }

    mapping (address => Voter) public voters;

    struct Candidate {
        uint votes;
    }

    Candidate[] public candidates;
    uint public candidatesCount;

    constructor(uint _totalCandidates) {
        candidatesCount = _totalCandidates;
        for (uint i = 0; i < _totalCandidates; i++) {
            candidates.push(Candidate(0));
        }
    }

    function register(address _voter, string memory _name, string memory _email, string memory _phnno) public {
        require(!voters[_voter].registered, "You have already registered");
        voters[_voter].voted = false;
        voters[_voter].name = _name;
        voters[_voter].email = _email;
        voters[_voter].phnno = _phnno;
        voters[_voter].weight = 1;
        voters[_voter].registered = true;
    }

    function vote(uint _candidateNo) public {
        Voter storage sender = voters[msg.sender];
        require(!sender.voted, "You have already voted");
        require(_candidateNo < candidates.length, "Invalid candidate");
        sender.voted = true;
        sender.votedTo = _candidateNo;
        candidates[_candidateNo].votes += sender.weight;
    }

    function findWinner() public view returns (uint winner) {
        uint votesCount = 0;
        for (uint i = 0; i < candidates.length; i++) {
            if (votesCount < candidates[i].votes) {
                votesCount = candidates[i].votes;
                winner = i;
            }   
        }
    }

    // Timing logic removed as per request
}
