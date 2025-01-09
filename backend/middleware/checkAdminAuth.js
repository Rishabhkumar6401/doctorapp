const jwt = require("jsonwebtoken");

// Middleware to check if admin is logged in
const checkAdminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if(!authHeader){
    res.status(401).json({
      success: false,
      message: "Unauthorised user!",
    });

  }
 try {
  const token = authHeader.split(' ')[1];
   const decoded =  jwt.verify(token, "SECRET")
   req.admin = decoded;
   next();
 } catch (error) {
  res.status(401).json({
    success: false,
    message: "Unauthorised user!",
  });
  
 }
  
};

module.exports = checkAdminAuth;

