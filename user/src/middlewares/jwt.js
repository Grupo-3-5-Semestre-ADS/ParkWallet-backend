import jsonwebtoken from "jsonwebtoken";

export const generateToken = (user) => {
    const payload = { id: user.id, email: user.email };
    const options = { expiresIn: process.env.JWT_EXPIRATION_TIME };
    return jsonwebtoken.sign(payload, process.env.JWT_SECRET, options);
  };

  
export const verify = (req, res, next) => {
    /*
    #swagger.tags = ["Auth"]
    #swagger.description = "Verifies the JWT token in the request header."
    #swagger.autoHeaders = false
    #swagger.security = [{
      "bearerAuth": {}
    }]
     */
    const authHeader = req.headers.authorization;
  
    if (!authHeader) {
      return res.unauthorized();
    }
  
    const token = authHeader.split(" ")[1];
  
    return jsonwebtoken.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        return res.unauthorized();
      }
  
      req.payload = payload;
      return next();
    })
  }
  