import express from 'express';
import proxy from 'express-http-proxy';
import dotenv from "dotenv";

const router = express.Router();

dotenv.config();

const catalogService = process.env.CATALOG_URL;

router.use('/catalog', proxy(catalogService, {
    proxyReqPathResolver: (req) => {
        console.log(req.url)
        return `/api${req.url}`;
    }
}));

export default router;
