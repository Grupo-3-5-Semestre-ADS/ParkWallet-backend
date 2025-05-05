import { User, Role } from '../models/index.js';

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
      const { name, email, cpf, password, birthdate, inactive } = req.body;
  
      const user = await User.create({
        name,
        email,
        cpf,
        password,
        birthdate,
        inactive
      });
  
      res.createdResponse();
    } catch (err) {
      next(err);
    }
  };