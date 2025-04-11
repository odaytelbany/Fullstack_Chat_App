import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
export const protectRoute = async (req, res, next) => {
   try {
    const token = req.cookies.jwt_chat_app;
    if (!token) {
        return res.status(401).json({message: "No token provided!"});
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
        return res.status(401).json({message: "Invalid token!"});
    }
    const user = await User.findById(decoded.userId).select("-password -__v");
    if (!user) {
        return res.status(401).json({message: "User not found!"});
    }
    req.user = user;
    next();
   } catch (error) {
    console.log("Error in protectRoute middleware: ", error);
    res.status(500).json({message: "Internal server error"});
   }

}