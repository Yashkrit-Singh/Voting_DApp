import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { useNavigate } from "react-router-dom";
import Ballot from "../contracts/Ballot.json"; // Ensure this path is correct
import "./VotingPage.css"; // Import the CSS file for styling

const VotingPage = () => {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const navigate = useNavigate();

  const loadBlockchainData = async () => {
    let web3;
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum !== 'undefined') {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' }); // Request account access
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]); // Use the first account
      } else {
        // Fallback to Infura
        web3 = new Web3(process.env.REACT_APP_INFURA_URL);
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]); // Use the first account
      }

      const networkId = await web3.eth.net.getId();
      const contractData = Ballot.networks[networkId];

      if (contractData) {
        const ballotContract = new web3.eth.Contract(
          Ballot.abi,
          contractData.address
        );
        setContract(ballotContract);

        const candidateCount = await ballotContract.methods
          .candidatesCount()
          .call({ gas: 3000000 });
        const candidatesArray = [];

        for (let i = 0; i < candidateCount; i++) {
          const candidate = await ballotContract.methods.candidates(i).call();
          candidatesArray.push({ index: i });
        }
        setCandidates(candidatesArray);
      } else {
        console.error("Contract not deployed to detected network.");
      }
    } catch (error) {
      console.error("Error loading blockchain data:", error);
    }
  };

  const handleVote = async () => {
    if (selectedCandidate !== null) {
      try {
        await contract.methods
          .vote(selectedCandidate)
          .send({ from: account, gas: 3000000 });
        navigate("/results"); // Redirect to results page after voting
      } catch (error) {
        console.error("Vote failed:", error);
        alert("Already Voted");
      }
    } else {
      alert("Please select a candidate before voting.");
    }
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  return (
    <div className="voting-page">
      <div className="voting-container">
        <h1 className="voting-title">Vote for Your Candidate</h1>
        <p className="voting-description">Please select one candidate to cast your vote:</p>

        <div className="candidates-grid">
          {candidates.map((candidate) => (
            <div
              key={candidate.index}
              className={`candidate-card ${
                selectedCandidate === candidate.index ? "selected" : ""
              }`}
              onClick={() => setSelectedCandidate(candidate.index)}
            >
              <input
                type="checkbox"
                checked={selectedCandidate === candidate.index}
                onChange={() => setSelectedCandidate(candidate.index)}
                id={`candidate-${candidate.index}`}
                className="candidate-checkbox"
              />
              <label htmlFor={`candidate-${candidate.index}`}>
                Candidate {candidate.index + 1}
              </label>
            </div>
          ))}
        </div>

        <button
          className="vote-button"
          onClick={handleVote}
          disabled={selectedCandidate === null}
        >
          Submit Vote
        </button>
      </div>
    </div>
  );
};

export default VotingPage;
