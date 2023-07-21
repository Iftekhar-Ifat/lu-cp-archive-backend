const express = require("express");
const router = express.Router();
const { connectToDatabase } = require("../models/database");

router.get("/intra-lu-contest", async (req, res) => {
    const db = await connectToDatabase();
    const shortContest = await db
        .collection("intra-lu-contest")
        .find({})
        .toArray();
    res.send(shortContest);
});

module.exports = router;
