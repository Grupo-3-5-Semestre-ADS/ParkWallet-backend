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
const paymentUrl = `http://${process.env.PAYMENT_HOST}:${process.env.PAYMENT_PORT}`;

const serviceRegistry = {
    products: catalogUrl,
    facilities: catalogUrl,
    chats: chatUrl,
    notifications: notificationUrl,
    transactions: transactionUrl,
    itemsTransaction: transactionUrl,
    payment: transactionUrl, // Para pagamentos de produtos (existente)
    recharges: paymentUrl,   // Novo endpoint para recargas
    wallets: walletUrl,
    users: userUrl,
    roles: userUrl,
    auth: userUrl,
};

router.post('/login', proxy(userUrl, {
    proxyReqPathResolver: (req) => '/login'
  }));
  
  router.post('/register', proxy(userUrl, {
    proxyReqPathResolver: (req) => '/register'
  }));

router.use('/api', (req, res, next) => {
    const pathSegments = req.path.split('/').filter(Boolean);

    if (pathSegments.length === 0) {
        return res.status(404).send('Endpoint API raiz não encontrado.');
    }

    const resource = pathSegments[0];
    const targetUrl = serviceRegistry[resource];

    if (!targetUrl) {
        console.log(`Gateway: Nenhum serviço registrado para o recurso "${resource}" em ${req.originalUrl}`);
        return res.status(404).send('Endpoint API não encontrado.');
    }

    const proxyOptions = {
        proxyReqPathResolver: (request) => {
            const targetPath = `/api${request.url}`;
            console.log(`Gateway: Proxying [${req.method}] ${req.originalUrl} -> ${targetUrl}${targetPath}`);
            return targetPath;
        },
        proxyErrorHandler: (err, proxyRes, nextFn) => {
            console.error(`Gateway: Erro no proxy para ${targetUrl}${req.path}:`, err.code || err.message);
            if (!proxyRes.headersSent) {
                nextFn(err);
            }
        }
    };

    proxy(targetUrl, proxyOptions)(req, res, next);
});

router.use((req, res) => {
    if (!res.headersSent) {
        console.log(`Gateway: Rota não encontrada [${req.method}] ${req.originalUrl}`);
        res.status(404).send('Recurso não encontrado no Gateway.');
    }
});


export default router;
