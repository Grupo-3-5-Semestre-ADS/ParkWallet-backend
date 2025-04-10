import Product from '../models/productModel.js';

export const showProduct = async (req, res, next) => {
  /*
  #swagger.tags = ["Products"]
  #swagger.responses[200]
  #swagger.responses[404] = {
    schema: { $ref: "#/definitions/NotFound" }
  }
  */
  try {
    const {_id} = req.params;

    const product = await Product.findByPk(_id);

    if (!product) {
      return res.notFoundResponse();
    }

    res.hateoas_item(product);
  } catch (err) {
    next(err);
  }
};

export const listProducts = async (req, res, next) => {
  /*
  #swagger.tags = ["Products"]
  #swagger.responses[200]
  */
  try {
    const {_page = 1, _size = 10, _order = 'id', ...filter} = req.query;
    const offset = (_page - 1) * _size;

    const {rows: products, count: totalItems} = await Product.findAndCountAll({
      where: filter,
      offset,
      limit: parseInt(_size),
      order: [[_order, 'ASC']],
    });

    const totalPages = Math.ceil(totalItems / _size);
    res.hateoas_list(products, totalPages);
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req, res, next) => {
  /*
  #swagger.tags = ["Products"]
  #swagger.requestBody = {
    required: true,
    schema: { $ref: "#/definitions/CreateOrUpdateProduct" }
  }
  #swagger.responses[200]
  */
  try {
    const {name, description, price} = req.body;

    await Product.create({
      name,
      description,
      price
    });

    res.createdResponse();
  } catch (err) {
    next(err);
  }
};

export const editProduct = async (req, res, next) => {
  /*
  #swagger.tags = ["Products"]
  #swagger.requestBody = {
    required: true,
    schema: { $ref: "#/definitions/CreateOrUpdateProduct" }
  }
  #swagger.responses[200]
  #swagger.responses[404] = {
    schema: { $ref: "#/definitions/NotFound" }
  }
  */
  try {
    const {name, description, price} = req.body;
    const {_id} = req.params;

    const product = await Product.findByPk(_id);

    if (!product) {
      return res.notFoundResponse();
    }

    await product.update({name, description, price});

    res.hateoas_item(product);
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  /*
  #swagger.tags = ["Products"]
  #swagger.responses[204]
  #swagger.responses[404] = {
    schema: { $ref: "#/definitions/NotFound" }
  }
  */
  try {
    const {_id} = req.params;

    const product = await Product.findByPk(_id);

    if (!product) {
      return res.notFoundResponse();
    }

    await product.destroy();

    res.noContentResponse();
  } catch (err) {
    next(err);
  }
};
