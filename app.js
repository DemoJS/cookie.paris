var express = require("express")
var app = express()
var bodyParser = require('body-parser')

var redis = require("redis").createClient()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.set("view engine", "jade")
app.set("views", __dirname + "/views")

/*app.get("/api/subscribers", function(request, response)
{
    redis.lrange("cookie:subscribers", 0, -1, function(err, data)
    {
        if (err) return response.sendStatus(500)
        
        response.json(data)
    })
})*/

app.post("/api/subscribers", function(request, response)
{
    var email = request.body.email
    if ((typeof email !== "string") || (email.length === 0))
        return response.sendStatus(400)
    
    email = email.substr(0, 100)
    
    redis.rpush("cookie:subscribers", email, function(err)
    {
        if (err) return response.sendStatus(500)
        
        response.send("Thanks for registering!")
    })
})

app.get("/", function(request, response)
{
    response.render("index")
})

app.use(express.static(__dirname + "/public"))

app.use(function(err, request, response, next)
{
    console.log(err)
    response.sendStatus(500)
})

app.listen(8092)
