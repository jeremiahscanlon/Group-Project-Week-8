//==================================================================
// Google Maps API Key - AIzaSyBOo3mntkfMMomnO0V0P6Mt4bQ3vMUUWIw
//==================================================================

var map;
function initMap() {

	var myLatLng = {lat: 40.488, lng: -74.439};

	var mapOptions = {
		center: myLatLng,
		zoom: 10,
<<<<<<< HEAD
		styles: [{"featureType":"road","elementType":"geometry","stylers":[{"color":"#b1ab85"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#8cc0c3"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#cde6cf"}]},{"featureType":"landscape.man_made","elementType":"geometry","stylers":[{"color":"#efede8"}]}]
=======
		styles: [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}]
>>>>>>> 559edcc779e941c274793946e177c5f4bea852d5
	};

	map = new google.maps.Map(document.getElementById('map'), mapOptions);

}

//==================================================================
// Indeed API request
//==================================================================


function initialSearch() {
	
	var keywords = $('#keywords').val().trim();
	var home = $('#location').val().trim();
	$('#keywords').val('');
	$('#location').val('');

	$('.results').show();
	$('#search').hide();
	
	//var home = 'New+Brunswick%2C+NJ';
	//var keywords = 'node';
	var searchLocation = "&l="+home;
	var searchKeyword = "&q="+keywords;
	var page = "&limit=";
	var pagenum = 10;
	var first = true;

	getCenter(home);
	buildResults(searchKeyword,searchLocation,page,pagenum,first);

}

function getCenter(home) {
	var centerLocation = home;

	var requestURL = 'https://maps.googleapis.com/maps/api/geocode/json?address='+centerLocation+'&key=AIzaSyBOo3mntkfMMomnO0V0P6Mt4bQ3vMUUWIw';
	
	console.log(requestURL);

	$.ajax({
		url: requestURL,
		method: 'GET',
	})
	.done(function(response) {
		console.log(response);
		var results = response.results[0].geometry.location;
		var centerLat = results.lat;
		var centerLong = results.lng;

		console.log('lat: '+centerLat);
		console.log('long: '+centerLong);
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
<<<<<<< HEAD
		icon: 'assets/images/arrow.png'
=======
		icon: 'assets/images/markerStart.png',
 		zIndex: 1,
 		opacity: .6
>>>>>>> 559edcc779e941c274793946e177c5f4bea852d5
	});
}


function buildResults(searchKeyword,searchLocation,page,pagenum,first) {
	
	var searchKey =searchKeyword;
	var searchLoc = searchLocation;
	var pag = page;
	var pageNumber = pagenum;
	var initialSearch = first;

	var queryURL = "http://api.indeed.com/ads/apisearch?publisher=8023780673544955&format=json"+searchKey+searchLoc+pag+pageNumber+"&v=2";
	//console.log(queryURL);

	$.ajax({
		url: queryURL,
		method: 'GET',
	    crossDomain: true,
	    dataType: 'jsonp'
	})
	.done(function(response) {
		
		console.log(response);

		var results = response.results
		var numResults = response.totalResults;
		var query = response.query;
		var responseLocation = response.location;

<<<<<<< HEAD
		$("#resultsList").html("<div class=\"searchHeader\"><h1>"+numResults+" Results for:<br>"+query+"<br>"+responseLocation+"</h1></div>");
=======
		$("#resultsList").html("<div class=\"searchHeader\"><h1><span class='blue'>"+numResults+"</span> Results for:<br>"+query+"<br>"+responseLocation+"</h1></div>");
>>>>>>> 559edcc779e941c274793946e177c5f4bea852d5

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

				$("#"+jobKey).append("<p>" + lat +", "+ long + "</p>");
				$("#"+jobKey).attr('data-lat', lat);
				$("#"+jobKey).attr('data-long', long);
				$("#"+jobKey).attr('data-company', jobTitle);
			
				var myLatlng = new google.maps.LatLng(lat,long);
							  
				allMarkers = new google.maps.Marker({
					position: myLatlng,
					map: map,
<<<<<<< HEAD
=======
					icon: 'assets/images/markerIcon.png',
>>>>>>> 559edcc779e941c274793946e177c5f4bea852d5
					title: jobTitle
				});
			   	
				var contentString = '<div id="content">'+
										'<div id="siteNotice">'+
										'</div>'+
										'<h3 id="firstHeading" class="firstHeading">'+jobTitle+'</h3>'+
										'<div id="bodyContent">'+
											'<p><b>'+company+'</b></p>'+
											'<a href="'+link+'" target="_blank">'+
											'Job Details</a> '+
										'</div>'+
									'</div>';

				var infowindow = new google.maps.InfoWindow({
					content: contentString
				});

				google.maps.event.addListener(allMarkers, 'click', function() {
<<<<<<< HEAD
					infowindow.open(map,allMarkers);
=======
					infowindow.open(map,this);
>>>>>>> 559edcc779e941c274793946e177c5f4bea852d5
				});

			});			
		}

		if (numResults > 10 && numResults >= pageNumber){
			$("#resultsList").append("<button type=\"button\" class=\"btn btn-default center-block\" id=\"nextPage\">Next 10 <span class=\"glyphicon glyphicon-chevron-right\" aria-hidden=\"true\"></span></button>");
			
			$('#nextPage').click(function(){
				if (initialSearch) {
					var start = '&start=';
					console.log(searchKey +" - "+ searchLoc +" - "+ start +" - " + pageNumber+" - " + initialSearch);
					first = false;
					buildResults(searchKey,searchLoc,start,pageNumber,first);
				} else {
					var start = '&start=';
					pageNumber = pageNumber + 10;
					console.log(searchKey +" - "+ searchLoc +" - "+ start +" - " + pageNumber+" - " + initialSearch);
					buildResults(searchKey,searchLoc,start,pageNumber,first);				
				}
			});	
		}

	});
}

//initialSearch();

$('#seeResults').click(function(){
	initialSearch();
<<<<<<< HEAD
=======
	$('.logoNav').show();
>>>>>>> 559edcc779e941c274793946e177c5f4bea852d5

	// Don't refresh the page!
	return false;
});