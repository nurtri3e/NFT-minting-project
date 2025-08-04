# Quick Start Guide - NFT Minting Project

## Prerequisites
- Node.js (v16 or higher)
- MetaMask browser extension
- IPFS installed and running
- Ganache (local blockchain)

## Step-by-Step Setup

### 1. Install Dependencies
```bash
# Install root dependencies
npm install

# Install client dependencies
npm run install-client
```

### 2. Start Ganache (Local Blockchain)
Open a new terminal and run:
```bash
ganache-cli -a 20 -e 1000 -m "test test test test test test test test test test test okay" -i 1337
```

### 3. Start IPFS Daemon
Open another terminal and run:
```bash
ipfs daemon
```

### 4. Deploy Smart Contract
```bash
npm run deploy
```
This will:
- Compile the smart contract
- Deploy it to your local blockchain
- Automatically update the contract address in the config file

### 5. Deposit ETH to Contract
```bash
node src/utils/depositEthereum.js
```

### 6. Start the React App
```bash
npm run start-client
```
The app will open at http://localhost:3000

### 7. Configure MetaMask
1. Open MetaMask
2. Add network: http://127.0.0.1:8545
3. Import a Ganache account using its private key

### 8. Test the Application
1. Connect your wallet
2. Fill in the NFT details
3. Use an IPFS link (e.g., http://localhost:8080/ipfs/QmZNEyAxoq55x3jZofjmCdqG1ujpYaKh8TGNhLjdkwiHqz)
4. Click "Mint NFT"

## Troubleshooting

### If Ganache is not running:
- Make sure Ganache is installed: `npm install -g ganache-cli`
- Start it with the command above

### If IPFS is not running:
- Install IPFS from https://docs.ipfs.tech/install/
- Initialize: `ipfs init`
- Start daemon: `ipfs daemon`

### If contract deployment fails:
- Make sure Ganache is running on port 8545
- Check that you have enough ETH in your account

### If MetaMask connection fails:
- Make sure you're connected to the correct network (localhost:8545)
- Try refreshing the page

## Features
- ✅ Mint NFTs with metadata
- ✅ Get rewarded with 1 ETH per NFT
- ✅ View minted tokens
- ✅ Check reward balance
- ✅ IPFS integration for metadata storage

## Project Structure
```
NFT-minting-project/
├── contracts/          # Smart contracts
├── client/            # React frontend
├── migrations/        # Deployment scripts
├── test/             # Contract tests
└── utils/            # Utility scripts
``` 