// Copyright Titanium I.T. LLC.
"use strict";

module.exports = class App {

	run() {
		const data = "hello";
		return rot13(data);
	}

};

// Courtesy of https://stackoverflow.com/a/617685
function rot13(data) {
	return data.replace(/[a-zA-Z]/g,function(c){return String.fromCharCode((c<="Z"?90:122)>=(c=c.charCodeAt(0)+13)?c:c-26);});
}