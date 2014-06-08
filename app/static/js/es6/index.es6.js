/*jshint unused:false*/
/* exported ajax */

(function(){
	'use strict';

	$(document).ready(init);

	function init(){
		$('#submitSearch').click(findGame);
		$('#results').on('click', '.addGame', saveGame);
		$('#currentFavorites').on('click', '.deleteGame', deleteGame);

	}

	function findGame(){
		var game = $('#search').val();
		$('#search').val('');
		ajax(`/users/find-game/${game}`, 'get', null, html=>{
			$('#results').empty().append(html);
		});
	}

	function saveGame(){
		var gameId = $(this).closest('.div').attr('data-id');
		var imgUrl = $(this).prev().prev().attr('data-url');
		var gameName = $(this).prev().text();
		ajax('/users/saveGame', 'put', {id: gameId, url: imgUrl, title: gameName}, response=>{
			$('#results').empty();
			$('#currentFavorites').empty().append(response);
		});
	}

	function deleteGame(event){
		var gameId = $(this).closest('.div').attr('data-id');
		ajax(`/users/deleteGame/${gameId}`, 'delete', null, response=>{
			$('#currentFavorites').empty().append(response);
		});
		event.preventDefault();
	}

})();

// Global ajax function
function ajax(url, type,  data={}, success=response=>console.log(response), dataType='html'){
  'use strict';
  $.ajax({url: url, type: type, data: data, dataType: dataType, success:success});
}