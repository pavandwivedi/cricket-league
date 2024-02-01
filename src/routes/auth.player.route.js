import express from 'express';
import {checkUserLogin} from "../middlewares/player.middleware.js"
import { addBallsController, addBatsController, addBatsmanController, addBowlerController, authLoginController, authLogoutController, bowlerLevelUpController, getBatsmanController, getBowlerController,  } from '../controllers/auth.player.controller.js';
import { batsmanLevelUpController } from '../controllers/auth.player.controller.js';

const authPlayerRouter = express.Router();

authPlayerRouter.route("/login").post(authLoginController);
authPlayerRouter.route("/logout").post(authLogoutController);
authPlayerRouter.post("/insertbatsman",checkUserLogin,addBatsmanController)
authPlayerRouter.put('/levelupbatsman',checkUserLogin,batsmanLevelUpController);
authPlayerRouter.get('/getbatsman',checkUserLogin,getBatsmanController);
authPlayerRouter.post("/insertbowler",checkUserLogin,addBowlerController)
authPlayerRouter.put('/levelupbowler',checkUserLogin,bowlerLevelUpController);
authPlayerRouter.get('/getbowlers',checkUserLogin,getBowlerController);
authPlayerRouter.post('/insertballs',checkUserLogin,addBallsController);
authPlayerRouter.post('/insertbats',checkUserLogin,addBatsController);
export default authPlayerRouter;