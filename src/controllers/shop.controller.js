import { error, success } from "../services/utills/responseWrapper.js";
import { Gems,Coins,ballPriceConstant } from "../constants/shop.constants.js";
import { searchBall, searchPack } from "../services/search.js";
import { getBallPrice } from "../services/search.js";
import guestPlayerModel from "../models/guest.player.model.js";
import { countAndStoreDetails } from "../services/generateGift.js";
import { searchBatsman } from "../services/search.js";
import { searchBowler } from "../services/search.js";
import tourPack from "../constants/tourPack.constants.js";
import { searchTourpack } from "../services/search.js";
import {packs} from "../constants/shop.constants.js"
import { getRandomCards } from "../services/generateGift.js";
import { getRandomBalls } from "../services/generateGift.js";
import Batsman from "../constants/batsmans.constants.js";
import bowlers from "../constants/bowlers.constants.js";
import { generatePack } from "../services/generateGift.js";

export async function shop(req,res){
  try {
     const purchaseItms ={};
     purchaseItms["Gems"] = Gems;
     purchaseItms["Coins"] = Coins;
     purchaseItms["balls"] = ballPriceConstant;
     purchaseItms["packs"] = packs;
     purchaseItms["Tour Pack"] = tourPack;
     purchaseItms["Batsman"]=Batsman;
     purchaseItms["Bowlers"] = bowlers;


     return res.send(success(200,purchaseItms));
  } catch (err) {
      return res.send(error(500,err.message));
  }
}



export async function purchaseBallsController(req,res){
    const userId =req._id;
    const ballName = req.body.ballName;
    const quantity = req.body.quantity;
    const price = getBallPrice(ballName,quantity);
    
    try {
        const player = await guestPlayerModel.findById(userId);
    
    if (!player) {
      return res.send(error(404, 'Player not found'));
    }
    if (player.gems < price) {
        return res.status(400).json({ error: 'Not enough gems to purchase the ball' });
      }
      const ballInfo =  searchBall(ballName);
    

    if (!ballInfo) {
      return res.status(404).json({ error: 'ball info not found' });
    }
      
      const ballCount = (player.ballCounts.get(ballName) || 0) + quantity;
      player.ballCounts.set(ballName, ballCount);

   
    const existingBallIndex = player.balls.findIndex(b => b.name === ballName);
    
    if (existingBallIndex !== -1) {
      
      player.balls[existingBallIndex].count += quantity;

      
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
      player.gems =player.gems- price;
      await player.save();
      return res.send(success(200,"balls added to player successfully"));

    } catch (err) {
        return res.send(error(500,err.message));
    }
}

export async function purchasePacksController(req,res){
    const userId = req._id;
    const packName = req.body.packName;
    try {
        const player = await guestPlayerModel.findById(userId);
    
    if (!player) {
      return res.send(error(404, 'Player not found'));
    }
        const packInfo = searchPack(packName);
        console.log(packInfo);
        const price = packInfo.price;
        player.coins+= packInfo.coins;
        player.gems+= packInfo.gems;
        
        const packDetails = generatePack(packName);
        console.log(packDetails);
        const details = countAndStoreDetails(packDetails);
        console.log(details);
        const players = details.players;
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
      
          const bowlers = details.bowlers;
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
          const packBalls = details.balls;
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
      if (player.gems < price) {
        return res.status(400).json({ error: 'Not enough gems to purchase the ball' });
      }

      player.gems -=price;

      await player.save();
     
      return res.send(success(200,"unlocking of packs successfully"));
 

    } catch (err) {
        return res.send(error(500,err.message));
    }
}

export async function purchaseTourPackController(req,res){
  const userId = req._id;
  const tourType = req.body.tourType;
  const tour = req.body.tour;
  try {

    const player = await guestPlayerModel.findById(userId);
    
    if (!player) {
      return res.send(error(404, 'Player not found'));
    }
     
    const packInfo = searchTourpack(tourType);
    const price = packInfo.price;
   console.log(packInfo);
    const Packs = {
      coins: packInfo?.coins[tour-1],
      cards:  getRandomCards(tour,tourType),
      gems: packInfo?.gems[tour-1],
      balls:getRandomBalls(tour,tourType)  
    };
    console.log(Packs);
    const details = countAndStoreDetails(Packs);
    console.log(details);
    const players = details.players;
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
      
          const bowlers = details.bowlers;
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
          const packBalls = details.balls;
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
      if (player.gems < price) {
        return res.status(400).json({ error: 'Not enough gems to purchase the ball' });
      }

      player.gems -=price;
      player.coins+=Packs.coins;

      await player.save();
     
      return res.send(success(200,"unlocking of packs successfully"));


  } catch (err) {
       return res.send(error(500,err.message));
  }
}
 
export async function purchaseCardsController(req,res){
   const userId = req._id;
   const cardName = req.body.cardName;
  
  try {
     const player = await guestPlayerModel.findById(userId);
     if(!player){
      return res.send(error(404,'player info. not found'));
     }
     const batsmanInfo = searchBatsman(cardName);
     console.log(batsmanInfo);
       
     
     
    if(!(batsmanInfo.length===0)){
     
      const batsmanCount = (player.batsmanCounts.get(cardName) || 0) + 1;
      player.batsmanCounts.set(cardName, batsmanCount);
  
      // Check if the batsman already exists in the array
      const existingBatsmanIndex = player.batsman.findIndex(b => b.name === cardName);
      
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

        console.log(batsmanInfo[0])
        // Batsman doesn't exist, create a new one and push it to the array
        const newBatsman = {
          name: cardName,
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
      
    } else{
      const bowlerInfo = searchBowler(cardName);
      console.log(bowlerInfo);
  
      if (!bowlerInfo) {
        return res.status(404).json({ error: 'bowler info not found' });
      }
  
      const bowlerCount = (player.bowlerCounts.get(cardName) || 0) + 1;
      player.bowlerCounts.set(cardName, bowlerCount);
  
      // Check if the batsman already exists in the array
      const existingBowlerIndex = player.bowlers.findIndex(b => b.name === cardName);
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
          name: cardName,
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
    await player.save();
    return res.send(success(200,"card added to player successfully"));
  }
    catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }




  
  
 

