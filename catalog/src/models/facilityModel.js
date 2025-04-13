import {DataTypes} from 'sequelize';
import database from '../config/database.js';

const Facility = database.sequelize.define('Facility', {
  name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('store', 'attraction', 'other'),
    allowNull: false
  },
  latitude: {
    type: DataTypes.DECIMAL(9, 6),
    allowNull: false
  },
  longitude: {
    type: DataTypes.DECIMAL(9, 6),
    allowNull: false
  },
  inactive: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  }
}, {
  tableName: 'facilities',
  timestamps: true
});

export default Facility;
