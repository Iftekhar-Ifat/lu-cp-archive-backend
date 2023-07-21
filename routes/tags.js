const express = require("express");
const router = express.Router();
const { connectToDatabase } = require("../models/database");

router.get("/tags", async (req, res) => {
    const db = await connectToDatabase();
    const allTags = await db.collection("tags").find({}).toArray();
    res.send(allTags);
});

router.post("/update-tags", async (req, res) => {
    const db = await connectToDatabase();

    const newTag = req.body.tags;
    // eslint-disable-next-line no-unused-vars
    const addTag = await db
        .collection("tags")
        .updateOne({ key: "tags_collection" }, { $addToSet: { tags: newTag } });
    res.send(newTag);
});

module.exports = router;
