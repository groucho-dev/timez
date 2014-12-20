var express = require("express");
var router = express.Router();

function sendError(objResponse, iStatusCode, strStatus, strType, errorCode) {
	objResponse.send({
		status : strStatus,
		err : errorCode,
		err_type : strType
	});
}

function runQuery(objConnection, strQuery, objResponse) {
	objConnection.query(strQuery, function(objError, objRows, objFields) {
		if (objError) {
			sendError(objResponse, 500, "error", "query", objError.code);	
		}
		else {
//			console.log(objRows);
			objResponse.send({
				status : "success",
				err : "",
				err_type : "",
				fields : objFields,
				rows : objRows,
				length : objRows.length
			});
		}
	});
}

//router.get("/zones", function(objRequest, objResponse) {
router.get("/zones/:filter", function(objRequest, objResponse) {
	var db_pool = objRequest.app.get("db_pool");
	var filterParam = objRequest.param("filter");
	console.log("in get /zones :filterParam=" + filterParam);
	
	db_pool.getConnection(function(objError, objConnection) {
		if (objError) {
//			console.log("GET:: DB POOL CONN ERROR!!");
			sendError(objResponse, 503, "error", "connection", objError.code);
		}
		else {
			var strQuery;
			if (filterParam === "All") {
				strQuery = "SELECT a.city, a.timezone_name, b.gmt_offset " + 
					"FROM user_zones a, zones b " +
					"WHERE (a.username = 'RahulRohatgi') AND (a.timezone_name = b.name)";
			}
			else {
				strQuery = "SELECT a.city, a.timezone_name, b.gmt_offset " + 
				"FROM user_zones a, zones b " +
				"WHERE (a.username = 'RahulRohatgi') AND (a.timezone_name = " + 
				"'" + filterParam + "')" + " AND (a.timezone_name = b.name)";	
			}
			
			runQuery(objConnection, strQuery, objResponse);			
		}
		
		objConnection.release();
	});
});

//router.post("/", function(objRequest, objResponse) {
//	objResponse.send("hey, hey Mister POST-man...!");
//});

router.post("/", function(objRequest, objResponse) {
//	console.log("city=" + objRequest.param("city"));
//	console.log("body=" + JSON.stringify(objRequest.body));
	
	var db_pool = objRequest.app.get("db_pool");
	console.log("in post");
	
	db_pool.getConnection(function(objError, objConnection) {
		if (objError) {
			console.log("GET:: DB POOL CONN ERROR!!");
			sendError(objResponse, 503, "error", "connection", objError.code);
		}
		else {
			var strQuery = "SELECT * FROM user_zones WHERE (username = 'RahulRohatgi') AND " +
				"(city = '" + objRequest.body.city + "') AND (timezone_name = '" + 
				objRequest.body.timezone + "')";

				objConnection.query(strQuery, function(objError, objRows, objFields) {
				if (objError) {
					console.log("GET:: DB INSERT ERROR!!");
					sendError(objResponse, 500, "error", "query", objError.code);	
				}
				else {
					if (objRows.length > 0) {
						//city & timezone combination already on db for this user
						sendError(objResponse, 500, "error", 
								"query - attempt to insert an existing record", 1);				
					}
					else {
						strQuery = "INSERT INTO `user_zones` (`username`, `city`, `timezone_name`) " + 
							"VALUES ('RahulRohatgi', '" + objRequest.body.city + "', " +
							"'" + objRequest.body.timezone + "')";						
						runQuery(objConnection, strQuery, objResponse);
					}
				}
			});
		}
		objConnection.release();
	});
});

router.put("/", function(objRequest, objResponse) {
//	console.log("in put");
//	console.log("oldCity=" + objRequest.param("oldCity"));
//	console.log("newCity=" + objRequest.param("newCity"));
//	console.log("body=" + JSON.stringify(objRequest.body));
	
	var db_pool = objRequest.app.get("db_pool");	
	
	db_pool.getConnection(function(objError, objConnection) {
		if (objError) {
			console.log("GET:: DB POOL CONN ERROR!!");
			sendError(objResponse, 503, "error", "connection", objError.code);
		}
		else {
			var strQuery = "UPDATE user_zones SET city = '" + objRequest.body.newCity + "' " +
				"WHERE (username = 'RahulRohatgi') AND " +
				"(city = '" + objRequest.body.oldCity + "') AND (timezone_name = '" + 
				objRequest.body.timezone + "')";
			
//			console.log(strQuery);
			runQuery(objConnection, strQuery, objResponse);
		}
		
		objConnection.release();
	});
});

router.delete("/", function(objRequest, objResponse) {	
	var db_pool = objRequest.app.get("db_pool");	
//	console.log("body=" + JSON.stringify(objRequest.body));
	
	db_pool.getConnection(function(objError, objConnection) {
		if (objError) {
//			console.log("GET:: DB POOL CONN ERROR!!");
			sendError(objResponse, 503, "error", "connection", objError.code);
		}
		else {
			var strQuery = "DELETE FROM user_zones " +
					"WHERE (username = 'RahulRohatgi') AND " + 
					"(city = '" + objRequest.body.city + "') AND " + 
					"(timezone_name = '" + objRequest.body.timezone + "')";
			
//			console.log(strQuery);
			runQuery(objConnection, strQuery, objResponse);			
		}
		
		objConnection.release();
	});
});

router.get("/load_zones", function(objRequest, objResponse) {
	var db_pool = objRequest.app.get("db_pool");
	var filterParam = objRequest.param("filter");
	console.log("in get /load_zones");
	
	db_pool.getConnection(function(objError, objConnection) {
		if (objError) {
//			console.log("GET:: DB POOL CONN ERROR!!");
			sendError(objResponse, 503, "error", "connection", objError.code);
		}
		else {
			var strQuery = "SELECT name FROM zones";
			runQuery(objConnection, strQuery, objResponse);			
		}
		
		objConnection.release();
	});
});

router.get("/zone_time/:selectedAddZone", function(objRequest, objResponse) {
	var db_pool = objRequest.app.get("db_pool");
	var selectedAddZone = objRequest.param("selectedAddZone");
	console.log("in get /zone_time :selectedAddZone=" + selectedAddZone);
	
	db_pool.getConnection(function(objError, objConnection) {
		if (objError) {
//			console.log("GET:: DB POOL CONN ERROR!!");
			sendError(objResponse, 503, "error", "connection", objError.code);
		}
		else {
			var strQuery = "SELECT gmt_offset FROM zones WHERE name = '" + 
				selectedAddZone + "'";		
			runQuery(objConnection, strQuery, objResponse);			
		}
		
		objConnection.release();
	});
});

module.exports = router; // 'router' available as a module
