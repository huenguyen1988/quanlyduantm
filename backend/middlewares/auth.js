const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = (roles = []) => {
  if (typeof roles === 'string') roles = [roles];
  return async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Không có token' });
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      // Enrich user context with name/email for logging/display
      try {
        if (decoded && decoded.userId) {
          const dbUser = await User.findById(decoded.userId).select('name email role');
          if (dbUser) {
            req.user.name = dbUser.name;
            req.user.email = dbUser.email;
            req.user.role = dbUser.role || decoded.role;
          }
        }
      } catch (_) { /* ignore enrich errors */ }
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ error: 'Không đủ quyền' });
      }
      next();
    } catch (err) {
      res.status(401).json({ error: 'Token không hợp lệ' });
    }
  };
}; 