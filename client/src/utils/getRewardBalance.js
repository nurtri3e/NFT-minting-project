const Web3 = require('web3');
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./config";

async function getRewardBalance(userAddress) {
    // Create a new web3 instance and connect to the blockchain
    const web3 = new Web3(window.ethereum);

    // Get the contract instance
    const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

    try {
        // Call the contract's totalRewards function
        const balanceInWei = await contract.methods.totalRewards(userAddress).call();

        // Convert balance from wei to ETH
        const balanceInEth = web3.utils.fromWei(balanceInWei, 'ether');

        // Return the total reward balance
        return balanceInEth;
    } catch (error) {
        console.error('Error retrieving reward balance:', error);
        return 0;
    }
}

export default getRewardBalance;