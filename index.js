const express = require("express");
const db = require("./db");
const app = express();
const { uploadFileS3 } = require("./s3");
const { uploader } = require("./multer");
const { s3Url } = require("./config.json");

app.use(express.json());
app.use(express.static("public"));

app.get("/images", (req, res) => {
    db.readAllImages().then(({ rows }) => {
        return res.json(rows);
    });
});

app.get("/images/:id", (req, res) => {
    console.log("get image", req.params.id);

    db.readImage({ id: req.params.id }).then(({ rows }) => {
        return res.json(rows[0]);
    });
});

app.get("/images/:id/comments", (req, res) => {
    db.readComments({ image_id: req.params.id }).then(({ rows }) => {
        return res.json(rows);
    });
});

app.post("/images/:id/comments", (req, res) => {
    console.log("post comments", req.body);

    db.createComment({
        image_id: req.params.id,
        text: req.body.text,
        username: req.body.username,
    }).then(({ rows }) => {
        return res.json(rows[0]);
    });
});

app.post("/upload", uploader.single("file"), uploadFileS3, (req, res) => {
    if (req.file) {
        const { filename } = req.file;
        const url = s3Url + filename;
        const { title, description, username } = req.body;
        return db
            .createImage({ url, title, description, username })
            .then(({ rows }) => {
                return res.json({ success: true, data: rows[0] });
            });
    } else {
        return res.json({ success: false });
    }
});

app.listen(8080, () => console.log("Listening...."));
