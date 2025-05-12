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
    const {_page = "1", _size = "10", _order = 'id'} = req.query;
    const offset = (parseInt(_page) - 1) * _size;

    const {rows: wallets, count: totalItems} = await Wallet.findAndCountAll({
      where: {},
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

export const patchBalance = async (req, res, next) => {
  try {
    const { id } = req.params; // Presumo que 'id' aqui seja o userId
    const { value } = req.body;

    // Validação crucial do input 'value'
    if (value === undefined || value === null || typeof value !== 'number') {
        // Se o 'value' não for um número ou não for fornecido, é um bad request.
        // O parseFloat('') é 0, parseFloat(null) é NaN, parseFloat(undefined) é NaN.
        // parseFloat('abc') é NaN.
        // É melhor validar ANTES do parseFloat.
        return res.status(400).json({ message: "Valor 'value' inválido ou ausente no corpo da requisição. Deve ser um número." });
    }

    const numericValue = parseFloat(value); // Agora, 'value' é garantido ser um número, mas parseFloat ainda pode dar NaN se era algo como Number.NaN

    if (isNaN(numericValue)) {
        return res.status(400).json({ message: "Valor 'value' fornecido não é um número válido." });
    }

    const wallet = await Wallet.findOne({ where: { userId: id } });
    if (!wallet) {
      // return res.notFoundResponse(); // Supondo que isso retorne 404
      return res.status(404).json({ message: `Carteira para userId ${id} não encontrada.` });
    }

    const currentBalance = parseFloat(wallet.balance); // Balance no banco é string ou decimal? Melhor garantir que seja numérico.

    // Se numericValue for positivo (crédito), não há verificação de saldo.
    // Se numericValue for negativo (débito):
    if (numericValue < 0 && currentBalance < Math.abs(numericValue)) {
      // return res.badRequest("Insufficient balance"); // Supondo que isso retorne 400 com a mensagem.
      return res.status(400).json({ message: "Saldo insuficiente", currentBalance: currentBalance, requestedDeduction: Math.abs(numericValue) });
    }

    const newBalance = currentBalance + numericValue;

    wallet.balance = newBalance.toFixed(2); // Guardar como string com 2 casas decimais se o tipo no BD for DECIMAL ou VARCHAR. Se for FLOAT, guardar como número.
    await wallet.save();

    // res.hateoas_item(wallet); // Supondo que isso retorne 200 com o objeto wallet.
    // Para consistência, vamos retornar um JSON padrão
    return res.status(200).json(wallet);

  } catch (err) {
    console.error("Erro em patchBalance na wallet-api:", err);
    // next(err); // Passa para o error handler do Express
    // Ou, para ser mais explícito:
    return res.status(500).json({ message: "Erro interno no servidor ao atualizar saldo."});
  }
};