# Aryan Certificate Portal

A production-ready decentralized application for issuing and verifying internship certificates as NFTs on the blockchain.

## 🎯 Features

- **Blockchain-Verified**: Issue tamper-proof certificates as ERC-721 NFTs
- **Role-Based Access**: Admin and issuer roles with granular permissions
- **Batch Minting**: Upload CSV to mint multiple certificates
- **Public Verification**: Anyone can verify certificate authenticity
- **QR Codes**: Each certificate includes a QR code for easy verification
- **Beautiful UI**: Modern, responsive design with glassmorphism
- **Testnet Ready**: Deploy to Polygon Amoy or Base Sepolia

## 🏗️ Tech Stack

### Smart Contracts
- Solidity ^0.8.20
- Hardhat
- OpenZeppelin Contracts
- ERC-721 Standard

### Frontend
- React + TypeScript
- Vite
- Wagmi + RainbowKit (Web3 integration)
- TailwindCSS
- shadcn/ui components

### Blockchain
- Polygon Amoy Testnet (primary)
- Base Sepolia Testnet (fallback)

## 📦 Project Structure

```
aryan-certificate-portal/
├── contracts/                 # Smart contracts & deployment
│   ├── InternCertificateNFT.sol
│   ├── hardhat.config.js
│   ├── scripts/deploy.js
│   └── test/
├── src/
│   ├── components/           # React components
│   │   ├── admin/           # Admin dashboard components
│   │   ├── verify/          # Verification components
│   │   └── ui/              # Reusable UI components
│   ├── config/              # Configuration files
│   ├── lib/                 # Utility functions
│   ├── pages/               # Page components
│   └── types/               # TypeScript types
└── public/                  # Static assets
```

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- npm or yarn
- MetaMask or compatible Web3 wallet
- Testnet tokens (Polygon MATIC or Base ETH)

### 1. Clone & Install
```bash
git clone <YOUR_GIT_URL>
cd aryan-certificate-portal
npm install
```

### 2. Deploy Smart Contract
```bash
cd contracts
npm install
cp .env.example .env
# Edit .env with your private key
npm run compile
npm run test
npm run deploy:amoy  # or deploy:base
```

### 3. Configure Frontend
Update `src/config/web3.ts` with:
- Deployed contract address
- WalletConnect Project ID

### 4. Run Development Server
```bash
npm run dev
```

Visit http://localhost:8080

## 📖 Documentation

For complete deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🔑 Key Contracts

### InternCertificateNFT
Main certificate contract with features:
- Mint single/batch certificates
- Revoke certificates
- Verify authenticity
- Role-based permissions
- Metadata hash verification

## 🌐 Network Info

### Polygon Amoy Testnet
- RPC: https://rpc-amoy.polygon.technology
- Chain ID: 80002
- Explorer: https://amoy.polygonscan.com
- Faucet: https://faucet.polygon.technology/

### Base Sepolia Testnet
- RPC: https://sepolia.base.org
- Chain ID: 84532
- Explorer: https://sepolia.basescan.org
- Faucet: https://www.alchemy.com/faucets/base-sepolia

## 👨‍💼 Admin Access

**Admin Wallet:** `0xbE27dFb76bdb342313B13357252A42a4CA34431d`

This wallet has full admin and issuer permissions.

## 🎨 UI Components

- Landing page with features
- Admin dashboard (wallet-gated)
- Single certificate minting
- Batch CSV upload
- Certificate management
- Public verification portal

## 🔒 Security

- Role-based access control
- Metadata hash verification
- Prevention of revoked certificate transfers
- No SQL injection (pure smart contract)
- Testnet deployment for safety

## 📝 Certificate Metadata

```json
{
  "name": "Internship Certificate — <name>",
  "description": "<name> successfully completed...",
  "image": "<IPFS or data URL>",
  "attributes": [
    {"trait_type": "name", "value": "..."},
    {"trait_type": "wallet", "value": "0x..."},
    {"trait_type": "program", "value": "..."},
    {"trait_type": "issue_date", "value": "..."},
    {"trait_type": "certificate_id", "value": "..."}
  ],
  "metadata_hash": "0x..."
}
```

## 🧪 Testing

```bash
cd contracts
npm test
```

Tests cover:
- Deployment
- Minting (single & batch)
- Revocation
- Verification
- Access control

## 📄 License

MIT

## 🤝 Contributing

This is a production-ready template. Feel free to fork and customize!

## 🆘 Support

For issues or questions:
1. Check [DEPLOYMENT.md](./DEPLOYMENT.md)
2. View contract on block explorer
3. Check MetaMask network settings

## 🎉 Credits

**Aryan Web3 Labs**  
Building the future of verifiable credentials.

---

**Live Demo:** Coming soon after deployment!  
**Contract Address:** Update after deployment  
**Admin Dashboard:** `/admin`  
**Verification Portal:** `/verify`
