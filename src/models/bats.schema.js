import mongoose from "mongoose";

const batsSchema = new mongoose.Schema({
  name: {
    type: String,
 
  },
  photo:{
    type:String
  },
  category:{
      type:String,
      enum:["normal","rare","epic"]
  },
  count: { type: Number },
  cost :{type: Number}
});

export default batsSchema;