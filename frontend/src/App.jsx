import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import YoutubeList from './pages/YoutubeList';
import { Toaster } from 'react-hot-toast';
import { useState } from 'react';

function App() {
  const [playlist, setPlaylist] = useState([]);

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home setPlaylist={setPlaylist} />} />
          <Route path="/youtube-list" element={<YoutubeListWrapper/>} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}
const YoutubeListWrapper = () => {
  const location = useLocation();
  const { playlist } = location.state || { playlist: [] };

  return <YoutubeList playlist={playlist} />;
}

export default App;
