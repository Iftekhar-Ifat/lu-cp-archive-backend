const express = require("express");
const router = express.Router();
const { connectToDatabase } = require("../models/database");

router.get("/resources/:topic", async (req, res) => {
    const currentRoute = req.params.topic;
    const db = await connectToDatabase();
    const TopicWiseResources = await db
        .collection("resources")
        .find({ route: currentRoute })
        .toArray();
    res.send(TopicWiseResources);
});

// router.post("/", async (req, res) => {
//     // Add logic to add new resources
//     // ...
// });

module.exports = router;
