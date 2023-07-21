const express = require("express");
const router = express.Router();
const { connectToDatabase } = require("../models/database");

router.get("/lu-problemsolver-marathon-contest", async (req, res) => {
    const db = await connectToDatabase();
    const shortContest = await db
        .collection("lu-problemsolver-marathon-contest")
        .find({})
        .toArray();
    res.send(shortContest);
});

module.exports = router;
