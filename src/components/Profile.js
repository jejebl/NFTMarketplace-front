//import { useParams } from 'react-router-dom';
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useState } from "react";
import NFTFile from "./NFTFile";
import './Profile.css';

export default function Profile () {
    const [data, updateData] = useState([]);
    const [address, updateAddress] = useState("0x");
    const [totalPrice, updateTotalPrice] = useState("0");

    const [dataFetched, updateFetched] = useState(false);

    async function getNFTData(/*tokenId*/) {
        const ethers = require("ethers");
        let sumPrice = 0;

        //After adding your Hardhat network to your metamask, this code will get providers and signers
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const addr = await signer.getAddress();
        updateAddress(addr);

        //Pull the deployed contract instance
        let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer)

        //create an NFT Token
        let transaction = await contract.getMyNFTs()

        /*
        * Below function takes the metadata from tokenURI and the data returned by getMyNFTs() contract function
        * and creates an object of information that is to be displayed
        */
        
        const items = await Promise.all(transaction.map(async i => {
            //Call the function tokenURI from the inherited ERC721 contract
            const tokenURI = await contract.tokenURI(i.tokenId);
            //We use the function get of axios to get the result of the tokenURI
            let meta = await axios.get(tokenURI);
            meta = meta.data;

            let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
            let item = {
                price,
                tokenId: i.tokenId.toNumber(),
                seller: i.seller,
                owner: i.owner,
                image: meta.image,
                name: meta.name,
                description: meta.description,
            }
            sumPrice += Number(price);
            return item;
        }))

        updateData(items);
        updateFetched(true);
        updateTotalPrice(sumPrice.toPrecision(3));
    }

    //const params = useParams();
    //const tokenId = params.tokenId;
    if(!dataFetched)
        getNFTData(/*tokenId*/);
    
    return (
            <div className="profile_container">
                <div className="profile_wallet_container">
                        <h2>Wallet Address</h2>  
                        <p>{address}</p>
                </div>
                <div className="profile_stats_container">
                        <div>
                            <h2>No. of NFTs</h2>
                            {data.length}
                        </div>
                        <div className="profile_totalvalue_container">
                            <h2>Total Value</h2>
                            {totalPrice} ETH
                        </div>
                </div>
                <div className="profile_nft_container">
                    <h2>Your NFTs</h2>
                    <div className="profile_mapnft">
                        {data.map((value, index) => {
                        return <NFTFile data={value} key={index}></NFTFile>;
                        })}
                    </div>
                    <div className="profile_nodata">
                        {data.length === 0 ? "Oops, No NFT data to display (Are you logged in?)":""}
                    </div>
                </div>
            </div>
    )
};