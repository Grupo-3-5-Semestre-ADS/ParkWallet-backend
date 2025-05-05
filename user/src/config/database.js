import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

const dialect = process.env.DB_DIALECT || 'mysql';
let sequelize;

if (dialect === 'mysql') {
  const database = process.env.MYSQL_DATABASE;
  const username = process.env.MYSQL_USER;
  const password = process.env.MYSQL_PASSWORD;
  const host = process.env.MYSQL_HOST;

  const ensureDatabaseExists = async () => {
    const connection = await mysql.createConnection({ host, user: username, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    await connection.end();
  };

  await ensureDatabaseExists();

  sequelize = new Sequelize(database, username, password, {
    host,
    dialect: 'mysql',
    logging: false,
  });

} else if (dialect === 'sqlite') {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './test.sqlite',
    logging: false,
  });
}

const connect = async () => {
  try {
    await sequelize.authenticate();
    console.info(`${dialect.toUpperCase()} DB is connected!`);
    await sequelize.sync({ alter: true });
  } catch (err) {
    console.error(`Error connecting to ${dialect}: ${err.message}`);
  }
};

export default {
  sequelize,
  connect,
};
