import mongoose from "mongoose";

const bowlerSchema = new mongoose.Schema({
    name:{
        type:String,
        
    },
    photo:{
        type:String,
        
    },
    category:{
        type:String,
        enum:["normal","rare","epic"]
    },
    cost:{
        type:Number,
        default:0
    },
   bowllingStyle:{
        type:String,
        enum:['fast bowler','off spinner','leg spinner','medium fast']
    
   },
   level: { type: Number, default: 1 },
    skillPoints: {
        type: Number,
        default: 1
    },
    levelUpOption:{
        type:Number,
        default:0
    }, 
    requiredCards: {
        type: Number
    },
    currCards:{
        type: Number 
    },
})

export default bowlerSchema;