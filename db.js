const spicedPg = require("spiced-pg");

let db;
if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    const { dbUser, dbPass } = require("./secrets.json");
    db = spicedPg(`postgres:${dbUser}:${dbPass}:@localhost:5432/imageboard`);
}

exports.readAllImages = () => {
    const query = `SELECT * FROM images ORDER BY created_at DESC;`;
    return db.query(query);
};

exports.createImage = ({ title, description, username, url }) => {
    const query = `INSERT INTO images (title, description, username, url) VALUES ($1, $2, $3, $4) RETURNING *;`;
    return db.query(query, [title, description, username, url]);
};

exports.readImage = ({ id }) => {
    const query = `SELECT * FROM images WHERE id = $1`;
    return db.query(query, [id]);
};

exports.createComment = ({ text, username, image_id }) => {
    const query = `INSERT INTO comments (text, username, image_id)
                   VALUES ($1, $2, $3) RETURNING *;`;
    return db.query(query, [text, username, image_id]);
};

exports.readComments = ({ image_id }) => {
    const query = `SELECT * FROM comments WHERE image_id = $1;`;
    return db.query(query, [image_id]);
};
