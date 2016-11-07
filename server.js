var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    request = require('request'),
    url = require('url'),
    hbs = require('hbs');

// Configs bodyParser (for receiving form data)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serves static files from public folder
app.use(express.static(__dirname + '/public'));

// Set view engine to hbs (handlebars)
app.set('view engine', 'hbs');

//listens to external port or 8080
app.listen(process.env.PORT || 8080, function() {
  console.log('server started');
});

//route to the landing page
app.get('/', function(req, res){
	res.render('main');
});

// route to search gifs
app.get('/search/:searchedValue', function(req, res){
    // api key
		var apiKey = 'dc6zaTOxFJmzC';
    // keep the searched value from the url params
		searchedValue = req.params.searchedValue;
    // build the api route
		var apiUrl = 'http://api.giphy.com/v1/gifs/search?q='+ searchedValue + '&api_key=' + apiKey + '&fmt=json';
    // request the data from the api using the apiUrl, parse the data to Json and build an array of objects
    // that each of them contains a gif_id and url (if api response has less than 5 results return 0 else return 5)
		request(apiUrl, function(error, response, body){
  		var data = JSON.parse(body);
  		res.json({data: data.data}); 
  });
});
