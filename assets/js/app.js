//==================================================================
// Google Maps API Key - AIzaSyBOo3mntkfMMomnO0V0P6Mt4bQ3vMUUWIw
//==================================================================

// var map;
// 	function initMap() {
// 		var myLatLng = {lat: 40.488, lng: -74.439};

// 		map = new google.maps.Map(document.getElementById('map'), {
// 			center: myLatLng,
// 			zoom: 10
// 		});

// 		// about markers: https://developers.google.com/maps/documentation/javascript/markers#introduction
// 		var marker = new google.maps.Marker({
// 			position: myLatLng,
// 			map: map,
// 			title: 'This that thing!'
// 		});
// 	}

// stylized map info: https://developers.google.com/maps/documentation/javascript/styling#creating_a_styledmaptype
function initMap() {

	// Create an array of styles.
	var styles = [
		{
			stylers: [
				{ hue: "#0033cc" },
				{ saturation: -20 }
			]
		},{
			featureType: "road",
			elementType: "geometry",
			stylers: [
				{ lightness: 100 },
				{ visibility: "simplified" }
			]
		},{
			featureType: "road",
			elementType: "labels",
			stylers: [
				{ visibility: "off" }
			]
		}
	];

	// Create a new StyledMapType object, passing it the array of styles,
	// as well as the name to be displayed on the map type control.
	var styledMap = new google.maps.StyledMapType(styles,
		{name: "Styled Map"});

	// Create a map object, and include the MapTypeId to add
	// to the map type control.
	var mapOptions = {
		zoom: 11,
		center: new google.maps.LatLng(40.488, -74.439),
		mapTypeControlOptions: {
			mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
		}
	};
	var map = new google.maps.Map(document.getElementById('map'),mapOptions);

	// var marker = new google.maps.Marker({
	// 	position: myLatLng,
	// 	map: map,
	// 	title: 'This that thing!'
	// });

	//Associate the styled map with the MapTypeId and set it to display.
	map.mapTypes.set('map_style', styledMap);
	map.setMapTypeId('map_style');
}

//==================================================================
// Indeed API request
//==================================================================

$('#seeResults').click(function(){
	var keywords = $('#keywords').val().trim();
	var home = $('#location').val().trim();
	
	$('#keywords').val('');
	$('#location').val('');
	$('#search').hide();
	$('.resultarea').show();
	$('.maparea').show();

	return home; 
	return keywords;

	var searchLocation = "&l="+home;
	var searchKeyword = "&q="+keywords;

});
//var home = 'New Brunswick'
//var keywords = 'node+full+stack'
// var home = 'New+Brunswick%2C+NJ';
// var keywords = 'node';
// var searchLocation = "&l="+home;
// var searchKeyword = "&q="+keywords;


var queryURL = "http://api.indeed.com/ads/apisearch?publisher=8023780673544955&format=json"+searchKeyword+searchLocation+"&limit=10&v=2";

console.log(queryURL);

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

	$("#resultsList").html("<div class=\"searchHeader\"><h1>"+numResults+" Results for:<br>"+query+"<br>"+responseLocation+"</h1></div>");

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

			$("#"+jobKey).append("<p>" + lat +", "+ long + "</p>");
		});			
	}
});