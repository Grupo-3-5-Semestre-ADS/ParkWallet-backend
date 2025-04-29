import {Chat} from "../models/index.js";

export const showChat = async (req, res, next) => {
  /*
  #swagger.tags = ["Chats"]
  #swagger.responses[200]
  #swagger.responses[404] = {
    schema: { $ref: "#/definitions/NotFound" }
  }
  */
  try {
    const {id} = req.params;

    const chat = await Chat.findByPk(id);

    if (!chat) {
      return res.notFoundResponse();
    }

    res.hateoas_item(chat);
  } catch (err) {
    next(err);
  }
};

export const listChats = async (req, res, next) => {
  /*
  #swagger.tags = ["Chats"]
  #swagger.responses[200]
  */
  try {
    const {_page = "1", _size = "10", _order = 'id'} = req.query;
    const offset = (parseInt(_page) - 1) * _size;

    const {rows: chats, count: totalItems} = await Chat.findAndCountAll({
      where: {},
      offset,
      limit: parseInt(_size),
      order: [[_order, 'ASC']],
    });

    const totalPages = Math.ceil(totalItems / _size);
    res.hateoas_list(chats, totalPages);
  } catch (err) {
    next(err);
  }
};

export const createChat = async (req, res, next) => {
  /*
  #swagger.tags = ["Chats"]
  #swagger.requestBody = {
    required: true,
    schema: { $ref: "#/definitions/CreateOrUpdateChat" }
  }
  #swagger.responses[200]
  */
  try {
    const {senderUserId, recipientUserId, message, wasRead} = req.body;

    await Chat.create({
      senderUserId,
      recipientUserId,
      message,
      wasRead,
    });

    res.createdResponse();
  } catch (err) {
    next(err);
  }
};

export const editChat = async (req, res, next) => {
  /*
  #swagger.tags = ["Chats"]
  #swagger.requestBody = {
    required: true,
    schema: { $ref: "#/definitions/CreateOrUpdateChat" }
  }
  #swagger.responses[200]
  #swagger.responses[404] = {
    schema: { $ref: "#/definitions/NotFound" }
  }
  */
  try {
    const {senderUserId, recipientUserId, message, wasRead} = req.body;
    const {id} = req.params;

    const chat = await Chat.findByPk(id);

    if (!chat) {
      return res.notFoundResponse();
    }

    await chat.update({
      senderUserId,
      recipientUserId,
      message,
      wasRead,
    });

    res.hateoas_item(chat);
  } catch (err) {
    next(err);
  }
};

export const deleteChat = async (req, res, next) => {
  /*
  #swagger.tags = ["Chats"]
  #swagger.responses[204]
  #swagger.responses[404] = {
    schema: { $ref: "#/definitions/NotFound" }
  }
  */
  try {
    const {id} = req.params;

    const chat = await Chat.findByPk(id);

    if (!chat) {
      return res.notFoundResponse();
    }

    await chat.destroy();

    res.noContentResponse();
  } catch (err) {
    next(err);
  }
};
