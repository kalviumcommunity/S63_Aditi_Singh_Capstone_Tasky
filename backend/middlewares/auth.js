const jwt = require("jsonwebtoken");

exports.authenticate = (req, res, next) => {
  console.log('Auth middleware hit!');
  console.log('Authorization Header:', req.headers.authorization);
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token. Unauthorized." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token." });
  }
};


exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // Check role from req.session.user
    if (!req.session || !req.session.user || !roles.includes(req.session.user.role)) {
      console.log('Access denied: User does not have required role.');
      return res.status(403).json({ message: "Access denied." });
    }
    next();
  };
};

// Middleware to check if user is authenticated via session
exports.isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    console.log('User authenticated via session.', req.session.user);
    return next();
  } else {
    console.log('User not authenticated via session.');
    return res.status(401).json({ error: 'Unauthorized' });
  }
};
