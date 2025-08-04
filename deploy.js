const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to extract contract address from truffle migrate output
function extractContractAddress(migrateOutput) {
    const lines = migrateOutput.split('\n');
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('contract address:')) {
            const address = lines[i].split('contract address:')[1].trim();
            return address;
        }
    }
    return null;
}

// Function to update contract address in config file
function updateContractAddress(address) {
    const configPath = path.join(__dirname, 'client', 'src', 'utils', 'config.js');
    const configContent = `export const CONTRACT_ADDRESS = '${address}'; // Updated automatically
export const CONTRACT_ABI = require('../contract-abi.json');`;
    
    fs.writeFileSync(configPath, configContent);
    console.log(`✅ Contract address updated to: ${address}`);
}

// Main deployment function
async function deploy() {
    try {
        console.log('🚀 Starting contract deployment...\n');
        
        // Compile contracts
        console.log('📦 Compiling contracts...');
        execSync('npx truffle compile', { stdio: 'inherit' });
        console.log('✅ Contracts compiled successfully\n');
        
        // Deploy contracts
        console.log('🚀 Deploying contracts to local blockchain...');
        const migrateOutput = execSync('npx truffle migrate --network development', { 
            encoding: 'utf8',
            stdio: 'pipe'
        });
        console.log('✅ Contracts deployed successfully\n');
        
        // Extract contract address
        const contractAddress = extractContractAddress(migrateOutput);
        if (contractAddress) {
            updateContractAddress(contractAddress);
            console.log('🎯 Contract address has been automatically updated in the config file!');
        } else {
            console.log('⚠️  Could not automatically extract contract address. Please update it manually.');
        }
        
        console.log('\n📝 Next steps:');
        console.log('1. Run: node src/utils/depositEthereum.js (to deposit ETH to contract)');
        console.log('2. Run: cd client && npm start (to start the React app)');
        console.log('3. Connect MetaMask to localhost:8545');
        console.log('4. Import a Ganache account into MetaMask');
        console.log('5. Test the NFT minting functionality!');
        
    } catch (error) {
        console.error('❌ Deployment failed:', error.message);
        console.log('\n💡 Make sure Ganache is running on http://127.0.0.1:8545');
    }
}

// Run deployment if this file is executed directly
if (require.main === module) {
    deploy();
}

module.exports = { deploy, updateContractAddress }; 