import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate  } from 'react-router-dom';
import {toast } from 'react-hot-toast';

const Home = () => {
  const [url, setUrl] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:5000/scrape?url=${encodeURIComponent(url)}`);
      // console.log('Response from backend:', response.data);
      if (response.status === 200) {
        toast.success('곡이 성공적으로 저장되었습니다.', { position: 'top-center' });
        // 페이지 이동
        navigate('/youtube-list');
      }
    } catch (error) {
      toast.error('곡 저장 중에 오류가 발생했습니다.', { position: 'top-center' });
    }
  };

  return (
    <>
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
</>
  );
};

export default Home;
