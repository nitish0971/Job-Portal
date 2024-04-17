import mongoose from "mongoose";

const dbConnection = ()=>{
    mongoose.connect(process.env.MONGO_URI,{
        dbName:"MERN_STACK_JOB_SITE"
    }).then(()=>{
        console.log("Connected to database");
    }).catch((err)=>{
        console.log(`Some error occured while connecting to database: ${err}`);
    })
}

export default dbConnection