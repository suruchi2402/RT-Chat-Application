// import dotenv from 'dotenv';
const mongoose=require('mongoose');
const dotenv=require('dotenv');
dotenv.config();
mongoose.connect(process.env.connectionURL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
    

}).then(()=>{
    console.log("connection successful");
}).catch((e)=>{
    console.log('no connection');
})