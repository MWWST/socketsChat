// require express and path
var express = require("express");
var path = require("path");
// create the express app
var app = express();
// static content 
app.use(express.static(path.join(__dirname, "./static")));
// setting up ejs and our views folder
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
// root route to render the index.ejs view
app.get('/', function(req, res) {
 res.render("index");
})


// tell the express app to listen on port 8000
var server = app.listen(8006, function() {
 console.log("listening on port 8006");
})
// this gets the socket.io module *new code!* 
var io = require('socket.io').listen(server)  // notice we pass the server object<br>

// Whenever a connection event happens (the connection event is built in) run the following code
var users= {connectedUsers:[

  	]};

  	var chat ={userChats:[
  		]};

//connect to sockets 
io.sockets.on('connection', function (socket) {
  console.log("WE ARE USING SOCKETS!");
  console.log(socket.id);
 	 
//listen for new user, when we get one push into our users.ConnectedUsers object defined outside of this function
	  socket.on("new_user", function (data){
	    console.log('this is the form data' + data.User);
	    	users.connectedUsers.push({Name:data.User,ID:socket.id});
	  		console.log('USERS ARRAY',users.connectedUsers);
	  		//emit to the new client the entire eixsting chats object so they can see all previous chats
	  		socket.emit('existing_chats',{chats:chat.userChats})
	  		//broadcast to all clients except the new users that a new user entered the chat room
	   		 socket.broadcast.emit('got_a_new_user', { response: 
			{ name: data.User,
	    	  id: socket.id,
	    	}
		});

	    
	})
//listen for new chat event, when received push the chat into the chat object defined outside of this function
	  socket.on("new_chat",function(data){
	  	chat.userChats.push({name:data.submission.person,ID:socket.id,chat:data.submission.chat});
	 	console.log('NEW CHAT', chat.userChats);
//full broadcast so all clients receive the latest chat	 	
	 	io.emit("new_chat_entered",{latest:data.submission.chat,poster:data.submission.person})
	  })
	
})

//NOTES ON SOCKET EVENTS
// //  this is just the configuration code that we've already used
// io.sockets.on('connection', function (socket) {
//     //  EMIT:
//     socket.emit('my_emit_event');
//     //  BROADCAST:
//     socket.broadcast.emit("my_broadcast_event");
//     //  FULL BROADCAST:
//     io.emit("my_full_broadcast_even");
// })



