import Transaction from './transactionModel.js';
import ItemTransaction from './itemTransactionModel.js';

Transaction.hasMany(ItemTransaction, {
  foreignKey: 'transactionId',
  as: 'itemsTransaction',
  onUpdate: 'CASCADE',
  onDelete: 'RESTRICT'
});

ItemTransaction.belongsTo(Transaction, {
  foreignKey: 'transactionId',
  as: 'transaction',
  onUpdate: 'CASCADE',
  onDelete: 'RESTRICT'
});

export { Transaction, ItemTransaction };
