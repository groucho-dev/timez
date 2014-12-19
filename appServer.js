var express = require("express");
var bodyParser = require("body-parser");
var app = express();

app.set("port", process.env.PORT || 3030);

var db = require("mysql");
var db_pool = db.createPool({
	host 		: "localhost",
	port 		: "3306",
	database 	: "timezone",
	user 		: "root",
	password 	: ""
});

app.set("db_pool", db_pool);

//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

var routes = require("./routes/index"); // 'routes' set to the router module exported by index.js
var users = require("./routes/users");	// 'users' set to the router module exported by users.js
app.use("/", routes);
app.use("/users", users);

//Setup static page delivery 
app.use("/users", express.static(__dirname + "/public/users"));



/*// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});*/


app.listen(app.get("port"));
console.log("App listening on port " + app.get("port"));

