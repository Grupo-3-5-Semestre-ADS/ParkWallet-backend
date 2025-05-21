import {faker} from '@faker-js/faker/locale/pt_BR';
import dotenv from 'dotenv';
import Chat from "./models/chatModel.js";

dotenv.config();

const ADMIN_USER_ID = 1;
const MIN_CLIENT_USER_ID = 2;
const MAX_CLIENT_USER_ID = 30;

const MESSAGES_PER_CONVERSATION_MIN = 1;
const MESSAGES_PER_CONVERSATION_MAX = 40;

export const seedDatabase = async () => {
  for (let clientId = MIN_CLIENT_USER_ID; clientId <= MAX_CLIENT_USER_ID; clientId++) {
    const numMessagesInThisInteraction = faker.number.int({
      min: MESSAGES_PER_CONVERSATION_MIN, max: MESSAGES_PER_CONVERSATION_MAX,
    });

    for (let i = 0; i < numMessagesInThisInteraction; i++) {
      let currentSenderIsAdmin = faker.datatype.boolean();
      const senderUserId = currentSenderIsAdmin ? ADMIN_USER_ID : clientId;
      const recipientUserId = currentSenderIsAdmin ? clientId : ADMIN_USER_ID;

      const messageData = {
        senderUserId,
        recipientUserId,
        message: faker.lorem.sentence({min: 3, max: 25}),
        wasRead: false,
      };

      await Chat.create(messageData);

      currentSenderIsAdmin = !currentSenderIsAdmin;
    }
  }
};
