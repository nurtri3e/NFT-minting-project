//import { ur } from "@faker-js/faker";
import { useEffect, useState } from "react";
import { connectWallet, getCurrentWalletConnected, mintNFT } from "./utils/interact";
import getRewardBalance from "./utils/getRewardBalance";
import getMintedTokens from "./utils/getMintedTokens";
import getAccountBalance from "./utils/getAccountBalance";


const Minter = (props) => {

    //State variables
    const [walletAddress, setWallet] = useState("");
    const [status, setStatus] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [url, setURL] = useState("");

    const [balance, setBalance] = useState("");
    const [rewardBalance, setRewardBalance] = useState("");
    const [mintedTokens, setMintedTokens] = useState([]);
    const [minting, setMinting] = useState(false);


    useEffect(() => {
        async function initialize() {
            const { address, status } = await getCurrentWalletConnected();
            setWallet(address);
            setStatus(status);

            addWalletListener();

            if (address) {
                const balance = await getAccountBalance(address);
                setBalance(balance);

                const rewardBalance = await getRewardBalance(address);
                setRewardBalance(rewardBalance);

                const mintedTokens = await getMintedTokens(address);
                setMintedTokens(mintedTokens);
            }
        }
        initialize();
    }, []);

    function addWalletListener() {
        if (window.ethereum) {
            window.ethereum.on("accountsChanged", async (accounts) => {
                if (accounts.length > 0) {
                    setWallet(accounts[0]);
                    setStatus("👆🏽 Write a message in the text-field above.");
                    const balance = await getAccountBalance(accounts[0]);
                    setBalance(balance);
                    const rewardBalance = await getRewardBalance(accounts[0]);
                    setRewardBalance(rewardBalance);
                    const mintedTokens = await getMintedTokens(accounts[0]);
                    setMintedTokens(mintedTokens);
                } else {
                    setWallet("");
                    setStatus("🦊 Connect to Metamask using the top right button.");
                    setBalance("");
                    setRewardBalance("");
                    setMintedTokens([]);
                }
            });
        } else {
            setStatus(
                <p>
                    {" "}
                    🦊{" "}
                    <a target="_blank" rel="noopener noreferrer" href={`https://metamask.io/download.html`}>
                        You must install Metamask, a virtual Ethereum wallet, in your
                        browser.
                    </a>
                </p>
            );
        }
    }

    const connectWalletPressed = async () => {
        const walletResponse = await connectWallet();
        setStatus(walletResponse.status);
        setWallet(walletResponse.address);
        if (walletResponse.address) {
            const balance = await getAccountBalance(walletResponse.address);
            setBalance(balance);
            const rewardBalance = await getRewardBalance(walletResponse.address);
            setRewardBalance(rewardBalance);
            const mintedTokens = await getMintedTokens(walletResponse.address);
            setMintedTokens(mintedTokens);
        }
    };

    const onMintPressed = async () => {
        setMinting(true);
        const { status } = await mintNFT(url, name, description);
        setStatus(status);
        if (walletAddress) {
            const rewardBalance = await getRewardBalance(walletAddress);
            setRewardBalance(rewardBalance);
            const mintedTokens = await getMintedTokens(walletAddress);
            setMintedTokens(mintedTokens);
        }
        setMinting(false);
    };

    return (
        <div className="Minter">
            <button id="walletButton" onClick={connectWalletPressed}>
                {walletAddress.length > 0 ? (
                    <>
                        <span>
                            Account 🦊: {String(walletAddress).substring(0, 6)}...
                            {String(walletAddress).substring(38)}
                        </span>
                        <br />
                        <span>💰 Balance: {balance} ETH</span> {/* Display account balance */}
                        <br />
                        <span> 💰 Total Reward: {rewardBalance} ETH </span>{ }
                    </>

                ) : (
                    <span>Connect Wallet</span>
                )}
            </button>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <h1 id="title"> NFT Assignment</h1>
            <p>
                This is a simple application to mint NFT tokens and get rewarded with ETH.
                Mint your first NFT and get rewarded with 1 ETH.
            </p>
            <form>
                <h2> 🚀 NFT Name: </h2>
                <input
                    type="text"
                    placeholder="e.g. Pam Emmanuel Gyang"
                    onChange={(event) => setName(event.target.value)}
                />

                <h2> 🚀 NFT Description: </h2>
                <input
                    type="text"
                    placeholder="e.g B.Sc. Computer Science, Plasu Bokkos"
                    onChange={(event) => setDescription(event.target.value)}
                />

                <h2> 🚀 Link to Digital Asset (e.g, IPFS link): </h2>
                <input
                    type="text"
                    placeholder="e.g. http://localhost:8080/ipfs/QmSimUVgZxkQ4vK2Qh2kcMruebQ9kyWdWNBE88CyXRnu5n"
                    onChange={(event) => setURL(event.target.value)}
                />

            </form>
            <button id="mintButton" onClick={onMintPressed} disabled={minting}>
                {minting ? (
                    <>
                        <div className="spinner"></div>
                        Minting NFT...
                    </>
                ) : (
                    "Mint NFT ⛏️"
                )}
            </button>
            <p id="status">
                {status}
            </p>

            <h2>Minted Tokens </h2>
            <ul>
                {mintedTokens.map((token, index) => (
                    <li key={index}>
                        <p>Token URI: {token.uri}</p> {/* You can customize this based on the structure of your tokens */}
                        <img src={token.image} width="250" height="250" alt="NFT" /> {/* Change size as needed */}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Minter;