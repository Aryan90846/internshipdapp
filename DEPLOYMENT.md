# Aryan Certificate Portal - Deployment Guide

## 🚀 Complete Setup & Deployment Instructions

### Prerequisites

- Node.js v18+ and npm
- MetaMask or compatible Web3 wallet
- Testnet tokens (Polygon Amoy or Base Sepolia)

---

## Step 1: Get Testnet Tokens

### Polygon Amoy Testnet (Recommended)
1. Add Polygon Amoy to MetaMask:
   - Network Name: `Polygon Amoy Testnet`
   - RPC URL: `https://rpc-amoy.polygon.technology`
   - Chain ID: `80002`
   - Currency: `MATIC`
   - Explorer: `https://amoy.polygonscan.com`

2. Get free testnet MATIC:
   - https://faucet.polygon.technology/
   - https://www.alchemy.com/faucets/polygon-amoy

### Base Sepolia Testnet (Fallback)
1. Add Base Sepolia to MetaMask:
   - Network Name: `Base Sepolia`
   - RPC URL: `https://sepolia.base.org`
   - Chain ID: `84532`
   - Currency: `ETH`
   - Explorer: `https://sepolia.basescan.org`

2. Get free testnet ETH:
   - https://www.alchemy.com/faucets/base-sepolia
   - https://docs.base.org/tools/network-faucets

---

## Step 2: Deploy Smart Contract

### 1. Navigate to contracts directory:
```bash
cd contracts
npm install
```

### 2. Create `.env` file:
```env
PRIVATE_KEY=your_wallet_private_key_here
POLYGONSCAN_API_KEY=your_api_key_here
BASESCAN_API_KEY=your_api_key_here
```

⚠️ **NEVER commit your `.env` file!**

### 3. Compile contract:
```bash
npm run compile
```

### 4. Run tests:
```bash
npm test
```

### 5. Deploy to testnet:

**For Polygon Amoy:**
```bash
npm run deploy:amoy
```

**For Base Sepolia:**
```bash
npm run deploy:base
```

### 6. Save the deployed contract address!

The deployment script will output:
```
✅ Contract deployed successfully!
📝 Contract Address: 0x...
```

### 7. Verify contract on explorer:

**Polygon Amoy:**
```bash
npx hardhat verify --network polygonAmoy YOUR_CONTRACT_ADDRESS
```

**Base Sepolia:**
```bash
npx hardhat verify --network baseSepolia YOUR_CONTRACT_ADDRESS
```

---

## Step 3: Configure Frontend

### 1. Update `src/config/web3.ts`:

Replace the contract address:
```typescript
export const CONTRACT_CONFIG = {
  address: 'YOUR_DEPLOYED_CONTRACT_ADDRESS' as `0x${string}`,
  // ... rest of config
};
```

### 2. Get WalletConnect Project ID:

1. Go to https://cloud.walletconnect.com/
2. Create a new project
3. Copy your Project ID
4. Update in `src/config/web3.ts`:
```typescript
export const config = getDefaultConfig({
  projectId: 'YOUR_WALLETCONNECT_PROJECT_ID',
  // ... rest of config
});
```

### 3. Install dependencies & run:
```bash
npm install
npm run dev
```

---

## Step 4: Test the DApp

### 1. Connect Wallet
- Open http://localhost:8080
- Click "Connect Wallet"
- Approve connection in MetaMask

### 2. Access Admin Dashboard
- Navigate to `/admin`
- Your wallet (`0xbE27dFb76bdb342313B13357252A42a4CA34431d`) has admin access
- Try minting a test certificate

### 3. Verify Certificate
- Navigate to `/verify`
- Enter the token ID (starts from 0)
- View certificate details on blockchain

---

## Step 5: Issue Sample Certificates

### Single Mint:
1. Go to Admin → Single Mint
2. Fill in:
   - Recipient: `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb` (test wallet)
   - Name: `Test User`
   - Program: `Full Stack Web3 Internship`
   - Issue Date: Today's date
   - Certificate ID: `CERT-2024-001`
3. Click "Mint Certificate"
4. Approve transaction in wallet

### Batch Mint (CSV):
1. Go to Admin → Batch Mint
2. Download CSV template
3. Fill with 5 sample certificates
4. Upload and mint

---

## Project Structure

```
aryan-certificate-portal/
├── contracts/                  # Smart contracts
│   ├── InternCertificateNFT.sol
│   ├── hardhat.config.js
│   ├── scripts/deploy.js
│   └── test/
├── src/
│   ├── components/
│   │   ├── admin/             # Admin components
│   │   ├── verify/            # Verification components
│   │   ├── Header.tsx
│   │   └── WalletConnect.tsx
│   ├── config/
│   │   └── web3.ts            # Web3 configuration
│   ├── lib/
│   │   └── ipfs.ts            # IPFS & metadata utils
│   ├── pages/
│   │   ├── Index.tsx          # Landing page
│   │   ├── Admin.tsx          # Admin dashboard
│   │   └── Verify.tsx         # Verification portal
│   └── types/
│       └── certificate.ts
└── DEPLOYMENT.md              # This file
```

---

## Key Features

### ✅ Implemented
- [x] ERC-721 NFT certificate contract
- [x] Role-based access control (OWNER, ISSUER)
- [x] Single & batch minting
- [x] Certificate revocation
- [x] On-chain verification
- [x] Metadata with SHA256 hash
- [x] Wallet connection (RainbowKit)
- [x] Admin dashboard
- [x] Public verification portal
- [x] QR code generation
- [x] Certificate image generation
- [x] Responsive UI

### 🔄 Production Enhancements
- [ ] IPFS upload (nft.storage or Pinata)
- [ ] Backend API for CSV processing
- [ ] ENS integration
- [ ] OpenSea metadata compatibility
- [ ] Email notifications
- [ ] Multi-language support

---

## Troubleshooting

### Issue: "Insufficient funds"
**Solution:** Get more testnet tokens from faucets

### Issue: "Contract not deployed"
**Solution:** Check `CONTRACT_ADDRESS` in `src/config/web3.ts`

### Issue: "Transaction reverted"
**Solution:** Check you have ISSUER_ROLE, view contract on explorer

### Issue: "Network mismatch"
**Solution:** Switch MetaMask to correct testnet (Polygon Amoy or Base Sepolia)

---

## Security Notes

- ✅ All certificates have metadata hash verification
- ✅ Role-based access control prevents unauthorized minting
- ✅ Revoked certificates cannot be transferred
- ✅ Admin wallet is set at deployment
- ⚠️ This is TESTNET - do NOT use for production without audit

---

## Support & Resources

- Smart Contract: View on explorer after deployment
- Frontend: http://localhost:8080
- Polygon Amoy Explorer: https://amoy.polygonscan.com
- Base Sepolia Explorer: https://sepolia.basescan.org
- Faucets: See Step 1

---

## Next Steps

1. ✅ Deploy contract to testnet
2. ✅ Update frontend config
3. ✅ Issue 5 sample certificates
4. ✅ Test verification flow
5. 🚀 Share with team!

**Admin Wallet:** 0xbE27dFb76bdb342313B13357252A42a4CA34431d

---

**Built with ❤️ by Aryan Web3 Labs**
