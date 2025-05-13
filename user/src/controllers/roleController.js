import { User, Role } from '../models/index.js';

export const showRole = async (req, res, next) => {
  /*
  #swagger.tags = ["Roles"]
  #swagger.responses[200]
  */

  try {
    const { id } = req.params;
    const role = await Role.findByPk(id, {
      include: [{ association: 'users' }],
    });

    if (!role) return res.notFoundResponse();

    res.hateoas_item(role);
  } catch (err) {
    next(err);
  }
};

export const listRoles = async (req, res, next) => {
  /*
  #swagger.tags = ["Roles"]
  #swagger.responses[200]
  */
  try {
    const roles = await Role.findAll();
    res.hateoas_list(roles);
  } catch (err) {
    next(err);
  }
};

export const createRole = async (req, res, next) => {
  /*
  #swagger.tags = ["Roles"]
  #swagger.requestBody = {
    required: true,
    schema: { $ref: "#/components/schemas/Role" }
  }
  #swagger.responses[200]
  */
  try {
    const { name, description, active } = req.body;
    if(!active) req.body.active = true;
    const role = await Role.create({ name, description, active });
    res.createdResponse(role);
  } catch (err) {
    next(err);
  }
};

export const editRole = async (req, res, next) => {
  /*
  #swagger.tags = ["Roles"]
  #swagger.requestBody = {
    required: true,
    schema: { $ref: "#/components/schemas/Role" }
  }
  #swagger.responses[200]
  */
  try {
    const { id } = req.params;
    const role = await Role.findByPk(id);

    if (!role) return res.notFoundResponse();

    const { name, description, active } = req.body;
    await role.update({ name, description, active });
    res.hateoas_item(role);
  } catch (err) {
    next(err);
  }
};

export const deleteRole = async (req, res, next) => {
  /*
    #swagger.tags = ["Roles"]
    #swagger.responses[204]
  */
  try {
    const { id } = req.params;

    const role = await Role.findByPk(id);

    if (!role) return res.notFoundResponse();

    await role.update({ active: false });
    await role.destroy();

    res.noContentResponse();
  } catch (err) {
    next(err);
  }
};

export const assignRolesToUser = async (req, res, next) => {
  /*
    #swagger.tags = ["User Roles"]
    #swagger.requestBody = {
      required: true,
      schema: { roles: ["admin", "editor"] }
    }
    #swagger.responses[200]
  */
  try {
    const { id } = req.params;
    const { roles } = req.body; // lista de nomes de roles

    const user = await User.findByPk(id);
    if (!user) return res.notFoundResponse();

    const roleRecords = await Role.findAll({
      where: { name: roles }
    });

    if (roleRecords.length !== roles.length) {
      return res.status(400).json({ message: 'Uma ou mais roles são inválidas.' });
    }

    await user.addRoles(roleRecords); // adiciona sem substituir
    const updatedUser = await User.findByPk(id, { include: ['roles'] });

    res.okResponse(updatedUser);
  } catch (err) {
    next(err);
  }
};

export const removeRolesFromUser = async (req, res, next) => {
  /*
    #swagger.tags = ["User Roles"]
    #swagger.requestBody = {
      required: true,
      schema: { roles: ["admin", "editor"] }
    }
    #swagger.responses[200]
  */
  try {
    const { id } = req.params;
    const { roles } = req.body;

    const user = await User.findByPk(id);
    if (!user) return res.notFoundResponse();

    const roleRecords = await Role.findAll({
      where: { name: roles }
    });

    await user.removeRoles(roleRecords);
    const updatedUser = await User.findByPk(id, { include: ['roles'] });

    res.okResponse(updatedUser);
  } catch (err) {
    next(err);
  }
};

