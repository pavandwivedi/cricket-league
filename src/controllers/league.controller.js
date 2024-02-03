
import { error, success } from "../services/utills/responseWrapper.js";
import { generateRankingList } from "../services/utills/generateRankingList.js";

export async function rankingPrizeController(req,res){
  try {
          const rankedPlayers= await generateRankingList();
          

    return res.send(success(200,rankedPlayers));
  } catch (err) {
    return res.send(error(500,err.message));
  
}
}



