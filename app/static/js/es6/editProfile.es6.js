/* jshint unused: false */

'use strict';

$(function()
{
  $('#profile .modal .modal-footer > .btn-primary').on('click', editProfile);
  $('.modal').on('click', '.delete-photo', deletePhoto);
  $('.modal').on('click', '.make-profile-pic', setProfilePic);

  function setProfilePic(e)
  {
    var photo = getPhotoFromButton(this);

    ajax(`/users/photos/${photo}`, 'PUT', {}, h=>
    {
      var $modal = getClosestModal(this);
      var $well = getWellFromModal($modal);
      $well.html(h);
    });

    e.preventDefault();
  }

  function deletePhoto(e)
  {
    var photo = getPhotoFromButton(this);

    ajax(`/users/photos/${photo}`, 'DELETE', {}, h=>
    {
      var $modal = getClosestModal(this);
      $modal.find('.modal-body').html(h);
    });

    e.preventDefault();
  }

  function getPhotoFromButton(button)
  {
    var srcParsed = $(button).parents('.profilePhoto').find('img').attr('src').split('/');
    var photo = srcParsed[srcParsed.length - 1];
    return photo;
  }

  function getWellFromModal($modal)
  {
    return $(`button[data-target=#${$modal.attr('id')}]`).closest('.well');
  }

  function getClosestModal(dom)
  {
    return $(dom).closest('.modal');
  }

  function editProfile(e)
  {
    var $modal = getClosestModal(this);
    var $well = getWellFromModal($modal);
    var category = $well.attr('id');
    switch(category)
    {
      case 'photos':
        addPhotos();
        break;
      default:
        editProfileData();
    }

    function addPhotos()
    {
      var data = new FormData();
      var $fileInput = $('#new-photos[type=file]');
      var files = $fileInput[0].files;

      if(files.length)
      {
        jQuery.each(files, (i, file)=>
        {
          data.append('photos', file);
        });

        ajax('/users/photos', 'POST', data, h=>
        {
          $modal.find('.modal-body').html(h);
        }, false, false);
      }
    }

    function editProfileData()
    {
      var $form = $modal.find('.modal-body').children('form');
      var data = $form.serializeObject();
      data.category = category;
      ajax('/users', 'PUT', data, h=>
      {
        $well.html(h);
        var $close = $modal.find('.modal-footer').children('.btn-default');
        $close.trigger('click');
      });
    }

    e.preventDefault();
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

function ajax(url, type, data={}, success=r=>console.log(r), processData=true, contentType='application/x-www-form-urlencoded', dataType='html')
{
  $.ajax(
  {
    url: url,
    type: type,
    dataType: dataType,
    contentType: contentType,
    processData: processData,
    data: data,
    success: success
  });
}