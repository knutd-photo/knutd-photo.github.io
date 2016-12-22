$(document).ready(function () {
    $(".slider").each(function () { 
        var obj = $(this);
        $(obj).append("<div id='sliderNav' class='nav'></div>");
        $(obj).find("li").each(function () {
            $(obj).find(".nav").append("<span rel='" + $(this).index() + "'></span>");
            $(this).addClass("slider" + $(this).index());
        });
        $(obj).find("span").first().addClass("on");

        _counter = 0;

        setInterval(function () {
            var sl = document.getElementsByClassName('slider');
            var li = $(sl).find('li');

            if (_counter >= li.length) {
                _counter = 0;
            }

            autoSlid(_counter);

            _counter++;
        }, 4000)
    });
});

$(document).on("click", ".slider .nav span", function () { 
    var sl = $(this).closest(".slider");
    $(sl).find("span").removeClass("on"); 
    $(this).addClass("on");
    var obj = $(this).attr("rel");
    _counter = obj;
    autoSlid(obj);
    return false;
});

function autoSlid(count) {
    var sl = document.getElementsByClassName('slider');
    var ul = $(sl).find('ul');
    var li = $(ul).find('li');
    var step = $(li[0]).width();

    var navDiv = document.getElementById('sliderNav');
    $(navDiv).find('span').removeClass('on')
    var navSpans = $(navDiv).find('span');

    for (var i = 0; i < navSpans.length; i++) {
        var val = navSpans[i].getAttribute('rel');
        if (val == count) {
            $(navSpans[i]).addClass('on');
        }
    }

    $(ul).animate({ marginLeft: "-" + step * count }, 700);
}