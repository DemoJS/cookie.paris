var http = require("http")
var url = require("url")

var server = http.createServer(function(request, response)
{
	var resourcePath = url.parse(request.url).pathname
	
	response.writeHead(200)
	response.write("cookie!")
	response.end()
})

server.listen(8092)
