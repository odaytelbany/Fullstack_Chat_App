import express from "express";
import { protectRoute } from "../middlewares/protectRoute.js";
import { getAllUsers, getMessages } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users",protectRoute ,getAllUsers);
router.get("/:id",protectRoute ,getMessages);
router.post("/send/:id",protectRoute ,getMessages);

export default router;