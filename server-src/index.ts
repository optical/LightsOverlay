import * as path from "path";
import express = require("express");
import bodyParser = require("body-parser");
import * as http from "http";
import io = require("socket.io");

const app = express();
const server = http.createServer(app);
const socketIoServer = io(server);

type LightColour = "RED" | "WHITE" | "BLUE" | "YELLOW" | "BLACK";


interface LightMessage {
	leftLight: LightColour;
	middleLight: LightColour;
	rightLight: LightColour;
}


app.use(bodyParser.text());
app.use(express.static(path.join(__dirname, "../static")));

server.listen(5050, () => {
	console.log("Backend is online");
});

app.post('/lights', (req, res) => {
	let wat:string = req.body;
	let colours: LightColour[] = wat.split(',').map(token => token.trim()) as LightColour[];

	let update: LightMessage = {
		leftLight: colours[0],
		middleLight: colours[1],
		rightLight: colours[2]
	};

	socketIoServer.emit('light-update', update);
	res.status(200);
	res.send("OK");
});
