import mongoose from "mongoose";
const packSchema = new mongoose.Schema({
    tour:{
        type:Number,
    },
    type:{
        type:String,
        enum:["basic","delux","elite"]
    },
    coins:{
        type:Number
    },

    gems:{
        type:Number
    },
    balls:{
        type:Object
    },
    players:{
        type:Object
        
    },
    bowlers:{
        type:Object
        
    }
    



});

export default packSchema