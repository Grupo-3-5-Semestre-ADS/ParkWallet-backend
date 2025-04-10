import User from '../models/userModel.js';

export const login = async (req, res, next) => {
  /*
  #swagger.tags = ["Users"]
   #swagger.requestBody = {
    required: true,
    schema: { $ref: "#/definitions/Login" }
  }
  #swagger.responses[200]
  #swagger.responses[401]
  */
  try {
  req.user = await User.findOne({
    email: req.body.email,
    password: req.body.email,
  });

  next();
  } catch (err) {
    next(err);
  }
}

export const showUser = async (req, res, next) => {
  /*
  #swagger.tags = ["Users"]
  #swagger.responses[200]
  #swagger.responses[404] = {
    schema: { $ref: "#/definitions/NotFound" }
  }
  */
  try {
    const {_id} = req.params;

    const user = await User.findOne({_id});

    if (!user) {
      return res.notFoundResponse();
    }

    res.hateoas_item(user);
  } catch (err) {
    next(err);
  }
};

export const listUsers = async (req, res, next) => {
  /*
  #swagger.tags = ["Users"]
  #swagger.responses[200] = {
    schema: {
      _page: { $ref: "#/definitions/Page" },
      _links: [
        { $ref: "#/definitions/HateoasLink" }
      ],
      data: [
        {
          $ref: "#/definitions/User"
        }
      ]
    }
  }
  */
  try {
    const {_page, _size, _order, ...filter} = req.query;
    const page = parseInt(_page) || 1;
    const size = parseInt(_size) || 10;
    const offset = (page - 1) * size;

    const users = await User
      .find(filter)
      .skip(offset)
      .limit(size)
      .sort(_order)

    const totalItems = await User.countDocuments();
    const totalPages = Math.ceil(totalItems / size);

    res.hateoas_list(users, totalPages);
  } catch (err) {
    next(err);
  }
};

export const createUser = async (req, res, next) => {
  /*
  #swagger.tags = ["Users"]
  #swagger.requestBody = {
    required: true,
    schema: { $ref: "#/definitions/CreateOrUpdateUser" }
  }
  #swagger.responses[200]
  */
  try {
    const {name, email, password} = req.body;

    await User.create({
      name,
      email,
      password
    });

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
  #swagger.responses[200] = {
    schema: {
      $ref: "#/definitions/User"
    }
  }
  #swagger.responses[404] = {
    schema: { $ref: "#/definitions/NotFound" }
  }
  */
  try {
    const {name, email, password} = req.body;

    const {_id} = req.params;

    const user = await User.findById(_id);

    if (!user) {
      return res.notFoundResponse();
    }

    const updatedUser = await User.findByIdAndUpdate(
      {_id},
      {name, email, password},
      {new: true}
    );

    res.hateoas_item(updatedUser);
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
    const {_id} = req.params;

    const user = await User.findById(_id);

    if (!user) {
      return res.notFoundResponse();
    }

    await User.deleteOne({_id});

    res.noContentResponse();
  } catch (err) {
    next(err);
  }
};
