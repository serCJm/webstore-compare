const http = require('http'),
    fs = require('fs');

const server = http.createServer(function(req, res) {
    console.log(`Request was made on ${req.url}`);
    if (req.url === '/home' || req.url === '/') {
        res.writeHead(200, {'Content-type': 'text/html'});
        fs.createReadStream(__dirname + '/public/index.html').pipe(res);
    } else {
        res.writeHead(404, {'Content-type': 'text/plain'});
        res.end("Oops, that page doesn't exist... yet, maybe");
    }
});

server.listen(3000, '127.0.0.1');
console.log('Server is listening on port 3000...');