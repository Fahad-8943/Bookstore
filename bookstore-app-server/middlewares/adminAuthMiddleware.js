const jwt = require("jsonwebtoken");

const adminAuthMiddleWare = (req, res, next) => {
  console.log("Inside authentication middleware");

  const authHeader = req.headers["authorization"];
  console.log("Authorization Header:", authHeader);

  const token = authHeader?.split(" ")[1];
  console.log("Token:", token);

  console.log("JWT Secret exists:", !!process.env.JWTSECRET);

  if (token) {
    try {
      const jwtResponse = jwt.verify(token, process.env.JWTSECRET);

      console.log("Decoded JWT:", jwtResponse);

      req.payload = {
        userEmail: jwtResponse.userEmail,
      };
      const role = jwtResponse.role;

      if (role == "admin") {
        next();
      } else {
        res.status(401).json("Authorization failed .. un-authorized access");
      }
    } catch (err) {
      console.log("JWT ERROR:", err.message);

      return res.status(401).json({
        message: "Invalid Token",
        error: err.message,
      });
    }
  } else {
    return res.status(401).json("Authorization failed.. Token is Missing");
  }
};

module.exports = adminAuthMiddleWare;
