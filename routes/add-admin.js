const express = require("express");
const router = express.Router();
const { connectToDatabase } = require("../models/database");
const checkRole = require("../middleware");

//updating admin
router.post("/add-admin", checkRole, async (req, res) => {
    const db = await connectToDatabase();
    const email = req.body.addAdmin;

    const usersCollection = await db.collection("users");

    const userExist = await usersCollection.findOne({ email: email });

    if (!userExist) {
        return res.status(200).json({ message: "User not found❗" });
    }

    await usersCollection.updateOne(
        { email: email },
        { $set: { role: "power" } }
    );

    return res.status(200).json({ message: "User role updated✔" });
});

module.exports = router;
