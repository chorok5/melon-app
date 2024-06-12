const axios = require('axios');
const app = express();


app.get('/api/search', async (req, res) => {
  const query = req.query.query;
  //console.log('Searching YouTube for query:', query);
  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        key: process.env.YOUTUBE_API_KEY,
        part: 'snippet',
        q: query,
        type: 'video',
        maxResults: 1, // 한 곡에 대해 최상위 결과만 가져오기
      },
    });
    //console.log('YouTube API response:', response.data);

    if (response.data.items.length > 0) {
      const videoId = response.data.items[0].id.videoId;
      res.json({ url :`https://www.youtube.com/watch?v=${videoId}`});
    } else {
      res.status(404).json({ error: 'No video found on YouTube.' });
    }
  } catch (error) {
    console.error('Error searching on YouTube:', error);
    resizeTo.status(500).json({ error: 'An error occurred while searching on YouTube.' });
  }
});




// 곡 리스트를 받아서 각 곡에 대한 유튜브 링크를 생성하는 함수
// const generateYoutubeLinks = async (playlist) => {
//   const youtubeLinks = [];

//   for (const song of playlist) {
//     const query = `${song.title} ${song.artist} ${song.album}`;
//     const youtubeLink = await searchYoutube(query);
//     if (youtubeLink) {
//       youtubeLinks.push(youtubeLink);
//     }
//   }

//   return youtubeLinks;
// };

// // 예시 플레이리스트
// const playlist = [
//   { title: 'Song Title 1', artist: 'Artist 1', album: 'Album 1' },
//   { title: 'Song Title 2', artist: 'Artist 2', album: 'Album 2' },
//   // 추가적인 곡 정보들...
// ];

// // 유튜브 링크 생성
// generateYoutubeLinks(playlist)
//   .then((youtubeLinks) => {
//     console.log('Youtube Links:', youtubeLinks);
//     // 이제 유튜브 링크를 사용하여 재생목록을 만들거나 출력할 수 있음
//   })
//   .catch((error) => console.error('Error generating YouTube links:', error));
