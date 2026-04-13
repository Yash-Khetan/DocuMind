import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { PDFParse } = require("pdf-parse");
import { chunkTextWithOverlap } from "./chunksGeneration.js";
import { generate_embeddings } from "./embeddingsGeneration.js";
import { db } from "../src/db/index.js";
import { documents, chunks } from "../src/db/schema.js";

export const uploadController = async (req, res) => {
    const file = req.file;

    if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    const name = file.originalname;

    if (!(name.endsWith(".pdf"))) {
        return res.status(400).json({ message: "Only PDF supported" });
    }

    try {
        // Pass the buffer exactly how pdf-parse expects it
        const parser = new PDFParse({ data: file.buffer });

        // In this version of pdf-parse, getText() returns an object with a .text property
        const data = await parser.getText();
        const extractedText = data.text;

        if (!extractedText || typeof extractedText !== 'string' || extractedText.trim() === '') {
            return res.status(400).json({ message: "No text found in PDF" });
        }

        // 1. Insert document record
        const [doc] = await db.insert(documents).values({
            name: name,
            userId: req.user.uid,
        }).returning();

        console.log("Document inserted:", doc.id);

        // 2. Chunk the text
        const textChunks = chunkTextWithOverlap(extractedText, 400, 100);

        // 3. Generate embeddings for all chunks
        const embeddings = await generate_embeddings(textChunks);

        // 4. Insert chunks + embeddings into DB
        const chunkRecords = textChunks.map((chunk, i) => ({
            documentId: doc.id,
            content: chunk,
            embedding: embeddings[i],
        }));

        await db.insert(chunks).values(chunkRecords);

        console.log(`Stored ${chunkRecords.length} chunks for document ${doc.id}`);

        return res.json({
            message: "Processed successfully",
            documentId: doc.id,
            chunksCount: chunkRecords.length,
        });
    } catch (err) {
        console.error("Upload error:", err);
        return res.status(500).json({ message: "Failed to process file", error: err.message });
    }
};