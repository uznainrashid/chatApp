import jwt from 'jsonwebtoken'
import {UserModel} from '../models/User.js'
import bcrypt from 'bcrypt'
import validator from 'validator'
// Create Token
const createToken = async (id , name, email)=>{
    return jwt.sign({id, name , email}, 
        process.env.JWT_TOKEN, 
        {
        expiresIn:"1d"
    })
}

// Register User
export const register = async (req, res) => {
    try{
    const {name, email, password} = req.body;
    const exist  = await UserModel.findOne({email})
    if (exist) {
     return res.status(400).json({success:false, message: "Email already exist please login"})  
    }
    if (!validator.isEmail(email)) {
        return res.status(403).json({success:false, message:"Please Enter your valid email"})
        
    }
    if (password.length < 8) {
      return res.status(403).json({success:false, message: "Please Enter 8 Character Password"})
    }
     const salt = await bcrypt.genSalt(10)
     const hashedPassword = await bcrypt.hash(password, salt)
     const newUser = new UserModel({name, email, password : hashedPassword})
 
     const user = await newUser.save()
     const token = await createToken(user._id, user.name, user.email)
     return res.status(201).json({success:true, token , user:{name: user.name, email: user.email, _id: user._id}})
}catch(error) {
    return res.status(500).json({
        success:false,
        message:"Internal Server Error" 
    })
    
} 

}
// Login User
export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await UserModel.findOne({email})
        if (!user) {
            return res.status(404).json({success:false, message:"User not found"})
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(403).json({success:false, message:"please enter your correct password"})
        }
        const token = await createToken(user._id , user.name, user.email)
        
   return res.status(200).json({ 
    success: true, 
    token, 
    user: { name: user.name, email: user.email, _id: user._id } 
});
    }catch(error) {
        console.log("Login error:", error);
        return res.status(500).json({           
            success:false,
            message:"Internal Server Error" 
        })
    }
}   
// Fetch All Users
export const fetchAllUsers = async (req, res) => { 
    const userId = req.userId 
    try {
        const users = await UserModel.find({_id: {$ne: userId}}).select("-password")
  
       return res.status(200).json({success:true, users})
    }catch(error) {
        console.log("Fetch users error:", error);
        return res.status(500).json({   
            success:false,
            message:"Internal Server Error"
        })
    }
}
