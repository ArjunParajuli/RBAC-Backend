import express from 'express'
import { getAllUsers } from '../controllers/User.js';
import { IsUser } from '../middleware/verifyToken.js';
const UserRoutes = express.Router();

UserRoutes.get('/getAllUsers', IsUser, getAllUsers)
export default UserRoutes;