const mongoose = require('mongoose');

const logschema = new mongoose.Schema({
    Username: {
        type: String,
        required: true
    },
   
    password: {
        type: String,
        required: true
    },
   

})

const Login=new mongoose.model("Login",logschema);
module.exports=Login;