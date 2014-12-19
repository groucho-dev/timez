var express = require("express");
var router = express.Router();

function sendError(objResponse, iStatusCode, strResult, strType, objError) {
	objResponse.send({
		result : strResult,
		err : objError.code,
		err_type : strType
	});
}

//router.get("/zones", function(objRequest, objResponse) {
router.get("/zones/:filter", function(objRequest, objResponse) {
	var db_pool = objRequest.app.get("db_pool");
	var filterParam = objRequest.param("filter");
	console.log("filterParam=" + filterParam);
	
	db_pool.getConnection(function(objError, objConnection) {
		if (objError) {
//			console.log("GET:: DB POOL CONN ERROR!!");
			sendError(objResponse, 503, "error", "connection", objError);
		}
		else {
			if (filterParam == "All") {
				var strQuery = "SELECT a.city, a.timezone_name, b.gmt_offset " + 
					"FROM user_zones a, zones b " +
					"WHERE (a.username = 'RahulRohatgi') AND (a.timezone_name = b.name)";
			}
			else {
				var strQuery = "SELECT a.city, a.timezone_name, b.gmt_offset " + 
				"FROM user_zones a, zones b " +
				"WHERE (a.username = 'RahulRohatgi') AND (a.timezone_name = " + 
				"'" + filterParam + "')" + " AND (a.timezone_name = b.name)";	
			}
	
			objConnection.query(strQuery, function(objError, objRows, objFields) {
				if (objError) {
					sendError(objResponse, 500, "error", "query", objError);	
				}
				else {
//					console.log(objRows);
					objResponse.send({
						result : "success",
						err : "",
						err_type : "",
						fields : objFields,
						rows : objRows,
						length : objRows.length
					});
				}
			});
			objConnection.release();
		}
	});
});

//router.post("/", function(objRequest, objResponse) {
//	objResponse.send("hey, hey Mister POST-man...!");
//});

router.post("/", function(objRequest, objResponse) {
	console.log("name=" + objRequest.param("name"));
	console.log("location=" + objRequest.param("location"));
	console.log("body=" + JSON.stringify(objRequest.body));
	console.log("objRequest.body.name", objRequest.body.name);	
	
	
	
	
	
	objResponse.send("hey, hey Mister POST-man...!");
});

module.exports = router; // 'router' available as a module
