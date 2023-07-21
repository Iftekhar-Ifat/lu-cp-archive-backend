const express = require("express");
const router = express.Router();
const { connectToDatabase } = require("../models/database");

router.delete("/delete-data", async (req, res) => {
    const db = await connectToDatabase();
    const selectedProblem = req.body;
    const deleteProblem = db
        .collection("topic-wise")
        .deleteOne(selectedProblem);
    res.send(deleteProblem);
});

module.exports = router;
