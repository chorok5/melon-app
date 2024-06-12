// YoutubeList.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const YoutubeList = ({ playlist }) => {
  const [youtubeLinks, setYoutubeLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  const fetchYoutubeLinks = useCallback(async () => {
    if (retryCount >= MAX_RETRIES) {
      toast.error('최대 재시도 횟수를 초과했습니다.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const links = [];
      for (const song of playlist) {
        const query = `${song.title} ${song.artist}`;
        console.log('Fetching YouTube link for:', query);

        const response = await axios.post('http://localhost:5000/api/searchYoutube', { q: `${song.title} ${song.artist}` });
        if (response.data.url) {
          links.push({ ...song, url: response.data.url });
          console.log(`No URL found for song: ${song.title} by ${song.artist}`);
        }
      }
      setYoutubeLinks(links);
    } catch (error) {
      console.error('에러 fetching youtube links:', error);
      setError(error);
      setRetryCount(retryCount + 1);
      toast.error('플레이리스트를 가져오는 중 오류가 발생했습니다. 다시 시도합니다...');
    } finally {
      setLoading(false);
    }
  }, [playlist, retryCount]);

  useEffect(() => {
    if (playlist.length > 0) {
      fetchYoutubeLinks();
    }
  }, [fetchYoutubeLinks]);

  const createPlaylist = async (title, description) => {
    try {
      const response = await axios.post('/createPlaylist', {
        title: title,
        description: description,
      });
      if (response.status === 200) {
        toast.success('재생목록이 성공적으로 생성되었습니다.');
      } else {
        toast.error('재생목록 생성 중 오류가 발생했습니다.');
      }
    } catch (error) {
      toast.error('재생목록 생성 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="bg-gray-100 py-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6">유튜브 재생목록</h1>
        <div className="bg-white shadow-lg rounded-lg p-6">
          {loading ? (
            <p>플레이리스트를 로드하는 중입니다...</p>
          ) : error ? (
            <p>플레이리스트를 가져오는 중 오류가 발생했습니다. 다시 시도해 주세요.</p>
          ) : (
            <ul className="space-y-4">
              {playlist.map((item, index) => (
                <li key={index} className="border-b pb-4 last:border-b-0">
                  <div className="flex justify-between items-center">
                    <div className="font-medium">{item.title} - {item.artist}</div>
                    {youtubeLinks[index] && (
                      <a
                        href={youtubeLinks[index].url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary btn-sm"
                      >
                        보기
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          onClick={() => createPlaylist('My Playlist', 'Description of my playlist')}
          className="btn btn-primary mt-6"
        >
          재생목록 생성
        </button>
      </div>
    </div>
  );
};

export default YoutubeList;