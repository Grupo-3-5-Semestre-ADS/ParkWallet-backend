import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

import routes from './routes/index.js';
import swagger from "./swagger.js";
import { initializeSocketIO } from './socketManager.js';

dotenv.config();
const app = express();

const httpServer = http.createServer(app);

const io = new SocketIOServer(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.use('/', swagger);
app.use('/', routes);

initializeSocketIO(io);

const SERVER_PORT = process.env.SERVER_PORT || 8080;

httpServer.listen(SERVER_PORT, () => {
    console.log(`Gateway Server running on port ${SERVER_PORT}`);
});
