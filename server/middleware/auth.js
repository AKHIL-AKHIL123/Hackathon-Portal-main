const jwt = require('jsonwebtoken');

function authMiddleware(allowedRoles = []) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ msg: 'No token' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ msg: 'No token' });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // id, role, email
      if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ msg: 'Access denied' });
      }
      next();
    } catch (err) {
      return res.status(401).json({ msg: 'Token invalid' });
    }
  };
}

module.exports = authMiddleware;
