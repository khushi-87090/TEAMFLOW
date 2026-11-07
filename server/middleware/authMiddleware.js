const jwt = require('jsonwebtoken');

// Matches the fallback secret in routes/auth.js so tokens always verify properly
const JWT_SECRET = process.env.JWT_SECRET || 'teamflow_fallback_secret_key_2026';

const verifyToken = (req, res, next) => {
  // 1. Grab the token from the request header
  const token = req.header('Authorization');

  // 2. If there is no token, deny access
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // 3. Remove "Bearer " if present and trim any accidental spaces
    const cleanToken = token.replace('Bearer ', '').trim();

    // 4. Verify the token using the secret key (with fallback)
    const verified = jwt.verify(cleanToken, JWT_SECRET);
    
    // 5. Attach the verified user ID to the request so the next function can use it
    req.user = verified;
    next(); // Pass control to the next function
  } catch (error) {
    console.error('JWT Verification Error:', error.message);
    res.status(400).json({ message: 'Invalid token.' });
  }
};

module.exports = verifyToken;