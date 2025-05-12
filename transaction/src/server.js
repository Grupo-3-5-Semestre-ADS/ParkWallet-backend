import http from "node:http";
import app from "./app.js";
import database from "./config/database.js";
import Transaction from "./models/transactionModel.js";
import { seedDatabase } from "./seeder.js";

const error = (err) => {
  console.error(`An error has occurred on start server\n ${err.message}`);
  throw err;
};

const listening = async () => {
  try {
    await database.sequelize.sync();
    const transactionCount = await Transaction.count();

    if (transactionCount === 0) {
      //await seedDatabase();
      console.log('Seed done!');
    }
  } catch (syncOrSeedError) {
    console.error('Error seeding:', syncOrSeedError);
  }

  console.log(`Server running on port ${process.env.SERVER_PORT}`);
};

const server = http.createServer(app);
server.listen(process.env.SERVER_PORT || 8081);
server.on('error', error);
server.on('listening', listening);
