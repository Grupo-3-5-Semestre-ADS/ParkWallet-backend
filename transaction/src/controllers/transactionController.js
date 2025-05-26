import {Transaction, ItemTransaction} from "../models/index.js";
import {Op} from "sequelize";

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
    const {_page = "1", _size = "10", _order = 'id', activesOnly = "false"} = req.query;
    const offset = (parseInt(_page) - 1) * _size;
    const where = activesOnly === "true" ? {active: true} : {};

    const {rows: transactions, count: totalItems} = await Transaction.findAndCountAll({
      where,
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

    const transactionItems = await transaction.getItemsTransaction();

    res.hateoas_list(transactionItems);
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
    const {userId, totalValue, operation, status} = req.body;

    await Transaction.create({
      userId,
      totalValue,
      operation,
      status: status || 'pending'
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
    const {userId, totalValue, operation, status} = req.body;
    const {id} = req.params;

    const transaction = await Transaction.findByPk(id);

    if (!transaction) {
      return res.notFoundResponse();
    }

    await transaction.update({
      userId,
      totalValue,
      operation,
      status: status || transaction.status // Keep existing status if not provided
    });

    res.hateoas_item(transaction);
  } catch (err) {
    next(err);
  }
};

export const toggleTransactionStatus = async (req, res, next) => {
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

    await transaction.update({
      active: !transaction.active,
    });

    res.okResponse();
  } catch (err) {
    next(err);
  }
};

export const listUserTransactionsWithItems = async (req, res, next) => {
  /*
  #swagger.tags = ["Transactions"]
  #swagger.responses[200]
  #swagger.responses[404] = {
    schema: { $ref: "#/definitions/NotFound" }
  }
  */
  try {
    const {_page = "1", _size = "10", _order, activesOnly = "false", userId} = req.query;
    const offset = (parseInt(_page) - 1) * parseInt(_size);

    const whereClause = {
      userId: parseInt(userId),
      status: "completed"
    };

    if (activesOnly === "true") {
      whereClause.active = true;
    }

    const {rows: transactions, count: totalItems} = await Transaction.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: ItemTransaction,
          as: 'itemsTransaction',
        }
      ],
      offset,
      limit: parseInt(_size),
      order: [[_order || 'createdAt', 'DESC']],
      distinct: true,
    });

    const totalPages = Math.ceil(totalItems / parseInt(_size));
    res.hateoas_list(transactions, totalPages);

  } catch (err) {
    next(err);
  }
};

export const listTransactionsByProductIds = async (req, res, next) => {
  /*
  #swagger.tags = ["Transactions"]
  #swagger.responses[200]
  #swagger.responses[404] = {
    schema: { $ref: "#/definitions/NotFound" }
  }
  */
  try {
    const {_page = "1", _size = "10", productIds} = req.query;
    const offset = (parseInt(_page) - 1) * _size;

    if (!productIds) {
      return res.status(400).json({message: "ProductIds is required."});
    }

    const productIdsArray = productIds.split(',')
      .map(id => parseInt(id.trim()))
      .filter(id => !isNaN(id) && id > 0);

    if (productIdsArray.length === 0) {
      return res.status(400).json({message: "Missing productIds."});
    }

    const matchingTransactions = await Transaction.findAll({
      include: [
        {
          model: ItemTransaction,
          as: 'itemsTransaction',
          where: {
            productId: {
              [Op.in]: productIdsArray
            }
          },
          required: true
        }
      ],
      order: [['id', 'DESC']],
      attributes: ['id', 'createdAt'],
    });

    const matchingTransactionIds = [...new Map(
      matchingTransactions.map(t => [t.id, t])
    )].map(([id]) => id);

    if (matchingTransactionIds.length === 0) {
      return res.hateoas_list([], 0);
    }

    const totalItems = matchingTransactionIds.length;
    const pagedIds = matchingTransactionIds.slice(offset, offset + parseInt(_size));

    const transactions = await Transaction.findAll({
      where: {
        id: {
          [Op.in]: pagedIds
        }
      },
      include: [
        {
          model: ItemTransaction,
          as: 'itemsTransaction'
        }
      ],
      order: [['id', 'DESC']],
    });

    const totalPages = Math.ceil(totalItems / _size);
    res.hateoas_list(transactions, totalPages);
  } catch (err) {
    next(err);
  }
};
