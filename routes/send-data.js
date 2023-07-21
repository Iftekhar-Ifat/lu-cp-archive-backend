// multiple post request in this file ( bad design !)
const express = require("express");
const router = express.Router();
const { connectToDatabase } = require("../models/database");

const checkRole = require("../middleware");

router.post("/send-data", checkRole, async (req, res) => {
    const db = await connectToDatabase();

    const CFproblems = db.collection("cf-problems");
    const IntraLuContest = db.collection("intra-lu-contest");
    const LuProblemSolverMarathon = db.collection(
        "lu-problemsolver-marathon-contest"
    );
    const LuProblemSolverShortContest = db.collection(
        "lu-problemsolver-short-contest"
    );
    const Resources = db.collection("resources");
    const TopicWise = db.collection("topic-wise");

    if (req.body.itemId === "resources") {
        const resourceURL = req.body.url;
        if (req.body.route === "intra-lu-contest") {
            const resourceExist = await IntraLuContest.find({
                url: resourceURL,
            })
                .limit(1)
                .toArray();

            if (resourceExist.length === 0) {
                const insertIntraLuContest = await IntraLuContest.insertOne(
                    req.body
                );
                res.send(insertIntraLuContest);
            } else {
                res.send("Error");
            }
        } else if (req.body.route === "lu-problemsolver-marathon-contest") {
            const resourceExist = await LuProblemSolverMarathon.find({
                url: resourceURL,
            })
                .limit(1)
                .toArray();

            if (resourceExist.length === 0) {
                const insertMarathonContest =
                    await LuProblemSolverMarathon.insertOne(req.body);
                res.send(insertMarathonContest);
            } else {
                res.send("Error");
            }
        } else if (req.body.route === "lu-problemsolver-short-contest") {
            const resourceExist = await LuProblemSolverShortContest.find({
                url: resourceURL,
            })
                .limit(1)
                .toArray();

            if (resourceExist.length === 0) {
                const insertShortContest =
                    await LuProblemSolverShortContest.insertOne(req.body);
                res.send(insertShortContest);
            } else {
                res.send("Error");
            }
        } else {
            const resourceExist = await Resources.find({
                url: resourceURL,
            })
                .limit(1)
                .toArray();

            if (resourceExist.length === 0) {
                const insertResources = await Resources.insertOne(req.body);
                res.send(insertResources);
            } else {
                res.send("Error");
            }
        }
    } else if (req.body.itemId === "topic-wise") {
        const itemUrl = req.body.url;

        const processedItem = {
            title: req.body.title,
            url: req.body.url,
            difficulty: req.body.difficulty,
            route: req.body.route,
            tags: req.body.tags,
        };

        const dataExist = await TopicWise.find({ url: itemUrl })
            .limit(1)
            .toArray();

        if (dataExist.length === 0) {
            const insertTopicWise = await TopicWise.insertOne(processedItem);
            res.send(insertTopicWise);
        } else {
            res.send("Error");
        }
    } else if (req.body.itemId === "cf-problems") {
        const itemUrl = req.body.url;

        const processedItem = {
            title: req.body.title,
            url: req.body.url,
            difficulty: req.body.difficulty,
            route: req.body.route,
        };
        const dataExist = await CFproblems.find({ url: itemUrl })
            .limit(1)
            .toArray();

        if (dataExist.length === 0) {
            const insertCFproblems = await CFproblems.insertOne(processedItem);
            res.send(insertCFproblems);
        } else {
            res.send("Error");
        }
    }
});

module.exports = router;
