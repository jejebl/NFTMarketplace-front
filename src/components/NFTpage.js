import { useParams } from 'react-router-dom';
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useState } from "react";
import './NFTpage.css';

export default function NFTPage () {

const [priceInput, updatePriceInput] = useState('0.01');
const [data, updateData] = useState({});
const [dataFetched, updateDataFetched] = useState(false);
const [message, updateMessage] = useState("");
const [currAddress, updateCurrAddress] = useState("0x");

async function getNFTData(tokenId) {
    const ethers = require("ethers");

    //After adding your Hardhat network to your metamask, this code will get providers and signers
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const addr = await signer.getAddress();
    //Pull the deployed contract instance
    let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer)

    const tokenURI = await contract.tokenURI(tokenId);
    //We use the function get of axios to get the result of the tokenURI
    let meta = await axios.get(tokenURI);
    meta = meta.data;
    const listedToken = await contract.getNftForTokenId(tokenId);
    let price = ethers.utils.formatUnits(listedToken.price.toString(), 'ether');

    let item = {
        price: price,
        tokenId: tokenId,
        owner: listedToken.owner,
        image: meta.image,
        name: meta.name,
        forSale: listedToken.forSale,
        description: meta.description,
    }
    updateData(item);
    updateDataFetched(true);
    updateCurrAddress(addr);
}

async function buyNFT(tokenId) {
    try {
        const ethers = require("ethers");
        //After adding your Hardhat network to your metamask, this code will get providers and signers
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        //Pull the deployed contract instance
        let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer);
        const salePrice = ethers.utils.parseUnits(data.price, 'ether')

        updateMessage("Buying the NFT... Please Wait (Upto 5 mins)")
        //run the executeSale function
        let transaction = await contract.executeSale(tokenId, {value:salePrice});
        await transaction.wait();

        alert('You successfully bought the NFT!');
        updateMessage("");
    }
    catch(e) {
        alert("Upload Error"+e)
    }
}

async function putOnSale(tokenId,e) {
    e.preventDefault();
    try {
        const ethers = require("ethers");
        //After adding your Hardhat network to your metamask, this code will get providers and signers
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        //Pull the deployed contract instance
        let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer);
        updateMessage("Puting on sale, wait...")

        const priceNFT = ethers.utils.parseUnits(priceInput, 'ether')

        let transaction = await contract.updateForSale(tokenId, priceNFT);
        await transaction.wait();

        alert('You successfully put your NFT on sale!');
        updateMessage("");
        updatePriceInput();
        window.location.replace("/")
        
    } catch (error) {
        alert( "Upload error"+ error )
    }
}

async function removeFromSale(tokenId,e) {
    e.preventDefault();
    try {
        const ethers = require("ethers");
        //After adding your Hardhat network to your metamask, this code will get providers and signers
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        //Pull the deployed contract instance
        let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer);
        updateMessage("Remove from sale, wait...")

        let transaction = await contract.removeFromSale(tokenId);
        await transaction.wait();

        alert('You successfully remove your NFT from sale!');
        updateMessage("");
        window.location.replace("/")
        
    } catch (error) {
        alert( "Upload error"+ error )
    }
}

const params = useParams();
const tokenId = params.tokenId;
if(!dataFetched)
    getNFTData(tokenId);


    return(
            <div className="nftpage_container_display">
                <div className="nftpage_display">
                    <div className="nftpage_container_info">
                        <div className="nftpage_image_container">
                            <img src={data.image} alt="" className="nftpage_image" />
                        </div>
                        <div className="nftpage_description_container">
                            <p>Name:</p>{data.name}<br></br><br></br>
                            <p>Description:</p> {data.description}<br></br><br></br>
                            <p>Price:</p> {data.price + " ETH"}<br></br><br></br>
                            <p>Owner:</p> <div className='nftpage_description_addressowner'>{data.owner}</div>
                        </div>
                    </div>
                    <div className="nftpage_container_sell">
                        { currAddress === data.owner ?
                            null
                            : data.forSale ? <button className='nftpage_button' onClick={() => buyNFT(tokenId)}>Buy this NFT</button>
                            : null
                        }

                        { currAddress === data.owner && !data.forSale ? 
                            <div className="nftpage_container_putonsale">
                                <p>Put this NFT on sale here:</p>
                                <div className="nftpage_price_container">
                                    <label className="nftpage_label_price" htmlFor="price">Price (in ETH)</label>
                                    <input className="nftpage_input" type="number" placeholder="Min 0.01 ETH" value={priceInput} onChange={e => updatePriceInput(e.target.value)}></input>
                                </div>
                                <button className='nftpage_button' onClick={(e) => putOnSale(tokenId,e)}>Put on sale</button>
                            </div>

                            : currAddress === data.owner && data.forSale ?
                            <div className="nftpage_container_withdraw">
                                <button className='nftpage_button' onClick={(e) => removeFromSale(tokenId,e)}>Withdraw from sale</button>
                            </div>
                            : null
                        }
                        
                        <div className="nftpage_message">{message}</div>
                    </div>
                </div>
            </div>
    )
}