import mongoose from "mongoose";
import batsmanSchema from "./batsman.model.js";
import bowlerSchema from "./bowler.schema.js";
import ballSchema from "./ball.schema.js";
import batsSchema from "./bats.schema.js";
/*import tourSchema from "./tour.schema.js";*/

const authPlayerSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  username:{type:String, required:true},
  email: { type: String, unique: true },
  photo: { type: String },   
  gems: { type: Number, default: 0 },
  coins: { type: Number, default: 0 },
  country: { type: String },
  batsmanCounts: {
    type: Map,
    of: Number,
    default: {},
  },
  bowlerCounts: {
    type: Map,
    of: Number,
    default: {},
  },
  ballCounts: {
    type: Map,
    of: Number,
    default: {},
  },
  batsCounts:{
    type:Map,
    of:Number,
    defult:{},
  },
  batsman: [batsmanSchema],  
  bowlers: [bowlerSchema],
  balls:  [ballSchema],
  bats:[batsSchema],
  /*tours:[{tourSchema}],*/
 

  wins: { type: Number, default: 0 },
  sixesScored: { type: Number, default: 0 },
  totalWickets: { type: Number, default: 0 },
  coinsEarned: { type: Number, default: 0 },
  totalMatches: { type: Number, default: 0 },
  winRate: { type: Number, default: 0 },
  worldRecord: { type: Number, default: 0 },
  countryRecord: { type: Number, default: 0 },
  winStreak: { type: Number, default: 0 },

}, 
{ timestamps: true }
);

const authPlayerModel = mongoose.model('authPlayer', authPlayerSchema);

export default authPlayerModel;
