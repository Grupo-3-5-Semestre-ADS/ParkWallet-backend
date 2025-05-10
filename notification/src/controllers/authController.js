import jsonwebtoken from "jsonwebtoken";


export const verify = (role) => {
  return (req, res, next) => {
    /*
    #swagger.autoHeaders = false
    #swagger.security = [{
      "bearerAuth": {}
    }]
    */
    const authHeader = req.headers.authorization;
    console.log("authHeader", authHeader);

    if (!!authHeader) {
      const token = authHeader.split(" ")[1];

      const JWTSECRET = process.env.JWT_SECRET;
      return jsonwebtoken.verify(token, JWTSECRET, (err, payload) => {
        if (err) return res.unauthorized();

        req.payload = payload;

        // Se o usuário for ADMIN, ignore a verificação de outras roles
        if (payload.roles.includes('ADMIN')) {
          return next();
        }

        // Verifica se o usuário tem a role necessária
        if (role && !payload.roles.includes(role)) {
          return res.unauthorized('Role não autorizada');
        }

        return next();
      });
    }

    res.unauthorized();
  };
};
