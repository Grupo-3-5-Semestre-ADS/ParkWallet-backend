import dotenv from "dotenv";
import connection from "./connection.js";
import Wallet from "../models/walletModel.js";

dotenv.config();

const queue = "process_user";
const exchange = "user_exchange";
const routingKey = "user.created";

connection(queue, exchange, routingKey, async (message) =>  {
    await Wallet.create({
        userId: message.data.id,
        balance: 0,
    });
    console.log("User data processed successfully.");
});
