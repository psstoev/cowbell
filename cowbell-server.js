var http = require("http");
var fs = require("fs");
var path = require("path");
var socketIo = require("socket.io");
var io;

var app = http.createServer(function(request, response) {
    fs.readFile(path.resolve(__dirname, "./index.html"), function(err, data) {
        if (err) {
            response.writeHead(500);
            return response.end("Cannot find index.html");
        }

        response.writeHead(200);
        response.end(data);
    });
});

io = socketIo.listen(app);
app.listen(8080);

io.sockets.on("connection", function(socket) {
    socket.on("guess", function(data) {
        console.log(data);
    });
});
