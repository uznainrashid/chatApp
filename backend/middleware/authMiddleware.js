import jwt from "jsonwebtoken"

export const authMiddleware = async (req , res , next)=>{
    const token = req.headers.authorization
    if (!token) {
        return res.status(401).json({
            success:false,
            message: "Access denied.No token provide",
        })
    }
    try {
        const verifyToken = jwt.verify(token, process.env.JWT_TOKEN)
        req.user = verifyToken
        next();
    } catch (error) {
        res.status(403).json({
            success:false,
            message:"Invalid Token"
        })
    }
}