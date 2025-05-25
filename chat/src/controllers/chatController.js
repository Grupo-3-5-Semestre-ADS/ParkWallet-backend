import {Chat} from "../models/index.js";
import {Op, Sequelize} from "sequelize";
import axios from "axios";

export const listUserChats = async (req, res, next) => {
  /*
  #swagger.tags = ["Chats"]
  #swagger.responses[200]
  */
  try {
    const {userId} = req.params;

    const {rows: messages} = await Chat.findAndCountAll({
      where: {
        [Op.or]: [
          {senderUserId: userId},
          {recipientUserId: userId}
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

export const listClientConversations = async (req, res, next) => {
  /*
  #swagger.tags = ["Chats"]
  #swagger.responses[200]
  */
  try {
    const sentUserIds = await Chat.findAll({
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('senderUserId')), 'userId']],
      raw: true,
    });

    const recipientUserIds = await Chat.findAll({
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('recipientUserId')), 'userId']],
      raw: true,
    });

    const allUserIdsInvolved = [
      ...new Set([
        ...sentUserIds.map(u => u.userId),
        ...recipientUserIds.map(u => u.userId),
      ]),
    ].filter(id => id != null);

    if (allUserIdsInvolved.length === 0) {
      return res.json([]);
    }

    const clientUsersDetails = [];

    const gatewayServiceBaseUrl = `http://${process.env.GATEWAY_HOST}:${process.env.GATEWAY_PORT}`;

    for (const userId of allUserIdsInvolved) {
      try {
        const response = await axios.get(`${gatewayServiceBaseUrl}/api/users/${userId}`);
        const user = response.data;

        if (user && user.role && user.role === 'CUSTOMER') {
          clientUsersDetails.push({
            id: user.id,
            name: user.name,
          });
        }
      } catch (error) {
        console.warn(`Could not retrieve or validate user ${userId} from user service: ${error.message}`);
        if (error.response && error.response.status === 404) {
          console.warn(`User ${userId} not found in user service.`);
        }
      }
    }

    if (clientUsersDetails.length === 0) {
      return res.json([]);
    }

    const clientConversations = [];

    for (const client of clientUsersDetails) {
      const lastMessage = await Chat.findOne({
        where: {
          [Op.or]: [
            {senderUserId: client.id},
            {recipientUserId: client.id},
          ],
        },
        order: [['createdAt', 'DESC']],
      });

      if (lastMessage) {
        clientConversations.push({
          userId: client.id,
          userName: client.name,
          lastMessage: lastMessage.message,
        });
      }
    }

    res.json(clientConversations);
  } catch (err) {
    next(err);
  }
};
