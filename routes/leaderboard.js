const express = require("express");
const router = express.Router();
const { connectToDatabase } = require("../models/database");
const checkRole = require("../middleware");

router.get("/leaderboard", async (req, res) => {
    const db = await connectToDatabase();
    const leaderboard = await db
        .collection("leaderboard")
        .find({
            key: "leaderboard-key",
        })
        .toArray();
    res.send(leaderboard);
});

//updating leaderboard
router.post("/send-leaderboard", checkRole, async (req, res) => {
    const db = await connectToDatabase();
    const leaderboard = req.body.leaderboard;
    const addLeaderboard = await db
        .collection("leaderboard")
        .updateOne(
            { key: "leaderboard-key" },
            { $set: { leaderboard: leaderboard } }
        );
    res.send(addLeaderboard);
});

module.exports = router;
