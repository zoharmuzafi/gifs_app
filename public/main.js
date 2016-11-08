$(document).ready(function(){
	// handelbars config
	var sourceMainPage = $('#cardsOfGifs').html();
	var templateMainPage = Handlebars.compile(sourceMainPage);

	// submit form event
 	$('#searchForm').on('submit', function(event){
		// preventing refresh when form is submitted
		event.preventDefault();
		// keeps the searched searchedValue
		var searchedValue = $('#searchBar').val();
		// clean the search bar after search
		$('#searchBar').val('');
		// get request for gifs from the api (send to the server and from the server to the api)
		$.get('/search/'+ searchedValue, function(data){
			console.log(data);
			$('#resultsDiv').show();
			$('#gifs').empty();
			$('#notEnoughGifsFound').hide();
			$('#startingDiv').hide();
			$('#clearButton').show();
			// show "no result message" div if 0 results returned or append the results otherwise
			if (data.data.length === 0){
				$('#notEnoughGifsFound').show();
			}	else{
				var trackHtmlMainPage = templateMainPage({gifsResults: data.data});
		 		$('#gifs').append(trackHtmlMainPage);
			}
		});		
	});
	// click event for the clear button (clean results and display the landing page div only)
	$('#clearButton').click(function(){
		$('#gifs').empty();
		$('#resultsDiv').hide();
		$('#notEnoughGifsFound').hide();
		$('#startingDiv').hide();
		$('#clearButton').hide();
		$('#startingDiv').show();
	});

	// click event on the favorite icon
	$('#gifs').on('click', '.notSelected', function(){
		elementClass = $(this).attr('class').split(" ")[3];
		$("." + elementClass).toggle();
		var url = $('#' + elementClass).attr('src');
		console.log(url);
		$.post('/gifs', {url: url}, function(data){
		});
	});
});
