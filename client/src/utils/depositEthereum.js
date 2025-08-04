const Web3 = require('web3');
const path = require('path');
const fs = require('fs');

// Read contract address from config
const configPath = path.join(__dirname, 'config.js');
const configContent = fs.readFileSync(configPath, 'utf8');
const contractAddressMatch = configContent.match(/CONTRACT_ADDRESS = '([^']+)'/);
const contractAddress = contractAddressMatch ? contractAddressMatch[1] : '0x17f713aC25039abbfFc34354d3084FC2183b49d5';

const web3 = new Web3('http://localhost:8545');

// Your account private key (first account from Ganache)
const privateKey = '0xaefcaad212aba1ac9c96f94f5dcef495467fb745179976fbe31711bc559fedcf';

// MyNFT contract ABI
const abi = require('../contract-abi.json');

// Set up the contract instance
const contract = new web3.eth.Contract(abi, contractAddress);

const depositETH = async () => {
    try {
        const account = web3.eth.accounts.privateKeyToAccount(privateKey);
        web3.eth.accounts.wallet.add(account);
        web3.eth.defaultAccount = account.address;

        console.log(`💰 Depositing ETH to contract: ${contractAddress}`);
        console.log(`👤 From account: ${account.address}`);

        const valueToSend = web3.utils.toWei('100', 'ether'); // 100 Ether

        const gasPrice = await web3.eth.getGasPrice();
        const gasEstimate = await contract.methods.depositETH().estimateGas({ 
            from: account.address, 
            value: valueToSend 
        });

        const receipt = await contract.methods.depositETH().send({ 
            from: account.address, 
            gasPrice: gasPrice, 
            gas: gasEstimate, 
            value: valueToSend 
        });

        console.log('✅ ETH deposited successfully!');
        console.log('📋 Transaction receipt:', receipt);
        
        // Check contract balance
        const contractBalance = await web3.eth.getBalance(contractAddress);
        console.log(`💰 Contract balance: ${web3.utils.fromWei(contractBalance, 'ether')} ETH`);
        
    } catch (error) {
        console.error('❌ Error depositing ETH:', error.message);
        console.log('💡 Make sure Ganache is running and the contract is deployed');
    }
}

depositETH();