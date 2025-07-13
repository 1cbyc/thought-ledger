import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <nav className="navbar">
        <div className="nav-brand">
          <span className="logo">🧠</span>
          <h1>Thought Ledger</h1>
        </div>
      </nav>

      <div className="main-content">
        <div className="hero-section">
          <h1>Share Your Thoughts on the Blockchain</h1>
          <p>
            A decentralized platform where you can express your thoughts and store them 
            permanently on the Ethereum blockchain. Your thoughts are immutable, 
            censorship-resistant, and truly yours.
          </p>
          <Link to="/main" className="cta-button">
            <button className="primary-btn">
              Let's Go
            </button>
          </Link>
        </div>

        <div className="features">
          <div className="feature">
            <h3>🔒 Immutable</h3>
            <p>Once posted, thoughts cannot be deleted or censored</p>
          </div>
          <div className="feature">
            <h3>🌐 Decentralized</h3>
            <p>No single entity controls your data</p>
          </div>
          <div className="feature">
            <h3>💎 Transparent</h3>
            <p>All thoughts are publicly verifiable on the blockchain</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 