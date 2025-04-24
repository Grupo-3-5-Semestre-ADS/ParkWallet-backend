import express from 'express';
import proxy from 'express-http-proxy';
import dotenv from "dotenv";

const router = express.Router();

dotenv.config();

const catalogUrl = `${process.env.CATALOG_HOST}:${process.env.CATALOG_PORT}`
const chatUrl = `${process.env.CHAT_HOST}:${process.env.CHAT_PORT}`
const notificationUrl = `${process.env.NOTIFICATION_HOST}:${process.env.NOTIFICATION_PORT}`
const transactionUrl = `${process.env.TRANSACTION_HOST}:${process.env.TRANSACTION_PORT}`
const walletUrl = `${process.env.WALLET_HOST}:${process.env.WALLET_PORT}`
const userUrl = `${process.env.USER_HOST}:${process.env.USER_PORT}`

router.use('/catalog', proxy(catalogUrl, {
    proxyReqPathResolver: (req) => {
        console.log(req.url)
        return `/api${req.url}`;
    }
}));

router.use('/chat', proxy(chatUrl, {
    proxyReqPathResolver: (req) => {
        console.log(req.url)
        return `/api${req.url}`;
    }
}));

router.use('/notification', proxy(notificationUrl, {
    proxyReqPathResolver: (req) => {
        console.log(req.url)
        return `/api${req.url}`;
    }
}));

router.use('/transaction', proxy(transactionUrl, {
    proxyReqPathResolver: (req) => {
        console.log(req.url)
        return `/api${req.url}`;
    }
}));

router.use('/wallet', proxy(walletUrl, {
    proxyReqPathResolver: (req) => {
        console.log(req.url)
        return `/api${req.url}`;
    }
}));

router.use('/user', proxy(userUrl, {
    proxyReqPathResolver: (req) => {
        console.log(req.url)
        return `/api${req.url}`;
    }
}));

export default router;
