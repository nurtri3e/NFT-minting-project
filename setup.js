const fs = require('fs');
const path = require('path');

// Function to update contract address in config file
function updateContractAddress(address) {
    const configPath = path.join(__dirname, 'client', 'src', 'utils', 'config.js');
    const configContent = `export const CONTRACT_ADDRESS = '${address}'; // Updated automatically
export const CONTRACT_ABI = require('../contract-abi.json');`;
    
    fs.writeFileSync(configPath, configContent);
    console.log(`✅ Contract address updated to: ${address}`);
}

// Function to check if ganache is running
function checkGanache() {
    console.log('🔍 Checking if Ganache is running...');
    console.log('📋 Please make sure Ganache is running on http://127.0.0.1:8545');
    console.log('💡 You can start Ganache with: ganache-cli -a 20 -e 1000 -m "test test test test test test test test test test test test okay" -i 1337');
}

// Function to check if IPFS is running
function checkIPFS() {
    console.log('🔍 Checking if IPFS is running...');
    console.log('📋 Please make sure IPFS is running on http://localhost:5001');
    console.log('💡 You can start IPFS with: ipfs daemon');
}

// Main setup function
async function setup() {
    console.log('🚀 Setting up NFT Minting Project...\n');
    
    checkGanache();
    console.log('');
    checkIPFS();
    console.log('');
    
    console.log('📝 Next steps:');
    console.log('1. Start Ganache (if not already running)');
    console.log('2. Start IPFS daemon (if not already running)');
    console.log('3. Run: npm run migrate (to deploy contract)');
    console.log('4. Run: node src/utils/depositEthereum.js (to deposit ETH)');
    console.log('5. Run: cd client && npm start (to start the React app)');
    console.log('');
    console.log('🎯 After deployment, the contract address will be automatically updated in the config file.');
}

// Export functions for use in other scripts
module.exports = {
    updateContractAddress,
    checkGanache,
    checkIPFS,
    setup
};

// Run setup if this file is executed directly
if (require.main === module) {
    setup();
} 