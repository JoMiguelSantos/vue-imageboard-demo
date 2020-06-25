const express = require("express");
const { readAllImages } = require("./db");
const app = express();

app.use(express.static("public"));

app.get("/images", (req, res) => {
    readAllImages().then((data) => {
        return res.json(JSON.stringify(data.rows));
    });
});

app.listen(8080, () => console.log("Listening...."));
