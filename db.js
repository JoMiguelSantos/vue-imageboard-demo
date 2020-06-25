const spicedPg = require("spiced-pg");

let db;
if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    const { dbUser, dbPass } = require("./secrets.json");
    db = spicedPg(`postgres:${dbUser}:${dbPass}:@localhost:5432/petition`);
}

exports.readAllImages = () => {
    const query = `SELECT * FROM images;`;
    return db.query(query);
};
