// Client application

jQuery(document).ready(function() {
	//on initial page load
//	alert("initial page load...");
	getZones("all");
	
/*	// Connect right button with click event
	$("#btnGetSuccessContent").on("click", function() {
		_getRESTfulData('nodes');
	});

	// Connect wrong button with click event
	$("#btnGetErrorContent").on("click", function() {
		_getRESTfulData('social_security_numbers');
	});

	// Connect delete button with click event
	$("#btnDeleteAll").on("click", function() {
		_deleteRESTfulData();
	});*/	
	
	$("#arrIns").on("click", function() {
		alert(this.value);
	});	

});

function filterChange() {
	var value = document.getElementById("my_dropdown").value;
//	alert("filter change: " + value);
	getZones(value);
}

function renderList(data) {
//	alert("in renderList...");
	var user_zones = [];
	var distinct_zones = {};

	if (data.result != 'error') {
	    var d = new Date();
	    var h = d.getUTCHours();
	    var m = d.getUTCMinutes();
	    var minutes = m < 10 ? "0" + m.toString() : m.toString();
	    
		$.each(data.rows, function(index, objRow) {
		    var local_time = (h + objRow.gmt_offset).toString() + ":" + minutes;	
		    
			user_zones.push(
					"<tr><td><input type='text' value='" + objRow.city + "' size=11></td>" + 
					"<td>" + objRow.timezone_name + "</td>" + 
					"<td>" + local_time + "</td></tr>");
			distinct_zones[objRow.timezone_name] = true;
		});
		
		populateFilter(distinct_zones);
		
/*		var filter_zones = [];
		$.each(distinct_zones, function(index, value) {
//			alert(index);
			filter_zones.push(index);
		});
		filter_zones.sort();
		
		var i;
		var myOpts = document.getElementById("my_dropdown").options;
	    while (myOpts.length > 1) {
	    	myOpts.remove(myOpts.length - 1);
	    }		
		
		for (i = 0; i < filter_zones.length; i++) {
			var option = document.createElement("option");
//			alert(filter_zones[i]);
			option.text = filter_zones[i];
			myOpts.add(option);
        }*/		
	}
	else {
		user_zones.push("<tr><td colspan='3'> An error has occured... " + 
				data.err_type + ": " + data.err + "</td></tr>");
	}
	// Now display the HTML results, whether an error or a rowset
	$("#timezone_list tbody").html(user_zones);
}

function populateFilter(distinct_zones) {
	var filter_zones = [];
	$.each(distinct_zones, function(index, value) {
//		alert(index);
		filter_zones.push(index);
	});
	filter_zones.sort();
	
	var i;
	var myOpts = document.getElementById("my_dropdown").options;	
    while (myOpts.length > 1) {
    	myOpts.remove(myOpts.length - 1);
    }		
	
	for (i = 0; i < filter_zones.length; i++) {
		var option = document.createElement("option");
//		alert(filter_zones[i]);
		option.text = filter_zones[i];
		myOpts.add(option);
    }
	
//	var filter = document.getElementById("my_dropdown");
//	alert("filter value selected: " + filter.value);
}

function getZones(filter) {	
	$.ajax({
		type: 'GET',
//		url: "/users/zones",
		url: "/users/zones/" + filter,
		dataType: "json", // data type of response
		success: renderList
	});	
}


/*function _deleteRESTfulData() {
	function deleteList(data) {
		// Be sure we don't have an error
		if (data.result != 'error') {
			return _getRESTfulData('nodes');
		}
		
		theseNodes.push("<tr><td colspan='3'> An error has occured... "
					+ data.err_type + ": " + data.err + "</td></tr>");
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

