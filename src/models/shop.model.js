import mongoose from "mongoose";

  
const gemSchema = new mongoose.Schema({
    gems: { type: Number, required: true },
    price: { type: Number, required: true },
  });
  

  const coinSchema = new mongoose.Schema({
    coins: { type: Number, required: true },
    price: { type: Number, required: true },
  });
  
const shopSchema = new mongoose.Schema({
    characters: [
        {
          characterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Character' },
          price: { type: Number, required: true },
        },
      ],
      gems: [gemSchema],    // Gem packages with price and quantity
      coins: [coinSchema],  // Coin packages with price and quantity
      packs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'pack' }],
});
const shopModel= new mongoose.model('shop',shopSchema);
export default shopModel;
