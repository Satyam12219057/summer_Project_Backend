import mongoose from "mongoose";
//funnction to connect the mongodb with the database
export const connectedDb=async()=>{
    try{
        mongoose.connection.on('connected',()=>console.log('Databse connected')

        );
        await mongoose.connect(`${process.env.MONGO_DB_URL}/chatapp`
           
        )

    }
    catch(err){
        console.log("error during the connectio",err);

    }
}