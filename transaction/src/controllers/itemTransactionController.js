import {ItemTransaction} from '../models/index.js';

export const showItemTransaction = async (req, res, next) => {
  /*
  #swagger.tags = ["ItemsTransaction"]
  #swagger.responses[200]
  #swagger.responses[404] = {
    schema: { $ref: "#/definitions/NotFound" }
  }
  */
  try {
    const {id} = req.params;

    const itemTransaction = await ItemTransaction.findByPk(id);

    if (!itemTransaction) {
      return res.notFoundResponse();
    }

    res.hateoas_item(itemTransaction);
  } catch (err) {
    next(err);
  }
};

export const listItemsTransaction = async (req, res, next) => {
  /*
  #swagger.tags = ["ItemsTransaction"]
  #swagger.responses[200]
  */
  try {
    const {_page = "1", _size = "10", _order = 'id'} = req.query;
    const offset = (parseInt(_page) - 1) * _size;

    const {rows: itemsTransaction, count: totalItems} = await ItemTransaction.findAndCountAll({
      where: {},
      offset,
      limit: parseInt(_size),
      order: [[_order, 'ASC']],
    });

    const totalPages = Math.ceil(totalItems / _size);
    res.hateoas_list(itemsTransaction, totalPages);
  } catch (err) {
    next(err);
  }
};

export const createItemTransaction = async (req, res, next) => {
  /*
  #swagger.tags = ["ItemsTransaction"]
  #swagger.requestBody = {
    required: true,
    schema: { $ref: "#/definitions/CreateOrUpdateItemTransaction" }
  }
  #swagger.responses[200]
  */
  try {
    const {name, description, price, facilityId} = req.body;

    await ItemTransaction.create({
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

export const editItemTransaction = async (req, res, next) => {
  /*
  #swagger.tags = ["ItemsTransaction"]
  #swagger.requestBody = {
    required: true,
    schema: { $ref: "#/definitions/CreateOrUpdateItemTransaction" }
  }
  #swagger.responses[200]
  #swagger.responses[404] = {
    schema: { $ref: "#/definitions/NotFound" }
  }
  */
  try {
    const {name, description, price, facilityId} = req.body;
    const {id} = req.params;

    const itemTransaction = await ItemTransaction.findByPk(id);

    if (!itemTransaction) {
      return res.notFoundResponse();
    }

    await itemTransaction.update({name, description, price, facilityId});

    res.hateoas_item(itemTransaction);
  } catch (err) {
    next(err);
  }
};

export const deleteItemTransaction = async (req, res, next) => {
  /*
  #swagger.tags = ["ItemsTransaction"]
  #swagger.responses[204]
  #swagger.responses[404] = {
    schema: { $ref: "#/definitions/NotFound" }
  }
  */
  try {
    const {id} = req.params;

    const itemTransaction = await ItemTransaction.findByPk(id);

    if (!itemTransaction) {
      return res.notFoundResponse();
    }

    await itemTransaction.destroy();

    res.noContentResponse();
  } catch (err) {
    next(err);
  }
};
