import express from 'express';
import {checkUserLogin} from "../middlewares/player.middleware.js"
import { addBallsController, addBatsController, addBatsmanController, addBowlerController, batsmanLevelUpController, bowlerLevelUpController, getBatsmanController,
     getBowlerController, guestDeleteController, guestLevelUpController, guestLoginController, guestUpdateController, insertGiftController, unlockGiftController } from '../controllers/guest.player.controller.js';


const guestPlayerRouter = express.Router();

guestPlayerRouter.route("/login").post(guestLoginController);
guestPlayerRouter.route("/delete").delete(guestDeleteController);
guestPlayerRouter.post("/insertbatsman",checkUserLogin,addBatsmanController)
guestPlayerRouter.put('/levelupbatsman',checkUserLogin,batsmanLevelUpController);
guestPlayerRouter.get('/getbatsman',checkUserLogin,getBatsmanController);
guestPlayerRouter.post("/insertbowler",checkUserLogin,addBowlerController)
guestPlayerRouter.put('/levelupbowler',checkUserLogin,bowlerLevelUpController);
guestPlayerRouter.get('/getbowlers',checkUserLogin,getBowlerController);
guestPlayerRouter.post('/insertballs',checkUserLogin,addBallsController);
guestPlayerRouter.post('/insertbats',checkUserLogin,addBatsController);
guestPlayerRouter.post('/levelup',checkUserLogin,guestLevelUpController);
guestPlayerRouter.put('/update',checkUserLogin,guestUpdateController);
guestPlayerRouter.post('/insertgift',checkUserLogin,insertGiftController);
guestPlayerRouter.post('/unlockgift',checkUserLogin,unlockGiftController);





 export default guestPlayerRouter;
