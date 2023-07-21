const { MongoClient } = require("mongodb");
require("dotenv").config();

const MongoURI = process.env.MONGODB_URI;

const client = new MongoClient(MongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

let db = null;

async function connectToDatabase() {
    try {
        if (!db) {
            await client.connect();
            console.log("Connected to MongoDB!");
            db = client.db("luca");
        }
        return db;
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        throw err;
    }
}

module.exports = { connectToDatabase };
