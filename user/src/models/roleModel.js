import { DataTypes } from 'sequelize';
import database from '../config/database.js';

const Role = database.sequelize.define('Role', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  tableName: 'roles',
  timestamps: false,
});

export default Role;
