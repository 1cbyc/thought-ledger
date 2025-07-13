# Thought Ledger

(i asked chatgpt to write this for me)
A decentralized social platform for sharing thoughts and quotes on the Ethereum blockchain. Every thought is stored immutably, ensuring true ownership and censorship resistance.

## Features
- Post thoughts/quotes to the blockchain (Ethereum Goerli testnet)
- Pay a small fee per post (configurable by contract owner)
- All posts are public, immutable, and attributed to the sender's wallet
- Owner can withdraw accumulated funds
- Modern, responsive frontend (React + Vite)
- MetaMask wallet integration

## Tech Stack
- **Smart Contract:** Solidity, Hardhat, OpenZeppelin
- **Frontend:** React 18, Vite, Ethers.js, TypeScript
- **Network:** Goerli testnet (Ethereum)
- **Deployment:** Cloudflare Pages or cPanel

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- MetaMask wallet

### Smart Contract
1. Install dependencies:
   ```bash
   npm install
   ```
2. Compile contracts:
   ```bash
   npm run compile
   ```
3. Run tests:
   ```bash
   npm test
   ```
4. Deploy to Goerli:
   - Set up `.env` with `GOERLI_URL`, `PRIVATE_KEY`, and `ETHERSCAN_API_KEY`.
   - Deploy:
     ```bash
     npm run deploy:goerli
     ```

### Frontend
1. Go to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```

### Deployment
- **Cloudflare Pages:** Deploy the `client/dist` folder as a static site.
- **cPanel:** Upload the `client/dist` build to your public_html or equivalent directory.

## Documentation
- **Development Phases:** See `docs/what-next.md`
- **Interview/Explanation:** See `docs/explanation.md`

## License
MIT
