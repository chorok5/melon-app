import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Home = ({ setPlaylist }) => {
  const [url, setUrl] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:5000/scrape?url=${encodeURIComponent(url)}`);
      //console.log('Scraped data:', response.data); // 데이터 형식 확인
      if (response.status === 200) {
        await axios.post('http://localhost:5000/savePlaylist', response.data); 
        //console.log('Saved playlist:', response.data);
        
        setPlaylist(response.data);
        toast.success('곡이 성공적으로 저장되었습니다.', { position: 'top-center' });
        navigate('/youtube-list', { state: { playlist: response.data } });
      }
    } catch (error) {
      toast.error('곡 저장 중에 오류가 발생했습니다.', { position: 'top-center' });
    }
  };

  return (
    <div className="container mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-5">멜론 to 유튜브</h2>
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="멜론 플레이리스트 URL을 입력하세요"
          className="input input-bordered input-primary w-full max-w-xs"
        />
        <button type="submit" className="btn border-t-green-500">
          전송
        </button>
      </form>
    </div>
  );
};

export default Home;
