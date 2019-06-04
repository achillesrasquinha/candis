const resize = () => {
  if ( $('.navbar-fixed-top').length ) {
    var padding = {
      top: $('.navbar-fixed-top').height() + 20
    }

    $('body').css('padding-top', padding.top + 'px')
  }
}

$(window).resize(resize)

$(document).ready(() => {
  resize()
})