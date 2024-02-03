import authPlayerModel from "../models/auth.player.model.js";
import guestPlayerModel from "../models/guest.player.model.js";
import { generateRankingList } from "./utills/generateRankingList.js";

// [
//     {
//         "rank": 1,
//         "_id": "65bdd5542b6e564195c99656",
//         "username": "pavan_10804",
//         "weeklyWinningCoins": 0
//     },
//     {
//         "rank": 2,
//         "_id": "65bdd5692b6e564195c99659",
//         "username": "kuldeep_11654",
//         "weeklyWinningCoins": 0
//     },
//     {
//         "rank": 3,
//         "_id": "65bdd5782b6e564195c9965d",
//         "username": "hemant_41515",
//         "weeklyWinningCoins": 0
//     }
// ]
export async function distributePrices(){
    const rankedPlayers = await generateRankingList();
    rankedPlayers.forEach(async(player) => {
        const username = player.username;
        const rank = player.rank;
        if (username.includes("guest")){
           const guestRankedPlayer = await guestPlayerModel.findOne({username});
          if (rank === 1) {
             guestRankedPlayer["gems"]+=100;
          } else if (rank === 2) {
            guestRankedPlayer["gems"]+=80;
          } else if (rank >= 3 && rank <= 6) {
            guestRankedPlayer["gems"]+=40;
          } else if (rank >= 7 && rank <= 20) {
            guestRankedPlayer["gems"]+=15;
          }
          await guestRankedPlayer.save();
        }
        else{
            const authRankedPlayer = await authPlayerModel.findOne({username});
            if (rank === 1) {
                authRankedPlayer["gems"]+=100;
             } else if (rank === 2) {
                authRankedPlayer["gems"]+=80;
             } else if (rank >= 3 && rank <= 6) {
                authRankedPlayer["gems"]+=40;
             } else if (rank >= 7 && rank <= 20) {
                authRankedPlayer["gems"]+=15;
             }
             await authRankedPlayer.save();
        }
    });
}