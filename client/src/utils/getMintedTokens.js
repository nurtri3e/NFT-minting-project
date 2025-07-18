const Web3 = require('web3');
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./config";

async function getMintedTokens(userAddress) {
    // Create a new web3 instance and connect to the blockchain
    const web3 = new Web3(window.ethereum);

    // Get the contract instance
    const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

    try {
        const tokenIds = await contract.methods.getMintedTokens(userAddress).call();

        // Call the contract's tokenURI function for each token and store the results
        const tokenUris = [];
        for (const tokenId of tokenIds) {
            const tokenUri = await contract.methods.tokenURI(tokenId).call();

            // Fetch the image URL from the token's JSON
            const response = await fetch(tokenUri);
            const data = await response.json();
            const imageUrl = data.image;

            tokenUris.push({ uri: tokenUri, image: imageUrl });
        }

        // Return the array of token URIs and image URLs
        return tokenUris;
    } catch (error) {
        console.error('Error retrieving minted tokens:', error);
        return [];
    }
}

// Usage example

export default getMintedTokens;