import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import Home from './pages/Home.jsx';
import YoutubeList from './pages/YoutubeList.jsx';

function App() {

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/youtube-list" element={<YoutubeList />} />

    </Routes>
  )
}

export default App;