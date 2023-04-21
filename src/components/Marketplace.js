import NFTFile from "./NFTFile";
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useState } from "react";
import './Marketplace.css';

export default function Marketplace() {
const [data, updateData] = useState();
const [dataFetched, updateFetched] = useState(false);

async function getAllNFTs() {
    const ethers = require("ethers");
    //After adding your Hardhat network to your metamask, this code will get providers and signers
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    //Pull the deployed contract instance
    let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer)
    //create an NFT Token
    let transaction = await contract.getAllNFTs()

    //Fetch all the details of every NFT from the contract and display
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
            owner: i.owner,
            image: meta.image,
            name: meta.name,
            forSale: i.forSale,
            description: meta.description,
        }
        return item;
    }))

    updateFetched(true);
    updateData(items);
}

if(!dataFetched)
    getAllNFTs();

return (
        <div className="market_container">
            <div className="market_marketplace_display">
                <p className="market_topnft_title">All the NFTs</p>
                <div className="market_listnft ">
                    {data && data.map((value, index) => {
                        return <NFTFile data={value} key={index}></NFTFile>;
                    })}
                </div>
            </div>
        </div>   
);

}