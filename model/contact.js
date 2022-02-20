const mongoose = require('mongoose');

const conschema = new mongoose.Schema({
    name: {
        type: String,
        required: true        
    },
    email: {
        type: String,
        required: true
    },
    msg: {
        type: String,
        required: true
    }

})

const Contact=new mongoose.model("Contact",conschema);
module.exports=Contact;