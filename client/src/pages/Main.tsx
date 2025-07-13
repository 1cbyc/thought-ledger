import { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./Main.css";
import ThoughtForm from "../components/ThoughtForm";
import ThoughtList from "../components/ThoughtList";

interface State {
  provider: any;
  signer: any;
  contract: any;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}

const Main = () => {
  const [state, setState] = useState<State>({
    provider: null,
    signer: null,
    contract: null,
  });
  const [account, setAccount] = useState("Not Connected");
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const connectWallet = async () => {
      try {
        const { ethereum } = window;
        
        if (!ethereum) {
          alert("Please install MetaMask!");
          return;
        }

        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });

        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);

          const provider = new ethers.BrowserProvider(ethereum);
          const signer = await provider.getSigner();
          
          // Contract address will be updated after deployment
          const contractAddress = "0x0000000000000000000000000000000000000000"; // Placeholder
          const contractABI: any[] = []; // Will be updated with actual ABI
          
          const contract = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
          );

          setState({ provider, signer, contract });

          // Listen for account changes
          ethereum.on("accountsChanged", () => {
            window.location.reload();
          });
        }
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    };

    connectWallet();
  }, []);

  return (
    <div className="main">
      <div className="header">
        <h1>Thought Ledger 🧠</h1>
        <div className="wallet-info">
          <span className="connection-status">
            {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
          </span>
          <span className="account">
            {account !== "Not Connected" 
              ? `${account.slice(0, 6)}...${account.slice(-4)}`
              : account
            }
          </span>
        </div>
      </div>

      <div className="content">
        {isConnected ? (
          <>
            <ThoughtForm state={state} />
            <ThoughtList state={state} />
          </>
        ) : (
          <div className="connect-prompt">
            <h2>Connect Your Wallet</h2>
            <p>Please connect your MetaMask wallet to start sharing thoughts on the blockchain.</p>
            <button 
              className="connect-btn"
              onClick={() => window.location.reload()}
            >
              Connect Wallet
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Main; 