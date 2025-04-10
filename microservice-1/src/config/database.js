import {Sequelize} from 'sequelize';
import dotenv from "dotenv";
import mysql from 'mysql2/promise';

dotenv.config();

const database = process.env.MYSQL_DATABASE;
const username = process.env.MYSQL_USER;
const password = process.env.MYSQL_PASSWORD;
const host = process.env.MYSQL_HOST;

const ensureDatabaseExists = async () => {
  const connection = await mysql.createConnection({host, user: username, password});
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
  await connection.end();
};

await ensureDatabaseExists();

const sequelize = new Sequelize(database, username, password, {
  host,
  dialect: 'mysql',
  logging: false,
});

const connect = async () => {
  try {
    await sequelize.authenticate();
    console.info('MySQL DB is connected!');
    await sequelize.sync({ alter: true });
  } catch (err) {
    console.error(`Error connecting to MySQL: ${err.message}`);
  }
};

export default {
  sequelize,
  connect
};
