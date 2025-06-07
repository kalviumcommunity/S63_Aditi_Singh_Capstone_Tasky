const jwt = require("jsonwebtoken");

exports.authenticate = (req, res, next) => {
  const requestId = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  req.requestId = requestId; // Attach a unique ID to the request
  console.log(`[Request ID: ${requestId}] Auth middleware hit!`);
  console.log(`[Request ID: ${requestId}] Request URL:`, req.originalUrl);
  console.log(`[Request ID: ${requestId}] Authorization Header:`, req.headers.authorization);
  console.log(`[Request ID: ${requestId}] Cookies:`, req.cookies);
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
    // Check role from req.user (populated by authenticate middleware)
    if (!req.user || !req.user.role || !roles.includes(req.user.role)) {
      console.log('Access denied: User does not have required role (checked via req.user.role).');
      return res.status(403).json({ message: "Access denied." });
    }
    next();
  };
};

// Middleware to check if user is authenticated via session
exports.isAuthenticated = (req, res, next) => {
  const requestId = req.requestId; // Retrieve the unique ID
  console.log(`[Request ID: ${requestId}] isAuthenticated middleware hit.`);
  console.log(`[Request ID: ${requestId}] req.session:`, req.session);
  console.log(`[Request ID: ${requestId}] req.session.user:`, req.session ? req.session.user : 'Session not found');
  if (req.session && req.session.user) {
    console.log('User authenticated via session.', req.session.user);
    // Optionally, populate req.user from session if needed for consistency
    req.user = req.session.user;
    return next();
  } else {
    console.log('User not authenticated via session.');
    return res.status(401).json({ error: 'Unauthorized' });
  }
};
