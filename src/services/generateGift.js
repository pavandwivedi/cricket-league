import tourPack from "../constants/tourPack.constants.js"
import { searchTourpack } from "./search.js";
import Batsman from "../constants/batsmans.constants.js";
import bowlers from "../constants/bowlers.constants.js";
import balls from "../constants/balls.constants.js";
import { searchBall } from "./search.js";
import { searchBatsman } from "./search.js";
import { searchBowler } from "./search.js";
import mongoose from 'mongoose';
 export function getRandomGiftPack() {
    // Define the pack types and their weights
    const packWeights = {
      basic: 7, // Higher weight for basic
      delux: 2,
      elite: 1 // Lower weight for elite
    };
  
    // Calculate total weight for all pack types
    const totalWeight = Object.values(packWeights).reduce((sum, weight) => sum + weight, 0);
  
    // Generate a random number between 1 and the total weight
    const randomValue = Math.floor(Math.random() * totalWeight) + 1;
  
    // Determine the selected pack type based on weights
    let selectedPack;
    let currentWeight = 0;
  
    for (const [packType, weight] of Object.entries(packWeights)) {
      currentWeight += weight;
  
      if (randomValue <= currentWeight) {
        selectedPack = packType;
        break;
      }
    }
  
    return selectedPack || "basic"; // Fallback to basic if something goes wrong
  }
  
  
  


   export function getRandomPlayer(category, count) {
    const players = Batsman.filter(batsman => batsman.category ===category); // Use either 'normal', 'rare', or 'epic'
 
    const bowlersList = bowlers.filter(bowler => bowler.category === category); // Filter bowlers based on category
    
    const selectedPlayers = [];
    const selectedBowlers = [];
  
    while ((selectedPlayers.length + selectedBowlers.length) < count && (players.length > 0 || bowlersList.length > 0)) {
      // Decide whether to select a batsman or bowler
      const isSelectingBatsman = Math.random() < 0.5;
        
      if ((isSelectingBatsman && players.length > 0) || bowlersList.length === 0) {
        const randomIndex = Math.floor(Math.random() * players.length);
     
        const selectedPlayer = players.splice(randomIndex, 1)[0];
        
        // Add pack type to the selected player
        selectedPlayers.push(selectedPlayer);
        
      } else {
        const randomIndex = Math.floor(Math.random() * bowlersList.length);
        
        const selectedBowler = bowlersList.splice(randomIndex, 1)[0];
         
        // Add pack type to the selected bowler
        selectedBowlers.push(selectedBowler);
       
      }
    }
      
    // Check if the selected arrays are not empty before returning
    return {
      players: selectedPlayers.length > 0 ? selectedPlayers : null,

      bowlers: selectedBowlers.length > 0 ? selectedBowlers : null,
    };
  }
 export  function getRandomBall(category, count) {
    const ballsList = balls.filter(ball => ball.category === category);
  
    const selectedBalls = [];
  
    while (selectedBalls.length < count && ballsList.length > 0) {
      const randomIndex = Math.floor(Math.random() * ballsList.length);
      const selectedBall = ballsList.splice(randomIndex, 1)[0];
  
      // Add pack type to the selected ball
      selectedBalls.push(selectedBall);
    }
  
    // Check if the selected array is not empty before returning
    return selectedBalls.length > 0 ? selectedBalls : null;
  }
  
  
 /* function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  } */

 export  function getRandomCards(tour,selectedPack){
        const tourPackInfo = searchTourpack(selectedPack);
        const normalCount = tourPackInfo?.normal[tour-1];
        const rareCount = tourPackInfo?.rare[tour-1];
        const epicCount = tourPackInfo?.epic[tour-1];
      const normalCards=  getRandomPlayer("normal",normalCount);
    
      const rareCards=  getRandomPlayer("rare",rareCount);
      
       const epicCards= getRandomPlayer("epic",epicCount);
      
       /*shuffleArray(normalCards);
       shuffleArray(rareCards); 
       shuffleArray(epicCards); */


       return {normalCards,rareCards,epicCards};

  }

 export function getRandomBalls(tour,selectedPack){
    const tourPackInfo = searchTourpack(selectedPack);
    const    normalBallCounts= tourPackInfo?.normalBalls[tour-1];
     const   rareBallCounts= tourPackInfo?.rareBalls[tour-1];
     const   epicBallCounts=tourPackInfo?.epicBalls[tour-1];
        const normalBalls = getRandomBall("normal",normalBallCounts);
       

        const rareBalls = getRandomBall("rare",rareBallCounts);
        
        const epicBalls = getRandomBall("epic",epicBallCounts);
       
        return {normalBalls,rareBalls,epicBalls};

}
export  function generateGift(tour,selectedPack){
    const tourPackInfo =  searchTourpack(selectedPack);
     
     

    const gifts = {
        coins: tourPackInfo?.coins[tour-1],
        cards:  getRandomCards(tour,selectedPack),
        gems: tourPackInfo?.gems[tour-1],
        balls:getRandomBalls(tour,selectedPack)  
      };
     
      return gifts;
}
 export function countAndStoreDetails(gift) {
    const details = {
      players: {},
      bowlers: {},
      balls: {}
    };
  
    function countNames(array, category) {
      if (array && array.length > 0) {
        array.forEach(item => {
          const name = item.name || 'Unknown';
          if (!details[category][name]) {
            details[category][name] = 1;
          } else {
            details[category][name]++;
          }
        });
      }
    }
  
    // Count players' names
    countNames(gift.cards.normalCards.players, 'players');
    countNames(gift.cards.rareCards.players, 'players');
    countNames(gift.cards.epicCards.players, 'players');
  
    // Count bowlers' names
    countNames(gift.cards.normalCards.bowlers, 'bowlers');
    countNames(gift.cards.rareCards.bowlers, 'bowlers');
    countNames(gift.cards.epicCards.bowlers, 'bowlers');
  
    // Count balls' names
    /*countNames(gift.balls.normalBalls.balls,"balls");
    countNames(gift.balls.rareballs.balls,"balls");
    countNames(gift.balls.epicBalls.balls,"balls");*/
   const ballTypes = ['normalBalls', 'rareBalls', 'epicBalls'];
    ballTypes.forEach(ballType => {
      const ballArray = gift.balls[ballType];
      if (ballArray && ballArray.length > 0) {
        ballArray.forEach(ball => {
          const name = ball.name || 'Unknown';
          if (!details.balls[name]) {
            details.balls[name] = 1;
          } else {
            details.balls[name]++;
          }
        });
      }
    });
    return details;
  }
 
  export function getRandomlyCards(selectedPack){
    const PackInfo = searchPack(selectedPack);
    const normalCount = PackInfo?.normalCards;
    const rareCount = PackInfo?.rareCards;
    const epicCount = PackInfo?.epicCards;
  const normalCards=  getRandomPlayer("normal",normalCount);
    
  const rareCards=  getRandomPlayer("rare",rareCount);
  
   const epicCards= getRandomPlayer("epic",epicCount);
  
   /*shuffleArray(normalCards);
   shuffleArray(rareCards); 
   shuffleArray(epicCards); */


   return {normalCards,rareCards,epicCards};

}

export function getRandomlyBalls(selectedPack){
const PackInfo = searchPack(selectedPack);
const    normalBallCounts= PackInfo?.normalBalls;
 const   rareBallCounts= PackInfo?.rareBalls;
 const   epicBallCounts=PackInfo?.epicBalls;
    const normalBalls = getRandomBall("normal",normalBallCounts);
   
     
    const rareBalls = getRandomBall("rare",rareBallCounts);
    
    const epicBalls = getRandomBall("epic",epicBallCounts);
   
    return {normalBalls,rareBalls,epicBalls};

}
export  function generatePack(selectedPack){
const PackInfo =  searchPack(selectedPack);
 
 

const Packs = {
    coins: PackInfo?.coins,
    cards:  getRandomlyCards(selectedPack),
    gems: PackInfo?.gems,
    balls:getRandomlyBalls(selectedPack)  
  };
 
  return Packs;
}

 

  