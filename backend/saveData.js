const db = require('./db');
const moment = require('moment');

// 플레이리스트 정보를 데이터베이스에 저장하는 함수
function savePlaylist(playlist) {
  playlist.forEach((song) => {
    const { title, artist, album } = song;
    const createdAt = moment().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss'); // 올바른 형식의 문자열 생성
    const query = `INSERT INTO playlist (title, artist, album, createdAt) VALUES ('${title}', '${artist}', '${album}', '${createdAt}')`;
    db.query(query, (err, result) => {
      if (err) throw err;
      console.log('Inserted:', result.affectedRows);
    });
  });
}

module.exports = { savePlaylist };