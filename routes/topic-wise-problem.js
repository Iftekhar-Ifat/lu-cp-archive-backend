const express = require("express");
const router = express.Router();
const { connectToDatabase } = require("../models/database");

router.get("/topicProblems/:topic", async (req, res) => {
    const db = await connectToDatabase();
    const currentRoute = req.params.topic;
    const topicWiseProblem = await db
        .collection("topic-wise")
        .find({
            route: currentRoute,
        })
        .toArray();
    res.send(topicWiseProblem);
});

module.exports = router;
