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

