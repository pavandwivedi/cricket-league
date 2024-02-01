import generatePlayerInfo from "../services/generatePlayerInfo.js";
import guestPlayerModel from "../models/guest.player.model.js";
import authPlayerModel from "../models/auth.player.model.js";
import generateAccessToken from "../services/generateAccessToken.js";
import {success,error} from "../services/utills/responseWrapper.js";
import {searchBatsman,searchBowler,searchBall,searchBat,searchTour} from "../services/search.js";
import levels from "../constants/levels.constant.js";
import { generateGift } from "../services/generateGift.js";
import { getRandomGiftPack } from "../services/generateGift.js";
import { countAndStoreDetails } from "../services/generateGift.js";


export async function guestLoginController(req,res){
    const{deviceId,country} = req.body;
    try {
        const existingUser = await authPlayerModel.findOne({deviceId});
        if(!existingUser){
            const {playerUUID, username} = await generatePlayerInfo("guest");
            const user = new guestPlayerModel({deviceId,username,userId:playerUUID,country});           
            const savedUser =await user.save();
            
            const accessToken = generateAccessToken({...savedUser});
            return res.send(success(200,{accessToken}));
        }
        
        const accessToken = generateAccessToken({...existingUser});
        return res.send(success(200,{accessToken}));

    } catch (err) {
        return res.send(error(500,err.message));
    }
}


export async function guestDeleteController(req,res){
    const {deviceId} = req.body;
    try {
        const player = await guestPlayerModel.findOneAndDelete({deviceId});
        res.send(success(200,"deleted successfully!"));
    } catch (err) {
        return res.send(error(500,err.message));
    }
}
export async function addBatsmanController(req, res) {
  const userId = req._id;
  
  const batsmanName = req.body.batsmanName;
  

  try {
    const player = await guestPlayerModel.findById(userId);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    const batsmanInfo = searchBatsman(batsmanName);

    if (!batsmanInfo) {
      return res.status(404).json({ error: 'Batsman info not found' });
    }

    const batsmanCount = (player.batsmanCounts.get(batsmanName) || 0) + 1;
    player.batsmanCounts.set(batsmanName, batsmanCount);

    // Check if the batsman already exists in the array
    const existingBatsmanIndex = player.batsman.findIndex(b => b.name === batsmanName);
    console.log('Existing Batsmen:', player.batsman);
    console.log(existingBatsmanIndex);
    if (existingBatsmanIndex !== -1) {
      // Batsman exists, update the data
      player.batsman[existingBatsmanIndex].currCards += 1;

      // Check if the player has enough cards for level up
      const currCards = player.batsman[existingBatsmanIndex].currCards;
      const requiredCards = batsmanInfo[0].requiredCards[0];

      if (currCards >= requiredCards) {
        // Provide an option for level up
        player.batsman[existingBatsmanIndex].levelUpOption = true;
      }
    } else {
      // Batsman doesn't exist, create a new one and push it to the array
      const newBatsman = {
        name: batsmanName,
        category: batsmanInfo[0].category,
        type: batsmanInfo[0].type,
        photo: batsmanInfo[0].photo,
        currCards: batsmanCount,
        requiredCards: batsmanInfo[0].requiredCards[0],
        handedness: batsmanInfo[0].type,
        level: 1,
        skillPoints: batsmanInfo[0].skillpoints[0],
      };

      player.batsman.push(newBatsman);
    }

    // Increase the counts for the specific batsman
    await player.save();

    return res.status(200).json({ success: true, message: 'Batsman added successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}


export async function batsmanLevelUpController(req,res){
  const batsmanName = req.body.batsmanName;
  const userId = req._id;

  try {
    const batsmanInfo = searchBatsman(batsmanName);
    console.log(batsmanInfo);
    if (!batsmanInfo) {
      return res.send(error(404, "BatsmanInfo not found"));
    }

    const player = await guestPlayerModel.findById(userId);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    // Assuming you have a function to get the existing batsman
    const existingBatsman = player.batsman.find(b => b.name === batsmanName);

    if (!existingBatsman) {
      return res.status(404).json({ error: 'Batsman not found for level up' });
    }

    if (existingBatsman.levelUpOption === 1) {
      existingBatsman.level += 1;
      existingBatsman.skillPoints = batsmanInfo.skillpoints[existingBatsman.level - 1];
      existingBatsman.currCards -= existingBatsman.requiredCards;
      existingBatsman.requiredCards = batsmanInfo.requiredCards[existingBatsman.level - 1];
      existingBatsman.levelUpOption = false;

      await existingBatsman.save();
    }

    // Update the batsman counts in the player model
    player.batsmanCounts.set(batsmanName, existingBatsman.currCards);

    // Save the changes to the player model
    await player.save();

    return res.send(success(200, 'Batsman level updated successfully'));
  } catch (err) {
    return res.send(error(500, err.message));
  }
}
 
export async function getBatsmanController(req,res){
  try {
    const userId = req._id;
    const batsmen = await authPlayerModel.find({});
    return res.send(success(200,batsmen));
} catch (err) {
    return res.send(error(500,err.message))
}
}
// add bowlers to a batsman
export async function addBowlerController(req,res){
  const userId = req._id;
  
  const bowlerName = req.body.bowlerName;
 
  

  try {
    const player = await guestPlayerModel.findById(userId);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    const bowlerInfo = searchBowler(bowlerName);
    console.log(bowlerInfo);

    if (!bowlerInfo) {
      return res.status(404).json({ error: 'bowler info not found' });
    }

    const bowlerCount = (player.bowlerCounts.get(bowlerName) || 0) + 1;
    player.bowlerCounts.set(bowlerName, bowlerCount);

    // Check if the batsman already exists in the array
    const existingBowlerIndex = player.bowlers.findIndex(b => b.name === bowlerName);
    console.log('Existing Bowlers:', player.bowlers);
    console.log(existingBowlerIndex);
    if (existingBowlerIndex !== -1) {
      // Batsman exists, update the data
      player.bowlers[existingBowlerIndex].currCards += 1;

      // Check if the player has enough cards for level up
      const currCards = player.bowlers[existingBowlerIndex].currCards;
      const requiredCards = bowlerInfo[0].requiredCards[0];

      if (currCards >= requiredCards) {
        // Provide an option for level up
        player.bowlers[existingBowlerIndex].levelUpOption = true;
      }
    } else {
      // Batsman doesn't exist, create a new one and push it to the array
      const newBowler = {
        name: bowlerName,
        category: bowlerInfo[0].category,
        type: bowlerInfo[0].type,
        photo: bowlerInfo[0].photo,
        currCards: bowlerCount,
        requiredCards: bowlerInfo[0].requiredCards[0],
        handedness: bowlerInfo.type,
        level: 1,
        skillPoints: bowlerInfo[0].skillpoints[0],
      };

      player.bowlers.push(newBowler);
    }

    // Increase the counts for the specific batsman
    await player.save();

    return res.status(200).json({ success: true, message: 'bowler added successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }

}
// level up for bowlers
export async function bowlerLevelUpController(req,res){
  const userId = req._id;
  const bowlerName = req.body.bowlerName;
  

  try {
    const bowlerInfo = searchBowler(bowlerName);
    console.log(bowlerInfo);
    if (!bowlerInfo) {
      return res.send(error(404, "bowlerInfo not found"));
    }

    const player = await guestPlayerModel.findById(userId);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    // Assuming you have a function to get the existing batsman
    const existingBowler = player.bowlers.find(b => b.name === bowlerName);

    if (!existingBowler) {
      return res.status(404).json({ error: 'Batsman not found for level up' });
    }

    if (existingBowler.levelUpOption === 1) {
      existingBowler.level += 1;
      existingBowler.skillPoints = bowlerInfo[0].skillpoints[existingBowler.level - 1];
      existingBowler.currCards -= existingBowler.requiredCards;
      existingBowler.requiredCards = bowlerInfo[0].requiredCards[existingBowler.level - 1];
      existingBowler.levelUpOption = false;

      await existingBowler.save();
    }

    // Update the batsman counts in the player model
    player.bowlerCounts.set( bowlerName, existingBowler.currCards);

    // Save the changes to the player model
    await player.save();

    return res.send(success(200, 'Bowler level updated successfully'));
  } catch (err) {
    return res.send(error(500, err.message));
  }
}
export async function getBowlerController(req,res){
    
}

//add balls to a guest player 
export async function addBallsController(req,res){
  const userId = req._id;
  
  const name = req.body.name;
  const count = req.body.count;
  

  try {
    const player = await guestPlayerModel.findById(userId);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    const ballInfo = searchBall(name);
    

    if (!ballInfo) {
      return res.status(404).json({ error: 'ball info not found' });
    }
    
    const ballCount = (player.ballCounts.get(name) || 0) + count;
    player.ballCounts.set(name, ballCount);

   
    const existingBallIndex = player.balls.findIndex(b => b.name === name);
    
    if (existingBallIndex !== -1) {
      
      player.balls[existingBallIndex].count += count;

      
    } else {
      // Batsman doesn't exist, create a new one and push it to the array
      const newBall = {
        name:name ,
        category: ballInfo[0].category,
        photo: ballInfo[0].photo,
        count : ballCount,
      
      };

      player.balls.push(newBall);
    }

    // Increase the counts for the specific batsman
    await player.save();

    return res.status(200).json({ success: true, message: 'ball added successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }

}

export async function addBatsController(req,res){
  const userId = req._id;
  
  const name = req.body.name;
  const count = req.body.count;
  

  try {
    const player = await guestPlayerModel.findById(userId);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    const batInfo = searchBat(name);
    
    console.log(batInfo);
    if (!batInfo) {
      return res.status(404).json({ error: 'bat info not found' });
    }
    
    const batCount = (player?.batsCounts?.get(name) || 0) + count;
    player?.batsCounts?.set(name, batCount);
    console.log(player);
   
    const existingBatIndex = player.bats.findIndex(b => b.name === name);
    
    if (existingBatIndex !== -1) {
      
      player.bats[existingBatIndex].count += count;

      
    } else {
      // Batsman doesn't exist, create a new one and push it to the array
      const newBat = {
        name:name ,
        category: batInfo[0].category,
        photo: batInfo[0].photo,
        count : batCount,
      
      };

      player.bats.push(newBat);
    }

    // Increase the counts for the specific batsman
    await player.save();

    return res.status(200).json({ success: true, message: 'bat added successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }

}
export async function guestLevelUpController(req, res) {
  const userId = req._id;
  const xp = req.body.xp; 

  try {
    const player = await guestPlayerModel.findById(userId);
    if (!player) {
      return res.send(error(404, 'Player not found'));
    }

    if (!player.level) {
      // If player doesn't have a level, create a default level and XP
      player.level = {
        name: 1,  // Default level
        xp: 0,    // Default XP
      };
    }

    const currLevel = player.level.name;
    const requiredXp = levels[currLevel - 1].requiredXp;
    let currXp = player.level.xp + xp;  // Adjusted variable name to lowercase

    if (currXp >= requiredXp) {  // Changed the condition to handle excess XP
      player.level.name++;
      currXp = currXp-requiredXp;
    }

    player.level.xp = currXp;  // Update player's XP
    await player.save();

    return res.send(success(200, 'Level upgraded successfully'));
  } catch (err) {
    return res.send(error(500, err.message));
  }
}

export async function guestUpdateController(req, res) {
  const userId = req._id;
  const tourName = req.body.tourName;
  const isWinner = req.body.isWinner;
  const sixes = req.body.sixes;
  const wickets = req.body.wickets;
  

  try {
    const tourInfo =  await searchTour(tourName);
    console.log(tourInfo);
    if (!tourInfo) {
      return res.status(404).json({ error: 'Tour info not found' });
    }

    const updateFields = {
      $inc: {
        sixesScored: sixes || 0,
        totalWickets: wickets || 0,
        
        totalMatches:1,
        
      },
      
      

    };

    if (isWinner) {
      // If the player is the winner, increment the wins field
      updateFields.$inc.wins = 1;
      updateFields.$inc.coinsEarned= tourInfo[0].entryFee|| 0;
      updateFields.$inc.coins=tourInfo[0].entryFee|| 0;
      
    }
    else{
      updateFields.$inc.coinsEarned = -tourInfo[0].entryFee|| 0;
      updateFields.$inc.coins= -tourInfo[0].entryFee|| 0;
    }

    const player = await guestPlayerModel.findByIdAndUpdate(userId, updateFields, { new: true });

    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    return res.status(200).json({ success: true, message: 'Player updated successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function insertGiftController(req,res){
  const userId = req._id;
  const isWinner = req.body.isWinner;
  const tour = req.body.tour;
  try {
    const player = await guestPlayerModel.findById(userId);
    if (!player) {
      return res.send(error(404, 'Player not found'));
    }
    const selectedPack = getRandomGiftPack();
   
    const pack = generateGift(tour,selectedPack);
    
    const details = countAndStoreDetails(pack);
   
    const giftPack = {
      tour:tour,
      type:selectedPack,
      coins: pack.coins,
      gems: pack.gems,
      balls: details.balls,
      players:details.players,
       bowlers:details.bowlers
    };

    if (isWinner) {
      await guestPlayerModel.updateOne(
        { _id: userId },
        {
          $push: {
            giftPacks: giftPack,
          },
        }
      );
    }
    return res.send(success(200,"gift inserted successfully"))

  } catch (err) {
    return res.send(error(500,err.message));
  }

}
export async function unlockGiftController(req,res){
  const userId =req._id;
  const tour = req.body.tour;
  try {
    const player = await guestPlayerModel.findById(userId);
    
    if (!player) {
      return res.send(error(404, 'Player not found'));
    }
     // Find the gift pack for the specified tour
    const giftPackIndex = player.giftPacks.findIndex((pack) => pack.tour === tour);

    if (giftPackIndex === -1) {
      return res.send(error(404, 'Gift pack not found for the specified tour'));
    }

    const unlockedGift = player.giftPacks[giftPackIndex];
    
    player.coins+= unlockedGift.coins;
    player.gems+= unlockedGift.gems;
    const players = unlockedGift.players;
  
     if(players){
    for (const playerName in players) { 
      const batsmanInfo =  searchBatsman(playerName);
      console.log(batsmanInfo);
      
      if (!batsmanInfo) {
        return res.status(404).json({ error: 'Batsman info not found' });
      }
      const batsmanCount = (player.batsmanCounts.get(playerName) || 0) + 1;
      player.batsmanCounts.set(playerName, batsmanCount);
      // Check if the batsman already exists in the array
    const existingBatsmanIndex = player.batsman.findIndex(b => b.name === playerName);
    if (existingBatsmanIndex !== -1) {
      // Batsman exists, update the data
      player.batsman[existingBatsmanIndex].currCards += 1;

      // Check if the player has enough cards for level up
      const currCards = player.batsman[existingBatsmanIndex].currCards;
      const requiredCards = batsmanInfo[0]?.requiredCards[0];

      if (currCards >= requiredCards) {
        // Provide an option for level up
        player.batsman[existingBatsmanIndex].levelUpOption = true;
      }
    } else {
      // Batsman doesn't exist, create a new one and push it to the array
      const newBatsman = {
        name: playerName,
        category: batsmanInfo[0]?.category,
        type: batsmanInfo[0]?.type,
        photo: batsmanInfo[0]?.photo,
        currCards: batsmanCount,
        requiredCards: batsmanInfo[0]?.requiredCards[0],
        handedness: batsmanInfo[0]?.type,
        level: 1,
        skillPoints: batsmanInfo[0]?.skillpoints[0],
      };

      player.batsman.push(newBatsman);
    }

    }
  }

    const bowlers = unlockedGift.bowlers;
    if(bowlers){
    for (const bowlerName in bowlers) {
      const bowlerInfo =  searchBowler(bowlerName);
      
  
      if (!bowlerInfo) {
        return res.status(404).json({ error: 'bowler info not found' });
      }
  
      const bowlerCount = (player.bowlerCounts.get(bowlerName) || 0) + 1;
      player.bowlerCounts.set(bowlerName, bowlerCount);
  
      // Check if the batsman already exists in the array
      const existingBowlerIndex = player.bowlers.findIndex(b => b.name === bowlerName);
      
      if (existingBowlerIndex !== -1) {
        // Batsman exists, update the data
        player.bowlers[existingBowlerIndex].currCards += 1;
  
        // Check if the player has enough cards for level up
        const currCards = player.bowlers[existingBowlerIndex].currCards;
        const requiredCards = bowlerInfo[0].requiredCards[0];
  
        if (currCards >= requiredCards) {
          // Provide an option for level up
          player.bowlers[existingBowlerIndex].levelUpOption = true;
        }
      } else {
        // Batsman doesn't exist, create a new one and push it to the array
        const newBowler = {
          name: bowlerName,
          category: bowlerInfo[0].category,
          type: bowlerInfo[0].type,
          photo: bowlerInfo[0].photo,
          currCards: bowlerCount,
          requiredCards: bowlerInfo[0].requiredCards[0],
          handedness: bowlerInfo.type,
          level: 1,
          skillPoints: bowlerInfo[0].skillpoints[0],
        };
  
        player.bowlers.push(newBowler);
      }
    }
  }
    const packBalls = unlockedGift.balls;
    console.log(packBalls);
   if (packBalls){

   
    
// Use sanitizedBallName in your code instead of ballName
   
    for(const ballName in packBalls){
      console.log(ballName);
      const ballInfo =  searchBall(ballName);
    

    if (!ballInfo) {
      return res.status(404).json({ error: 'ball info not found' });
    }
    
    const ballCount = (player.ballCounts.get(ballName) || 0) + 1;
    player.ballCounts.set(ballName, ballCount);

   
    const existingBallIndex = player.balls.findIndex(b => b.name === ballName);
    
    if (existingBallIndex !== -1) {
      
      player.balls[existingBallIndex].count += 1;

      
    } else {
      // Batsman doesn't exist, create a new one and push it to the array
      const newBall = {
        name:ballName ,
        category: ballInfo[0].category,
        photo: ballInfo[0].photo,
        count : ballCount,
      
      };

      player.balls.push(newBall);
    }

  }
}   
  
      

      
    player.giftPacks.splice(giftPackIndex, 1);
     await player.save();
     
     return res.send(success(200,"unlocking of gifts successfully"));

     
  } catch (err) {
    return res.send(error(500,err.message))
  }
}