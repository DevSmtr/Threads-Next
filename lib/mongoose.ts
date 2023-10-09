import mongoose from "mongoose"

let isConnected=false //check connection state

export const connectToDB = async() => {
  mongoose.set('strictQuery',true);

  if(!process.env.MONGODB_URL) return console.log("MONGO_URL not found")

  if(isConnected) return console.log("DB already connected")
  
  try {
    await mongoose.connect(process.env.MONGODB_URL)
    isConnected = true;
    console.log("-> DB connected sucessfully!!")
  } catch (error) {
    console.log("** DB not connected **")
    console.log(error)
  }

}