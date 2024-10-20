import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import Ballot from "../contracts/Ballot.json";
import "./RegisterPage.css"; // Import the CSS file for styling

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phnno: "",
  });
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const navigate = useNavigate();

  const loadBlockchainData = async () => {
    let web3;
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum !== 'undefined') {
        // Use MetaMask's provider
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
        const ballotContract = new web3.eth.Contract(Ballot.abi, contractData.address);
        setContract(ballotContract);
      } else {
        console.error("Contract not deployed to detected network.");
      }
    } catch (error) {
      console.error("Error loading blockchain data:", error);
    }
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!account) {
      console.error("No Ethereum account found");
      return;
    }

    if (!contract) {
      console.error("Smart contract not loaded");
      return;
    }

    try {
      await contract.methods
        .register(account, formData.name, formData.email, formData.phnno)
        .send({ from: account, gas: 3000000 });

      console.log("Registered successfully!");
      navigate("/vote");
    } catch (error) {
      alert("Already Registered");
    }
  };

  return (
    <div className="register-page">
      <div className="form-container">
        <h1 className="form-title">Register to Vote</h1>
        <form onSubmit={handleSubmit} className="register-form">
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="form-input"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="form-input"
            required
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={formData.phnno}
            onChange={(e) => setFormData({ ...formData, phnno: e.target.value })}
            className="form-input"
            required
          />
          <button type="submit" className="form-button">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
