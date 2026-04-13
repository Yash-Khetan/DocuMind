import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided. Unauthorized.' });
        }

        const token = authHeader.split('Bearer ')[1];

        // Verify JWT
        const decoded = jwt.verify(token, JWT_SECRET);

        // Attach user information to the request so controllers can use it
        req.user = decoded;

        next();
    } catch (error) {
        console.error("Token verification error:", error.message);
        return res.status(403).json({ error: 'Invalid or expired token. Unauthorized.' });
    }
};
