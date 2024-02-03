import express from 'express';
// import { leagueController } from '../controllers/league.controller.js';
import {  rankingPrizeController } from '../controllers/league.controller.js';

const leagueRouter = express.Router();
leagueRouter.get('/league',rankingPrizeController);
export default leagueRouter;


