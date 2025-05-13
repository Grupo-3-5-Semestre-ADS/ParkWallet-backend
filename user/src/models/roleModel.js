import { DataTypes } from 'sequelize';
import db from '../config/database.js';

const Role = db.sequelize.define('Role', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'roles',
  timestamps: true,
  paranoid: true
});

export default Role;