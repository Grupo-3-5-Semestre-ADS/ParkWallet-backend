import {DataTypes} from 'sequelize';
import database from '../config/database.js';

const Chat = database.sequelize.define('Chat', {
  senderUserId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  recipientUserId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  message: {
    type: DataTypes.STRING(1000),
    allowNull: false
  },
  wasRead: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
}, {
  tableName: 'chats',
  timestamps: true
});

export default Chat;
