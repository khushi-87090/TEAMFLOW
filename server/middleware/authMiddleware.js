const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // 1. Grab the token from the request header
  const token = req.header('Authorization');

  // 2. If there is no token, deny access
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // 3. The token usually looks like "Bearer eyJhbG..." so we remove the "Bearer " part
    const cleanToken = token.replace('Bearer ', '');

    // 4. Verify the token using your secret key
    const verified = jwt.verify(cleanToken, process.env.JWT_SECRET);
    
    // 5. Attach the verified user ID to the request so the next function can use it
    req.user = verified;
    next(); // Pass control to the next function
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

module.exports = verifyToken;