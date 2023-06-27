const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const port = process.env.PORT || 5000;

//app initialization
const app = express();
app.use(express.json());

//connecting to database
const MongoURI = `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASS}@cluster0-shard-00-00.rjalm.mongodb.net:27017,cluster0-shard-00-01.rjalm.mongodb.net:27017,cluster0-shard-00-02.rjalm.mongodb.net:27017/luca?ssl=true&replicaSet=atlas-pit1kf-shard-0&authSource=admin&retryWrites=true&w=majority`;

const client = new MongoClient(MongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// server side functions
async function serverSide() {
    try {
        await client.connect();
        // database collections
        const database = client.db("luca");
        const users = database.collection("users");
        const CFproblems = database.collection("cf-problems");
        const IntraLuContest = database.collection("intra-lu-contest");
        const LuProblemSolverMarathon = database.collection(
            "lu-problemsolver-marathon-contest"
        );
        const LuProblemSolverShortContest = database.collection(
            "lu-problemsolver-short-contest"
        );
        const Resources = database.collection("resources");
        const TopicWise = database.collection("topic-wise");
        const Tags = database.collection("tags");
        const Cards = database.collection("cards");
        const Leaderboard = database.collection("leaderboard");

        /*
            GET request start ....
        */

        //getting cards info
        app.get("/cards", async (req, res) => {
            const cardData = await Cards.find({}).toArray();
            res.send(cardData);
        });

        // getting all the users
        app.get("/users", async (req, res) => {
            const currentUserEmail = req.query.currentUserEmail;
            if (currentUserEmail) {
                const userData = await users
                    .find({ email: req.query.currentUserEmail })
                    .toArray();
                res.send(userData[0]);
            } else {
                const userData = await users.find({}).toArray();
                res.send(userData);
            }
        });

        // getting leaderboard
        app.get("/leaderboard", async (req, res) => {
            const leaderboard = await Leaderboard.find({
                key: "leaderboard-key",
            }).toArray();
            res.send(leaderboard);
        });

        // getting topic-wise problem according to the route
        app.get("/topicProblems/:topic", async (req, res) => {
            const currentRoute = req.params.topic;
            const topicWiseProblem = await TopicWise.find({
                route: currentRoute,
            }).toArray();
            res.send(topicWiseProblem);
        });

        //getting resources according to the route
        app.get("/resources/:topic", async (req, res) => {
            const currentRoute = req.params.topic;
            const TopicWiseResources = await Resources.find({
                route: currentRoute,
            }).toArray();

            res.send(TopicWiseResources);
        });

        //getting cf problems
        app.get("/codeforces-problems/:ladder", async (req, res) => {
            const currentRoute = req.params.ladder;
            const codeforcesProblems = await CFproblems.find({
                route: currentRoute,
            }).toArray();
            res.send(codeforcesProblems);
        });

        //getting intra-lu-contest page content
        app.get("/intra-lu-contest", async (req, res) => {
            const intraLuContest = await IntraLuContest.find({}).toArray();
            res.send(intraLuContest);
        });

        //getting lu-problemsolver-marathon-contest
        app.get("/lu-problemsolver-marathon-contest", async (req, res) => {
            const marathonContest = await LuProblemSolverMarathon.find(
                {}
            ).toArray();
            res.send(marathonContest);
        });

        //getting lu-problemsolver-short-contest
        app.get("/lu-problemsolver-short-contest", async (req, res) => {
            const shortContest = await LuProblemSolverShortContest.find(
                {}
            ).toArray();
            res.send(shortContest);
        });

        //getting tags
        app.get("/all-tags", async (req, res) => {
            const allTags = await Tags.find({}).toArray();
            res.send(allTags);
        });

        /*
            GET request end ....
        */

        /*
            POST request start ....
        */

        //adding new user
        app.post("/send-user", async (req, res) => {
            const userEmail = req.body.email;
            const userExist = await users
                .find({ email: userEmail })
                .limit(1)
                .toArray();

            if (userExist.length === 0) {
                await users.insertOne(req.body);
                res.send("Success");
            } else {
                res.send("Already Exists");
            }
        });

        //updating Handle
        app.post("/send-handle", async (req, res) => {
            const currentUserEmail = req.body.handleInfo.userEmail;
            const platformName = req.body.handleInfo.platform;
            const userHandle = req.body.handleInfo.handle;

            const handleObject = {
                platform: platformName,
                handle: userHandle,
            };

            // Find the document with the given email
            const document = await users.findOne({
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
                const setHandle = await users.updateOne(
                    { email: currentUserEmail },
                    { $set: { handles: handles } }
                );

                res.json(setHandle);
            } else {
                console.log("Document not found.");
            }
        });

        //updating leaderboard
        app.post("/send-leaderboard", async (req, res) => {
            const leaderboard = req.body;
            const addLeaderboard = await Leaderboard.updateOne(
                { key: "leaderboard-key" },
                { $set: { leaderboard: leaderboard } }
            );
            res.send(addLeaderboard);
        });

        //sending data to database
        app.post("/send-data", async (req, res) => {
            if (req.body.itemId === "resources") {
                const resourceURL = req.body.url;
                if (req.body.route === "intra-lu-contest") {
                    const resourceExist = await IntraLuContest.find({
                        url: resourceURL,
                    })
                        .limit(1)
                        .toArray();

                    if (resourceExist.length === 0) {
                        const insertIntraLuContest =
                            await IntraLuContest.insertOne(req.body);
                        res.send(insertIntraLuContest);
                    } else {
                        res.send("Error");
                    }
                } else if (
                    req.body.route === "lu-problemsolver-marathon-contest"
                ) {
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
                } else if (
                    req.body.route === "lu-problemsolver-short-contest"
                ) {
                    const resourceExist =
                        await LuProblemSolverShortContest.find({
                            url: resourceURL,
                        })
                            .limit(1)
                            .toArray();

                    if (resourceExist.length === 0) {
                        const insertShortContest =
                            await LuProblemSolverShortContest.insertOne(
                                req.body
                            );
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
                        const insertResources = await Resources.insertOne(
                            req.body
                        );
                        res.send(insertResources);
                    } else {
                        res.send("Error");
                    }
                }
            } else if (req.body.itemId === "topic-wise") {
                const itemUrl = req.body.url;
                console.log(req.body);

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
                    const insertTopicWise = await TopicWise.insertOne(
                        processedItem
                    );
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
                    const insertCFproblems = await CFproblems.insertOne(
                        processedItem
                    );
                    res.send(insertCFproblems);
                } else {
                    res.send("Error");
                }
            }
        });

        /*
            POST request end ....
        */

        // update problem status
        app.post("/update-problem-status", async (req, res) => {
            const currentUserEmail = req.body.email;
            const currentStatus = req.body.status;
            const problemURL = req.body.url;

            const allArrays = ["solving", "solved", "reviewing", "skipped"];

            allArrays.forEach((element) => {
                let checkQuery = {};
                checkQuery["status." + element] = problemURL;

                const getUserProblems = users.updateOne(
                    {
                        email: currentUserEmail,
                    },
                    { $pull: checkQuery }
                );
            });

            let query = {};
            query["status." + currentStatus] = problemURL;

            const dataExist = await users
                .find({ email: currentUserEmail })
                .limit(1)
                .toArray();

            let updateStatus;
            if (dataExist.length > 0) {
                updateStatus = await users.updateOne(
                    {
                        email: currentUserEmail,
                    },
                    { $push: query }
                );
            }
            res.send(updateStatus);
        });

        //updating tags
        app.post("/update-tags", async (req, res) => {
            const newTag = req.body.tags;

            const addTag = await Tags.updateOne(
                { key: "tags_collection" },
                { $addToSet: { tags: newTag } }
            );
            res.send(newTag);
        });
        //updating cards
        app.post("/add-cards", async (req, res) => {
            const newCardTitle = req.body.title;
            const processedItem = {
                icon: req.body.icon,
                title: req.body.title,
                subtitle: req.body.subtitle,
            };
            const dataExist = await Cards.find({ title: newCardTitle })
                .limit(1)
                .toArray();

            if (dataExist.length === 0) {
                const insertCards = await Cards.insertOne(processedItem);
                res.send(insertCards);
            } else {
                res.send("Error");
            }
        });

        //deleting a problem
        app.delete("/delete-data", async (req, res) => {
            const selectedProblem = req.body;
            const deleteProblem = TopicWise.deleteOne(selectedProblem);
            res.send(deleteProblem);
        });
    } finally {
    }
}

serverSide().catch(console.dir);
app.use(cors());

client.connect((err) => {
    if (err) {
        console.error(err);
        return false;
    }
    // connection to mongo is successful, listen for requests
    app.listen(port, () => {
        console.log("server working at 5000");
    });
});
