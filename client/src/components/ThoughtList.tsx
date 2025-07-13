import { useEffect, useState } from "react";
import "./ThoughtList.css";

interface State {
  provider: any;
  signer: any;
  contract: any;
}

interface ThoughtListProps {
  state: State;
}

interface Thought {
  name: string;
  message: string;
  timestamp: bigint;
  sender: string;
  thoughtId: bigint;
}

const ThoughtList = ({ state }: ThoughtListProps) => {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchThoughts = async () => {
      if (!state.contract) return;

      try {
        setLoading(true);
        const allThoughts = await state.contract.getAllThoughts();
        setThoughts(allThoughts);
      } catch (error) {
        console.error("Error fetching thoughts:", error);
        setError("Failed to load thoughts");
      } finally {
        setLoading(false);
      }
    };

    fetchThoughts();
  }, [state.contract]);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="thought-list">
        <h2>Thoughts on the Blockchain</h2>
        <div className="loading">Loading thoughts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="thought-list">
        <h2>Thoughts on the Blockchain</h2>
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="thought-list">
      <h2>Thoughts on the Blockchain ({thoughts.length})</h2>
      
      {thoughts.length === 0 ? (
        <div className="empty-state">
          <p>No thoughts posted yet. Be the first to share your thought!</p>
        </div>
      ) : (
        <div className="thoughts-grid">
          {thoughts.map((thought, index) => (
            <div key={index} className="thought-card">
              <div className="thought-header">
                <span className="thought-name">{thought.name}</span>
                <span className="thought-id">#{thought.thoughtId.toString()}</span>
              </div>
              
              <div className="thought-message">
                {thought.message}
              </div>
              
              <div className="thought-footer">
                <span className="thought-sender">
                  From: {formatAddress(thought.sender)}
                </span>
                <span className="thought-time">
                  {formatTimestamp(thought.timestamp)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThoughtList; 