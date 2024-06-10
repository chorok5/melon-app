const express = require("express");
const dotenv = require("dotenv");
const scrapeRouter = require("./scrape");


const app = express();
dotenv.config();

const PORT = process.env.PORT || 5000;

// scrapeRouter를 '/' 경로에 마운트합니다.
app.use('/', scrapeRouter);


app.get("/", (req, res) => {
    res.send("Hello World!");
})

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))


