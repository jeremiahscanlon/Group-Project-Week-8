//==================================================================
// Universal Variables
//==================================================================

var infowindow = null;
var allMarkers = [];


//==================================================================
// Google Maps (API Key - AIzaSyBOo3mntkfMMomnO0V0P6Mt4bQ3vMUUWIw)
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
// Firebase
//==================================================================

// create firebase variable
var savedSearch = new Firebase("https://withinreach.firebaseio.com/");

// function to add new search to the database
function searchCall(keywords, home){
	
	var search = {
		keyWord:  keywords,
		home: home,
	}
	savedSearch.push(search);
}

// Create Firebase event for adding search history from database into row in the html when a user adds an entry
savedSearch.limitToLast(5).on("child_added", function(childSnapshot, prevChildKey){

	// console.log(childSnapshot.val());

	// Store everything into a variable.
	var keywords = childSnapshot.val().keyWord;
	var location = childSnapshot.val().home;

	// Search info
	// console.log(keywords);
	// console.log(location);

	// Add each train's data into the table
	$("#searchTable").append("<tr class=\"recentSearchRow\" data-keyword=\""+keywords+"\" data-location=\""+location+"\"><td>" + location + "</td><td>" + keywords + "</td></tr>");
	createClick();
});

//==================================================================
// Functions
//==================================================================

// take keywords and home from the search field and send it to other functions
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
	buildResults(searchKeyword,searchLocation,limit,resultsnum,pageNumber,first,home);
}

// use Google Maps Geocode to figure out the long lat for the serch center
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

// use the long lat to move the map to the new center and add a marker
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

// center the home page map
function reCenter2(lat, long) {
	var center = new google.maps.LatLng(lat, long);
	map2.panTo(center);
}

// build out the results from the search at indeed.
function buildResults(searchKeyword,searchLocation,limit,resultsnum,pageNumber,first,home) {

	var searchKey =searchKeyword;
	var searchLoc = searchLocation;
	var lim = limit;
	var resultsNumber = resultsnum;
	var pagenum = pageNumber;
	var initialSearch = first;
	var center = home;

	getCenter(center);

	var queryURL = "http://api.indeed.com/ads/apisearch?publisher=8023780673544955&format=json"+searchKey+searchLoc+lim+resultsNumber+"&v=2";
	//console.log('queryURL: '+queryURL);

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

			$("#resultsList").append("<a href="+link+" target=\"_blank\" ><div class=\"searchResult\" id="+jobKey+"><h2>" + jobTitle + "</h2><p>" + company + " - " + location + "</p><p>" + snippet + "</p></div></a>");
			//$("#resultsList").append("<div class=\"searchResult\" id="+jobKey+"><a href="+link+" target=\"_blank\" ><h2>" + jobTitle + "</h2><p>" + company + " - " + location + "</p><p>" + snippet + "</p></a></div>");

			var secondURL = 'http://api.indeed.com/ads/apigetjobs?publisher=8023780673544955&jobkeys='+jobKey+'&format=json&v=2';

			$.ajax({
				url: secondURL,
				method: 'GET',
			    crossDomain: true,
			    dataType: 'jsonp'
			})
			.done(function(response) {
				//console.log('inner respsonse:');
				//console.log(response);
				var long = response.results[0].longitude;
				var lat = response.results[0].latitude;
				var jobKey = response.results[0].jobkey;
				var jobTitle = response.results[0].jobtitle;
				var link = response.results[0].url;
				var cCompany = response.results[0].company;
				var snippet = response.results[0].snippet;
			
				var myLatlng = new google.maps.LatLng(lat,long);
							  
				var allMarkers = new google.maps.Marker({
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
											'<p><b>'+cCompany+'</b></p>'+
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
						$('#' + jobKey).addClass('clicked').parent().siblings().children().removeClass('clicked');
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
				
				console.log ('allmarkers:');
				console.log (allMarkers);

			});			
		}
		

		if ( Math.ceil(numResults / 10) > pagenum ){
			$("#resultsList").append("<button type=\"button\" class=\"btn btn-default center-block\" id=\"nextPage\">Next 10 <span class=\"glyphicon glyphicon-chevron-right\" aria-hidden=\"true\"></span></button>");
			$('#nextPage').click(function(){
				//initMap();
				
				if (initialSearch) {
					var start = '&start=';
					initialSearch = false;
					pagenum++;
					buildResults(searchKey,searchLoc,start,resultsNumber,pagenum,initialSearch,center);
				} else {
					var start = '&start=';
					pagenum++;
					resultsNumber = resultsNumber + 10;
					buildResults(searchKey,searchLoc,start,resultsNumber,pagenum,initialSearch,center);				
				}
			});
		}

		if ( pagenum > 1 ){
			$("#resultsList").append("<button type=\"button\" class=\"btn btn-default center-block\" id=\"previousPage\"><span class=\"glyphicon glyphicon-chevron-left\" aria-hidden=\"true\"></span> Previous 10</button>");
			$('#previousPage').click(function(){
				//initMap();
				getCenter(center);
				if (pagenum == 2) {
					var limit = "&limit=";
					first = true;
					resultsNumber = 10;
					pagenum--;
					buildResults(searchKey,searchLoc,limit,resultsNumber,pagenum,first,center);
				} else {
					var start = '&start=';
					pagenum--;
					resultsNumber = resultsNumber - 10;
					buildResults(searchKey,searchLoc,start,resultsNumber,pagenum,first,center);				
				}
			});	
		}

	});
}

function createClick() {
	$('.recentSearchRow').off().click(function(){
		//preventDefault();
		var recentSearchLocation = $(this).data('location');
		var recentSearchKeyword = $(this).data('keyword');

		//console.log(recentSearchLocation);
		//console.log(recentSearchKeyword);

		if (recentSearchLocation !== ''){
			initialSearch(recentSearchKeyword, recentSearchLocation);
			$('#keywords').val('');
			$('#location').val('');
			$('.navbar').show();
			$('.results').show();
			$('#search').hide();
			$('#map2').hide();
		} else {
			$('#myModal').modal('show');
		}
		
	});
}

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
		$('#myModal').modal('show');
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
		$('#myModal').modal('show');
	}

	// Don't refresh the page!
	return false;

});

$('.logoNav').click(function(){
	location.reload(false);
});

$('#recentSearch').click(function(){
	$('#recentSearchBody').toggle();
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
