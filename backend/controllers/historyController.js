import { db } from "../src/db/index.js";
import { chats, documents } from "../src/db/schema.js";
import { eq, desc } from "drizzle-orm";

export const historyController = async (req, res) => {
    try {
        // Find the most recently uploaded document for this user
        const userDocs = await db.select()
            .from(documents)
            .where(eq(documents.userId, req.user.uid))
            .orderBy(desc(documents.uploadedAt));
        
        if (userDocs.length === 0) {
            return res.status(200).json({ chats: [], activeDocument: null });
        }
        
        const latestDoc = userDocs[0];
        
        // Fetch all chat history for this specific document
        const documentChats = await db.select()
            .from(chats)
            .where(eq(chats.documentId, latestDoc.id))
            .orderBy(chats.createdAt); // Order by oldest to newest so it reads top-to-bottom
        
        return res.status(200).json({
            activeDocument: latestDoc,
            allDocuments: userDocs,
            chats: documentChats
        });
    } catch (error) {
        console.error("History fetch error:", error);
        return res.status(500).json({ message: "Failed to fetch history" });
    }
};
