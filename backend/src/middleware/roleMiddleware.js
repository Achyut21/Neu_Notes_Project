// src/middleware/roleMiddleware.js - Role-based access control
const roleMiddleware = (roles) => {
    return (req, res, next) => {
      // Check if user exists in session
      if (!req.session || !req.session.user) {
        return res.status(401).json({ message: 'Unauthorized: Please login to continue' });
      }
      
      // Check if user has required role
      if (roles.includes(req.session.user.role)) {
        return next();
      }
      
      return res.status(403).json({ message: 'Forbidden: You do not have permission to access this resource' });
    };
  };
  export default roleMiddleware;