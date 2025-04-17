import {Transaction} from "../models/index.js";

export const showTransaction = async (req, res, next) => {
  /*
  #swagger.tags = ["Transactions"]
  #swagger.responses[200]
  #swagger.responses[404] = {
    schema: { $ref: "#/definitions/NotFound" }
  }
  */
  try {
    const {id} = req.params;

    const transaction = await Transaction.findByPk(id);

    if (!transaction) {
      return res.notFoundResponse();
    }

    res.hateoas_item(transaction);
  } catch (err) {
    next(err);
  }
};

export const listTransactions = async (req, res, next) => {
  /*
  #swagger.tags = ["Transactions"]
  #swagger.responses[200]
  */
  try {
    const {_page = 1, _size = 10, _order = 'id', ...filter} = req.query;
    const offset = (_page - 1) * _size;

    const {rows: transactions, count: totalItems} = await Transaction.findAndCountAll({
      where: filter,
      offset,
      limit: parseInt(_size),
      order: [[_order, 'ASC']],
    });

    const totalPages = Math.ceil(totalItems / _size);
    res.hateoas_list(transactions, totalPages);
  } catch (err) {
    next(err);
  }
};

export const listItemsByTransaction = async (req, res, next) => {
  /*
  #swagger.tags = ["Transactions"]
  #swagger.responses[200]
  #swagger.responses[404] = {
    schema: { $ref: "#/definitions/NotFound" }
  }
  */
  try {
    const {id} = req.params;

    const transaction = await Transaction.findByPk(id);

    if (!transaction) {
      return res.notFoundResponse();
    }

    // TODO add get of transaction items
    // const products = await transaction.getItems();

    res.hateoas_list(products);
  } catch (err) {
    next(err);
  }
};

export const createTransaction = async (req, res, next) => {
  /*
  #swagger.tags = ["Transactions"]
  #swagger.requestBody = {
    required: true,
    schema: { $ref: "#/definitions/CreateOrUpdateTransaction" }
  }
  #swagger.responses[200]
  */
  try {
    const {userId, totalValue, operation} = req.body;

    await Transaction.create({
      userId,
      totalValue,
      operation,
    });

    res.createdResponse();
  } catch (err) {
    next(err);
  }
};

export const editTransaction = async (req, res, next) => {
  /*
  #swagger.tags = ["Transactions"]
  #swagger.requestBody = {
    required: true,
    schema: { $ref: "#/definitions/CreateOrUpdateTransaction" }
  }
  #swagger.responses[200]
  #swagger.responses[404] = {
    schema: { $ref: "#/definitions/NotFound" }
  }
  */
  try {
    const {userId, totalValue, operation} = req.body;
    const {id} = req.params;

    const transaction = await Transaction.findByPk(id);

    if (!transaction) {
      return res.notFoundResponse();
    }

    await transaction.update({
      userId,
      totalValue,
      operation,
    });

    res.hateoas_item(transaction);
  } catch (err) {
    next(err);
  }
};

// TODO change this to an inactivation function
export const deleteTransaction = async (req, res, next) => {
  /*
  #swagger.tags = ["Transactions"]
  #swagger.responses[204]
  #swagger.responses[404] = {
    schema: { $ref: "#/definitions/NotFound" }
  }
  */
  try {
    const {id} = req.params;

    const transaction = await Transaction.findByPk(id);

    if (!transaction) {
      return res.notFoundResponse();
    }

    await transaction.destroy();

    res.noContentResponse();
  } catch (err) {
    next(err);
  }
};
