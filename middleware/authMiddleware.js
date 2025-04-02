const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  // Extract the token from the Authorization header
  const authHeader = req.headers['authorization']; // or req.get('authorization')
  const token = authHeader && authHeader.split(' ')[1]; // Get the token part after 'Bearer'

  if (!token) {
    return res.status(401).json({ message: 'Token missing or invalid' });
  }

  // Verify token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token is not valid' });
    }

    // Attach user to the request object
    req.user = user;
    next(); // Proceed to the next middleware or route handler
  });
}

module.exports = authenticateToken;
