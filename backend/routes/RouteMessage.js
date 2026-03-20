import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getMessages } from "../controllers/message.controllers.js";

const router = express.Router();


router.get("/:friendId", authMiddleware, getMessages)



export default router