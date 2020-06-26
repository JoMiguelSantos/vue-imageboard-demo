const express = require("express");
const { readAllImages } = require("./db");
const app = express();
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

app.use(express.static("public"));

app.get("/images", (req, res) => {
    readAllImages().then(({ rows }) => {
        return res.json(rows);
    });
});

app.post("/upload", uploader.single("file"), (req, res) => {
    if (req.file) {
        // send to s3
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

app.listen(8080, () => console.log("Listening...."));
