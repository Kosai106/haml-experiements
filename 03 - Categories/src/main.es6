var listHeight = $('.list').height();
var listWidth = $('.list').width();

$('.list-container').css('height', listHeight).css('margin', '0 0 60px 0');
$('.list').scrollLeft(listWidth / 4);
