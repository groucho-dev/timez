// Client application
var listCities;

jQuery(document).ready(function() {
	//on initial page load
//	alert("initial page load...");
	get_load_zones();	//populate add zone select box	
	get_zones("All");	//display all user zones
});

function onClickAdd() {
	var addSelect = document.getElementById("addZone");	
	if ($("#addCity").val() === "" || addSelect.selectedIndex === 0) {
		$("#addStatusMessage").html("both City and Timezone fields are required!");
	}
	else {
		$("#addStatusMessage").html("");
		post_zone();
	}
}

function filterChange() {
	var filterValue = document.getElementById("filterZone").value;
	get_zones(filterValue);
}

function onClickModify(listId) {
//	alert("modify button id: " + listId);
	$("#modifyStatusMessage" + listId).html("");
	
	if ($("#listCity" + listId).val() === "") {
		$("#modifyStatusMessage" + listId).html("City field is required!");
	}
	else if($("#listCity" + listId).val() !== listCities[listId]) {
		put_zone(listId);
	}
}

function onClickDelete(listId) {
//	alert("delete button id: " + listId);
	delete_zone(listId);
}

function getAddZoneTime(selectedAddZone) {
//	alert("addSelectValue=" + addSelectValue);
	if (selectedAddZone !== "") {
		get_add_select_zone_time(selectedAddZone);
	}
	else {
		$("#addTime").html("");
	}
}

function renderList(result) {
	var user_zones = [];
	var distinct_zones = {};
	listCities = [];

	if (result.status != 'error') {
	    var d = new Date();
	    var h = d.getUTCHours();
	    var m = d.getUTCMinutes();	    	    
	    var minutes = m < 10 ? "0" + m.toString() : m.toString();	    
	    $("#heading").html("Timezone Store &ensp; ~ &ensp; GMT " + h + ":" + minutes);
	    
		var j = 0;
	    $.each(result.rows, function(index, objRow) {
			var hours = ((h + objRow.gmt_offset + 24) % 24).toString();
		    
			user_zones.push(
				"<tr><td><input type='text' id='listCity" + j + "' value='" + 
					objRow.city + "' size=11></td>" + 
				"<td id='listTimezone" + j + "'>" + objRow.timezone_name + "</td>" + 
				"<td>" + hours + ":" + minutes + "</td>" +
				"<td><input type='button' id=" + j + " value='modify' " + 
					"onclick='onClickModify(" + j + ")'/></td>" + 
				"<td><input type='button' id=" + j + "' value='remove' " +
					"onclick='onClickDelete(" + j + ")'/></td>" +
				"<td id='modifyStatusMessage" + j + "'></td></tr>");
				
			distinct_zones[objRow.timezone_name] = true;
			
			listCities.push(objRow.city);
			j++;
		});
		
		populateFilter(distinct_zones);	
	}
	else {
		user_zones.push("<tr><td colspan='3'> An error has occured... " + 
				result.err_type + ": " + result.err + "</td></tr>");
	}
	// Now display the HTML results, whether an error or a rowset
	$("#timezone_list tbody").html(user_zones);
}

function populateFilter(distinct_zones) {
	var filter_zones = [];
	$.each(distinct_zones, function(index, value) {
		filter_zones.push(index);
	});
	filter_zones.sort();
	
	var i;
	var filter = document.getElementById("filterZone");
	var filterValue = filter.value;
	
	var myOpts = filter.options;
    while (myOpts.length > 1) {
    	myOpts.remove(myOpts.length - 1);
    }		
	
	for (i = 0; i < filter_zones.length; i++) {
		var option = document.createElement("option");
		option.text = filter_zones[i];
		myOpts.add(option);
//		alert("i=" + i + " ; option.text=" + option.text + " ; filterValue=" + filterValue);
		if (option.text === filterValue) {
			filter.selectedIndex = i + 1;
//			alert("sel i=" + (i + 1));
		}
    }
}

function populateAddZoneSelect(result) {
	if (result.status != 'error') {
		var addSelectOptions = document.getElementById("addZone").options;
		
	    $.each(result.rows, function(index, objRow) {
			var option = document.createElement("option");
			option.text = objRow.name;
			addSelectOptions.add(option);
		});
	}
	else {
		alert("populateAddZoneSelect result error!");
/*		user_zones.push("<tr><td colspan='3'> An error has occured... " + 
				result.err_type + ": " + result.err + "</td></tr>");*/
	}
}

function populateSelectedAddZoneTime(result) {
	if (result.status != 'error') {
	    var d = new Date();
	    var h = d.getUTCHours();
	    var m = d.getUTCMinutes();	    	    
	    var minutes = m < 10 ? "0" + m.toString() : m.toString();	    
	    $("#heading").html("Timezone Store &ensp; ~ &ensp; GMT " + h + ":" + minutes);
	    
	    $.each(result.rows, function(index, objRow) {
//	    	alert("populateSelectedAddZoneTime got row");	    	
	    	var hours = ((h + objRow.gmt_offset + 24) % 24).toString();
	    	$("#addTime").html(hours + ":" + minutes);
		});	
	}
	else {
		alert("Database error: " + result.err_type + ": " + result.err);
	}
}

function get_zones(filterValue) {
//	alert("ajax:GET /users/zones/");
	$.ajax({
		type: "GET",
		url: "/users/zones/" + filterValue,
		dataType: "json", // data type of response
		success: renderList
	});	
}

function post_zone() {
	var addSelect = document.getElementById("addZone");
	
	function postZoneComplete(result) {
//		alert("in postZoneComplete()");
		if (result.status != 'error') {
			$("#addCity").val("");
//			var addSelect = document.getElementById("addZone");		
			addSelect.selectedIndex = 0;
			$("#addTime").html("");
			
			get_zones("All");
		}
		else {
			if (result.err === 1) {
				$("#addStatusMessage").html("the city/timezone combination already exists!");
			}
			else {				
				$("#addStatusMessage").html(result.err_type + ": " + result.err);
			}
		}
	}
	
//	alert("ajax:POST");
	$.ajax({
		type: "POST",
		url: "/users",
		data: {city: $("#addCity").val(), timezone: addSelect.value},
		dataType: "json", // data type of response
		success: postZoneComplete
	});	
}

function put_zone(listId) {
	function putZoneComplete(result) {
//		alert("in putZoneComplete() with listId=" + listId);
		if (result.status != 'error') {
			var filterValue = document.getElementById("filterZone").value;
//			alert("in putZoneComplete() with filterValue=" + filterValue);
			
			$.ajax({
				type: "GET",
				url: "/users/zones/" + filterValue,
				dataType: "json", // data type of response
				success: renderList
			}).done(function() { //resolve deferred object
				$("#modifyStatusMessage" + listId).html("modified");
			});
		}
		else {				
			$("#modifyStatusMessage" + listId).text(result.err_type + ": " + result.err);
		}
	}			
	
//	alert("ajax:PUT /users");
	$.ajax({
		type: "PUT",
		url: "/users",
		data: {oldCity: listCities[listId], newCity: $("#listCity" + listId).val(),
			timezone: $("#listTimezone" + listId).text()},			
		dataType: "json", // data type of response
		success: putZoneComplete
	});	
}

function delete_zone(listId) {
		function deleteZoneComplete(result) {
//			alert("in deleteZoneComplete()");
			if (result.status != 'error') {
				var filterValue = document.getElementById("filterZone").value;
//				alert("in putZoneComplete() with filterValue=" + filterValue);
				get_zones(filterValue);
			}
			else {				
				$("#modifyStatusMessage" + listId).text(result.err_type + ": " + result.err);
			}
		}
		
//		alert("ajax:DELETE");
		$.ajax({
			type: "DELETE",
			url: "/users",
			data: {city: $("#listCity" + listId).val(),
				timezone: $("#listTimezone" + listId).text()},
			dataType: "json", // data type of response
			success: deleteZoneComplete
		});	
	}

function get_load_zones() {
//	alert("ajax:GET /users/load_zones/");
	$.ajax({
		type: "GET",
		url: "/users/load_zones/",
		dataType: "json", // data type of response
		success: populateAddZoneSelect
	});	
}

function get_add_select_zone_time(selectedAddZone) {
//	alert("ajax:GET /users/load_zones/");
	$.ajax({
		type: "GET",
		url: "/users/zone_time/" + selectedAddZone,
		dataType: "json", // data type of response
		success: populateSelectedAddZoneTime
	});		
}


/*$.ajax({
    url: 'http://example.com/',
    type: 'PUT',
    data: 'ID=1&Name=John&Age=10', // or $('#myform').serializeArray()
    success: function() { alert('PUT completed'); }
});*/




/*function _deleteRESTfulData() {
	function deleteList(result) {
		// Be sure we don't have an error
		if (result.status != 'error') {
			return _getRESTfulData('nodes');
		}
		
		theseNodes.push("<tr><td colspan='3'> An error has occured... "
					+ result.err_type + ": " + result.err + "</td></tr>");
		// Now display the HTML results, whether an error or a rowset
		$("#nodes_results tbody").html(theseNodes);
	}
	
	$.ajax({
		type: 'DELETE',
		url: "/xxx",
		dataType: "json", // data type of response
		success: deleteList
	});
}*/

