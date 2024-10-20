import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css"; // Import the CSS file for styling

const LandingPage = () => {
  const [account, setAccount] = useState("");
  const [connected, setConnected] = useState(false);
  const navigate = useNavigate();

  const loadBlockchainData = async () => {
    try {
      // Check if MetaMask is installed and available
      if (typeof window.ethereum !== 'undefined') {
        const web3 = new Web3(window.ethereum); // Use MetaMask's provider
        await window.ethereum.request({ method: 'eth_requestAccounts' }); // Request account access
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]); // Use the first account
        setConnected(true);
      } else {
        // Fallback to Infura if MetaMask is not available
        const web3 = new Web3(process.env.REACT_APP_INFURA_URL);
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]); // Use the first account
        setConnected(true);
      }
    } catch (error) {
      console.error("Error loading blockchain data:", error);
    }
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <div className="landing-page">
      <div className="landing-content">
        <h1 className="landing-title">Welcome to the Voting DApp</h1>
        {connected ? (
          <>
            <p className="landing-text">Connected Account: {account}</p>
            <button className="landing-button" onClick={handleRegisterClick}>
              Register Yourself
            </button>
          </>
        ) : (
          <p className="landing-text">Please connect to MetaMask.</p>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
