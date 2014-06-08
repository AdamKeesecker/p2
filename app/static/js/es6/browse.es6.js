///*global ajax*/
(function(){
	'use strict';
	$(document).ready(init);

	function init(){
		$('#filterSpecifity').click(filterMatches);
	}

	function filterMatches(){
		var orientation = $(this).prev().prev().prev().val();
		var sex = $(this).prev().prev().val();
		var distance = $(this).prev().val();
		console.log(orientation, sex, distance);
		var filterData = {orientation: orientation, sex:sex, distance:distance};

		ajax('/users/browse/filter', 'put', filterData, html=>{
			console.log(html);
			$('#filteredMatches').empty().append(html);
		});
		// var orient = $('orentation').find('. option:selected');
		// var sex =


	}




})();

function ajax(url, type,  data={}, success=response=>console.log(response), dataType='html'){
  'use strict';
  $.ajax({url: url, type: type, data: data, dataType: dataType, success:success});
}
