// src/middleware/authMiddleware.js - Authentication middleware
const authMiddleware = (req, res, next) => {
    // Check if user is authenticated via session
    if (req.session && req.session.user) {
      return next();
    }
    
    return res.status(401).json({ message: 'Unauthorized: Please login to continue' });
  };
  
  export default authMiddleware;