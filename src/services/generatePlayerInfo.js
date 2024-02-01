import { v4 as uuidv4 } from 'uuid';

function generateFiveDigitNumber() {
    return Math.floor(10000 + Math.random() * 90000); 
  }
  
async function generatePlayerInfo(name) {
    try {
    const randomFiveDigitNumber = generateFiveDigitNumber();
      const playerUUID = uuidv4();
      const username = name +"_"+ randomFiveDigitNumber ;
      return { playerUUID, username };

    } catch (err) {
      throw new Error('Hashing error');
    }
  }
  export default generatePlayerInfo;