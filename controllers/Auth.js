import UserModel from "../models/user.js"
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'

const register=async(req,res)=>{
    console.log(req.body)
    try {
        const {name,email,password}=req.body
           
        const existUser = await UserModel.findOne({email})
        if (existUser) {
            return res.status(401).json({success:false,message:"User already Exist"})
        }
            const hashpassword = await bcryptjs.hash(password, 10)
        const newUser= new UserModel({
            name, email, password:hashpassword
        })
        
          await newUser.save()

          res.status(200).json({message:"user register successfully", user: {_id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role, status:"Active", permissions: newUser.permissions}})
    } catch (error) {
        res.status(500).json({success:false,message:"interanl server error"})
        console.log(error)
    }
}


const Login=async(req,res)=>{
    try {
        // console.log("In login")
          const {email, password}=req.body

          const user = await UserModel.findOne({email})

          if (!user) {
              return res.status(404).json({success:false,message:"Invalid credentials"})
          }

        // console.log(password, user)
          const ispasswordValid = await bcryptjs.compare(password, user.password)
          console.log(ispasswordValid)
          if (!ispasswordValid) {
            return res.status(404).json({success:false,message:"Invalid credentials"})
          }
          // console.log(user)
               const token = jwt.sign({userId:user._id},process.env.JWT_SECRET)

                res.cookie('token',token,{
                    httpOnly: true,
                    secure: false,
                    maxAge: 3600000,
                })
                
    res.status(200).json({success:true, message:"Login successfully", user: {_id: user._id, name: user.name, email: user.email, role: user.role, status:"Active", permissions: user.permissions},token})

    } catch (error) {
        res.status(500).json({success:false,message:"interanl server error"})
        console.log(error)
    }
}


  const Logout=async(req,res)=>{
    try {
        res.clearCookie('token')
        res.status(200).json({message:"user Logout successfully"})
    } catch (error) {
        res.status(500).json({success:false,message:"interanl server error"})
        console.log(error)
    }
  }

  
     const CheckUser=async(req,res)=>{
            try {
                const user=req.user
                if (!user) {
                    res.status(404).json({message:'User not found'})
                }
                res.status(200).json(user)

                
            } catch (error) {
                res.status(500).json({message:"internal server error"})
                console.log(error)
                
            }
     }

export {register,Login,Logout,CheckUser}