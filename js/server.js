const http = require('http'),
url = require('url'),
fs = require('fs');

http.createServer((request, response) => {
    let address = request.url,
    parsedUrl = url.parse(address, true),
    filePath = '';

    fs.appendFile('/logs/connection-log.txt', 'URL: ' + address + '\nTimestamp: ' + new Date() + '\n\n', (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Added connection to log.');
        }
    });

    if (parsedUrl.pathname.includes('documentation')) {
        filePath = (__dirname + '/documentation.html');
    } else {
        filePath = 'index.html';
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            throw err;
        }

    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write(data);
    response.end();

    });
    
}).listen(8080);

console.log('Node test server, running on Port 8080');