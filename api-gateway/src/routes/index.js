import express from 'express';
import proxy from 'express-http-proxy';
import dotenv from "dotenv";

const router = express.Router();

dotenv.config();

const catalogUrl = `http://${process.env.CATALOG_HOST}:${process.env.CATALOG_PORT}`;
const chatUrl = `http://${process.env.CHAT_HOST}:${process.env.CHAT_PORT}`;
const notificationUrl = `http://${process.env.NOTIFICATION_HOST}:${process.env.NOTIFICATION_PORT}`;
const transactionUrl = `http://${process.env.TRANSACTION_HOST}:${process.env.TRANSACTION_PORT}`;
const walletUrl = `http://${process.env.WALLET_HOST}:${process.env.WALLET_PORT}`;
const userUrl = `http://${process.env.USER_HOST}:${process.env.USER_PORT}`;


const resolveProxyPath = (serviceName, targetUrl) => (req) => {
    const targetPath = req.url;
    console.log(`Proxying [${req.method}] ${req.originalUrl} to ${serviceName} (${targetUrl}${targetPath})`);
    return targetPath;
};

router.use('/catalog', proxy(catalogUrl, {
    proxyReqPathResolver: resolveProxyPath('Catalog', catalogUrl)
}));

router.use('/chat', proxy(chatUrl, {
    proxyReqPathResolver: resolveProxyPath('Chat', chatUrl)
}));

router.use('/notification', proxy(notificationUrl, {
    proxyReqPathResolver: resolveProxyPath('Notification', notificationUrl)
}));

router.use('/transaction', proxy(transactionUrl, {
    proxyReqPathResolver: resolveProxyPath('Transaction', transactionUrl)
}));

router.use('/wallet', proxy(walletUrl, {
    proxyReqPathResolver: resolveProxyPath('Wallet', walletUrl)
}));

router.use('/user', proxy(userUrl, {
    proxyReqPathResolver: resolveProxyPath('User', userUrl)
}));

export default router;
