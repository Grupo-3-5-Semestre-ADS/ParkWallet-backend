import {DataTypes} from 'sequelize';
import database from '../config/database.js';

const ItemTransaction = database.sequelize.define('ItemTransaction', {
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  totalValue: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
}, {
  tableName: 'itemTransactions',
  timestamps: false
});

export default ItemTransaction;
