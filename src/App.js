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
            <Route path="*" element={<Marketplace />}/>
            <Route path="/nftPage/:tokenId" element={<NFTPage />}/>        
            <Route path="/profile" element={<Profile />}/>
            <Route path="/createNFT" element={<CreateNFT />}/>             
          </Routes>
    </div>
  );
}

export default App;