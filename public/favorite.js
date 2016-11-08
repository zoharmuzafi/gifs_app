$(document).ready(function(){
	// click event on delete favorite
	$('#favoriteGifs').on('click', '.delete', function(event){
		var cardId = $(this).attr('id');
		var warning = confirm('Are you sure you want to delete this cute gif?');
		if (warning){
			$.ajax({
			  url: '/gifs/favorites/' + cardId,
			  type: 'DELETE',
			  dataType : 'json',
			  success: function(data){
			  	$('.' + cardId).remove();
			  }
			});
		}
	});
});
