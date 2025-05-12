import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

const database = process.env.MYSQL_DATABASE;
const username = process.env.MYSQL_USER;
const password = process.env.MYSQL_PASSWORD;
const host = process.env.MYSQL_HOST;

const MAX_RETRIES = 10;
const RETRY_DELAY = 6000;

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const ensureDatabaseExists = async () => {
  let retries = MAX_RETRIES;

  while (retries > 0) {
    try {
      const connection = await mysql.createConnection({ host, user: username, password });
      await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
      await connection.end();
      console.info('Banco de dados verificado/criado com sucesso.');
      break;
    } catch (err) {
      retries--;
      console.warn(`Erro ao conectar ao MySQL (tentativas restantes: ${retries}): ${err.message}`);
      if (retries === 0) throw new Error('Falha ao conectar ao MySQL após várias tentativas.');
      await wait(RETRY_DELAY);
    }
  }
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
    console.info('MySQL DB está conectado!');
    await sequelize.sync({ alter: true });
  } catch (err) {
    console.error(`Erro ao conectar ao MySQL: ${err.message}`);
    throw err;
  }
};

export default {
  sequelize,
  connect
};
