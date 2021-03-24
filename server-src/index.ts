// Note: Dotenv should always be the first import & we should invoke dotenv.config() immediately after import - before we perform any further imports
import dotenv from "dotenv";
dotenv.config();

import * as path from "path";
import express = require("express");
import bodyParser = require("body-parser");
import * as http from "http";
import io = require("socket.io");
const fetch = require('node-fetch');

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

const port = 5050;
server.listen(port, () => {
	console.log(`Backend is online at http://127.0.0.1:${port}`);
});

app.post('/lights', (req, res) => {
	let requestBody:string = req.body;
	let colours: LightColour[] = requestBody.split(',').map(token => token.trim()) as LightColour[];

	let update: LightMessage = {
		leftLight: colours[0],
		middleLight: colours[1],
		rightLight: colours[2]
	};

	socketIoServer.emit('light-update', update);
	res.status(200);
	res.send("OK");
});

if (process.env.OPENLIFTER_URL) {
	const openLifterUrl = process.env.OPENLIFTER_URL;
	console.log(`Open lifter url configured as ${openLifterUrl}, forwarding timer events`);
	app.post('/lift-timer-started', async (req, res) => {
		try {
			await fetch(`${openLifterUrl}${openLifterUrl.endsWith("/") ? "" : "/"}lift-timer-started`, {
				method: "POST",
			});
		} catch (error) {
			console.log(`Failed to post to openlifter. Error was: ${error}`);
		} finally {
			res.status(200);
			res.send("OK");
		}
	});
} else {
	console.log(`Open lifter url not configured. Will not forward events`);
}
