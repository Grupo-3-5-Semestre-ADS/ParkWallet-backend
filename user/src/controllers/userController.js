import User from '../models/userModel.js';

export const login = async (req, res, next) => {
  /*
  #swagger.tags = ["Login"]
  #swagger.responses[200]
  #swagger.responses[401]
  */
  const {email, password} = req.body;

  const user = await User.scope('withPassword').findOne({
    where: {email}
  });

  if (!user) {
    return res.unauthorized();
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    return res.unauthorized();
  }

  req.user = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  next();
};

export const showUser = async (req, res, next) => {
  /*
  #swagger.tags = ["Users"]
  #swagger.responses[200]
  */
  try {
    const {id} = req.params;

    const user = await User.findByPk(id);

    if (!user) return res.notFoundResponse();

    return res.hateoas_item(user);
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
    const {_page = 1, _size = 10, _order = 'id', ...filter} = req.query;

    const page = parseInt(_page) || 1;
    const size = parseInt(_size) || 10;
    const offset = (page - 1) * size;

    const allowedFilters = ['email', 'name', 'cpf'];
    const where = {};
    for (const key of allowedFilters) {
      if (filter[key]) where[key] = filter[key];
    }

    const { rows: users, count: totalItems } = await User.findAndCountAll({
      where,
      offset,
      limit: size,
      order: [[_order, 'ASC']]
    });

    const totalPages = Math.ceil(totalItems / size);
    res.hateoas_list(users, totalPages);
  } catch (err) {
    next(err);
  }
};

export const editUser = async (req, res, next) => {
  /*
  #swagger.tags = ["Users"]
  #swagger.requestBody = {
    required: true,
    schema: { $ref: "#/components/schemas/CreateOrUpdateUser" }
  }
  #swagger.responses[200]
  */
  try {
    const {id} = req.params;
    const user = await User.findByPk(id);

    if (!user) return res.notFoundResponse();

    const {name, email, cpf, password, birthdate, active} = req.body;

    const updates = {name, email, cpf, birthdate, active};
    if (active !== undefined) updates.active = active;
    if (password) updates.password = password;

    await user.update(updates);

    res.hateoas_item(user);
  } catch (err) {
    next(err);
  }
};

export const toggleUserStatus = async (req, res, next) => {
  /*
    #swagger.tags = ["Users"]
    #swagger.responses[204]
    #swagger.responses[404] = {
      description: "Usuário não encontrado",
      schema: { $ref: "#/components/schemas/NotFound" }
    }
  */
  try {
    const {id} = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.notFoundResponse();
    }

    await user.update({
      active: !user.active,
    });

    res.okResponse();
  } catch (err) {
    next(err);
  }
};

export const changeUserRole = async (req, res, next) => {
  /*
    #swagger.tags = ["Users"]
    #swagger.requestBody = {
      required: true,
      schema: {
        role: "CUSTOMER"
      }
    }
    #swagger.responses[200]
    #swagger.responses[400]
    #swagger.responses[404]
  */
  try {
    const { id } = req.params;
    const { role } = req.body;

    const validRoles = ['CUSTOMER', 'ADMIN', 'SELLER'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Role inválida. As opções são: CUSTOMER, ADMIN, SELLER.' });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.notFoundResponse();
    }

    await user.update({ role });

    return res.hateoas_item(user);
  } catch (err) {
    next(err);
  }
};
