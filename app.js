// import modules
const http = require("http"),
	fs = require("fs"),
	dotenv = require("dotenv").config();
(url = require("url")), (fetch = require("node-fetch"));
// set up port for heroku
const PORT = process.env.PORT || 3000;
// set up API keys
const walmartAPI = process.env.WALMARTAPI;
const ebayAPI = process.env.EBAYAPI;

// create a server
const server = http.createServer(function(req, res) {
	console.log(`Request was made on ${req.url}`);
	// parse request url
	const parsedURL = url.parse(req.url, true);

	// get search phrase from request url
	const search = parsedURL.query.search;

	// extract request url path
	req.url = parsedURL.pathname;
	// listen for a home directory route
	if (req.url === "/home" || req.url === "/") {
		res.writeHead(200, {
			"content-type": "text/html; charset=utf-8"
		});
		fs.createReadStream(__dirname + "/public/index.html")
			.pipe(res)
			.on("error", errorHandler);
		// upload js files
	} else if (req.url === "/public/js/search.min.js") {
		res.writeHead(200, {
			"Content-type": "text/javascript"
		});
		fs.createReadStream(__dirname + "/public/js/search.min.js")
			.pipe(res)
			.on("error", errorHandler);
		// upload css files - use different listening technique
	} else if (req.url.indexOf(".css") != -1) {
		res.writeHead(200, {
			"Content-type": "text/css"
		});
		fs.createReadStream(__dirname + "/public/stylesheets/styles.min.css")
			.pipe(res)
			.on("error", errorHandler);
	} else if (req.url === "/walmart") {
		// walmart search API query
		let query = `https://api.walmartlabs.com/v1/search?apiKey=${walmartAPI}&query=${search}`;
		queryAPI(query, res);
	} else if (req.url === "/ebay") {
		console.log("ebay");
		let query = `https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=${ebayAPI}&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&keywords=${search}&paginationInput.entriesPerPage=10`;
		queryAPI(query, res);
	} else if (req.url === "/all") {
		console.log("all");
		let queries = [
			`https://api.walmartlabs.com/v1/search?apiKey=${walmartAPI}&query=${search}`,
			`https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=${ebayAPI}&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&keywords=${search}&paginationInput.entriesPerPage=10`
		];

		// send request to all queries using a promise
		Promise.all(queries.map(query => fetch(query)))
			.then(responses => Promise.all(responses.map(res => res.text())))
			.then(texts => {
				// forward result to client
				res.writeHead(200, {
					"Content-Type": "application/json"
				});
				res.end(JSON.stringify(texts));
			})
			.catch(err => console.log(err));
	}
	// handle all non-existing routes
	else {
		console.log("Not found");
		res.writeHead(404, {
			"Content-type": "text/html; charset=utf-8"
		});
		res.end("Oops, that page doesn't exist... yet, maybe");
	}
});

function queryAPI(query, res) {
	// make API call from server
	fetch(query)
		.then(res => {
			console.log("API call statusCode:", res.ok && res.status);
			return res.text();
		})
		.then(body => {
			res.writeHead(200, {
				"Content-Type": "application/json"
			});
			res.end(body);
		})
		.catch(err => console.log("error:", err));
}

server.listen(PORT);
console.log(`Server is listening on port ${PORT}...`);

function errorHandler(err) {
	console.log(err);
}
