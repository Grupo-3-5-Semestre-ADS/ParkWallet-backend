import Facility from './facilityModel.js';
import Product from './productModel.js';

// Definindo as Associações
Facility.hasMany(Product, {
  foreignKey: 'facilityId',
  as: 'products',
  onUpdate: 'CASCADE',
  onDelete: 'RESTRICT'
});

Product.belongsTo(Facility, {
  foreignKey: 'facilityId',
  as: 'facility',
  onUpdate: 'CASCADE',
  onDelete: 'RESTRICT'
});

export { Facility, Product };
