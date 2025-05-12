import {Transaction, ItemTransaction} from "../models/index.js";

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
    const where = activesOnly === "true" ? {inactive: false} : {};

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
      inactive: !transaction.inactive,
    });

    res.okResponse();
  } catch (err) {
    next(err);
  }
};

export const listUserTransactionsWithItems = async (req, res, next) => {
  /*
  #swagger.tags = ["Transactions", "Users"]
  #swagger.summary = "Lists all transactions and their items for a specific user"
  #swagger.parameters['userId'] = {
    in: 'path',
    required: true,
    type: 'integer',
    description: 'ID of the user'
  }
  #swagger.parameters['_page'] = {
    in: 'query',
    type: 'integer',
    description: 'Page number (default: 1)'
  }
  #swagger.parameters['_size'] = {
    in: 'query',
    type: 'integer',
    description: 'Number of items per page (default: 10)'
  }
  #swagger.parameters['_order'] = {
    in: 'query',
    type: 'string',
    description: 'Order field (default: id)'
  }
  #swagger.parameters['activesOnly'] = {
    in: 'query',
    type: 'boolean',
    description: 'Filter for active transactions only (default: false)'
  }
  #swagger.responses[200] = {
    description: "A list of user's transactions with their items.",
    schema: {
      type: "object",
      properties: {
        items: {
          type: "array",
          items: {
            allOf: [
              { $ref: "#/definitions/Transaction" },
              {
                type: "object",
                properties: {
                  itemsTransaction: {
                    type: "array",
                    items: { $ref: "#/definitions/ItemTransaction" } // Assuming you have an ItemTransaction definition
                  }
                }
              }
            ]
          }
        },
        totalPages: { type: "integer" },
        // ... other HATEOAS properties
      }
    }
  }
  #swagger.responses[404] = {
    schema: { $ref: "#/definitions/NotFound" },
    description: "User not found (or user has no transactions, depending on desired behavior)"
  }
  */
  try {
    const { userId } = req.params;
    const { _page = "1", _size = "10", _order = 'id', activesOnly = "false" } = req.query;
    const offset = (parseInt(_page) - 1) * parseInt(_size); // Ensure _size is parsed too

    const whereClause = {
      userId: parseInt(userId), // Filter by userId
    };

    if (activesOnly === "true") {
      whereClause.inactive = false;
    }

    const { rows: transactions, count: totalItems } = await Transaction.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: ItemTransaction,
          as: 'itemsTransaction', 
        }
      ],
      offset,
      limit: parseInt(_size),
      order: [[_order, 'ASC']],
      distinct: true, // Important for correct count when using include with hasMany
    });

    const totalPages = Math.ceil(totalItems / parseInt(_size));
    res.hateoas_list(transactions, totalPages); // Your hateoas_list should handle the nested itemsTransaction

  } catch (err) {
    next(err);
  }
};