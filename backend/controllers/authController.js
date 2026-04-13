import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../src/db/index.js";
import { users } from "../src/db/schema.js";
import { eq } from "drizzle-orm";

const JWT_SECRET = process.env.JWT_SECRET;

export const registerController = async (req, res) => {
    const { email, password, name } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    try {
        // Check if user already exists
        const existing = await db.select().from(users).where(eq(users.email, email));
        if (existing.length > 0) {
            return res.status(409).json({ message: "User already exists." });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate a unique ID
        const userId = crypto.randomUUID();

        // Insert user
        await db.insert(users).values({
            id: userId,
            email,
            password: hashedPassword,
            name: name || "DocuMind User",
        });

        // Generate JWT
        const token = jwt.sign({ uid: userId, email }, JWT_SECRET, { expiresIn: "7d" });

        return res.status(201).json({ token, user: { id: userId, email, name: name || "DocuMind User" } });
    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({ message: "Registration failed." });
    }
};

export const loginController = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    try {
        // Find user
        const result = await db.select().from(users).where(eq(users.email, email));
        if (result.length === 0) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        const user = result[0];

        if (!user.password) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        // Compare password
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        // Generate JWT
        const token = jwt.sign({ uid: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

        return res.status(200).json({ token, user: { id: user.id, email: user.email, name: user.name } });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Login failed." });
    }
};
