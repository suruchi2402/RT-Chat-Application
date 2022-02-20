const socket = io();
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");
var audio = new Audio('notify.mp3');
var audio1 = new Audio('go.mp3');
var audio2 = new Audio('incoming.mp3');

const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;

}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    if (message != '') {

        append(`You : ${message} `, 'right');
        socket.emit('send', ({ message: message, time: Date.now() }));
        messageInput.value = '';

    }
    else {
        alert("Cannot send empty message!!");
    }
})
let name="User"
socket.on("setName",data=>{
     name=data
})
socket.on('user-joined', name => {
    audio.play();
    append(`${name} joined the chat,Welcome ${name}!!`, 'middle');

})

socket.on('receive', data => {
    // console.log(data);
    audio2.play();
    append(`${data.name}: ${data.message}`, 'left');
})
socket.on("SendData", data => {
    // console.log(name,data);
    data.map((item) => {
        if (name === item.Name) {

            append(`You: ${item.message}`, 'right');
        }
        else {
            append(`${item.Name}: ${item.message}`, 'left');
        }
    })
})

socket.on('left', name => {
    append(`${name} left the chat,bye ${name} !!`, 'middle');

})
