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

      const role = await Role.findOne({ where: { name: 'CUSTOMER' } });

      if (!role) {
        return res.status(404).json({ message: 'Role not found' });
      }

      await user.addRole(role);
  
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