const express = require("express");
const router = express.Router();
const { connectToDatabase } = require("../models/database");

router.get("/lu-problemsolver-short-contest", async (req, res) => {
    const db = await connectToDatabase();
    const shortContest = await db
        .collection("lu-problemsolver-short-contest")
        .find({})
        .toArray();
    res.send(shortContest);
});

module.exports = router;
