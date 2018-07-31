// import modules
const http = require('http'),
    fs = require('fs'),
    dotenv = require('dotenv').config();

const walmartAPI = process.env.WALMARTAPI;

// create a server
const server = http.createServer(function (req, res) {
    console.log(`Request was made on ${req.url}`);
    // listen for a home directory route
    if (req.url === '/home' || req.url === '/') {
        res.writeHead(200, {
            'content-type': 'text/html; charset=utf-8'
        });
        fs.createReadStream(__dirname + '/public/index.html').pipe(res).on('error', errorHandler);
        // upload js files
    } else if (req.url === '/public/js/search.js') {
        res.writeHead(200, {
            'Content-type': 'text/javascript'
        });
        fs.createReadStream(__dirname + '/public/js/search.js').pipe(res).on('error', errorHandler);
        // upload css files - use different listening technique
    } else if (req.url.indexOf('.css') != -1) {
        res.writeHead(200, {
            'Content-type': 'text/css'
        });
        fs.createReadStream(__dirname + '/public/stylesheets/styles.css').pipe(res).on('error', errorHandler);
    } else if (req.url === '/walmart') {
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        res.end(JSON.stringify({name: 'hi'}));
    }
    // handle all non-existing routes
    else {
        res.writeHead(404, {
            'Content-type': 'text/html; charset=utf-8'
        });
        res.end("Oops, that page doesn't exist... yet, maybe");
    }
});

server.listen(3000, '127.0.0.1');
console.log('Server is listening on port 3000...');

function errorHandler(err) {
    console.log(err);
}