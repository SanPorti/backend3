import jwt from "jsonwebtoken"; 
import userModel from "../models/user.js";
import dotenv from "dotenv"; 

dotenv.config();
const claveSecreta = process.env.CLAVE_SECRETA;

let secretKey = claveSecreta; 

export const generateToken = (user) => {
    const token = jwt.sign({user}, secretKey, {expiresIn: '24h'})
    return token;
}

export const updateLastConnection = async (userId) => {
    await userModel.findByIdAndUpdate(userId, {
        last_connection: new Date()
    })
}