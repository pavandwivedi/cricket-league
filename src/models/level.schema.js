import mongoose from "mongoose";

const levelSchema = new mongoose.Schema({
  name: {
     type: Number,
      default:1
    },
    
  xp:{
    type:Number,
    default :0
  },
  requiredXp: {
     type: Number,
     
    }
});
export default levelSchema;