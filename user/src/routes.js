import { Router } from 'express';

import order from "./middlewares/order.js";
import hateoas from "./middlewares/hateoas.js";
import handlers from "./middlewares/handlers.js";

import InternalServerError from './routes/helper/500.js';
import NotFound from './routes/helper/404.js';

import userRouter from "./routes/userRouter.js";
import roleRouter from "./routes/roleRouter.js";
// import {verify} from "./controllers/authController.js";

const routes = Router();

routes.use(order);
routes.use(hateoas);
routes.use(handlers);
routes.use(order);

// Recursos protegidos com autenticação (descomente quando usar auth)
// routes.use("/api/users", verify, userRouter);
// routes.use("/api/roles", verify, roleRouter);

// Por enquanto, sem verificação
routes.use("/api/users", userRouter);
routes.use("/api/roles", roleRouter);

// Tratamento de erros
routes.use(InternalServerError);
routes.use(NotFound);

export default routes;
