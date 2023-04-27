import './App.css';
import Marketplace from './components/Marketplace';
import Profile from './components/Profile';
import CreateNFT from './components/CreateNFT';
import NFTPage from './components/NFTpage';
import {
  Routes,
  Route,
} from "react-router-dom";
import Navbar from './components/Navbar';

function App() {
  return (
    <div className='container'>
      <Navbar />
        <Routes>
          <Route path="*" element={<Marketplace/>}></Route>
          <Route path="/NFTMarketplace-front" element={<Marketplace />}/>
          <Route path="/NFTMarketplace-front/nftPage/:tokenId" element={<NFTPage />}/>        
          <Route path="/NFTMarketplace-front/profile" element={<Profile />}/>
          <Route path="/NFTMarketplace-front/createNFT" element={<CreateNFT />}/>             
        </Routes>
    </div>
  );
}

export default App;