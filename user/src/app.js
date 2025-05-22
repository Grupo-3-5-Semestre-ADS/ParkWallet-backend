import express from "express";
import compression from "compression";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import {createRequire} from "module";

import database from "./config/database.js";
import routes from "./routes.js";
import { createDefaultAdmin } from './config/createDefaultAdmin.js';

dotenv.config();

const initializeDatabase = async () => {
  await database.connect();
  await createDefaultAdmin();
}

initializeDatabase();
const app = express();
const require = createRequire(import.meta.url);
const swaggerFile = require('./config/swagger.json');

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(morgan('dev'));
app.get('/swagger/swagger.json', (req, res) => {
  res.json(swaggerFile);
});
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile))
app.use(routes);

export default app;
