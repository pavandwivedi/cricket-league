import mongoose from "mongoose";

const ballSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: [
      "Default",
      "Kingfisher",
      "Stallion",
      "Lizard",
      "Lion",
      "Highness",
      "Tempest",
      "Kobra"
    ]
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

export default ballSchema;