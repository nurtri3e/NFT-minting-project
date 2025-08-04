import getMintedTokens from "./getMintedTokens";
import getRewardBalance from "./getRewardBalance";
import uploadToIPFS from './ipfs.js';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./config";

const Web3 = require('web3');
let web3;
if (typeof window !== "undefined" && window.ethereum) {
    web3 = new Web3(window.ethereum);
} else {
    web3 = null;
}


export const mintNFT = async (url, name, description) => {
    //error handling
    if (url.trim() === "" || (name.trim() === "" || description.trim() === "")) {
        return {
            success: false,
            status: "❗Please make sure all fields are completed before minting.",
        }
    }
    //make metadata
    const metadata = {};
    metadata.name = name;
    metadata.image = url;
    metadata.description = description;

    let tokenURI;
    try {
        tokenURI = await uploadToIPFS(metadata);
    } catch (error) {
        console.error("Error uploading data to IPFS", error);
        return {
            success: false,
            status: "Could not upload metadatato IPFS",
        };
    }

    //load smart contract
    const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

    const address = window.ethereum.selectedAddress;
    const nonce = await web3.eth.getTransactionCount(address);

    console.log(nonce)

    //set up your Ethereum transaction
    const transactionParameters = {
        to: CONTRACT_ADDRESS, // Required except during contract publications.
        from: address, // must match user's active address.
        'data': contract.methods.mintNFT(address, tokenURI).encodeABI(), //make call to NFT smart contract 
        nonce: nonce.toString()
    };

    console.log(transactionParameters)
    //sign transaction via Metamask
    try {
        const txHash = await window.ethereum
            .request({
                method: 'eth_sendTransaction',
                params: [transactionParameters],
            });

        // Fetch and update the minted tokens
        const tokens = await getMintedTokens(address);

        // Fetch and update the reward balance
        const rewardBalance = await getRewardBalance(address);

        return {
            success: true,
            status: "✅ Check out your transaction on Etherscan: https://goerli.etherscan.io/tx/" + txHash,
            mintedTokens: tokens || [],
            rewardBalance: rewardBalance,
        }
    } catch (error) {
        return {
            success: false,
            status: "😥 Something went wrong: " + error.message
        }
    }


}

export const connectWallet = async () => {
    if (window.ethereum) {
        try {
            const addressArray = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            return {
                status: "👆🏽 Wallet connected.",
                address: addressArray[0],
            };
        } catch (err) {
            return {
                address: "",
                status: "😥 " + err.message,
            };
        }
    } else {
        return {
            address: "",
            status: "🦊 You must install Metamask, a virtual Ethereum wallet, in your browser: https://metamask.io/download.html",
        };
    }
};


export const getCurrentWalletConnected = async () => {
    if (window.ethereum) {
        try {
            const addressArray = await window.ethereum.request({
                method: "eth_accounts",
            });
            if (addressArray.length > 0) {
                return {
                    address: addressArray[0],
                    status: "👆🏽 Write a message in the text-field above.",
                };
            } else {
                return {
                    address: "",
                    status: "🦊 Connect to Metamask using the top right button.",
                };
            }
        } catch (err) {
            return {
                address: "",
                status: "😥 " + err.message,
            };
        }
    } else {
        return {
            address: "",
            // Changed from JSX to plain string for status
            status: "🦊 You must install Metamask, a virtual Ethereum wallet, in your browser: https://metamask.io/download.html",
        };
    }
};

// Suggestion: In your React component, listen for account/network changes like this:
// if (window.ethereum) {
//   window.ethereum.on('accountsChanged', () => { /* update UI */ });
//   window.ethereum.on('chainChanged', () => { /* update UI */ });
// }
   