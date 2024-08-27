const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: 'Access denied, token missing!' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Please Login or Signup to Proceed!' });
    }
};

const authorizeRole = (roles) => {
    return async (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        try {
            const user = await User.findById(req.user.id);
            if (!roles.includes(user.role)) {
                return res.status(403).json({ message: 'You do not have permission to perform this action' });
            }
            next();
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    };
};

module.exports = {
    authenticateJWT,
    authorizeRole
};