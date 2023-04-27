import { Link } from "react-router-dom";
import './NFTFile.css';

function NFTFile (data) {
    const newTo = {
        pathname:"/NFTMarketplace-front#/nftPage/"+data.data.tokenId
    }
    return (
        <Link to={newTo}>
            <div className="nftfile_container">
                <div className="nftfile_image_container">
                    <img src={data.data.image} alt="" className="nftfile_image" />
                </div>
                <div className= "nftfile_description_container">
                    <p>{data.data.name}</p>
                    {data.data.forSale ? <p>{data.data.price} Matic</p> : <p>Not for Sale</p>}
                </div>
            </div>
        </Link>
    )
}

export default NFTFile;
