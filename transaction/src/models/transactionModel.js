import {DataTypes} from 'sequelize';
import database from '../config/database.js';

const Transaction = database.sequelize.define('Transaction', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  totalValue: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  operation: {
    type: DataTypes.ENUM('purchase', 'credit'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed'),
    allowNull: false,
    defaultValue: 'pending'
  },
  inactive: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
}, {
  tableName: 'transactions',
  timestamps: true
});

export default Transaction;
