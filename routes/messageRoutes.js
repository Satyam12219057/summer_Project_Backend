import express from "express"
import { protectRoutes } from "../middelware/auth.js";
import { getMessages, getUserFromSidebar, markMessageAsSeen, sendMessage } from "../controllers/messageController.js";

const messageRouter=express.Router();
messageRouter.get("/user",protectRoutes,getUserFromSidebar);
messageRouter.get("/:id",protectRoutes,getMessages);
messageRouter.put("mark/:id",protectRoutes,markMessageAsSeen);
messageRouter.post("/send/:id",protectRoutes,sendMessage);


export default messageRouter;

