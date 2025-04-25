import {Wallet} from "../models/index.js";

export const showWallet = async (req, res, next) => {
  /*
  #swagger.tags = ["Wallets"]
  #swagger.responses[200]
  #swagger.responses[404] = {
    schema: { $ref: "#/definitions/NotFound" }
  }
  */
  try {
    const {id} = req.params;

    const wallet = await Wallet.findByPk(id);

    if (!wallet) {
      return res.notFoundResponse();
    }

    res.hateoas_item(wallet);
  } catch (err) {
    next(err);
  }
};

export const listWallets = async (req, res, next) => {
  /*
  #swagger.tags = ["Wallets"]
  #swagger.responses[200]
  */
  try {
    const {_page = 1, _size = 10, _order = 'id', ...filter} = req.query;
    const offset = (_page - 1) * _size;

    const {rows: wallets, count: totalItems} = await Wallet.findAndCountAll({
      where: filter,
      offset,
      limit: parseInt(_size),
      order: [[_order, 'ASC']],
    });

    const totalPages = Math.ceil(totalItems / _size);
    res.hateoas_list(wallets, totalPages);
  } catch (err) {
    next(err);
  }
};

export const createWallet = async (req, res, next) => {
  /*
  #swagger.tags = ["Wallets"]
  #swagger.requestBody = {
    required: true,
    schema: { $ref: "#/definitions/CreateOrUpdateWallet" }
  }
  #swagger.responses[200]
  */
  try {
    const {userId, balance} = req.body;

    await Wallet.create({
      userId,
      balance,
    });

    res.createdResponse();
  } catch (err) {
    next(err);
  }
};

export const editWallet = async (req, res, next) => {
  /*
  #swagger.tags = ["Wallets"]
  #swagger.requestBody = {
    required: true,
    schema: { $ref: "#/definitions/CreateOrUpdateWallet" }
  }
  #swagger.responses[200]
  #swagger.responses[404] = {
    schema: { $ref: "#/definitions/NotFound" }
  }
  */
  try {
    const {userId, balance} = req.body;
    const {id} = req.params;

    const wallet = await Wallet.findByPk(id);

    if (!wallet) {
      return res.notFoundResponse();
    }

    await wallet.update({
      userId,
      balance,
    });

    res.hateoas_item(wallet);
  } catch (err) {
    next(err);
  }
};

export const deleteWallet = async (req, res, next) => {
  /*
  #swagger.tags = ["Wallets"]
  #swagger.responses[204]
  #swagger.responses[404] = {
    schema: { $ref: "#/definitions/NotFound" }
  }
  */
  try {
    const {id} = req.params;

    const wallet = await Wallet.findByPk(id);

    if (!wallet) {
      return res.notFoundResponse();
    }

    await wallet.destroy();

    res.noContentResponse();
  } catch (err) {
    next(err);
  }
};
