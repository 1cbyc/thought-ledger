import { useState } from "react";
import { ethers } from "ethers";
import "./ThoughtForm.css";

interface State {
  provider: any;
  signer: any;
  contract: any;
}

interface ThoughtFormProps {
  state: State;
}

const ThoughtForm = ({ state }: ThoughtFormProps) => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !message.trim()) {
      setError("Please fill in both name and message");
      return;
    }

    if (!state.contract) {
      setError("Contract not connected");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const postingFee = ethers.parseEther("0.0001");
      
      const tx = await state.contract.postThought(name, message, {
        value: postingFee,
      });

      await tx.wait();
      
      // Clear form
      setName("");
      setMessage("");
      
      // Refresh the page to show new thought
      window.location.reload();
      
    } catch (error) {
      console.error("Error posting thought:", error);
      setError("Failed to post thought. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="thought-form">
      <h2>Share Your Thought</h2>
      <p className="fee-info">
        Posting fee: 0.0001 ETH (covers gas fees and platform costs)
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Your Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            maxLength={50}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="message">Your Thought:</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Share your thought, quote, or message..."
            maxLength={500}
            rows={4}
            required
          />
          <span className="char-count">
            {message.length}/500 characters
          </span>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button 
          type="submit" 
          className="submit-btn"
          disabled={isSubmitting || !state.contract}
        >
          {isSubmitting ? "Posting..." : "Post Thought"}
        </button>
      </form>
    </div>
  );
};

export default ThoughtForm; 