import jsonwebtoken from "jsonwebtoken";

export const verify = (req, res, next) => {
  /*
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
