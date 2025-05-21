import { DataTypes } from 'sequelize';
import db from '../config/database.js';
import bcrypt from 'bcryptjs';
import { publishUserCreated } from '../services/publish.js';

const User = db.sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  cpf: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  birthdate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('CUSTOMER', 'ADMIN', 'SELLER'),
    allowNull: false,
    defaultValue: 'CUSTOMER'
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false
  },
}, {
  tableName: 'users',
  timestamps: true,
  paranoid: true,
  scopes: {
    defaultScope: {
      where: { active: true },
      attributes: { exclude: ['password'] }
    },
    withPassword: {
      attributes: { include: ['password'] },
    },
    withoutPassword: {
      attributes: { exclude: ['password'] }
    },
    active: {
      where: { active: true }
    },
    inactive: {
      where: { active: false }
    },
    all: {
      where: {}
    },
    public: {
      attributes: ['id', 'name', 'email', 'createdAt']
    }
  },
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    afterCreate: async (user) => {
      await publishUserCreated({
        id: user.id,
        email: user.email,
        name: user.name
      });
    }
  }
});

User.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

User.prototype.hasRole = function (roleName) {
  return this.role === roleName;
};

export default User;
