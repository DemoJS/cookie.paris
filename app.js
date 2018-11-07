var express = require("express")
var app = express()
var bodyParser = require('body-parser')
var fs = require('fs')

var redis = require("redis").createClient()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))

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

app.post("/api/register", function (request, response) {
    var handle = request.body.handle
    if ((typeof handle !== "string") || (handle.length === 0))
        return response.sendStatus(400)
    handle = handle.substr(0, 100)

    var group = request.body.group
    if ((typeof group !== "string"))
        return response.sendStatus(400)
    group = group.substr(0, 100)

    var visitor = handle;
    if (group)
        visitor += " / " + group;

    redis.rpush("cookie2018:visitors", visitor, function (err) {
        if (err) return response.sendStatus(500)

        response.redirect("/visitors")
    })
})

app.get("/", function (request, response) {
    response.render("index")
})
app.get("/visitors", function (request, response) {
    return redis.lrange("cookie2018:visitors", 0, -1, function (err, visitors) {
        if (err) return response.sendStatus(500)

        response.render("visitors", {
            visitors: visitors,
        })
    })
})

app.get("/:page", function (request, response, next) {
    fs.exists('views/' + request.params.page + '.jade', function (exists) {
        if (!exists) return next()

        response.render(request.params.page, function (err, html) {
            if (err) return response.send(err);

            response.send(html)
        })
    })
})

app.use(express.static(__dirname + "/public"))

app.use(function (err, request, response, next) {
    console.log(err)
    response.sendStatus(500)
})

app.listen(8092)
