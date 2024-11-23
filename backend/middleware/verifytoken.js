const jwt = require('jsonwebtoken');

// Middleware to protect routes by verifying JWT
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extract token from the Authorization header
  if (!token) return res.status(403).json({ message: 'Access denied. No token provided.' });
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid or expired token' });
    req.user = decoded; // Save decoded token data (user ID) in request object
    next();
  });
};

module.exports = verifyToken;
