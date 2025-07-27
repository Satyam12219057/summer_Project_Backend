import express from "express"
import { checkAuth, login, signup, updateProfile } from "../controllers/userController.js";
import { protectRoutes } from "../middelware/auth.js";

const userRouter=express.Router();

//we will create the different end point
userRouter.post("/signup",signup);
userRouter.post("/login",login);
// userRouter.post("/update-profile",protectRoutes,updateProfile);
userRouter.put("/update-profile", protectRoutes, updateProfile);

userRouter.get("/check",protectRoutes,checkAuth);

export default userRouter;


