import { User, Role } from '../models/index.js';

export const showUser = async (req, res, next) => {
  /*
  #swagger.tags = ["Users"]
  #swagger.responses[200]
  #swagger.responses[404] = {
    schema: { $ref: "#/definitions/NotFound" }
  }
  */
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, { include: ['roles'] });

    if (!user) return res.notFoundResponse();

    res.hateoas_item(user);
  } catch (err) {
    next(err);
  }
};

export const listUsers = async (req, res, next) => {
  /*
  #swagger.tags = ["Users"]
  #swagger.responses[200]
  */
  try {
    const { _page = 1, _size = 10, _order = 'id', ...filter } = req.query;
    const offset = (_page - 1) * _size;

    const { rows: users, count: totalItems } = await User.findAndCountAll({
      where: filter,
      offset,
      limit: parseInt(_size),
      order: [[_order, 'ASC']],
      include: ['roles']
    });

    const totalPages = Math.ceil(totalItems / _size);
    res.hateoas_list(users, totalPages);
  } catch (err) {
    next(err);
  }
};

export const createUser = async (req, res, next) => {
  /*
  #swagger.tags = ["Auth"]
  #swagger.requestBody = {
    required: true,
    schema: { $ref: "#/definitions/CreateOrUpdateUser" }
  }
  #swagger.responses[200]
  */
  try {
    const { name, email, cpf, password, birthdate, inactive } = req.body;

    await User.create({ name, email, cpf, password, birthdate, inactive });
    res.createdResponse();
  } catch (err) {
    next(err);
  }
};

export const editUser = async (req, res, next) => {
  /*
  #swagger.tags = ["Users"]
  #swagger.requestBody = {
    required: true,
    schema: { $ref: "#/definitions/CreateOrUpdateUser" }
  }
  #swagger.responses[200]
  #swagger.responses[404] = {
    schema: { $ref: "#/definitions/NotFound" }
  }
  */
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) return res.notFoundResponse();

    const { name, email, cpf, password, birthdate, inactive } = req.body;

    await user.update({ name, email, cpf, password, birthdate, inactive });
    res.hateoas_item(user);
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  /*
  #swagger.tags = ["Users"]
  #swagger.responses[204]
  #swagger.responses[404] = {
    schema: { $ref: "#/definitions/NotFound" }
  }
  */
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) return res.notFoundResponse();

    await user.destroy();
    res.noContentResponse();
  } catch (err) {
    next(err);
  }
};

// Adicionar um papel ao usuário
export const addRoleToUser = async (req, res, next) => {
  /*
  #swagger.tags = ["Users"]
  #swagger.requestBody = {
    required: true,
    schema: { roleId: 1 }
  }
  #swagger.responses[200]
  #swagger.responses[404] = {
    schema: { $ref: "#/definitions/NotFound" }
  }
  */
  try {
    const { id } = req.params;
    const { roleId } = req.body;

    const user = await User.findByPk(id);
    const role = await Role.findByPk(roleId);

    if (!user || !role) return res.notFoundResponse();

    await user.addRole(role);
    res.hateoas_item(user);
  } catch (err) {
    next(err);
  }
};

// Listar papéis de um usuário
export const listUserRoles = async (req, res, next) => {
  /*
  #swagger.tags = ["Users"]
  #swagger.responses[200]
  */
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) return res.notFoundResponse();

    const roles = await user.getRoles();
    res.hateoas_list(roles);
  } catch (err) {
    next(err);
  }
};

// Remover um papel de um usuário
export const removeRoleFromUser = async (req, res, next) => {
  /*
  #swagger.tags = ["Users"]
  #swagger.requestBody = {
    required: true,
    schema: { roleId: 1 }
  }
  #swagger.responses[200]
  #swagger.responses[404] = {
    schema: { $ref: "#/definitions/NotFound" }
  }
  */
  try {
    const { id } = req.params;
    const { roleId } = req.body;

    const user = await User.findByPk(id);
    const role = await Role.findByPk(roleId);

    if (!user || !role) return res.notFoundResponse();

    await user.removeRole(role);
    res.hateoas_item(user);
  } catch (err) {
    next(err);
  }
};

