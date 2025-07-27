//here we can control the message and stor it in the  database

import Message from "../models/message.js";
import User from "../models/user.js";
import cloudinary from "../lib/cloudinary.js";
import {io,userSocketMap} from "../server.js"

export const getUserFromSidebar=async (req,res)=>{
  try{
 const userId=req.user._id;
 const filterUsers=await User.find({_id:{$ne:userId}}).select("-password");
 
 //count the total number of the mesage not seen
 const unseenMessages={};
 const promises=filterUsers.map(async (user)=>{
    const messages=await Message.find({senderId:user._id,receiverId:userId,seen:false})
    if(messages.length>0){
      unseenMessages[user.id]=messages.length;
    }
 })

 await Promise.all(promises);  

 res.json({success:true,users:filterUsers,unseenMessages})
  }  
  catch(err){
    console.log(err.messages);
    res.json({success:false,message:filterUsers,unseenMessages});


  }
}



//get all message for the selected user
export const getMessages=async (req,res)=>{
    try{
        const {id:selectedUserId}=req.params;
        const myId=req.user._id;
        const messages=await Message.find({
            $or:[
                {senderId:myId,receiverId:selectedUserId},
                {senderId:selectedUserId,receiverId:myId}
            ]
        })
        await Message.updateMany({senderId:selectedUserId,receiverId:myId},{seen:true});

       res.json({success:true,messages});
    }
    catch(err){
        console.log(err.message);
        res.json({success:false,message:err.message});
    }
}





//api to mark message as seen using message id
export const markMessageAsSeen=async ()=>{
    try{
        const {id}=req.params;
        await Message.findByIdAndUpdate(id,{seen:true});
        res.json({success:true});

    }
    catch(err){
        console.log(err.message);
        res.json({success:false,message:err.message});

    }
}

//send message to the selected user
export const sendMessage=async (req,res)=>{
   try{
    const {text,image}=req.body;
    const receiverId=req.params.id;
    const senderId=req.user._id;
    let imageUrl;
    if(image){
        const uploadResponse=await cloudinary.uploader.upload(image);
        imageUrl=uploadResponse.secure_url;
    }
    const newMessage=await Message.create({
        senderId,
        receiverId,
        text,
        image:imageUrl
    })
    //emit the new message to receiver socket
    const receiveSocketId=userSocketMap[receiverId];
    if(receiveSocketId){
        io.to(receiverSocketId).emit("newMessage",newMessage)
    }
    
    res.json({success:true,newMessage});



   } 
   catch(err){
      console.log(err.message);
      res.json({success:false,message:err.message});

   }
}