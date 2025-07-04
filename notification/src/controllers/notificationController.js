import {Notification} from "../models/index.js";

export const showNotification = async (req, res, next) => {
  /*
  #swagger.tags = ["Notifications"]
  #swagger.responses[200]
  #swagger.responses[404] = {
    schema: { $ref: "#/definitions/NotFound" }
  }
  */
  try {
    const {id} = req.params;

    const notification = await Notification.findByPk(id);

    if (!notification) {
      return res.notFoundResponse();
    }

    res.hateoas_item(notification);
  } catch (err) {
    next(err);
  }
};

export const listNotifications = async (req, res, next) => {
  /*
  #swagger.tags = ["Notifications"]
  #swagger.responses[200]
  */
  try {
    const {_page = "1", _size = "10", _order = 'id'} = req.query;
    const offset = (parseInt(_page) - 1) * _size;

    const {rows: notifications, count: totalItems} = await Notification.findAndCountAll({
      where: {},
      offset,
      limit: parseInt(_size),
      order: [[_order, 'ASC']],
    });

    const totalPages = Math.ceil(totalItems / _size);
    res.hateoas_list(notifications, totalPages);
  } catch (err) {
    next(err);
  }
};

export const createNotification = async (req, res, next) => {
  /*
  #swagger.tags = ["Notifications"]
  #swagger.requestBody = {
    required: true,
    schema: { $ref: "#/definitions/CreateOrUpdateNotification" }
  }
  #swagger.responses[200]
  */
  try {
    const {userId, text, receivedByTheUser} = req.body;

    await Notification.create({
      userId,
      text,
      receivedByTheUser,
    });

    res.createdResponse();
  } catch (err) {
    next(err);
  }
};

export const editNotification = async (req, res, next) => {
  /*
  #swagger.tags = ["Notifications"]
  #swagger.requestBody = {
    required: true,
    schema: { $ref: "#/definitions/CreateOrUpdateNotification" }
  }
  #swagger.responses[200]
  #swagger.responses[404] = {
    schema: { $ref: "#/definitions/NotFound" }
  }
  */
  try {
    const {userId, text, receivedByTheUser} = req.body;
    const {id} = req.params;

    const notification = await Notification.findByPk(id);

    if (!notification) {
      return res.notFoundResponse();
    }

    await notification.update({
      userId,
      text,
      receivedByTheUser,
    });

    res.hateoas_item(notification);
  } catch (err) {
    next(err);
  }
};

export const deleteNotification = async (req, res, next) => {
  /*
  #swagger.tags = ["Notifications"]
  #swagger.responses[204]
  #swagger.responses[404] = {
    schema: { $ref: "#/definitions/NotFound" }
  }
  */
  try {
    const {id} = req.params;

    const notification = await Notification.findByPk(id);

    if (!notification) {
      return res.notFoundResponse();
    }

    await notification.destroy();

    res.noContentResponse();
  } catch (err) {
    next(err);
  }
};
