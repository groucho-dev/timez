var express = require("express");
var router = express.Router();

/* GET home page. 
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});*/

router.get("/", function(objRequest, objResponse) {
	objResponse.send("gotta LOGIN man!");
});

module.exports = router;
