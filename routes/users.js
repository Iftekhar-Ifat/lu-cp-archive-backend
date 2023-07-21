const express = require("express");
const router = express.Router();
const { connectToDatabase } = require("../models/database");

router.get("/users", async (req, res) => {
    const db = await connectToDatabase();

    const currentUserEmail = req.query.currentUserEmail;

    if (currentUserEmail) {
        const userData = await db
            .collection("users")
            .find({ email: req.query.currentUserEmail })
            .toArray();
        res.send(userData[0]);
    } else {
        const userData = await db.collection("users").find({}).toArray();
        res.send(userData);
    }
});

router.post("/send-user", async (req, res) => {
    const db = await connectToDatabase();

    const userEmail = req.body.email;
    const userExist = await db
        .collection("users")
        .find({ email: userEmail })
        .limit(1)
        .toArray();

    if (userExist.length === 0) {
        await db.collection("users").insertOne(req.body);
        res.send("Success");
    } else {
        res.send("Already Exists");
    }
});

router.post("/send-handle", async (req, res) => {
    const db = await connectToDatabase();

    const currentUserEmail = req.body.handleInfo.userEmail;
    const platformName = req.body.handleInfo.platform;
    const userHandle = req.body.handleInfo.handle;

    const handleObject = {
        platform: platformName,
        handle: userHandle,
    };

    // Find the document with the given email
    const document = await db.collection("users").findOne({
        email: currentUserEmail,
    });

    if (document) {
        const handles = document.handles;

        // Check if the handles array is empty
        if (handles.length === 0) {
            handles.push(handleObject);
        } else {
            // Find the index of the object with the same platform value
            const matchingIndex = handles.findIndex(
                (handle) => handle.platform === handleObject.platform
            );

            if (matchingIndex !== -1) {
                // Replace the object at the matching index with the new object
                handles.splice(matchingIndex, 1, handleObject);
            } else {
                // Add the new object to the handles array
                handles.push(handleObject);
            }
        }

        // Update the document in the collection
        const setHandle = await db
            .collection("users")
            .updateOne(
                { email: currentUserEmail },
                { $set: { handles: handles } }
            );

        res.json(setHandle);
    } else {
        console.log("Document not found.");
    }
});

router.post("/update-problem-status", async (req, res) => {
    const db = await connectToDatabase();

    const currentUserEmail = req.body.email;
    const currentStatus = req.body.status;
    const problemURL = req.body.url;

    const allArrays = ["solving", "solved", "reviewing", "skipped"];

    allArrays.forEach((element) => {
        let checkQuery = {};
        checkQuery["status." + element] = problemURL;

        // eslint-disable-next-line no-unused-vars
        const getUserProblems = db.collection("users").updateOne(
            {
                email: currentUserEmail,
            },
            { $pull: checkQuery }
        );
    });

    let query = {};
    query["status." + currentStatus] = problemURL;

    const dataExist = await db
        .collection("users")
        .find({ email: currentUserEmail })
        .limit(1)
        .toArray();

    let updateStatus;
    if (dataExist.length > 0) {
        updateStatus = await db.collection("users").updateOne(
            {
                email: currentUserEmail,
            },
            { $push: query }
        );
    }
    res.send(updateStatus);
});

module.exports = router;
