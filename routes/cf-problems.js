const express = require("express");
const router = express.Router();
const { connectToDatabase } = require("../models/database");

router.get("/codeforces-problems/:ladder", async (req, res) => {
    const db = await connectToDatabase();
    const currentRoute = req.params.ladder;
    const codeforcesProblems = await db
        .collection("cf-problems")
        .find({
            route: currentRoute,
        })
        .toArray();
    res.send(codeforcesProblems);
});

module.exports = router;
