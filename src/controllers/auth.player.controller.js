import generatePlayerInfo from "../services/generatePlayerInfo.js";
import authPlayerModel from "../models/auth.player.model.js";
import generateAccessToken from "../services/generateAccessToken.js";
import {success,error} from "../services/utills/responseWrapper.js";
import {searchBatsman,searchBowler} from "../services/search.js";
import { searchBall,searchBat } from "../services/search.js";
/*import batsmanModel from "../models/batsman.model.js"*/

export async function authLoginController(req,res){
    const {name,email,country}  = req.body;
    try {
        const existingUser = await authPlayerModel.findOne({email});
        if(!existingUser){
            const {playerUUID, username} = await generatePlayerInfo(name);
            const user = new authPlayerModel({email,country,username,userId:playerUUID});
            const savedUser = await user.save();
            const accessToken = generateAccessToken({...savedUser});
            return res.send(success(200,{accessToken}));
        }
        
        const accessToken = generateAccessToken({...existingUser});
        return res.send(success(200,{accessToken}));

    } catch (err) {
        return res.send(error(500,err.message));
    }
}


export async function authLogoutController(req,res){
    try {
                
    } catch (err) {
        return res.send(error(500,err.message));
    }
}




export async function addBatsmanController(req, res) {
    const userId = req._id;
    const batsmanName = req.body.batsmanName;
  
    try {
      const player = await authPlayerModel.findById(userId);
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
        const requiredCards = batsmanInfo.requiredCards[0];
  
        if (currCards >= requiredCards) {
          // Provide an option for level up
          player.batsman[existingBatsmanIndex].levelUpOption = true;
        }
      } else {
        // Batsman doesn't exist, create a new one and push it to the array
        const newBatsman = {
          name: batsmanName,
          category: batsmanInfo.category,
          type: batsmanInfo.type,
          photo: batsmanInfo.photo,
          currCards: batsmanCount,
          requiredCards: batsmanInfo.requiredCards[0],
          handedness: batsmanInfo.type,
          level: 1,
          skillPoints: batsmanInfo.skillpoints[0],
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


// api for level up of the batsman
export async function batsmanLevelUpController(req, res) {
    const batsmanName = req.body.batsmanName;
    const userId = req._id;
  
    try {
      const batsmanInfo = searchBatsman(batsmanName);
      console.log(batsmanInfo);
      if (!batsmanInfo) {
        return res.send(error(404, "BatsmanInfo not found"));
      }
  
      const player = await authPlayerModel.findById(userId);
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
    const player = await authPlayerModel.findById(userId);
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
        handedness: bowlerInfo[0].type,
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
  console.log(userId)
  const bowlerName = req.body.bowlerName;


  try {
    const bowlerInfo = searchBowler(bowlerName);
    if (!bowlerInfo) {
      return res.send(error(404, "bowlerInfo not found"));
    }

    const player = await authPlayerModel.findById(userId);
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

export async function addBallsController(req,res){
  const userId = req._id;
  
  const name = req.body.name;
  const count = req.body.count;
  

  try {
    const player = await authPlayerModel.findById(userId);
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
    const player = await authPlayerModel.findById(userId);
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

