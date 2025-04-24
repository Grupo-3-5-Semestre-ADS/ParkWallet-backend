import { DataTypes } from 'sequelize';
import database from '../config/database.js';

const User = database.sequelize.define(
  'User',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      required: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      required: true,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Email inválido.',
        },
      },
    },
    cpf: {
      type: DataTypes.STRING,
      allowNull: false,
      required: true,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      required: true,
      validate: {
        len: {
          args: [8, 255],
          msg: 'A senha deve ter no mínimo 8 caracteres.',
        },
        is: {
          args: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
          msg: 'A senha deve conter letras e números.',
        },
      },
    },
    birthdate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      required: true,
    },
    inactive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  {
    tableName: 'users',
    timestamps: true,
  }
);

export default User;
