import Transaction from './transactionModel.js';
import Product from './productModel.js';

// Definindo as Associações
Transaction.hasMany(Product, {
  foreignKey: 'facilityId',
  as: 'products',
  onUpdate: 'CASCADE',
  onDelete: 'RESTRICT'
});

Product.belongsTo(Transaction, {
  foreignKey: 'facilityId',
  as: 'facility',
  onUpdate: 'CASCADE',
  onDelete: 'RESTRICT'
});

export { Transaction, Product };
