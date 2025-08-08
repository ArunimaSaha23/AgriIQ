import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
    try {
        const { token } = req.headers;

        if (!token) {
            return res.status(401).json({ success: false, message: 'Not authorized: Token missing' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user info to req.user instead of req.body
        req.user = { id: decoded.id };

        next();
    } catch (error) {
        console.error('Auth error:', error);
        res.status(401).json({ success: false, message: 'Not authorized: Invalid token' });
    }
};

export default authUser;
