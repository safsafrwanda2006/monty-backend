import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config();

export const generateToken = (admin)=>{
    const payload = {
        id: admin.admin_id,
        role: admin.admin_role,
        email: admin.email
    };
    const token = jwt.sign(payload,process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_IN || "30d",
    });
    return token;
} 
