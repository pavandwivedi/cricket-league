import Batsman from "../constants/batsmans.constants.js"
import bowlers from "../constants/bowlers.constants.js"
import balls from "../constants/balls.constants.js";
import bats from "../constants/bats.constants.js"
import tour from '../constants/tour.contstants.js'
import tourPack from '../constants/tourPack.constants.js'
import { ballPriceConstant } from "../constants/shop.constants.js";
import {packs} from "../constants/shop.constants.js";
 export  function searchBatsman(name) {
  const result = Batsman.filter(batsman =>
    batsman.name===name
  );

  return result;
}

export function searchBowler(name){
   

  // Filter bowlers based on name and category
  const result = bowlers.filter(bowler =>
    bowler.name===name
  );

  return result;
}

export function searchBall(name){
  
    const result = balls.filter(ball =>ball.name===name);
   
    if (result){
      return result;
        
    }
    return null;
}
export function searchBat(name){
 
    const result = bats.filter(bat =>bat.name===name);
    
    if (result){
      return result;
        
    }
    return null;
}

export  function searchTour(name){
    const result = tour.filter(tour => tour.name===name);
    if (result){
      return result;
    }
    return null;
}

export  function searchTourpack(type){
 
    const result = tourPack.filter(b =>b.type===type);
    if (result) {
      return result[0];
    }
    
    return null;
}


export function getBallPrice(ballName, quantity) {
  const ball = ballPriceConstant.find((b) => b.name === ballName);
 
  if (ball) {
    const priceKey = `${quantity} balls`;
    
    return ball[priceKey] || 0;
    
  }

  return 0; // Return 0 if the ball name is not found in the constant
}
export function searchPack(packName) {
  const pack = packs.find((p) => p.name === packName);
 
  return pack || null;
}



















