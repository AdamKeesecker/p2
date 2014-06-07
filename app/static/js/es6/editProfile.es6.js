'use strict';

$(function()
{
  $('#profile .modal .modal-footer > .btn-primary').on('click', editProfile);

  function editProfile(e)
  {
    console.log('editing');
    var $form = $(this).closest('.modal-content').children('.modal-body').children('form');
    var category = $form.closest('.modal').attr('id');
    switch(category)
    {
      case 'infoModal':
        editInfo($form);
        break;
      default:
    }

    e.preventDefault();
  }

  function editInfo($form)
  {
    console.log('editing info');
    var data = $form.serializeObject();
    console.log(data);
    ajax('/users/info', 'PUT', data, h=>
    {
      console.log('edited');
      $('#info').html(h);
      var $close = $form.closest('.modal-content').children('.modal-footer').children('.btn-default');
      $close.trigger('click');
    });
  }

  $.fn.serializeObject = function()
  {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
      if (o[this.name] !== undefined) {
        if (!o[this.name].push) {
          o[this.name] = [o[this.name]];
        }
        o[this.name].push(this.value || '');
      } else {
        o[this.name] = this.value || '';
      }
    });
    return o;
  };
});

function ajax(url, type, data={}, success=r=>console.log(r), dataType='html')
{
  $.ajax(
  {
    url: url,
    type: type,
    dataType: dataType,
    data: data,
    success: success
  });
}