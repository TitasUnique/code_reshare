const jwt = require('njwt')
const logger = require('./logger')

const jwtBlacklist = new Set();

// ------------------------- include all controllers here ----------------------------

module.exports.authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];

        // Check if the token is provided in Bearer format
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Access token missing.',
                data: []
            });
        }

        // Extract the token from the Bearer header
        const token = authHeader.split(' ')[1];

        if (jwtBlacklist.has(token)) {
            return res.status(403).json({
                success: false,
                message: 'Token has been invalidated. Please log in again.',
                data: []
            });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach decoded payload to the request object for use in controllers
        req.user = decoded;

        next();
    } catch (err) {
        // Handle token verification errors
        const errorMessage = err.name === 'TokenExpiredError' 
            ? 'Access token has expired.' 
            : 'Invalid or malformed token.';
        
        return res.status(403).json({
            success: false,
            message: errorMessage,
            data: []
        });
    }
};

module.exports.jwtBlacklist = jwtBlacklist;

module.exports.authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this resource.'
      });
    }
    next();
  };
};
