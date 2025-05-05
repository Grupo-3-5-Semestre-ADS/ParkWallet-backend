import { Router } from 'express';

import order from "./middlewares/order.js";
import hateoas from "./middlewares/hateoas.js";
import handler from "./middlewares/handlers.js";

import InternalServerError from './routes/helper/500.js';
import NotFound from './routes/helper/404.js';

import UserRouter from "./routes/userRouter.js";
import RoleRouter from "./routes/roleRouter.js";
import AuthRouter from './routes/authRouter.js';
import RegisterRouter from './routes/registerRouter.js';
import UserRoleRouter from './routes/userRoleRouter.js';

import { verify } from "./controllers/authController.js";

const routes = Router()
routes.use(order);
routes.use(hateoas);
routes.use(handler);

routes.use("/login", AuthRouter);
routes.use("/register", RegisterRouter);
routes.use("/api/users", /*verify,*/ UserRouter);
routes.use("/api/users", /*verify,*/ UserRoleRouter);
routes.use("/api/roles", /*verify,*/ RoleRouter);

routes.use(InternalServerError);
routes.use(NotFound);

export default routes;
