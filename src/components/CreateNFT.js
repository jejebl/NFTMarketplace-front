import { useState } from "react";
import { uploadFileToIPFS, uploadJSONToIPFS } from "../pinata";
import Marketplace from '../Marketplace.json';
import './CreateNFT.css';

export default function CreateNFT () {

    const [formParams, updateFormParams] = useState({ name: '', description: '', image: []});
    const ethers = require("ethers");
    const [message, updateMessage] = useState('');

    //This function uploads the NFT image to IPFS
    async function uploadImageToIPFS(image) {
        updateMessage("Please wait... uploading");
        const {name, description} = formParams;
        //Make sure that none of the fields are empty
        if( !name || !description || !image) {
            alert("A field is missing!");
            window.location.replace("/createNFT")
            return;
        }
        //check for file extension
        try {
            //upload the file to IPFS
            const response = await uploadFileToIPFS(image);
            if(response.success === true) {
                console.log("Uploaded image to Pinata: ", response.pinataURL)
                return response.pinataURL;
            }
        }
        catch(e) {
            console.log("Error during file upload", e);
            window.location.replace("/createNFT")
        }
    }

    //This function uploads the metadata to IPFS
    async function uploadMetadataToIPFS(imageURL) {
        const {name, description} = formParams;
        
        //Make sure that none of the fields are empty
        if( !name || !description || !imageURL) {
            window.location.replace("/createNFT")
            return;
        }

        const nftJSON = {
            name, description, price: 0, image: imageURL
        }

        try {
            //upload the metadata JSON to IPFS
            const response = await uploadJSONToIPFS(nftJSON);
            if(response.success === true){
                console.log("Uploaded JSON to Pinata: ", response)
                return response.pinataURL;
            }
        }
        catch(e) {
            console.log("error uploading JSON metadata:", e)
            window.location.replace("/createNFT")
        }
    }

    async function listNFT(e) {
        e.preventDefault();

        //Upload data to IPFS
        try {
            //Upload the image to IPFS
            const imageURL = await uploadImageToIPFS(formParams.image);
            //Upload the metadata to IPFS
            const metadataURL = await uploadMetadataToIPFS(imageURL);
            //After adding your Hardhat network to your metamask, this code will get providers and signers
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            //Pull the deployed contract instance
            let contract = new ethers.Contract(Marketplace.address, Marketplace.abi, signer)

            //Create the NFT
            let transaction = await contract.mintNft(metadataURL)
            await transaction.wait()

            alert("Successfully create your NFT!");
            updateMessage("");
            updateFormParams({ name: '', description: '', image: []});
            window.location.replace("/")
        }
        catch(e) {
            alert( "Upload error"+e )
            window.location.replace("/createNFT")
        }
    }

    console.log("Working", process.env);

    return (
            <div className="create_container">
                <form className="create_form_container">
                <h3 className="create_h3_title">Upload your NFT to the marketplace</h3>
                    <div className="create_name_container">
                        <label className="create_name_label" htmlFor="name">NFT Name</label>
                        <input className="create_name_input" id="name" type="text" placeholder="NFT name" onChange={e => updateFormParams({...formParams, name: e.target.value})} value={formParams.name}></input>
                    </div>
                    <div className="create_description_container">
                        <label className="create_description_label" htmlFor="description">NFT Description</label>
                        <textarea className="create_description_text" cols="40" rows="5" id="description" type="text" placeholder="Description" value={formParams.description} onChange={e => updateFormParams({...formParams, description: e.target.value})}></textarea>
                    </div>
                    <div className="create_image_container">
                        <label className="create_image_label" htmlFor="image">Upload Image</label>
                        <input type={"file"} onChange={e => updateFormParams({...formParams, image: e.target.files[0]})}></input>
                    </div>
                    <br></br>
                    <div className="create_message">{message}</div>
                    <button onClick={listNFT} className="create_button_listnft">
                        List NFT
                    </button>
                </form>
            </div>
    )
}