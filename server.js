import express from "express";
import "dotenv/config"
import cors from "cors"
import http from "http"
import { connect } from "http2";
import { connectedDb } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import {Server} from "socket.io";


//creating express app and http server
const app=express();

const server=http.createServer(app);

//Insilized socket.io to the server
export const io=new Server(server,{
   cors:{origin:"*"}
})

//store online user
export const userSocketMap={};

//socket.io connectio handler
io.on("connection",(socket)=>{
const userId=socket.handshake.query.userId;
console.log("user connected",userId);

//when the user is avilable we add the data in the userSocketMap
if(userId){
   userSocketMap[userId]=socket.id;

}

// Emit online user to all connected user
io.emit("getOnlineUser",Object.keys(userSocketMap));
socket.on("disconnect",()=>{
   console.log("user disconnected ",userId);
   delete userSocketMap[userId];
   io.emit("getOnlineUser",Object.keys(userSocketMap))
})
})


//middelware setup
app.use(express.json({limit:"4mb"}))
app.use(cors());//it will allow all the url coming from the frontend


//routes setup
app.use("/api/status",(req,res)=> res.send("server is live"));
app.use("/api/auth",userRouter);
app.use("/api/messages",messageRouter)


//connect to mongo db

await connectedDb();

const PORT=process.env.PORT || 5000;
server.listen(PORT,()=>{
console.log(`Server is running on port ${PORT}`);
});


