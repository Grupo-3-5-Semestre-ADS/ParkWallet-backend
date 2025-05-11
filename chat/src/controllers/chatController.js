import {Chat} from "../models/index.js";
import {Op} from "sequelize";

export const listUserChats = async (req, res, next) => {
  /*
  #swagger.tags = ["Chats"]
  #swagger.responses[200]
  */
  try {
    const { userId } = req.params;

    const { rows: messages } = await Chat.findAndCountAll({
      where: {
        [Op.or]: [
          { senderUserId: userId },
          { recipientUserId: userId }
        ]
      },
      order: [["createdAt", "DESC"]],
    });

    res.json(messages);
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
