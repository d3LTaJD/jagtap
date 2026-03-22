const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');

exports.protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  if (!token) {
    return res.status(401).json({ status: 'error', message: 'Not authorized to access this route' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId || decoded.id); 
    if (!req.user) {
      return res.status(401).json({ status: 'error', message: 'User belonging to token no longer exists' });
    }
    next();
  } catch (error) {
    return res.status(401).json({ status: 'error', message: 'Token is invalid or expired' });
  }
};

// Legacy role-based check
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ status: 'error', message: `User role ${req.user.role} is not authorized` });
    }
    next();
  };
};

 // Dynamic permission check
 exports.requirePermission = (moduleName, action) => {
   return async (req, res, next) => {
     // SUPER_ADMIN (SA code) implicitly has all permissions
     if (req.user.role === 'SA' || req.user.role === 'SUPER_ADMIN') {
       return next(); 
     }

     try {
       const roleDoc = await Role.findOne({ code: req.user.role });
       
       // Check primary role
       let hasPermission = false;
       if (roleDoc?.permissions) {
         const perms = roleDoc.permissions.get(moduleName);
         if (perms && perms[action] === true) hasPermission = true;
       }

       // Check secondary role (additive)
       if (!hasPermission && req.user.secondaryRole) {
         const secRole = await Role.findOne({ code: req.user.secondaryRole });
         if (secRole?.permissions) {
           const secPerms = secRole.permissions.get(moduleName);
           if (secPerms && secPerms[action] === true) hasPermission = true;
         }
       }

       if (hasPermission) return next();

       return res.status(403).json({ status: 'error', message: `Not authorized to perform ${action} on ${moduleName}` });
     } catch (err) {
       console.error('Permission check error:', err);
       return res.status(500).json({ status: 'error', message: 'Server error during permission check' });
     }
   };
 };
