import mongoose from "mongoose";

import levelSchema from "./level.schema.js";

const tourSchema = new mongoose.Schema({
  name: { 
    type: String,
    required: true 
   },

  place: {
     type: String,
     required: true 
    },
  playersOnline: { 
    type: Number,
    default: 0 
  },

  entryFee: { 
    type: Number,
    required: true 
   },

  levels: [levelSchema]
});

export default tourSchema;
