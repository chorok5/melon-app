const express = require("express");
const cors = require('cors');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const { savePlaylist } = require('./saveData');


const app=express();

app.use(cors());

app.get('/scrape', async (req, res) => {
    try {
        const url = req.query.url; // URL을 프론트엔드에서 받아옴
        console.log('URL 로그:', url);
        
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);

        const html = await page.content();

        const $ = cheerio.load(html);

        const songs =[];
        $('tbody tr').each((index, element) => {
            const title = $(element).find('td:nth-child(3) a.fc_gray').text().trim();
            const artist = $(element).find('td:nth-child(4) a.fc_mgray').text().trim();
            const album = $(element).find('td:nth-child(5) a.fc_mgray').text().trim();
            songs.push({ title: title.replace(/'/g, "''"), artist: artist.replace(/'/g, "''"), album: album.replace(/'/g, "''") });
          });

          // 플레이리스트 db에 저장하기
          savePlaylist(songs);

          console.log('Scraped data:', songs);

          res.json(songs);

          await browser.close();

        } catch (error) {
          console.error('Error scraping data:', error);
          res.status(500).json({ error: 'Error scraping data' });
        }
      });

module.exports = app;