// server url add
$.getScript("js/configDomain/domain_name.js", function () {
  localStorage.removeItem("DXB_ip");
  if (base_domainip === null) {
    // var get_ip="192.168.0.1";
    var get_ip = domain_name;
    localStorage.setItem("DXB_ip", get_ip);
  }
});

configFun = function () {
  $.getScript("js/configDomain/domain_name.js", function () {
    localStorage.removeItem("DXB_ip");
    if (base_domainip === null) {
      // var get_ip="192.168.0.1";
      // var get_ip ="192.168.0.1";
      var get_ip = domain_name;
      localStorage.setItem("DXB_ip", get_ip);
    }
  });
};

$(".navbar-dark a").click(function () {
  // $(".navbar-dark a").removeClass("active-li");
  // $(this).addClass("active-li");
});

$("navbar-dark a").attr("href");

$(".side-nav li a").click(function () {
  $("nav#mobile_header").css("height", "23px");
});

$(".panel").click(function () {
  $("nav#mobile_header").css("height", "590px !important");
});

$(".tables-collapse li a").click(function () {
  $("nav#mobile_header").css("height", "23px !important");
});

// function placeFooter() {
//     if( $(document.body).height() < $(window).height() ) {
//         $(".footer").css({position: "absolute", bottom:"-260px"});
//     } else {
//         $(".footer").css({position: ""});
//     }
// }

// placeFooter();

// var contentHeight = jQuery(window).height();
// var footerHeight = jQuery('.footer').height();
// var footerTop = jQuery('.footer').position().top + footerHeight;
// if (footerTop < contentHeight) {
//     jQuery('.footer').css('margin-top', 10+ (contentHeight - footerTop) + 'px');
// }
