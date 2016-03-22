//==================================================================
// Universal Variables
//==================================================================

var infowindow = null;


//==================================================================
// Google Maps API Key - AIzaSyBOo3mntkfMMomnO0V0P6Mt4bQ3vMUUWIw
//==================================================================

var map;

function initMap() {

	var myLatLng = {lat: 40.488, lng: -74.439};

	var mapOptions = {
		center: myLatLng,
		zoom: 10,
		styles: [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}]
	};

	map = new google.maps.Map(document.getElementById('map'), mapOptions);

}

var map2;
function initMap2() {

	var myLatLng = {lat: 40.9452, lng: -74.1829};

	var mapOptions = {
		center: myLatLng,
		zoom:11,
		styles: [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}]
	};

	map2 = new google.maps.Map(document.getElementById('map2'), mapOptions);

}

//==================================================================
// Indeed API request
//==================================================================

//////////////////////////////////////START OF FIREBASE/////////////////////////////////////////
var savedSearch = new Firebase("https://withinreachjobs.firebaseio.com/");
		//Firebase 
function searchCall(keywords, home){
	
	var search = {
		keyWord:  keywords,
		home: home,
		
	}
	savedSearch.push(search);
}

//Firebase input
// 3. Create Firebase event for adding search history to the database and a row in the html when a user adds an entry
savedSearch.on("child_added", function(childSnapshot, prevChildKey){

	console.log(childSnapshot.val());

	// Store everything into a variable.
	var jobStore = childSnapshot.val().keyWord;
	var location = childSnapshot.val().home;
	

	// Search info
	console.log(keywords);
	console.log(location);
	

	// Add each train's data into the table 
	$("#searchTable").append("<tr><td>" + location + "</td><td>" + jobStore + "</td><td>");

});

	//Hides the saved search
	$( "#searchList" ).hide( "slow" );

	//Recent search hide/show
	  $(document).ready(function(){
   			$("#recentSearches").click(function(){
        		$("#searchList").toggle();

    });
});



//////////////////////////////////////END OF FIREBASE////////////////////////////////////////////////

function initialSearch(keywords, home) {
	
	var keywords = keywords;
	var home = home;
	
	//var home = 'New+Brunswick%2C+NJ';
	//var keywords = 'node';
	var searchLocation = "&l="+home;
	var searchKeyword = "&q="+keywords;
	var limit = "&limit=";
	var resultsnum = 10;
	var pageNumber = 1;
	var first = true;


    searchCall(keywords, home);
	

	getCenter(home);
	buildResults(searchKeyword,searchLocation,limit,resultsnum,pageNumber,first);

}

function getCenter(home) {
	var centerLocation = home;

	var requestURL = 'https://maps.googleapis.com/maps/api/geocode/json?address='+centerLocation+'&key=AIzaSyBOo3mntkfMMomnO0V0P6Mt4bQ3vMUUWIw';

	$.ajax({
		url: requestURL,
		method: 'GET',
	})
	.done(function(response) {
		//console.log(response);
		var results = response.results[0].geometry.location;
		var centerLat = results.lat;
		var centerLong = results.lng;

		initMap();
		reCenter(centerLat, centerLong);
	});
}

function reCenter(lat, long) {
	var center = new google.maps.LatLng(lat, long);
	map.panTo(center);

	var marker = new google.maps.Marker({
		position: center,
		map: map,
		title: 'This is your Search Center',
		icon: 'assets/images/markerStart.png',
 		zIndex: 1,
 		opacity: .6
	});
}

function reCenter2(lat, long) {
	var center = new google.maps.LatLng(lat, long);
	map2.panTo(center);
}


function buildResults(searchKeyword,searchLocation,limit,resultsnum,pageNumber,first) {
	
	var searchKey =searchKeyword;
	var searchLoc = searchLocation;
	var lim = limit;
	var resultsNumber = resultsnum;
	var pagenum = pageNumber;
	var initialSearch = first;

	console.log("Before buttons added >>> Results Number - " + resultsNumber + " Initial Search - " + initialSearch + " pagenum - " + pagenum);

	var queryURL = "http://api.indeed.com/ads/apisearch?publisher=8023780673544955&format=json"+searchKey+searchLoc+lim+resultsNumber+"&v=2";
	console.log('queryURL: '+queryURL);

	$.ajax({
		url: queryURL,
		method: 'GET',
	    crossDomain: true,
	    dataType: 'jsonp'
	})
	.done(function(response) {
		
		//console.log(response);

		var results = response.results
		var numResults = response.totalResults;
		var query = response.query;
		var responseLocation = response.location;

		$("#resultsListHeader").html("<div class=\"searchHeader\"><span class='badge'>"+numResults+"</span> Results for: <span class='badge'>"+query+"</span> - <span class='badge'>"+responseLocation+"</span></div>");
		$('#resultsList').html('');

		for (var i = 0; i < results.length; i++) {

			var jobTitle = results[i].jobtitle;
			var company = results[i].company;
			var location = results[i].formattedLocationFull;
			var snippet = results[i].snippet;
			var link = results[i].url;
			var jobKey = results[i].jobkey;

			$("#resultsList").append("<div class=\"searchResult\" id="+jobKey+"><h2><a href="+link+" target=\"_blank\">" + jobTitle + "</a></h2><p>" + company + " - " + location + "</p><p>" + snippet + "</p></div>");

			var secondURL = 'http://api.indeed.com/ads/apigetjobs?publisher=8023780673544955&jobkeys='+jobKey+'&format=json&v=2';

			$.ajax({
				url: secondURL,
				method: 'GET',
			    crossDomain: true,
			    dataType: 'jsonp'
			})
			.done(function(response) {
				//console.log(response);
				var long = response.results[0].longitude;
				var lat = response.results[0].latitude;
				var jobKey = response.results[0].jobkey;
				var jobTitle = response.results[0].jobtitle;
				var link = response.results[0].url;
				var cCompany = response.results[0].company;
				var snippet = response.results[0].snippet;

				//$("#"+jobKey).append("<p>" + lat +", "+ long + "</p>");
				$("#"+jobKey).attr('data-lat', lat);
				$("#"+jobKey).attr('data-long', long);
				$("#"+jobKey).attr('data-company', jobTitle);
			
				var myLatlng = new google.maps.LatLng(lat,long);
							  
				allMarkers = new google.maps.Marker({
					position: myLatlng,
					map: map,
					icon: 'assets/images/markerIcon.png',
					animation: google.maps.Animation.DROP,
					title: jobTitle
				});
			   	
				var contentString = '<div id="content">'+
										'<div id="siteNotice">'+
										'</div>'+
										'<h3 id="firstHeading" class="firstHeading">'+jobTitle+'</h3>'+
										'<div id="bodyContent">'+
											'<p><b>'+company+'</b></p>'+
											'<p>'+snippet+'</p> '+
										'</div>'+
									'</div>';

				var infowindow = new google.maps.InfoWindow({
					content: contentString,
					maxWidth: 300, 
					buttons: { close: { visible: false } }
				});

				google.maps.event.addListener(allMarkers, 'click', function() {
					infowindow.open(map,this);
						$('#' + jobKey).addClass('clicked').siblings().removeClass('clicked');
						$('.resultsarea').scrollTop(0);
						$('.resultsarea').animate({
							scrollTop: $('#' + jobKey).position().top - 25 }, 500);
				});

				google.maps.event.addListener(allMarkers, 'mouseover', function() {
					infowindow.open(map,this);
				});
				google.maps.event.addListener(allMarkers, 'mouseout', function() {
					infowindow.close(map,this);
				});

			});			
		}

		if ( Math.ceil(numResults / 10) > pagenum ){
			$("#resultsList").append("<button type=\"button\" class=\"btn btn-default center-block\" id=\"nextPage\">Next 10 <span class=\"glyphicon glyphicon-chevron-right\" aria-hidden=\"true\"></span></button>");
			$('#nextPage').click(function(){
				if (initialSearch) {
					var start = '&start=';
					initialSearch = false;
					pagenum++;
					console.log("Next Page first: Results Number - " + resultsNumber + " Initial Search - " + initialSearch + " pagenum - " + pagenum);
					//getCenter(searchLoc);
					buildResults(searchKey,searchLoc,start,resultsNumber,pagenum,initialSearch);
				} else {
					var start = '&start=';
					pagenum++;
					resultsNumber = resultsNumber + 10;
					console.log("Next Page after first: Results Number - " + resultsNumber + " Initial Search - " + initialSearch + " pagenum - " + pagenum);
					buildResults(searchKey,searchLoc,start,resultsNumber,pagenum,initialSearch);				
				}
			});	
		}

		if ( pagenum > 1 ){
			$("#resultsList").append("<button type=\"button\" class=\"btn btn-default center-block\" id=\"previousPage\"><span class=\"glyphicon glyphicon-chevron-left\" aria-hidden=\"true\"></span> Previous 10</button>");
			$('#previousPage').click(function(){
				if (pagenum == 2) {
					var limit = "&limit=";
					first = true;
					resultsNumber = 10;
					pagenum--;
					console.log("Previous page from page 2: Results Number - " + resultsNumber + " Initial Search - " + initialSearch + " pagenum - " + pagenum);
					//getCenter(searchLoc);
					buildResults(searchKey,searchLoc,limit,resultsNumber,pagenum,first);
				} else {
					var start = '&start=';
					pagenum--;
					resultsNumber = resultsNumber - 10;
					console.log("Previous page from after 2: Results Number - " + resultsNumber + " Initial Search - " + initialSearch + " pagenum - " + pagenum);
					buildResults(searchKey,searchLoc,start,resultsNumber,pagenum,first);				
				}
			});	
		}

	});
}

//initialSearch();

$('#seeResults').click(function(){
	var keywords = $('#keywords').val().trim();
	var home = $('#location').val().trim();

	if (home !== ''){
		initialSearch(keywords, home);
		$('#keywords').val('');
		$('#location').val('');
		$('.navbar').show();
		$('.results').show();
		$('#search').hide();
		$('#map2').hide();
	} else {
		alert('Please enter a location.');
	}

	// Don't refresh the page!
	return false;
});

$('#seeResultsNav').click(function(){
	
	var keywords = $('#keywordsNav').val().trim();
	var home = $('#locationNav').val().trim();

	if (home !== ''){
		initialSearch(keywords, home);
		$('#keywords').val('');
		$('#location').val('');
	} else {
		alert('Please enter a location.');
	}

	// Don't refresh the page!
	return false;

});

//==================================================================
// Get current Location
//==================================================================

window.onload = function() {
	var startPos;
	var geoOptions = {
		maximumAge: 5 * 60 * 1000,
		timeout: 10 * 1000,
	}

	var geoSuccess = function(position) {
		startPos = position;
		var lati = startPos.coords.latitude;
		var longi = startPos.coords.longitude;
		var latlong = lati+","+longi;

		var geoRequestURL = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+latlong+'&key=AIzaSyBOo3mntkfMMomnO0V0P6Mt4bQ3vMUUWIw';

		$.ajax({
			url: geoRequestURL,
			method: 'GET',
		})
		.done(function(response) {
			console.log('browser location response:');
			console.log(response);
			var currentZip = response.results[0].address_components[6].short_name;
			$('#location').val(currentZip);
		});
		reCenter2(lati,longi);

	};
	var geoError = function(error) {
		console.log('Error occurred. Error code: ' + error.code);
	};

	navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);

	initMap2();
};

$('#currentLocNav').click(function(){
	
	var startPos;
	var geoOptions = {
		maximumAge: 5 * 60 * 1000,
		timeout: 10 * 1000,
	}

	var geoSuccess = function(position) {
		startPos = position;
		//console.log('Latitude: '+startPos.coords.latitude + 'Logitude: '+startPos.coords.longitude);
		var latlong = startPos.coords.latitude+","+startPos.coords.longitude;
		var geoRequestURL = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+latlong+'&key=AIzaSyBOo3mntkfMMomnO0V0P6Mt4bQ3vMUUWIw';

		$.ajax({
			url: geoRequestURL,
			method: 'GET',
		})
		.done(function(response) {
			console.log('browser location response Nav Bar:');
			console.log(response);
			var currentZip = response.results[0].address_components[6].short_name;
			$('#locationNav').val(currentZip);
		});
	};
	var geoError = function(error) {
		console.log('Error occurred. Error code: ' + error.code);
	};

	navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);

	// Don't refresh the page!
	return false;

});
