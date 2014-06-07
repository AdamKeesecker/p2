/*jshint unused:false*/

(function(){
	'use strict';

	$(document).ready(init);

	function init(){
		$('#submitSearch').click(findGame);
	}
	function findGame(){
		var game = $('#search').val();
		$('#search').val();
		ajax(`/users/find-game/${game}`, 'get', null, html=>{
			console.log(html);
		},'json');
	}

})();

// Global ajax function
function ajax(url, type,  data={}, success=response=>console.log(response), dataType='html'){
  'use strict';
  $.ajax({url: url, type: type, data: data, dataType: dataType, success:success});
}