import {DataTypes} from 'sequelize';
import database from '../config/database.js';

const Notification = database.sequelize.define('Notification', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  text: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  receivedByTheUser: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
}, {
  tableName: 'notifications',
  timestamps: true
});

export default Notification;
