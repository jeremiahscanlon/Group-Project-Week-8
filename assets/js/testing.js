var queryURL = "http://api.indeed.com/ads/apisearch?publisher=8023780673544955&q=java&l=austin%2C+tx&useragent=Mozilla/%2F4.0%28Firefox%29&v=2"

// create ajax request to call API
$.ajax({url: queryURL, method: 'GET',dataType: "xml"})
// when ajax request complete then ...
.done(function(xml) {
	
	console.log(xml);

});