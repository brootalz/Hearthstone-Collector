console.log("hsc.js");

var cardJson; // not needed?
var allClassTypes = []; // not needed?
var selectedClassTypes = []; // not needed?

function init() {
	loadJSON(function(response) {
		cardJson = JSON.parse(response);
		populateClassButtons(cardJson);
	});
}

function loadJSON(callback) {   
    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', 'https://api.hearthstonejson.com/v1/28329/enUS/cards.collectible.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
}

function populateClassButtons(jsonObj) {
	document.getElementById("menuClasses").innerHTML = "";
 	for(var i = 0; i < jsonObj.length; i++) {
 		if(!allClassTypes.includes(jsonObj[i].cardClass)) {
 			if(jsonObj[i].cardClass != "NEUTRAL") {
 				allClassTypes.push(jsonObj[i].cardClass);
 			}
 		}
 	}
 	allClassTypes.sort();
 	allClassTypes.push("NEUTRAL");
 	for(var ii = 0; ii < allClassTypes.length; ii++) {
		var node = document.createElement("LI");
		var button = document.createElement("INPUT");
		button.type = "button";
		button.value = allClassTypes[ii];
		button.onclick = function() {
			onClassButtonPress(this);
		}
		node.appendChild(button);
		document.getElementById("menuClasses").appendChild(node);
 	}
}

function onClassButtonPress(button) {
	for(var i =0; i < document.getElementById("menuClasses").children.length; i++) {
		document.getElementById("menuClasses").children[i].children[0].className= "";
	}
	button.className = "current";
	var cardsLength = populateResults(cardJson, button.value);
	populatePageButtons(cardsLength);
}

function populateResults(jsonObj, searchTerm) {
	var cards = [];
 	document.getElementById("output").innerHTML = "";
 	for(var i = 0; i < jsonObj.length; i++) {
 		var obj = jsonObj[i];
		if(obj.cardClass === searchTerm) {
			cards.push(obj);
		}
 	}
 	// Sort alphabetically, then by casting cost
 	cards.sort(function(a, b){
		var nameA = a.name.toLowerCase();
		var nameB = b.name.toLowerCase();
		if (nameA < nameB) {
			return -1;
		}
		if (nameA > nameB) {
			return 1;
		}
		return 0;
	});
	cards.sort(function(a, b) {
    	return a.cost - b.cost;
	});
	for(var ii = 0; ii < cards.length; ii++) {
		loadImage(cards[ii].id, cards[ii].name);
	}
	paginateResults(0);
	return cards.length;
}

var perPageNum = 14;
function populatePageButtons(cardsLength) {
	var pagesNum = Math.floor(cardsLength / perPageNum);
	document.getElementById("paginatorButtons").innerHTML = "";
	for(var i = 0; i < pagesNum; i++) {
		var node = document.createElement("LI");
		var button = document.createElement("INPUT");
		button.type = "button";
		button.value = i + 1;
		button.onclick = function() {
			onPageButtonPress(this);
		}
		node.appendChild(button);
		document.getElementById("paginatorButtons").appendChild(node);
		i === 0 ? button.className = "current" : button.className = "";
	}
}

function loadImage(cardId, name) {
	var node = document.createElement("LI");
	node.style.display = "none";
	var img = document.createElement("IMG");
	img.id = cardId;
	var newImg = new Image;
	newImg.onload = function() {
	    img.src = this.src;
	    img.alt = name;
	    img.title = name;
	}
	// FULL CARD
	newImg.src = "https://art.hearthstonejson.com/v1/render/latest/enUS/256x/" + cardId + ".png";
	// CARD ART ONLY
	//newImg.src = "https://art.hearthstonejson.com/v1/256x/" + cardId + ".jpg";

	node.appendChild(img);
	document.getElementById("output").appendChild(node); 
}

function paginateResults(currentPage) {
	console.log("paginateResults: " + currentPage);
	var ul = document.getElementById("output");
	var pagesNum = Math.floor(ul.children.length / perPageNum);
	for(var i = 0; i < ul.children.length; i++) {
		if(i >= currentPage * perPageNum && i <= currentPage * perPageNum + (perPageNum-1)) {
			ul.children[i].style.display = "inline-block";
		}
		else
		{
			ul.children[i].style.display = "none";
		}
	}
	document.getElementById("paginatorButtons")
}

function onPageButtonPress(button) {
	console.log("page button pressed: " + button.value);
	for(var i = 0; i < document.getElementById("paginatorButtons").children.length; i++) {
		document.getElementById("paginatorButtons").children[i].children[0].className= "";
	}
	button.className = "current";
	paginateResults(button.value);
}

function loadName(cardName) {
	var node = document.createElement("LI");
	var textnode = document.createTextNode(cardName);
	node.appendChild(textnode);
	document.getElementById("output").appendChild(node); 
 }

init();