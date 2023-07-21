const { connectToDatabase } = require("./models/database");

async function checkRole(req, res, next) {
    const userEmail = req.body.email;
    const db = await connectToDatabase();

    try {
        const user = await db.collection("users").findOne({ email: userEmail });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (user.role !== "power") {
            return res
                .status(403)
                .json({ message: "You don't have the required permission." });
        }

        next();
    } catch (error) {
        console.error("Error checking user role:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}

module.exports = checkRole;
