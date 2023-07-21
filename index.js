const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
const cardsRoute = require("./routes/cards");
const cfProblemsRoute = require("./routes/cf-problems");
const intraLuContestRoute = require("./routes/intra-lu-contest");
const leaderBoardRoute = require("./routes/leaderboard");
const lupsMarathonContestRoute = require("./routes/lups-marathon-contest");
const lupsShortContestRoute = require("./routes/lups-short-contest");
const resourcesRoute = require("./routes/resources");
const tagsRoute = require("./routes/tags");
const sendData = require("./routes/send-data");
const topicwiseProblemsRoute = require("./routes/topic-wise-problem");
const usersRoute = require("./routes/users");
const deleteData = require("./routes/delete-data");

app.use(cardsRoute);
app.use(cfProblemsRoute);
app.use(intraLuContestRoute);
app.use(leaderBoardRoute);
app.use(lupsMarathonContestRoute);
app.use(lupsShortContestRoute);
app.use(resourcesRoute);
app.use(tagsRoute);
app.use(sendData);
app.use(topicwiseProblemsRoute);
app.use(usersRoute);
app.use(deleteData);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
