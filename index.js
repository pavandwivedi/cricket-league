import express from "express";
import connectDB from "./src/config/db.js";
import authPlayerRouter from "./src/routes/auth.player.route.js";
import guestPlayerRouter from "./src/routes/guest.player.route.js";
import shopRouter from "./src/routes/shop.route.js";


connectDB();
const app = express();
const port = 3000;
app.use(express.json());
app.use('/player',authPlayerRouter);
app.use('/guest',guestPlayerRouter); 
app.use("/shop",shopRouter);

app.listen(port,()=>{
    console.log(`server running on port ${port}`)
})