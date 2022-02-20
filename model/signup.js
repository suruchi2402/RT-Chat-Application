const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const regschema = new mongoose.Schema({
    Username: {
        type: String,
        required: true,
        unique:true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    }

})
regschema.pre("save",async function(next){

if(this.isModified("password")){
// const passwordHash = await bcrypt.hash(password,10);
console.log(`the current password is ${this.password}`);
this.password = await bcrypt.hash(this.password,10);
console.log(`the current password is ${this.password}`);

}

next();
})

const signup=new mongoose.model("signup",regschema);
module.exports=signup;