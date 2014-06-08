/*jshint unused:false*/
/* exported ajax */

$(function(){
  'use strict';

  $('#favorites').on('click', '.deleteGame', deleteGame);

  function deleteGame(event){
    var gameId = $(this).closest('.div').attr('data-id');
    ajax(`/games/remove/${gameId}`, 'delete', null, response=>{
      $('#favorites').html(response);
    });
    event.preventDefault();
  }

  // Global ajax function
  function ajax(url, type,  data={}, success=response=>console.log(response), dataType='html'){

    $.ajax({url: url, type: type, data: data, dataType: dataType, success:success});
  }

});