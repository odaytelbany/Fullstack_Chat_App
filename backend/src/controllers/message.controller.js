import asyncWrapper from "../middlewares/asyncWrapper.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import {SUCCESS} from "../utils/httpStatusText.js";
import cloudinary from "../config/cloudinary.js";

export const getAllUsers = asyncWrapper(
    async (req, res, next) => {
        const {_id} = req.user;
        const allUsers = await User.find({_id: {$ne: _id}}).select("-password");

        res.status(200).json({
            status: SUCCESS,
            data: allUsers
        })
    }
)

export const getMessages = asyncWrapper(
    async (req, res, next) => {
        const {id: otherUserId} = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                {senderId: myId, receiverId: otherUserId},
                {senderId: otherUserId, receiverId: myId}
            ]
        });

        res.status(200).json({status: SUCCESS, data: messages});
    }
)

export const sendMessage = asyncWrapper(
    async(req, res, next) => {
        const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      // Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

        res.status(201).json({
            status: SUCCESS,
            data: {message: newMessage}
        })
    }
)