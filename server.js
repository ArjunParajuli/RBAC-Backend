import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieparser from 'cookie-parser'
import DbCon from './utlis/db.js'
import AuthRoutes from './routes/Auth.js'
import AdminRoutes from './routes/AdminRoutes.js'
import UserRoutes from './routes/UserRoutes.js'
dotenv.config()
const PORT=process.env.PORT || 4000
const app=express()


DbCon()
app.use(cors({
    origin: ['http://localhost:5173', 'https://glittering-faun-21c75c.netlify.app'], // Add both local and deployed URLs
    credentials: true, // Allow credentials (cookies, etc.)
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow all necessary HTTP methods
}))

app.options('*', cors({
    origin: ['http://localhost:5173', 'https://glittering-faun-21c75c.netlify.app'], // Add both local and deployed URLs
    credentials: true,
}))

app.use(express.json())
app.use(cookieparser())

app.use('/api/auth', AuthRoutes);
app.use('/api/admin', AdminRoutes);
app.use('/api/users', UserRoutes);

app.get('/',(req,res)=>{
    res.send('test')
})

app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`)
})