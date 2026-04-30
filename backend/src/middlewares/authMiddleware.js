const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('x-auth-token') || req.header('Authorization');

  if (!token) {
    // For now, we are using mock tokens, so we just log and proceed
    // In a real app, you would verify the JWT here:
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // req.user = decoded.user;
    return next();
  }

  try {
    // Mock verification for now
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
