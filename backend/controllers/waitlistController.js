import { db } from "../src/db/index.js";
import { waitlist_users } from "../src/db/schema.js";

export const waitlistController = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        await db.insert(waitlist_users).values({
            email: email
        }).onConflictDoNothing(); // Prevent crash if they submit twice
        
        return res.status(200).json({ message: "Successfully joined waitlist" });
    } catch (error) {
        console.error("Waitlist error:", error);
        return res.status(500).json({ message: "Failed to join waitlist" });
    }
};
