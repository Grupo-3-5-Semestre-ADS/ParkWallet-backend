import {Product} from '../models/index.js';

export const showProduct = async (req, res, next) => {
  /*
  #swagger.tags = ["Products"]
  #swagger.responses[200]
  #swagger.responses[404] = {
    schema: { $ref: "#/definitions/NotFound" }
  }
  */
  try {
    const {id} = req.params;

    const product = await Product.findByPk(id);

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
    const {_page = "1", _size = "10", _order = 'id', activesOnly = "false"} = req.query;
    const offset = (parseInt(_page) - 1) * _size;
    const where = activesOnly === "true" ? {inactive: false} : {};

    const {rows: products, count: totalItems} = await Product.findAndCountAll({
      where,
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
    const {name, description, price, facilityId} = req.body;

    await Product.create({
      name,
      description,
      price,
      facilityId
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
    const {name, description, price, facilityId} = req.body;
    const {id} = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.notFoundResponse();
    }

    await product.update({name, description, price, facilityId});

    res.hateoas_item(product);
  } catch (err) {
    next(err);
  }
};

export const toggleProductStatus = async (req, res, next) => {
  /*
  #swagger.tags = ["Products"]
  #swagger.responses[204]
  #swagger.responses[404] = {
    schema: { $ref: "#/definitions/NotFound" }
  }
  */
  try {
    const {id} = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.notFoundResponse();
    }

    await product.update({
      inactive: !product.inactive,
    });

    res.okResponse();
  } catch (err) {
    next(err);
  }
};
