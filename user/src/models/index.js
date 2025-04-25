import Role from './roleModel.js';
import User from './userModel.js';
import UserRole from './userRoleModel.js';
// Definindo as Associações

User.belongsToMany(Role, {
  through: UserRole,
  foreignKey: 'userId',
  otherKey: 'roleId',
  as: 'roles',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE',
});

Role.belongsToMany(User, {
  through: UserRole,
  foreignKey: 'roleId',
  otherKey: 'userId',
  as: 'users',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE',
});


export { User, Role };
