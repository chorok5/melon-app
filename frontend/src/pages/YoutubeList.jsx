import React, { useState, useEffect } from 'react';
import axios from 'axios';

const YoutubeList = () => {
  const [playlist, setPlaylist] = useState([]);

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        // 유튜브 API를 호출하여 재생목록 데이터를 가져옵니다.
        const response = await axios.get('https://www.googleapis.com/youtube/v3/search');
        setPlaylist(response.data.items); // 재생목록 데이터 설정
      } catch (error) {
        console.error('Error fetching playlist:', error);
      }
    };

    fetchPlaylist(); // 컴포넌트가 마운트될 때 재생목록 데이터를 가져옵니다.
  }, []);

  return (
    <div>
      <h1>유튜브 재생목록</h1>
      <ul>
        {playlist.map((item) => (
          <li key={item.id}>
            <div>{item.snippet.title}</div>
            <img src={item.snippet.thumbnails.default.url} alt={item.snippet.title} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default YoutubeList;
