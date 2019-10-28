let socket = io.connect();

let timer;

const popupDuration = 10000;

let lightsLookup = {
	BLACK: "#000000",
	BLUE: "#0000FF",
	RED: "#e53935",
	WHITE: "#FFFFFF",
	YELLOW: "#ffff00"
}

socket.on('light-update', data => {
	updateStyle(document.getElementById("left-light"), data.leftLight);
	updateStyle(document.getElementById("middle-light"), data.middleLight);
	updateStyle(document.getElementById("right-light"), data.rightLight);

	let numGood = isGood(data.leftLight) + isGood(data.middleLight) + isGood(data.rightLight);
	updateLiftText(numGood >= 2);

	let popupElement = document.getElementById("lights-popup");
	animateCSS(popupElement, "slideInDown");
	popupElement.style.display = "";

	clearInterval(timer);
	timer = setTimeout(async () => {
		await animateCSS(popupElement, "slideOutUp");
		popupElement.style.display = "none";
	}, popupDuration);
});

function updateLiftText(isGoodLift) {
	let textElement = document.getElementById('lifting-text');

	let classToAdd = isGoodLift ? "good-lift" : "no-lift";
	let classToRemove = isGoodLift ? "no-lift" : "good-lift";

	textElement.innerText = isGoodLift ? "good lift" : "no lift";
	textElement.classList.add(classToAdd);
	textElement.classList.remove(classToRemove);
}

function isGood(colour) {
	if (colour === "WHITE") {
		return 1;
	}
	return 0;
}

function updateStyle(element, light) {
	if (light === "RED" || light === "WHITE") {
		element.style["box-shadow"] = "";
		element.style.background = lightsLookup[light];
	} else {
		element.style.background = lightsLookup["RED"];
		element.style["box-shadow"] = `0 0 3px 3px ${lightsLookup[light]}`;
	}
}

function animateCSS(element, animationName) {
	element.classList.add('animated', animationName);

	let promise = new Promise((resolve, reject) => {
		element.addEventListener('animationend', () => {
			element.classList.remove('animated', animationName);
			resolve();
		}, {
			once: true
		});
	});

	return promise;
}
