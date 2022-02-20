const express = require('express');
const app = express();
const http = require('http').createServer(app);
const PORT = process.env.PORT || 3000
require("./db/connection");
const signup = require('./model/signup');
const Login = require('./model/login');
const Contact = require('./model/contact');
const bcrypt = require("bcryptjs"); 
var mongoose = require('mongoose');

http.listen(PORT, () => {
    console.log(`Application running on port ${PORT}`);
});
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(__dirname + '/public'));


const msg = new mongoose.Schema({
    Name: String,
    message: String,
    when: Date
});
const msgitem = mongoose.model('msgitem', msg);
let data=[],name='';
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

app.post('/', async (req, res) => {
    // console.log(req.body);
    try {

        const password = req.body.password;
        const Username = req.body.Username;
        // console.log(email, password, Username);
        const nameofuser = await signup.findOne({ Username: Username });
        const isMatch = bcrypt.compare(password,nameofuser.password);
        if (isMatch) {
            const logg = new Login({
                Username: req.body.Username,
                password: req.body.password,

            })

            const logged = await logg.save();
            const messages=await msgitem.find();
            data=messages;
            name=Username;
            res.status(200).sendFile(__dirname + '/index.html');
        }
        else {
            res.sendFile(__dirname + '/public/indetail.html');
        }
    }
    catch (err) {
        res.send("Invalid details");
    }
})

app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/public/signup.html')
})
app.post('/signup',async(req,res)=>{
    try{
       const rege=new signup({
           Username:req.body.Username,
           email:req.body.email,
           password:req.body.password
       })
       
       const registered=await rege.save();
       res.sendFile(__dirname+'/public/login.html');
    }
    catch(err){
        res.sendFile(__dirname+'/public/userexist.html');
    }
})


app.get('/contact', (req, res) => {
    res.sendFile(__dirname + '/public/contact.html')
})
app.post('/contact',async(req,res)=>{
    try{
        const con=new Contact({
            name:req.body.name,
            email:req.body.email,
            msg:req.body.msg
        })
 
        const cont=await con.save();
        res.sendFile(__dirname+'/public/consuc.html');
     }
     catch(err){
          res.status(401).send('Bad request');
     }
})

app.get('/delete', (req, res) => {
    res.sendFile(__dirname + '/public/delete.html');
});

app.post('/delete', async (req, res) => {
    try {

        const password = req.body.password;
        const Username = req.body.Username;
        const nameofuser = await signup.findOne({ Username: Username })
        if ((nameofuser.password === password)) {
            const logg = new Login({
                Username: req.body.Username,
                password: req.body.password,

            })
            const namef = await signup.deleteOne({ Username: Username })
            res.sendFile(__dirname+'/public/deleted.html');

        }
        else {
            res.send("Invalid Details");
        }
    }
    catch (err) {
        res.send("Invalid details");
    }
})
// connect Socket with server
const io = require('socket.io')(http);

const users={}
io.on('connection', async(socket) => {
    // new-user-joined is an event
    

    users[socket.id] = name;
    socket.broadcast.emit('user-joined', name);
    socket.emit("setName",name);
    socket.emit("SendData",data);

    socket.on('send', ({message,time}) => {
        // console.log(message,time);
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] ,time:moment(Date.now()).format('lll')});
        var it = new msgitem({ Name: users[socket.id], message: message, when: Date.now() });
        it.save(function (err, it) {
            if (err) return console.error(err);
            it.speak;
        });

    });

    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });

})