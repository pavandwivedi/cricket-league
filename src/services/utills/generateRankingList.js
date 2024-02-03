import authPlayerModel from "../../models/auth.player.model.js";
import guestPlayerModel from "../../models/guest.player.model.js";



export async function generateRankingList(){
    
      const authPlayers = await authPlayerModel.find({},{username:1,weeklyWinningCoins:1});
      const guestPlayers = await guestPlayerModel.find({},{username:1,weeklyWinningCoins:1});
      const allplayers = [...authPlayers,...guestPlayers];
      const rankedPlayers = allplayers.sort((a,b)=>b.weeklyWinningCoins-a.weeklyWinningCoins).slice(0, 3);
      const updatedRankedPlayers =rankedPlayers.map((player, index) => ({
        rank: index + 1,
        _id:player._id,
        username: player.username,
        weeklyWinningCoins: player.weeklyWinningCoins,
      }));
     return  updatedRankedPlayers;
  
  }
  

  
