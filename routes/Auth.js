import express from 'express'
import { CheckUser, Login, Logout, register } from '../controllers/Auth.js'
import {IsUser} from '../middleware/verifyToken.js'
import { googleAuth } from '../controllers/googleAuth.js'
const AuthRoutes=express.Router()

AuthRoutes.post('/register',register)
AuthRoutes.post('/login',Login)
AuthRoutes.post('/logout',Logout)
AuthRoutes.get('/CheckUser', IsUser, CheckUser)
AuthRoutes.post('/google-login', googleAuth)

export default AuthRoutes