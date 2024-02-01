import mongoose from"mongoose";

const memberSchema = new mongoose.Schema({
  playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
  joinedAt: { type: Date, default: Date.now },
  isAdmin: { type: Boolean, default: false },
});

// Define the main Club schema
const clubSchema = new mongoose.Schema({
  name: { type: String, required: true },
  photo: { type: String },  // Assuming a URL to the photo
  coinsEarned: { type: Number, default: 0 },
  ranking: { type: Number, default: 0 },
  maxPlayers: { type: Number, default: 12 },
  members: [memberSchema],  // Array of members using the memberSchema
  chat: [
    {
      senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
      message: { type: String },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

const clubModel = new mongoose.model('club',clubSchema);
export default clubModel;