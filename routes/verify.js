const status = require('http-status');
const jwt = require('jsonwebtoken');

function verify(...roles) {
    return (req, res, next) => {
        const token = req.header('token');
        if (!token) {
            return res.status(status.UNAUTHORIZED).json({
                error: "Access denied",
                message: "You are not logged in"
            });
        }
        try {
            const verifiedUser = jwt.verify(token, process.env.TOKEN_SECRET);
            if (!roles.includes(verifiedUser.role)) {
                res.status(status.FORBIDDEN).json({
                    error: "Forbidden access",
                    message: `Users with role: ${verifiedUser.role} cannot access this resource`
                });
            }
            req.user = verifiedUser;
            next();
        } catch (err) {
            res.status(status.UNAUTHORIZED).json({
                error: "Forbidden access",
                message: `Provided JWT token is invalid`
            });
        }
    };
}

module.exports = verify;