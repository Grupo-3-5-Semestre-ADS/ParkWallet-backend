import User from './userModel.js';
import Role from './roleModel.js';

User.belongsToMany(Role, { 
  through: 'UserRoles',
  foreignKey: 'userId',
  otherKey: 'roleId',
  as: 'roles'
});

Role.belongsToMany(User, { 
  through: 'UserRoles',
  foreignKey: 'roleId',
  otherKey: 'userId',
  as: 'users'
});

User.prototype.hasRole = async function(roleName) {
  const roles = await this.getRoles();
  return roles.some(role => role.name === roleName);
};

User.prototype.hasAnyRole = async function(roleNames) {
  const roles = await this.getRoles();
  return roles.some(role => roleNames.includes(role.name));
};

User.prototype.hasAllRoles = async function(roleNames) {
  const roles = await this.getRoles();
  const userRoleNames = roles.map(role => role.name);
  return roleNames.every(roleName => userRoleNames.includes(roleName));
};

export { User, Role };