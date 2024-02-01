import express from 'express';
import { purchaseBallsController, purchaseCardsController, purchasePacksController, purchaseTourPackController, shop } from '../controllers/shop.controller.js';
import { checkUserLogin } from '../middlewares/player.middleware.js';

const shopRouter = express.Router();

shopRouter.get("/", shop);
shopRouter.post("/purchaseballs",checkUserLogin,purchaseBallsController);
shopRouter.post('/purchasepacks',checkUserLogin,purchasePacksController);
shopRouter.post('/purchasetourpack',checkUserLogin,purchaseTourPackController);
shopRouter.post('/purchasecards',checkUserLogin,purchaseCardsController);

export default shopRouter;