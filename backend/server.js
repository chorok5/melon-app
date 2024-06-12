const express = require("express");
const dotenv = require("dotenv");
const axios = require('axios');
const cors = require('cors');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const { savePlaylist } = require('./saveData');
const db = require('./db'); // 데이터베이스 연결
const { google } = require("googleapis");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );
  google.options({ auth: oauth2Client });

  app.get("/callback", (req, res) => {
    const scopes = ["https://www.googleapis.com/auth/youtube.force-ssl"];
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
    });
    res.redirect(url);
  });

  app.get("http://localhost:4000/callback", async (req, res) => {
    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    res.redirect("/"); // 인증 후 리디렉션할 URL
  });


app.post('/api/searchYoutube', async (req, res) => {
  const { q } = req.body;
  console.log('Received search query:', q);
  try {
    const url = await searchYoutube(q);
    console.log('유튜브 search result URL:', url); // 로그 추가
    res.json({ url });
  } catch (error) {
    console.error('Error searching on YouTube:', error);
    res.status(500).json({ error: 'Error searching on YouTube' });
  }
});

const searchYoutube = async (query) => {
  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        key: process.env.YOUTUBE_API_KEY,
        part: 'snippet',
        q: query,
        type: 'video',
        maxResults: 1, // 최상위 검색결과 1개만
      },
    });

    if (response.data.items && response.data.items.length > 0) {
      const videoId = response.data.items[0].id.videoId;
      return `https://www.youtube.com/watch?v=${videoId}`;
    } else {
      console.log('No search results found for query:', query);
      return null;
    }
  } catch (error) {
    console.error('Error searching on YouTube:', error);
    return null;
  }
};



app.post("/createPlaylist", async (req, res) => {
    try {
      const { title, description } = req.body;
      const youtube = google.youtube("v3");
      const response = await youtube.playlists.insert({
        part: "snippet,status",
        resource: {
          snippet: {
            title: title,
            description: description,
          },
          status: {
            privacyStatus: "private", // 재생목록의 공개 상태 설정 (public, private, unlisted)
          },
        },
      });
      res.status(200).json(response.data);
    } catch (error) {
      console.error("Error creating playlist:", error);
      res.status(500).json({ error: "Error creating playlist" });
    }
  });

  
// 플레이리스트 저장 API
app.post('/savePlaylist', async (req, res) => {
    try {
      const playlistData  = req.body; // 요청으로 받은 플레이리스트 데이터
      await db.query('INSERT INTO playlist (title, artist, album) VALUES ?', [playlistData.map(song => [song.title, song.artist, song.album])]);
      res.status(200).json({ message: 'Playlist saved successfully' }); // 성공 응답
    } catch (error) {
      console.error('Error saving playlist:', error);
      res.status(500).json({ error: 'Failed to save playlist' }); // 에러 응답
    }
  });
  




app.get("/scrape", async (req, res) => {
  const { url } = req.query;
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const html = await page.content();
    const $ = cheerio.load(html);

    const songs = [];
    $('tbody tr').each((index, element) => {
      const title = $(element).find('td:nth-child(3) a.fc_gray').text().trim();
      const artist = $(element).find('td:nth-child(4) a.fc_mgray').text().trim();
      const album = $(element).find('td:nth-child(5) a.fc_mgray').text().trim();
      songs.push({ title: title.replace(/'/g, "''"), artist: artist.replace(/'/g, "''"), album: album.replace(/'/g, "''") });
    });


    res.json(songs);
    await browser.close();
  } catch (error) {
    console.error('Error scraping data:', error);
    res.status(500).json({ error: 'Error scraping data' });
  }
});



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
