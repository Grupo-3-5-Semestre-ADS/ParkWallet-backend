import { Router } from 'express'

import order from "./middlewares/order.js";
import hateoas from "./middlewares/hateoas.js";
import handlers from "./middlewares/handlers.js";

import InternalServerError from './routes/helper/500.js'
import NotFound from './routes/helper/404.js'
import walletRouter from "./routes/walletRouter.js";
// import {verify} from "./controllers/authController.js";

const routes = Router();
routes.use(order);
routes.use(hateoas);
routes.use(handlers);
routes.use(order);

routes.use("/api/wallets", /*verify,*/ walletRouter);

routes.use(InternalServerError)
routes.use(NotFound)

export default routes
