var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    request = require('request'),
    url = require('url'),
    mongoose = require('mongoose'),
    hbs = require('hbs');

// Configs bodyParser (for receiving form data)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serves static files from public folder
app.use(express.static(__dirname + '/public'));

// Set view engine to hbs (handlebars)
app.set('view engine', 'hbs');

//connect the data base
mongoose.connect(
  process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/gifs'
);

var Gif = require("./models/gif");

//listens to external port or 8080
app.listen(process.env.PORT || 8080, function() {
  console.log('server started');
});

// --------------------------------main page routes--------------------------------
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
      // keep only images in size of 290 * 300 or less
      var validData = [];
      for(var i=0; i<data.data.length; i++){
        if((data.data[i].images.downsized.height <= 300)&&(data.data[i].images.downsized.width <= 300)){
          validData.push(data.data[i]);
        }
      }
  		res.json({data: validData}); 
  });
});

// post a favorite gif
app.post('/gifs', function(req, res){
  Gif.find({url: req.body.url}, function(err, url){
    if(!url[0]){
      var newFavorite = new Gif(req.body);
      newFavorite.save(function(err, savedGif){
        res.json(savedGif);
      });
    }else{
      res.status(400).send('Current gif already saved');
    }
  });
});

// --------------------------------favorites route--------------------------------
app.get('/gifs/favorites', function(req, res){
  Gif.find(function(err, gifs){
    res.render('favorites', {gifs: gifs});
  });
});

app.delete('/gifs/favorites/:id', function(req, res){
  gifId = req.params.id;
  Gif.remove({_id: gifId}, function(err, deletedGif){
    res.json(deletedGif);
  });
});
