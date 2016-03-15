

//======================================================
// Indeed API request
//======================================================

var searchLocation = "new+brunswick%2C+nj";
var searchType = "node";

var queryURL = "http://api.indeed.com/ads/apisearch?publisher=8023780673544955&format=json&q="+searchType+"&l="+searchLocation+"&v=2";

$.ajax({
	url: queryURL,
	method: 'GET',
    crossDomain: true,
    dataType: 'jsonp'
})
.done(function(response) {
	
	console.log(response);
	var results = response.results
	for (var i = 0; i < results.length; i++) {
		var jobTitle = results[i].jobtitle;
		var company = results[i].company;
		var location = results[i].formattedLocationFull;
		var snippet = results[i].snippet;
		var link = results[i].url;
		var jobKey = results[i].jobkey;

		$("#resultsList").append("<div id="+jobKey+"><h2><a href="+link+" target=\"_blank\">" + jobTitle + "</a></h2><p>" + company + "</p><p>" + location + "</p><p>" + snippet + "</p></div>");

		var secondURL = 'http://api.indeed.com/ads/apigetjobs?publisher=8023780673544955&jobkeys='+jobKey+'&format=json&v=2';

		$.ajax({
			url: secondURL,
			method: 'GET',
		    crossDomain: true,
		    dataType: 'jsonp'
		})
		.done(function(response) {
			console.log(response);
			var long = response.results[0].longitude;
			var lat = response.results[0].latitude;
			var jobKey = response.results[0].jobkey;

			$("#"+jobKey).append("<p>" + lat +", "+ long + "</p>");
		});			
	}
});