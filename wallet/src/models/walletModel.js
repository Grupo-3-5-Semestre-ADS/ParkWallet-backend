import {DataTypes} from 'sequelize';
import database from '../config/database.js';

const Wallet = database.sequelize.define('Wallet', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  balance: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
}, {
  tableName: 'wallets',
  timestamps: true
});

export default Wallet;
