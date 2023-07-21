const express = require("express");
const router = express.Router();
const { connectToDatabase } = require("../models/database");
const checkRole = require("../middleware");

router.get("/cards", async (req, res) => {
    const db = await connectToDatabase();
    const cardData = await db.collection("cards").find({}).toArray();
    res.send(cardData);
});

router.post("/add-cards", checkRole, async (req, res) => {
    const db = await connectToDatabase();
    const newCardTitle = req.body.title;
    const processedItem = {
        icon: req.body.icon,
        title: req.body.title,
        subtitle: req.body.subtitle,
    };
    const dataExist = await db
        .collection("cards")
        .find({ title: newCardTitle })
        .limit(1)
        .toArray();

    if (dataExist.length === 0) {
        const insertCards = await db
            .collection("cards")
            .insertOne(processedItem);
        res.send(insertCards);
    } else {
        res.send("Error");
    }
});

module.exports = router;
