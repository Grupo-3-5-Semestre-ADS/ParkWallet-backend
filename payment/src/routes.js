import { Router } from 'express'

import InternalServerError from './routes/helper/500.js'
import NotFound from './routes/helper/404.js'
import rechargeRoutes from "./interfaces/http/routes/rechargeRoutes.js";
import middlewares from './middlewares/index.js';

const routes = Router();

// Aplicar middlewares comuns a todas as rotas
routes.use(middlewares.order);
routes.use(middlewares.hateoas);
routes.use(middlewares.handlers);

// Rotas da API
routes.use("/api/recharges", rechargeRoutes);

// Handlers de erro
routes.use(InternalServerError)
routes.use(NotFound)

export default routes
