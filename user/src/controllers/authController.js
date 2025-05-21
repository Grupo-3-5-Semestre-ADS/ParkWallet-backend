import jsonwebtoken from "jsonwebtoken";

export const generate = (req, res, next) => {
  if (!req.user) {
    return res.unauthorized();
  }

  const payload = {
    id: req.user.id,
    email: req.user.email,
    role: req.user.role,
  };

  const JWTSECRET = process.env.JWT_SECRET;
  const JWTEXPIRE = process.env.JWT_EXPIRATION_TIME;

  const token = jsonwebtoken.sign(payload, JWTSECRET, {
    expiresIn: JWTEXPIRE,
  });

  res.okResponse({ token });
};

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
        if (payload.role === 'ADMIN') return next();

        // Verifica se o usuário tem a role necessária
        if (role && payload.role !== role) return res.unauthorized('Role não autorizada');

        return next();
      });
    }

    res.unauthorized();
  };
};