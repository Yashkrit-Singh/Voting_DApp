import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { useNavigate } from "react-router-dom";
import Ballot from "../contracts/Ballot.json"; // Ensure this path is correct
import "./ResultsPage.css"; // Import the CSS file for styling

const ResultsPage = () => {
    const [candidates, setCandidates] = useState([]);
    const [winner, setWinner] = useState(null);
    const navigate = useNavigate();

    const loadResults = async () => {
        try {
            let web3;
            // Check if MetaMask is installed
            if (typeof window.ethereum !== 'undefined') {
                web3 = new Web3(window.ethereum);
                await window.ethereum.request({ method: 'eth_requestAccounts' }); // Request account access
            } else {
                // Fallback to Infura
                web3 = new Web3(process.env.REACT_APP_INFURA_URL);
            }

            const accounts = await web3.eth.getAccounts();
            const networkId = await web3.eth.net.getId();
            const contractData = Ballot.networks[networkId];

            if (contractData) {
                const ballotContract = new web3.eth.Contract(Ballot.abi, contractData.address);

                // Get candidates count
                const candidateCount = await ballotContract.methods.candidatesCount().call();
                const candidatesArray = [];

                for (let i = 0; i < candidateCount; i++) {
                    const candidate = await ballotContract.methods.candidates(i).call();
                    candidatesArray.push({ index: i, votes: Number(candidate) }); // Access the votes property correctly
                }

                setCandidates(candidatesArray);

                // Find the winner
                const winnerIndex = await ballotContract.methods.findWinner().call();
                setWinner(Number(winnerIndex));
            } else {
                console.error("Contract not deployed to detected network.");
            }
        } catch (error) {
            console.error("Error loading results:", error);
        }
    };

    useEffect(() => {
        loadResults();
    }, []);

    return (
        <div className="results-page">
            <div className="results-container">
                <h1 className="results-title">Voting Results</h1>
                <h2 className="winner-announcement">
                    {winner !== null ? `🎉 Winner: Candidate ${winner + 1}! 🎉` : "Calculating..."}
                </h2>

                <table className="results-table">
                    <thead>
                        <tr>
                            <th>Candidate</th>
                            <th>Votes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {candidates.map((candidate) => (
                            <tr key={candidate.index} className={winner === candidate.index ? 'winner-row' : ''}>
                                <td>Candidate {candidate.index + 1}</td>
                                <td>{candidate.votes}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <button className="vote-again-button" onClick={() => navigate('/vote')}>
                    Vote Again
                </button>
            </div>
        </div>
    );
};

export default ResultsPage;
