import jsonwebtoken from 'jsonwebtoken';

export const verify = (authorizedRoles = []) => {
  return (req, res, next) => {
    /*
    #swagger.autoHeaders = false
    #swagger.security = [{
      "bearerAuth": {}
    }]
    */
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.unauthorized();
    }

    const token = authHeader.split(' ')[1];
    req.token = token;
    const JWT_SECRET = process.env.JWT_SECRET;

    jsonwebtoken.verify(token, JWT_SECRET, (err, payload) => {
      if (err) {
        return res.unauthorized();
      }

      req.payload = payload;

      const {role: userRole} = payload;

      if (userRole === 'ADMIN') {
        return next();
      }

      if (authorizedRoles.length === 0) {
        return next();
      }

      if (authorizedRoles.includes(userRole)) {
        return next();
      }

      return res.unauthorized();
    });
  };
};
