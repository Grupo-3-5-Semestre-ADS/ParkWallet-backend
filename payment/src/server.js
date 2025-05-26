import app from './app.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.SERVER_PORT || 8080;

app.listen(PORT, () => {
  console.log(`Payment API está rodando na porta ${PORT}`);
  console.log(`Wallet API URL: ${process.env.WALLET_API_URL || 'http://wallet-api:8080'}`);
  console.log(`Transaction API URL: ${process.env.TRANSACTION_API_URL || 'http://transaction-api:8080'}`);
});
