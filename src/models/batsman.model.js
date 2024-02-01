import mongoose from "mongoose";

const batsmanSchema = new mongoose.Schema({
   
    name: {
        type: String,
        
    },
    category: {
        type: String,
        enum: ["normal", "rare", "epic"]
    },
    photo: {
        type: String
    },
    requiredCards: {
        type: Number
    },
    currCards:{
        type: Number 
    },
    type: {
        type: String,
        enum: ['left handed', 'right handed'], // Update this enum based on your batsman types
        
    },
    level: { type: Number, default: 1 },
    skillPoints: {
        type: Number,
        default: 1
    },
    levelUpOption:{
        type:Number,
        default:0
    }
});

/*const batsmanModel = mongoose.model('Batsman', batsmanSchema);
export default batsmanModel;*/
export default batsmanSchema;
