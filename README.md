# Grove - Mindful Moments on the Blockchain

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://grove-wellness-dapp.web.app/)

> A sanctuary for tracking your mindful moments on the blockchain. Connect your wallet to begin cultivating your digital wellness garden and earn badges for your journey toward inner peace.

## ◆ Overview

Grove is a decentralized application (DApp) that gamifies mindfulness and wellness practices using blockchain technology. Users can log their meditation sessions, wellness activities, and mindful moments while earning NFT badges as achievements. Each moment is recorded on-chain, creating an immutable record of your wellness journey.

## ◆ Features

- **Wallet Integration** — Connect with MetaMask and other Web3 wallets
- **Activity Logging** — Track meditation, yoga, journaling, and other wellness activities
- **NFT Badge System** — Earn unique blockchain-based badges for milestones
- **Digital Wellness Garden** — Visualize your progress and growth over time
- **On-Chain Records** — Immutable tracking of your mindfulness journey
- **Progress Analytics** — View insights into your wellness habits

## ◆ Tech Stack

### Frontend
- **React** — UI framework
- **JavaScript/CSS/HTML** — Core web technologies
- **Web3.js/Ethers.js** — Blockchain interaction

### Backend & Blockchain
- **Solidity** — Smart contract development
- **Firebase** — Hosting and backend services
- **Ethereum/Polygon** — Blockchain network

### Development Tools
- **Node.js** — Runtime environment
- **npm/yarn** — Package management
- **Hardhat/Truffle** — Smart contract development framework

## ◆ Usage

1. **Connect Your Wallet** — Click "Connect Wallet" and approve the connection
2. **Log a Moment** — Record your meditation or wellness activity
3. **Earn Badges** — Complete milestones to receive NFT badges
4. **Track Progress** — View your wellness garden and statistics

## ◆ Project Structure

```
grove-wellness-dapp/
├── .firebase/          # Firebase configuration
├── .github/            # GitHub workflows and CI/CD
├── public/             # Static assets
├── src/                # React application source
│   ├── components/     # Reusable UI components
│   ├── contracts/      # Smart contract ABIs
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Page components
│   ├── utils/          # Helper functions
│   └── App.js          # Main application component
├── BADGE_SYSTEM.md     # Badge system documentation
├── README.md           # This file
├── firebase.json       # Firebase configuration
└── package.json        # Dependencies and scripts
```

## ◆ Smart Contract Architecture

The project uses a modular smart contract system:

- **GroveToken.sol** — Main wellness tracking contract
- **BadgeNFT.sol** — NFT badge minting and management
- **ActivityLogger.sol** — On-chain activity recording

### Key Functions

```solidity
// Log a mindful moment
function logActivity(string memory activityType, uint256 duration) public

// Mint achievement badge
function mintBadge(address recipient, uint256 milestoneId) public

// Get user statistics
function getUserStats(address user) public view returns (UserStats memory)
```

## ◆ Security Considerations

- Smart contracts follow OpenZeppelin standards
- Input validation on all user submissions
- Rate limiting on activity logging
- Secure wallet connection handling
- No private keys stored in the application

## ◆ Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## ◆ License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ◆ Acknowledgments

- Built with inspiration from the mindfulness and Web3 communities
- Special thanks to OpenZeppelin for secure smart contract libraries
- Icons and design elements from various open-source resources

## ◆ Contact

**Sreya Nair** — [@NairSreya](https://github.com/NairSreya)

Project Link: [https://github.com/NairSreya/Grove](https://github.com/NairSreya/Grove)

Live Demo: [https://grove-wellness-dapp.web.app/](https://grove-wellness-dapp.web.app/)

---

<p align="center">Cultivate mindfulness, one block at a time</p>
