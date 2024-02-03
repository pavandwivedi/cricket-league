import guestPlayerModel from "../models/guest.player.model.js";
import authPlayerModel from "../models/auth.player.model.js";
import nodeCron from  "node-cron";
import { distributePrices } from "./distributePrices.js"; 

const resetWeeklyWinningCoinsCronJob = nodeCron.schedule("* * * */7 * *",async()=>{
    try {
             distributePrices();
        await authPlayerModel.updateMany({},{$set:{weeklyWinningCoins:0}});
        await guestPlayerModel.updateMany({},{$set:{weeklyWinningCoins:0}});
        console.log("weeklyWinningCoins updated successfully!");       
    } catch (error) {
        console.log(error.message);
    }
})


export default resetWeeklyWinningCoinsCronJob;