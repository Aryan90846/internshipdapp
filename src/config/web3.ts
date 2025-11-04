import { http, createConfig } from 'wagmi';
import { polygonAmoy, baseSepolia } from 'wagmi/chains';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';

// Contract configuration
export const CONTRACT_CONFIG = {
  address: '0x0000000000000000000000000000000000000000' as `0x${string}`, // UPDATE AFTER DEPLOYMENT
  abi: [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {"internalType": "address", "name": "to", "type": "address"},
        {"internalType": "string", "name": "metadataURI", "type": "string"},
        {"internalType": "bytes32", "name": "metadataHash", "type": "bytes32"},
        {"internalType": "string", "name": "certificateId", "type": "string"}
      ],
      "name": "mintCertificate",
      "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "address[]", "name": "recipients", "type": "address[]"},
        {"internalType": "string[]", "name": "metadataURIs", "type": "string[]"},
        {"internalType": "bytes32[]", "name": "metadataHashes", "type": "bytes32[]"},
        {"internalType": "string[]", "name": "certificateIds", "type": "string[]"}
      ],
      "name": "batchMint",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "uint256", "name": "tokenId", "type": "uint256"},
        {"internalType": "string", "name": "reason", "type": "string"}
      ],
      "name": "revokeCertificate",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "uint256", "name": "tokenId", "type": "uint256"}
      ],
      "name": "verifyCertificate",
      "outputs": [
        {"internalType": "address", "name": "owner", "type": "address"},
        {"internalType": "string", "name": "uri", "type": "string"},
        {"internalType": "bytes32", "name": "metadataHash", "type": "bytes32"},
        {"internalType": "bool", "name": "isRevoked", "type": "bool"}
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "string", "name": "certificateId", "type": "string"}
      ],
      "name": "getTokenIdByCertificateId",
      "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "uint256", "name": "tokenId", "type": "uint256"}
      ],
      "name": "isRevoked",
      "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "bytes32", "name": "role", "type": "bytes32"},
        {"internalType": "address", "name": "account", "type": "address"}
      ],
      "name": "hasRole",
      "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "ISSUER_ROLE",
      "outputs": [{"internalType": "bytes32", "name": "", "type": "bytes32"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {"indexed": true, "internalType": "address", "name": "to", "type": "address"},
        {"indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256"},
        {"indexed": false, "internalType": "string", "name": "uri", "type": "string"},
        {"indexed": false, "internalType": "bytes32", "name": "metadataHash", "type": "bytes32"},
        {"indexed": false, "internalType": "string", "name": "certificateId", "type": "string"}
      ],
      "name": "CertificateIssued",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {"indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256"},
        {"indexed": false, "internalType": "string", "name": "reason", "type": "string"}
      ],
      "name": "CertificateRevoked",
      "type": "event"
    }
  ] as const
};

// Admin wallet configuration
export const ADMIN_WALLET = '0xbE27dFb76bdb342313B13357252A42a4CA34431d';

// Wagmi configuration
export const config = getDefaultConfig({
  appName: 'Aryan Certificate Portal',
  projectId: 'YOUR_WALLETCONNECT_PROJECT_ID', // Get from https://cloud.walletconnect.com/
  chains: [polygonAmoy, baseSepolia],
  transports: {
    [polygonAmoy.id]: http(),
    [baseSepolia.id]: http(),
  },
});

// Network info for users
export const NETWORK_INFO = {
  [polygonAmoy.id]: {
    name: 'Polygon Amoy Testnet',
    explorer: 'https://amoy.polygonscan.com',
    faucets: [
      'https://faucet.polygon.technology/',
      'https://www.alchemy.com/faucets/polygon-amoy'
    ],
    rpcUrl: 'https://rpc-amoy.polygon.technology'
  },
  [baseSepolia.id]: {
    name: 'Base Sepolia Testnet',
    explorer: 'https://sepolia.basescan.org',
    faucets: [
      'https://www.alchemy.com/faucets/base-sepolia',
      'https://docs.base.org/tools/network-faucets'
    ],
    rpcUrl: 'https://sepolia.base.org'
  }
};
