/*jshint unused:false*/
/* exported ajax */

$(function(){
	'use strict';

	$('#submitSearch').click(findGame);
	$('#results').on('click', '.addGame', saveGame);

	function findGame(){
		var game = $('#search').val();

		if(game)
		{
			$('#search').val('');
			ajax(`/games/${game}`, 'get', null, html=>
			{
				$('#results').html(html);
			});
		}
	}

	function saveGame(){
		var gameId = $(this).closest('.div').attr('data-id');
		var imgUrl = $(this).prev().prev().attr('data-url');
		var gameName = $(this).prev().text();
		ajax('/games/add', 'put', {id: gameId, url: imgUrl, title: gameName}, response=>{
			// $('#results').empty();
			$('#favorites').html(response);
		});
	}

	// Global ajax function
	function ajax(url, type,  data={}, success=response=>console.log(response), dataType='html'){

	  $.ajax({url: url, type: type, data: data, dataType: dataType, success:success});
	}

});