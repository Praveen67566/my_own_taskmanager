import express from "express"
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path"

dotenv.config();

const app = express();

app.set('view engine','ejs');
app.set('Views',path.resolve('./views'))

async function connectDB(){
    try {
        await mongoose.connect(process.env.MONGO_URL).then(()=>{
            app.listen(5000,()=>{
                console.log("Server is listening....")
            })
        })
    } catch (error) {
        console.log("Error",error)
    }
}

connectDB();

app.get('/',(req,res)=>{
    res.render('Home')
})