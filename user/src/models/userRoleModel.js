// src/models/userRoleModel.js

import { DataTypes } from 'sequelize';
import database from '../config/database.js';

const UserRole = database.sequelize.define('UserRole', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  roleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  }
}, {
  timestamps: false,
  tableName: 'user_roles',
});
  
      

export default UserRole;
