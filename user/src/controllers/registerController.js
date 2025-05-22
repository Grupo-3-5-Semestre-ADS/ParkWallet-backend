import User from '../models/userModel.js';

export const createUser = async (req, res, next) => {
    /*
      #swagger.tags = ["Register"]
      #swagger.requestBody = {
        required: true,
        schema: { $ref: "#/components/schemas/CreateOrUpdateUser" }
      }
      #swagger.responses[201]
    */
    try {
      const { name, email, cpf, password, birthdate } = req.body;

      const user = await User.create({
        name,
        email,
        cpf,
        password,
        birthdate,
        active: true,
        role: 'CUSTOMER' // atribuição direta
      });

      res.createdResponse();
    } catch (err) {
      if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
          message: "Validation error",
          errors: err.errors.map(e => ({ field: e.path, message: e.message }))
        });
      }

      next(err);
    }
  };
