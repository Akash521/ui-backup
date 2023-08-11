
    // if(window.innerWidth > 1000 && window.innerWidth < 1900){
    //   document.body.style.zoom = window.innerWidth/1900
    // }
var intervalchart;
window.PJAX_ENABLED = true;
window.DEBUG = true;
//colors
//same as in _variables.scss
//keep it synchronized
var $lime = "#8CBF26",
  $red = "#f25118",
  $redDark = "#d04f4f",
  $blue = "#4e91ce",
  $green = "#3ecd74",
  $orange = "#f2c34d",
  $pink = "#E671B8",
  $purple = "#A700AE",
  $brown = "#A05000",
  $teal = "#4ab0ce",
  $gray = "#666",
  $white = "#fff",
  $olive = "#808000",
  $fuchsia = "#FF00FF",
  $yellow = "#FFFF00",
  $aliceblue = "#F0F8FF",
  $antiqueWhite = "#FAEBD7",
  $aqua = "#00FFFF",
  $aquamarine = "#7FFFD4",
  $beige = "#F5F5DC",
  $bisque = "#FFE4C4",
  $blanchedalmond = "#FFEBCD",
  $blueviolet = "#8A2BE2",
  $brown = "#A52A2A",
  $burlywood = "#DEB887",
  $cadetblue = "#5F9EA0",
  $darkmagenta = "#8B008B",
  $darkoliveGreen = "#556B2F",
  $darkorange = "#FF8C00",
  $darkorchid = "#9932CC",
  $darksalmon = "#E9967A",
  $darkseaGreen = "#8FBC8F",
  $darkslateBlue = "#483D8B",
  $textColor = $gray;

//turn off charts is needed
var chartsOff = false;
if (chartsOff) {
  nv.addGraph = function () {};
}

var userprofiledata = {}
var userloginstatus


// COLOR_VALUES = [$red, $orange, $green, $blue, $teal, $redDark,$lime, $aliceblue,$antiqueWhite,$aqua,$aquamarine,$beige,$bisque,$blanchedalmond,$blueviolet,$brown,$burlywood,$cadetblue,$darkmagenta,$darkoliveGreen,$darkorange,$darkorchid,$darksalmon,$darkseaGreen,$darkslateBlue];

COLOR_VALUES = [
  "#993867",
  "#bf5268",
  "#e26552",
  "#e2975d",
  "#e9d88e",
  "#e4bf7f",
  "#8e8c6c",
  "#74c493",
  "#447c69",
  "#51574a",
  "#3c8e9d",
  "#a5f1ff",
  "#ffcccc",
  "#99ccff",
  "#4a48c1",
];
window.colors = (function () {
  if (!window.d3) return false;
  return d3.scale.ordinal().range(COLOR_VALUES);
})();

function keyColor(d, i) {
  if (!window.colors) {
    window.colors = (function () {
      return d3.scale.ordinal().range(COLOR_VALUES);
    })();
  }
  return window.colors(d.key);
}

function closeNavigation() {
  var $accordion = $("#side-nav").find(".panel-collapse.in");
  $accordion.collapse("hide");
  $accordion.siblings(".accordion-toggle").addClass("collapsed");
  resetContentMargin();
  var $sidebar = $("#sidebar");
  if ($(window).width() < 768 && $sidebar.is(".in")) {
    $sidebar.collapse("hide");
  }
}

function resetContentMargin() {
  if ($(window).width() > 767) {
    $(".content").css("margin-top", "");
  }
}

function initPjax() {
  var PjaxApp = function () {
    this.pjaxEnabled = window.PJAX_ENABLED;
    this.debug = window.DEBUG;
    this.$sidebar = $("#sidebar");
    this.$atag = $("a");
    this.$content = $(".content");
    this.$loaderWrap = $(".loader-wrap");
    this.pageLoadCallbacks = {};
    this.loading = false;

    this._resetResizeCallbacks();
    this._initOnResizeCallbacks();

    if (this.pjaxEnabled) {
      //prevent pjaxing if already loading
      this.$sidebar
        .find("a:not(.accordion-toggle):not([data-no-pjax])")
        .on("click", $.proxy(this._checkLoading, this));
      $(document).pjax(
        "#sidebar a:not(.accordion-toggle):not([data-no-pjax])",
        ".content",
        {
          fragment: ".content",
          type: "GET", //use POST to prevent caching when debugging,
          timeout: 10000,
        }
      );

      $(document).pjax("a", ".content", {
        fragment: ".content",
        type: "GET", //use POST to prevent caching when debugging,
        timeout: 10000,
      });
      $(document).on(
        "pjax:start",
        $.proxy(this._changeActiveNavigationItem, this)
      );
      $(document).on("pjax:start", $.proxy(this._resetResizeCallbacks, this));
      $(document).on("pjax:send", $.proxy(this.showLoader, this));
      $(document).on("pjax:success", $.proxy(this._loadScripts, this));
      //custom event which fires when all scripts are actually loaded
      $(document).on("pjax-app:loaded", $.proxy(this._loadingFinished, this));
      $(document).on("pjax-app:loaded", $.proxy(this.hideLoader, this));
      $(document).on("pjax:end", $.proxy(this.pageLoaded, this));
      window.onerror = $.proxy(this._logErrors, this);
    }
  };

  PjaxApp.prototype._initOnResizeCallbacks = function () {
    var resizeTimeout,
      view = this;

    $(window).resize(function () {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(function () {
        view._runPageCallbacks(view.resizeCallbacks);
      }, 100);
    });
  };

  PjaxApp.prototype._resetResizeCallbacks = function () {
    this.resizeCallbacks = {};
  };

  PjaxApp.prototype._changeActiveNavigationItem = function (
    event,
    xhr,
    options
  ) {
    this.$sidebar.find("li.active").removeClass("active");

    
   if(options.url.includes("cctv_map")){
    $("#sidebar.sidebar.nav-collapse.collapse.homeside").hide()
   }else{
    $("#sidebar.sidebar.nav-collapse.collapse.homeside").show()
   }

    this.$sidebar
      .find('a[href*="' + this.extractPageName(options.url) + '"]')
      .each(function () {
        if (this.href === options.url) {
          // $(this).closest('li').addClass('active')
          //     .closest('.panel').addClass('active');
        }
      });
  };

  PjaxApp.prototype.showLoader = function () {
    var view = this;
    // this.showLoaderTimeout = setTimeout(function(){
    //     view.$content.addClass('hiding');
    //     view.$loaderWrap.removeClass('hide');
    //     setTimeout(function(){
    //         view.$loaderWrap.removeClass('hiding');
    //     }, 0)
    // }, 200);
  };

  PjaxApp.prototype.hideLoader = function () {
    // clearTimeout(this.showLoaderTimeout);
    // this.$loaderWrap.addClass('hiding');
    // this.$content.removeClass('hiding');
    // var view = this;
    // this.$loaderWrap.one($.support.transition.end, function () {
    //     view.$loaderWrap.addClass('hide');
    //     view.$content.removeClass('hiding');
    // }).emulateTransitionEnd(200)
    // alert(window.location.href);

    pageDXB();

    history.pushState(null, document.title, location.href);
    window.addEventListener("popstate", function (event) {
      history.pushState(null, document.title, location.href);
    });
  };

  // check URL of the page and call specific condition.
  function pageDXB() {
    // if(window.location.pathname == '/addCam'){
    //     var videoJsDXB=typeof videojs;
    //     if(videoJsDXB == "undefined" ){
    //         //console.log("videojs is undefined")
    //     }else {
    //         if(videojs.getPlayers()['vid1']) {
    //             videojs('vid1').dispose();
    //         }
    //     }
    //     $('.act').removeClass('active');
    //
    //
    //     $.getScript("js/perimeter/addCamPerimeter.js", function() {
    //         //console.log("Script loaded and executed.");
    //         $("#svg_div").empty();
    //         svg_div_var_cc=null;
    //         videoDict_cc_p_s['Intrusion Detection']=[];
    //         polygon_no=0;
    //         RoadDict={}
    //         $('#transparent-input').val('');
    //         drawing =true;
    //         dragging =false;
    //         localStorage.removeItem('perimeterBoundary');
    //         // here you can use anything you defined in the loaded script
    //     });
    //
    //     $('#addcampage').addClass('active');
    //
    //
    //
    //     // sidebarlist();
    //     getScripts(["js/cctv_monitoring.js"], function () {
    //         sidebarlist();
    //     });
    //
    //
    // }
    // else if(window.location.pathname == '/cam' || window.location.pathname == '/') {
    //     if(localStorage.getItem('camName-DXB') == null){
    //         // stream();
    //         // fusioncharts();
    //         getScripts(["js/chart/scriptFusion/ganttscript.js"], function () {
    //             fusioncharts();
    //         });
    //         // sidebarlist();
    //         getScripts(["js/cctv_monitoring.js"], function () {
    //             sidebarlist();
    //             display();
    //             // testAlertaSig();
    //             // testfun();
    //         });
    //
    //         $('#airportName').empty();
    //         $('#terminalName').empty();
    //         $('#aircraftStandName').empty();
    //         $('#camName').empty();
    //         $('#airportName').append("-");
    //         $('#terminalName').append("-");
    //         $('#aircraftStandName').append("-");
    //         $('#camName').append("-");
    //         $('#eventsDXB').append('<div id="loadingEvent" class="position eventsDXBA" style="text-align:center ">No Events Found</div>')
    //         $('#camAlertsDXB').append('<li id="alertsDXBA" > <div class="position" style="text-align:center ">No Alerts Found</div> </li>');
    //
    //
    //     }else {
    //         check();
    //         // sidebarlist();
    //         getScripts(["js/cctv_monitoring.js"], function () {
    //             sidebarlist();
    //             display();
    //         });
    //     }
    //     getScripts(["js/index.js"], function () {
    //         // camdetailsPage();
    //
    //     });
    //
    //
    //
    // }
    // else if(window.location.pathname == '/logs'){
    //         var videoJsDXB=typeof videojs;
    //         if(videoJsDXB == "undefined" ){
    //             //console.log("videojs is undefined")
    //         }else {
    //             if(videojs.getPlayers()['vid1']) {
    //                 videojs('vid1').dispose();
    //             }
    //         }
    //
    //     $('.act').removeClass('active');
    //     $('#logspage').addClass('active');
    //     getScripts(["js/logsDXB.js"], function () {
    //         logs();
    //         testfun();
    //     });
    //     // sidebarlist();
    //     getScripts(["js/cctv_monitoring.js"], function () {
    //         sidebarlist();
    //     });
    //
    // }
    // else if(window.location.pathname == '/analytics'){
    //     var videoJsDXB=typeof videojs;
    //     if(videoJsDXB == "undefined" ){
    //         //console.log("videojs is undefined")
    //     }else {
    //         if(videojs.getPlayers()['vid1']) {
    //             videojs('vid1').dispose();
    //         }
    //     }
    //
    //     $('.act').removeClass('active');
    //     getScripts(["js/analyticsPage.js"], function () {
    //         // getStates();
    //         // getAnalytics("initial");
    //         $('#analyticsPage').addClass('active');
    //     });
    //     // sidebarlist();
    //     getScripts(["js/cctv_monitoring.js"], function () {
    //         sidebarlist();
    //     });
    //
    // }
    // else if(window.location.pathname == '/userprofile'){
    //     var videoJsDXB=typeof videojs;
    //     if(videoJsDXB == "undefined" ){
    //         //console.log("videojs is undefined")
    //     }else {
    //         if(videojs.getPlayers()['vid1']) {
    //             videojs('vid1').dispose();
    //         }
    //     }
    //
    //     $('.act').removeClass('active');
    //     // $('#usersPage').addClass('active');
    //     // sidebarlist();
    //     getScripts(["js/cctv_monitoring.js"], function () {
    //         sidebarlist();
    //     });
    //     getScripts(["js/userprofile.js"], function () {
    //         getUserprofileDXB();
    //     });
    // }
    // else if(window.location.pathname == '/users'){
    //     var videoJsDXB=typeof videojs;
    //     if(videoJsDXB == "undefined" ){
    //         //console.log("videojs is undefined")
    //     }else {
    //         if(videojs.getPlayers()['vid1']) {
    //             videojs('vid1').dispose();
    //         }
    //     }
    //
    //     $('.act').removeClass('active');
    //
    //     // sidebarlist();
    //     getScripts(["js/cctv_monitoring.js"], function () {
    //         sidebarlist();
    //     });
    //     // getusers();
    //     getScripts(["js/usersDXB.js"], function () {
    //         getusers();
    //     });
    //     //$('#usersPage').addClass('active');
    //
    //
    //
    //
    // }
    // else if(window.location.pathname == '/camDetails'){
    //     getScripts(["js/completeScript/script.js"], function () {
    //         camdetailsPage();
    //
    //     });
    //     getScripts(["js/cctv_monitoring.js"], function () {
    //         sidebarlist();
    //     });
    //
    // }
    // else if(window.location.pathname == '/flightDetails'){
    //
    //     getScripts(["lib/slimScroll/jquery.slimscroll.min.js","js/index.js","js/completeScript/script.js"], function () {
    //         flightDetailsPage();
    //
    //     });
    // }
    // else if(window.location.pathname == '/camLogs'){
    //
    //     getScripts(["js/completeScript/cameralogs.js"], function () {
    //         cameralogs()
    //
    //     });
    //     getScripts(["js/cctv_monitoring.js"], function () {
    //         sidebarlist();
    //     });
    // }
    // else if(window.location.pathname == '/login'){
    //
    //     getScripts(["js/config/config.js"], function () {
    //         localStorage.clear()
    //         configFun();
    //
    //     });
    // }

    getScripts(["js/load.js"], function () {
      check();
    });

    // check();

    // check();
  }

  function getScripts(scripts, callback) {
    var progress = 0;
    scripts.forEach(function (script) {
      $.getScript(script, function () {
        if (++progress == scripts.length) callback();
      });
    });
  }

  /**
   * Specify a function to execute when window was resized.
   * Runs maximum once in 100 milliseconds.
   * @param fn A function to execute
   */
  PjaxApp.prototype.onResize = function (fn) {
    this._addPageCallback(this.resizeCallbacks, fn);
  };

  /**
   * Specify a function to execute when page was reloaded with pjax.
   * @param fn A function to execute
   */

  PjaxApp.prototype.onPageLoad = function (fn) {
    this._addPageCallback(this.pageLoadCallbacks, fn);
  };

  PjaxApp.prototype.pageLoaded = function () {
    this._runPageCallbacks(this.pageLoadCallbacks);
  };

  PjaxApp.prototype._addPageCallback = function (callbacks, fn) {
    var pageName = this.extractPageName(location.href);
    if (!callbacks[pageName]) {
      callbacks[pageName] = [];
    }
    callbacks[pageName].push(fn);
  };

  PjaxApp.prototype._runPageCallbacks = function (callbacks) {
    var pageName = this.extractPageName(location.href);
    if (callbacks[pageName]) {
      _(callbacks[pageName]).each(function (fn) {
        fn();
      });
    }
  };

  PjaxApp.prototype._loadScripts = function (
    event,
    data,
    status,
    xhr,
    options
  ) {
    var $bodyContents = $(
        $.parseHTML(
          data.match(/<body[^>]*>([\s\S.]*)<\/body>/i)[0],
          document,
          true
        )
      ),
      $scripts = $bodyContents
        .filter("script[src]")
        .add($bodyContents.find("script[src]")),
      $templates = $bodyContents
        .filter('script[type="text/template"]')
        .add($bodyContents.find('script[type="text/template"]')),
      $existingScripts = $("script[src]"),
      $existingTemplates = $('script[type="text/template"]');

    //append templates first as they are used by scripts
    $templates.each(function () {
      var id = this.id;
      var matchedTemplates = $existingTemplates.filter(function () {
        //noinspection JSPotentiallyInvalidUsageOfThis
        return this.id === id;
      });
      if (matchedTemplates.length) return;

      var script = document.createElement("script");
      script.id = $(this).attr("id");
      script.type = $(this).attr("type");
      script.innerHTML = this.innerHTML;
      document.body.appendChild(script);
    });

    //ensure synchronous loading
    var $previous = {
      load: function (fn) {
        fn();
      },
    };

    $scripts.each(function () {
      var src = this.src;
      var matchedScripts = $existingScripts.filter(function () {
        //noinspection JSPotentiallyInvalidUsageOfThis
        return this.src === src;
      });
      if (matchedScripts.length) return;

      var script = document.createElement("script");
      script.src = $(this).attr("src");
      $previous.load(function () {
        document.body.appendChild(script);
      });

      $previous = $(script);
    });

    var view = this;
    $previous.load(function () {
      $(document).trigger("pjax-app:loaded");
      view.log("scripts loaded.");
    });
  };

  PjaxApp.prototype.extractPageName = function (url) {
    //credit: http://stackoverflow.com/a/8497143/1298418
    var pageName = url
      .split("#")[0]
      .substring(url.lastIndexOf("/") + 1)
      .split("?")[0];
    return pageName === "" ? "index.html" : pageName;
  };

  PjaxApp.prototype._checkLoading = function (e) {
    var oldLoading = this.loading;
    this.loading = true;
    if (oldLoading) {
      this.log("attempt to load page while already loading; preventing.");
      e.preventDefault();
    } else {
      this.log(e.currentTarget.href + " loading started.");
    }
    //prevent default if already loading
    return !oldLoading;
  };

  PjaxApp.prototype._loadingFinished = function () {
    this.loading = false;
    var head = document.getElementsByTagName("head")[0];
    var script = document.createElement("script");
    script.src = "lib/Tags-Input/jquery.tagsinput.js";
    head.appendChild(script);
  };

  PjaxApp.prototype.onp = function () {};

  PjaxApp.prototype._logErrors = function () {
    // var errors = JSON.parse(localStorage.getItem('lb-errors')) || {};
    // errors[new Date().getTime()] = arguments;
    // localStorage.setItem('lb-errors', JSON.stringify(errors));
    // //console.log(errors);
  };

  PjaxApp.prototype.log = function (message) {
    if (this.debug) {
      var pageName = this.extractPageName(location.href);
      localStorage.setItem("pageName", pageName);
      //console.log(
      //   message +
      //     " - " +
      //     arguments.callee.caller.toString().slice(0, 30).split("\n")[0] +
      //     " - " +
      //     this.extractPageName(location.href)
      // );
    }
  };
  window.PjaxApp = new PjaxApp();
}

function initDemoFunctions() {
  $(document).on("pjax:end", function () {
    // alert('The page was loaded with pjax!');
  });
}

function initAppPlugins() {
  /* ========================================================================
   * Table head check all checkboxes
   * ========================================================================
   */
  !(function ($) {
    $(document).on("click", "table th [data-check-all]", function () {
      $(this)
        .closest("table")
        .find("input[type=checkbox]")
        .not(this)
        .prop("checked", $(this).prop("checked"));
    });
  })(jQuery);

  /* ========================================================================
   * Animate Progress Bars
   * ========================================================================
   */
  !(function ($) {
    $.fn.animateProgressBar = function () {
      return this.each(function () {
        var $bar = $(this).find(".progress-bar");
        setTimeout(function () {
          $bar.css("width", $bar.data("width"));
        }, 0);
      });
    };

    $(".js-progress-animate").animateProgressBar();
  })(jQuery);
}

$(function () {
  var $sidebar = $("#sidebar");

  $sidebar.on("mouseleave", function () {
    if (
      ($(this).is(".sidebar-icons") || $(window).width() < 1049) &&
      $(window).width() > 767
    ) {
      setTimeout(function () {
        closeNavigation();
      }, 300); // some timeout for animation
    }
  });

  //need some class to present right after click
  $sidebar.on("show.bs.collapse", function (e) {
    e.target == this && $sidebar.addClass("open");
  });

  $sidebar.on("hide.bs.collapse", function (e) {
    if (e.target == this) {
      $sidebar.removeClass("open");
      $(".content").css("margin-top", "");
    }
  });

  $(window).resize(function () {
    //if ($(window).width() < 768){
    // closeNavigation();
    //}
  });

  var pageload = true;

  $(document).on("pjax-app:loaded", function () {
    if ($(window).width() < 768) {
      closeNavigation();
    }
  });

  //check page Url

  //load multiple javasrript file
  function getScripts(scripts, callback) {
    var progress = 0;
    scripts.forEach(function (script) {
      $.getScript(script, function () {
        if (++progress == scripts.length) callback();
      });
    });
  }

  //load multiple javascript
  function getScripts(scripts, callback) {
    var progress = 0;
    scripts.forEach(function (script) {
      $.getScript(script, function () {
        if (++progress == scripts.length) callback();
      });
    });
  }

  history.pushState(null, document.title, location.href);
  window.addEventListener("popstate", function (event) {
    history.pushState(null, document.title, location.href);
  });

  //class-switch for button-groups
  $(".btn-group > .btn[data-toggle-class]").click(function () {
    var $this = $(this),
      isRadio = $this.find("input").is("[type=radio]"),
      $parent = $this.parent();

    if (isRadio) {
      $parent
        .children(".btn[data-toggle-class]")
        .removeClass(function () {
          return $(this).data("toggle-class");
        })
        .addClass(function () {
          return $(this).data("toggle-passive-class");
        });
      $this
        .removeClass($(this).data("toggle-passive-class"))
        .addClass($this.data("toggle-class"));
    } else {
      $this
        .toggleClass($(this).data("toggle-passive-class"))
        .toggleClass($this.data("toggle-class"));
    }
  });

  $("#search-toggle").click(function () {
    //first hide menu if open

    if ($sidebar.data("bs.collapse")) {
      $sidebar.collapse("hide");
    }

    var $notifications = $(".notifications"),
      notificationsPresent = !$notifications.is(":empty");

    $("#search-form").css("height", function () {
      var $this = $(this);
      if ($this.height() == 0) {
        $this.css("height", 40);
        notificationsPresent && $notifications.css("top", 86);
      } else {
        $this.css("height", 0);
        notificationsPresent && $notifications.css("top", "");
      }
    });
  });

  //hide search field if open
  $sidebar.on("show.bs.collapse", function () {
    var $notifications = $(".notifications"),
      notificationsPresent = !$notifications.is(":empty");
    $("#search-form").css("height", 0);
    notificationsPresent && $notifications.css("top", "");
  });

  /*   Move content down when second-level menu opened */
  $("#side-nav")
    .find("a.accordion-toggle")
    .on("click", function () {
      if ($(window).width() < 768) {
        //console.log($this);
        var $this = $(this),
          $sideNav = $("#side-nav"),
          menuHeight =
            $sideNav.height() +
            parseInt($sideNav.css("margin-top")) +
            parseInt($sideNav.css("margin-bottom")),
          contentMargin = menuHeight + 20,
          $secondLevelMenu = $this.find("+ ul"),
          $subMenuChildren = $secondLevelMenu.find("> li"),
          subMenuHeight = $.map($subMenuChildren, function (child) {
            return $(child).height();
          }).reduce(function (sum, el) {
            return sum + el;
          }),
          $content = $(".content");
        if (!$secondLevelMenu.is(".in")) {
          //when open
          $content.css(
            "margin-top",
            contentMargin +
              subMenuHeight -
              $this
                .closest("ul")
                .find("> .panel > .panel-collapse.open")
                .height() +
              "px"
          );
        } else {
          //when close
          $content.css("margin-top", contentMargin - subMenuHeight + "px");
        }
      }
    });

  $sidebar.on("show.bs.collapse", function (e) {
    if (e.target == this) {
      if ($(window).width() < 768) {
        var $sideNav = $("#side-nav"),
          menuHeight =
            $sideNav.height() +
            parseInt($sideNav.css("margin-top")) +
            parseInt($sideNav.css("margin-bottom")),
          contentMargin = menuHeight + 20;
        $(".content").css("margin-top", contentMargin + "px");
      }
    }
  });

  //need some class to present right after click for submenu
  var $subMenus = $sidebar.find(".panel-collapse");
  $subMenus.on("show.bs.collapse", function (e) {
    if (e.target == this) {
      $(this).addClass("open");
    }
  });

  $subMenus.on("hide.bs.collapse", function (e) {
    if (e.target == this) {
      $(this).removeClass("open");
    }
  });

  initPjax();
  initDemoFunctions();
  initAppPlugins();

  //on page load call this function
  // check();
  // sidebarlist();

  
  if(window.location.pathname != "/cctv_poilive" && window.location.pathname != "/cctv_voilive"){
    getLiveCams()
  }


  getScripts(["js/load.js"], function () {
    check();
  });

  

  const activeli = () => {
    $("." + window.location.pathname.replace("/", "")).addClass("active-li");
    $(".navbar-brand").click(function () {
      if ($(this).hasClass("home")) {
        $(".navbar-dark a").removeClass("active-li");
        $($($(this).siblings("div")[0]).children("a")[0]).addClass("active-li");
      } else {
        if (!$($(this).parent("div")[0]).hasClass("b7") && !$($(this).parent("div")[0]).hasClass("b10")) {
          $(".navbar-dark a").removeClass("active-li");
          $(this).addClass("active-li");
        }
      }
    });
  };

  function handlehomeclick() {
    $(".active-li").removeClass("active-li");
    $(".cctv_map").addClass("active-li");
  }


  //chaeck user login admin or normal user
  $.get("/userprofiledata",function(userdata){
    userprofiledata = userdata
    data = userprofiledata.userlogin_status
    userloginstatus = data
      let name =userprofiledata.name ? userprofiledata.name :"" ;
      let rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu');

      let initials = [...name.matchAll(rgx)] || [];
      console.log([...name?.matchAll(rgx)] || [])

      initials = (
        (initials.shift()?.[1] || '') + (initials.pop()?.[1] || '')
      ).toUpperCase();

    if (data == "super_administrator") {
      $("#sidebar").append(`
       <a href="/cctv_map" onclick="handlehomeclick()" id="site_logo" class="navbar-brand home">
                <img src="img/hr4logo.png" alt="" width="60%" class="branding_logo">
            </a>


             <div class="b2" >
                <a href="/cctv_map" style="padding-right: 15px !important;padding-left: 15px !important;" class="navbar-brand link-menu cctv_map">
                    <p class="menu-1 " style="text-align: center;">
                        <i class="fa fa-map-o" aria-hidden="true"></i><br><br>
                        <span class="link_p text">Map</span></p>

                </a>
            </div>


       <div class="b1" >
                <a href="/cctv_vms" class="navbar-brand link-menu cctv_dashboard">
                    <p class="menu-1 " style="text-align: center;">
                        <i class="fa fa-th-large" aria-hidden="true"></i>
                        <span class="link_p text">Live</span></p>

                </a>
            </div>
            <div class="b2" >
                <a href="/cctv_addition" class="navbar-brand link-menu cctv_addition">
                    <p class="menu-1 " style="text-align: center;">
                        <i class="fa fa-plus-square-o"></i><br><br>
                        <span class="link_p text">Add CCTV</span></p>

                </a>
            </div>
            <div class="b3" >
                <a href="/cctv_location" class="navbar-brand link-menu cctv_location">
                    <p class="menu-1 " style="text-align: center;">
                        <i class="fa fa-map-marker"></i><br><br>
                        <span class="link_p text">Location</span></p>

                </a>
            </div>

           

            
            <div class="b3" >
                <a href="/cctv_analytics" class="navbar-brand link-menu cctv_analytics">
                    <p class="menu-1 " style="text-align: center;">
                        <i class="fa fa-bar-chart" aria-hidden="true"></i><br><br>
                        <span class="link_p text">Analytics</span></p>
                </a>
            </div>
            <div class="b6"  >
                <a href="/cctv_users" class="navbar-brand link-menu cctv_users">
                    <p class="menu-1 " style="text-align: center;">
                        <i class="fa fa-users"></i><br><br>
                        <span class="link_p text">Users</span></p>
                </a>
            </div>

            <div class="b10" style="display:none;">
                <div class="navbar-brand link-menu" style="margin-right: 0;" id="openalerts">
                     <p class="menu-1 " style="text-align: center;">
                        <i class="fa fa-bullhorn"></i><br><br>
                        <span class="link_p text">Alerts <span class="caret"></span></span></p>

                        <ul id="alertsmenu" style="position: absolute; top: 64px; background: #212936 !important; padding: 10px 0; box-shadow: 2px 2px 5px #000;border-radius: 8px;display: none;">
              <li><a href="/cctv_pendingalerts" style="padding: 10px 15px 0 15px;height: fit-content !important;" class="navbar-brand link-menu cctv_pendingalerts">
                    <p class="menu-1 " style="text-align: center;margin-bottom:0">
                        <i style="width: 20px;" class="fa fa-exclamation-circle" aria-hidden="true"></i><br><br>
                        <span class="link_p text">Pending alerts</span></p>
                </a></li>
                <hr style="width:90%;"/>
      <li><a href="/cctv_resolvedalerts" style="   padding: 10px 15px 0 15px;height: fit-content !important;" class="navbar-brand link-menu cctv_resolvedalerts">
                    <p class="menu-1 " style="text-align: center;margin-bottom:0">
                        <i style="width: 20px;" class="fa fa-check-square-o"></i></i><br><br>
                        <span class="link_p text">Resolved alerts</span></p>
                </a></li>

                
         
            </ul>
                </div>
            </div>

            
            <div class="b10"  >
                <div class="navbar-brand link-menu" style="margin-right: 0;" id="openconfig">
                     <p class="menu-1 " style="text-align: center;">
                         <i class="fa fa-cog" aria-hidden="true"></i><br><br>
                        <span class="link_p text">Config <span class="caret"></span></span></p>

                        <ul id="configmenu" style="position: absolute; top: 64px; background: #212936 !important;    padding: 10px 0; box-shadow: 2px 2px 5px #000;border-radius: 8px; display: none;">
              <li><a href="/cctv_voi" style="padding: 10px 15px 0 15px;height: fit-content !important; display:none;" class="navbar-brand link-menu cctv_voi">
                    <p class="menu-1 " style="text-align: center;margin-bottom:0"">
                        <i style="width: 20px;" class="fa fa-car"></i><br><br>
                        <span class="link_p text">VOI Conf</span></p>
                </a></li>
               
                <hr style="width:90%; display:none;"/>
      <li><a href="/cctv_poi" style="padding: 10px 15px 0 15px;height: fit-content !important; display: none;" class="navbar-brand link-menu cctv_poi">
                    <p class="menu-1 " style="text-align: center;margin-bottom:0"">
                        <i style="width: 20px;" class="fa fa-user"></i><br><br>
                        <span class="link_p text">POI Conf</span></p>
                </a></li>
                <hr style="width:90%; display:none;"/>
                
              <li><a href="/cctv_downloads" style="padding: 10px 15px 0 15px;height: fit-content !important;" class="navbar-brand link-menu cctv_downloads">
                    <p class="menu-1 " style="text-align: center;margin-bottom:0"">
                        <i class="fa fa-download" style="width: 20px;"></i><br><br>
                        <span class="link_p text">Downloads</span></p>
                </a></li>
              <hr style="width:90%;"/>
                 <li>
                 <li><a href="/cctv_deviceInfo" style="padding: 10px 15px 0 15px;height: fit-content !important; " class="navbar-brand link-menu cctv_voi">
                <p class="menu-1 " style="text-align: center;margin-bottom:0"">
                    <i style="width: 20px;" class="fa fa-info-circle"></i><br><br>
                    <span class="link_p text">Device Management</span></p>
            </a></li>
              <hr style="width:90%;"/>
      <div class="b7">
      <span onclick="openmodalSMTP();" class="navbar-brand link-menu" style="padding: 10px 15px !important;height: fit-content !important;padding-bottom: 0 !important;">
                     <p class="menu-1 " style="text-align: center;margin-bottom: 0 !important;">
                         <i style="width: 20px;" class="fa fa-cog"></i><br><br>
                         <span class="link_p text">Main Setup</span></p>
                 </span>
                 </div>
      </li>
      
         
            </ul>
                </div>
            </div>


            

            
            `);


            // <li><a href="/cctv_alert" class="navbar-brand link-menu cctv_alert">
            //         <p class="menu-1 " style="text-align: center;">
            //             <i class="fa fa-plus-square-o"></i><br><br>
            //             <span class="link_p text">Add alerts</span></p>
            //     </a></li>

      //       <li>
      // <div class="b7">
      // <span onclick="openmodalSMTP();" class="navbar-brand link-menu">
      //                <p class="menu-1 " style="text-align: center;">
      //                    <i class="fa fa-cog"></i><br><br>
      //                    <span class="link_p text">Main Setup</span></p>
      //            </span>
      //            </div>
      // </li>

      // <div class="b7" onclick="openmodalSMTP();" >
      //           <span  class="navbar-brand link-menu">
      //               <p class="menu-1 " style="text-align: center;">
      //                   <i class="fa fa-cog"></i><br><br>
      //                   <span class="link_p text">Main Setup</span></p>
      //           </span>
      //       </div>

      // <div class="b8" >
      //           <a href="/cctv_location" class="navbar-brand link-menu cctv_location">
      //               <p class="menu-1 " style="text-align: center;">
      //                   <i class="fa fa-map-marker"></i><br><br>
      //                   <span class="link_p text">Add Location</span></p>
      //           </a>
      //       </div>

      // <li><a href="/userprofile"><i class="glyphicon glyphicon-cog">&nbsp;</i><span>Account Settings</span></a></li><hr></hr>
      // <li><a href="/userprofile"><i class="glyphicon glyphicon-cog">&nbsp;</i><span>Account Settings</span></a></li><hr></hr>
      $("#acc_setting").append(`
      <li style="padding: 0 20px;display: flex;">
      <div class="profilecircle">
  <p class="profilecircle-inner">${initials}</p>
</div>
        <div>
        <h3 style="font-size: 18px;margin-top: 9px;text-transform: capitalize;">${userprofiledata.name}</h3>
        <h6 style="text-transform: capitalize;">${userprofiledata.userlogin_status?.replaceAll("_"," ")}</h6>
        </div>
      </li>
      <li><a href="/userprofile"><i class="glyphicon glyphicon-cog">&nbsp;</i><span>Account Settings</span></a></li><hr>
      <li><div style="cursor: pointer;font-size: 16px;font-weight: 400;padding: 10px 19px;" class="logout" onclick="logout()"><i class="glyphicon glyphicon-off">&nbsp;</i><span>Logout</span></div></li>
                `);

       $(".ipadrw").append(`
      <a href="/cctv_map" class="homelogo home"
            ><img
              src="img/Raven-logo.png"
              height="60px"
              class="branding_logomob"
          /></a>
      `);

      $("#ipad_dropdown_menu").append(`
      <li>
                        <a href="/cctv_map" class="navbar-brand link-menum cctv_map">
                            <p class="menu-1">
                                <i class="fa fa-map-o" aria-hidden="true"></i>
                                <span class="link_p text">Map</span></p>

                        </a>
                    </li>
                    <li>
                    <a href="/cctv_dashboard" class="navbar-brand link-menum cctv_dashboard">
                    <p class="menu-1">
                        <i class="fa fa-th-large" aria-hidden="true"></i>
                        <span class="link_p text">Dashboard</span></p>

                </a>
                </li>
                  
                <li>
                  <a href="/cctv_addition" class="navbar-brand link-menum cctv_addition">
                    <p class="menu-1">
                        <i class="fa fa-plus-square-o" aria-hidden="true"></i>
                        <span class="link_p text">Add CCTV</span></p>

                </a>
                
                </li>


                <li>
                   <a href="/cctv_location" class="navbar-brand link-menum cctv_location">
                    <p class="menu-1">
                        <i class="fa fa-map-marker"></i>
                        <span class="link_p text">Location</span></p>

                </a>
                
                
                </li>
                    <li>
                        <a href="/cctv_analytics" class="navbar-brand link-menum cctv_analytics">
                            <p class="menu-1">
                                <i class="fa fa-bar-chart" aria-hidden="true"></i>
                                <span class="link_p text">Analytics</span></p>
                        </a>
                    </li>
                   
                   
                    <li>
                        <a href="/cctv_users" class="navbar-brand link-menum cctv_users">
                            <p class="menu-1">
                                <i class="fa fa-users"></i>
                                <span class="link_p text">Users</span></p>

                        </a>
                    </li>
                    <li>
                        <a href="/cctv_pendingalerts" class="navbar-brand link-menum cctv_pendingalerts">
                            <p class="menu-1">
                                <i class="fa fa-exclamation-circle" aria-hidden="true"></i>
                                <span class="link_p text">Pending Alerts</span></p>

                        </a>
                    </li>
                   <li><a href="/cctv_resolvedalerts" class="navbar-brand link-menum cctv_resolvedalerts">
                    <p class="menu-1">
                        <i class="fa fa-check-square-o"></i></i>
                        <span class="link_p text">Resolved alerts</span></p>
                </a></li>


                <li><a href="/cctv_voi" class="navbar-brand link-menum cctv_voi">
                    <p class="menu-1 ">
                        <i class="fa fa-car"></i>
                        <span class="link_p text">VOI Conf</span></p>
                </a></li>
      <li><a href="/cctv_poi" class="navbar-brand link-menum cctv_poi">
                    <p class="menu-1 ">
                        <i class="fa fa-user"></i>
                        <span class="link_p text">POI Conf</span></p>
                </a></li>
      <li>
      <a onclick="openmodalSMTP();" class="navbar-brand link-menum">
                     <p class="menu-1 ">
                         <i class="fa fa-cog"></i>
                         <span class="link_p text">Main Setup</span></p>
                 </a>
      </li>




                    <li>
                        <a href="/userprofile" class="navbar-brand link-menum userprofile">
                            <p class="menu-1">
                                <i class="glyphicon glyphicon-cog select_clr"></i>
                                <span class="link_p text">Account Setting</span></p>

                        </a>
                    </li>

                    <li>
                        <a onclick="logout()" href="/" class="navbar-brand link-menum">
                            <p class="menu-1">
                                <i class="glyphicon glyphicon-off select_clr"></i>
                                <span class="link_p text">Logout</span></p>

                        </a>
                    </li>
                   
       `);

      // <li><a href="/userprofile" class="acipa"><i class="glyphicon glyphicon-cog select_clr">&nbsp;</i><span>Settings</span></a></li><hr></hr>
      $("#mobile_side_nav").append(`

      <li data-toggle="collapse" data-target=".sidebar">
                        <a href="/cctv_map" class="navbar-brand link-menum cctv_map">
                            <p class="menu-1">
                                <i class="fa fa-map-o" aria-hidden="true"></i>
                                <span class="link_p text">Map</span></p>

                        </a>
                    </li>
                    <li data-toggle="collapse" data-target=".sidebar">
                    <a href="/cctv_dashboard" class="navbar-brand link-menum cctv_dashboard">
                    <p class="menu-1">
                        <i class="fa fa-th-large" aria-hidden="true"></i>
                        <span class="link_p text">Dashboard</span></p>

                </a>
                </li>
                  
                <li data-toggle="collapse" data-target=".sidebar">
                  <a href="/cctv_addition" class="navbar-brand link-menum cctv_addition">
                    <p class="menu-1">
                        <i class="fa fa-plus-square-o" aria-hidden="true"></i>
                        <span class="link_p text">Add CCTV</span></p>

                </a>
                
                </li>


                <li data-toggle="collapse" data-target=".sidebar">
                   <a href="/cctv_location" class="navbar-brand link-menum cctv_location">
                    <p class="menu-1">
                        <i class="fa fa-map-marker"></i>
                        <span class="link_p text">Location</span></p>

                </a>
                
                
                </li>
                    <li data-toggle="collapse" data-target=".sidebar">
                        <a href="/cctv_analytics" class="navbar-brand link-menum cctv_analytics">
                            <p class="menu-1">
                                <i class="fa fa-bar-chart" aria-hidden="true"></i>
                                <span class="link_p text">Analytics</span></p>
                        </a>
                    </li>
                   
                   
                    <li data-toggle="collapse" data-target=".sidebar">
                        <a href="/cctv_users" class="navbar-brand link-menum cctv_users">
                            <p class="menu-1">
                                <i class="fa fa-users"></i>
                                <span class="link_p text">Users</span></p>

                        </a>
                    </li>
                    <li data-toggle="collapse" data-target=".sidebar">
                        <a href="/cctv_pendingalerts" class="navbar-brand link-menum cctv_pendingalerts">
                            <p class="menu-1">
                                <i class="fa fa-exclamation-circle" aria-hidden="true"></i>
                                <span class="link_p text">Pending Alerts</span></p>

                        </a>
                    </li>
                   <li data-toggle="collapse" data-target=".sidebar"><a href="/cctv_resolvedalerts" class="navbar-brand link-menum cctv_resolvedalerts">
                    <p class="menu-1">
                        <i class="fa fa-check-square-o"></i></i>
                        <span class="link_p text">Resolved alerts</span></p>
                </a></li>


                <li data-toggle="collapse" data-target=".sidebar"><a href="/cctv_voi" class="navbar-brand link-menum cctv_voi">
                    <p class="menu-1 ">
                        <i class="fa fa-car"></i>
                        <span class="link_p text">VOI Conf</span></p>
                </a></li>
      <li data-toggle="collapse" data-target=".sidebar"><a href="/cctv_poi" class="navbar-brand link-menum cctv_poi">
                    <p class="menu-1 ">
                        <i class="fa fa-user"></i>
                        <span class="link_p text">POI Conf</span></p>
                </a></li>
      <li data-toggle="collapse" data-target=".sidebar">
      <a onclick="openmodalSMTP();" class="navbar-brand link-menum">
                     <p class="menu-1 ">
                         <i class="fa fa-cog"></i>
                         <span class="link_p text">Main Setup</span></p>
                 </a>
      </li>




                    
                     <li>
                        <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
                            <div class="panel panel-default acpn">
                                <div class="panel-heading2" role="tab" id="headingThree">
                                    <a class="collapsed acipc" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                        <i class="glyphicon glyphicon-user select_clr" style="color: #767a81;"></i> &nbsp;Account Setting
                                    </a>
                                </div>
                                <div id="collapseThree" class="panel-collapse2 collapse" role="tabpanel" aria-labelledby="headingThree">
                                    <div class="panel-body">
                                        <ul id="tables-collapse" class="panel-collapse" aria-expanded="false" style="height: 0px;">
                                            <li><a href="/userprofile" class="acipa"><i class="glyphicon glyphicon-cog select_clr">&nbsp;</i><span>Profile</span></a></li>
                                            <li><a href="/logout" class="acipa"><i class="glyphicon glyphicon-off select_clr">&nbsp;</i><span>Logout</span></a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
      `);

      // <li
      //   data-toggle="collapse"
      //   data-target=".sidebar"
      //   onclick="openmodalSMTP();"
      // >
      //   <a href="#" class="navbar-brand link-menum">
      //     <p class="menu-1 ">
      //       <i class="fa fa-cog"></i>
      //       <span class="link_p text add_cameratext">Main Setup</span>
      //     </p>
      //   </a>
      // </li>;

      //  <li data-toggle="collapse" data-target=".sidebar">
      //    <a href="/cctv_location" class="navbar-brand link-menum cctv_location">
      //      <p class="menu-1 ">
      //        <i class="fa fa-map-marker"></i>
      //        <span class="link_p text add_cameratext">Add Location</span>
      //      </p>
      //    </a>
      //  </li>;

      // <li><a href="/userprofile" class="acipa"><i class="glyphicon glyphicon-cog select_clr">&nbsp;</i><span>Settings</span></a></li><hr></hr>

      {
        /* <li data-toggle="collapse" data-target=".sidebar">
  <a href="/cctv_location" class="navbar-brand link-menum cctv_location">
    <p class="menu-1 ">
      <i class="fa fa-map-marker"></i>
      <span class="link_p text add_cameratext">Add Location</span>
    </p>
  </a>
</li>; */
      }

      {
        /* <li><a href="/userprofile" class="acipa"><i class="glyphicon glyphicon-cog select_clr">&nbsp;</i><span>Settings</span></a></li><hr></hr> */
      }



      $("#openalerts").on("mouseover", function () {
        $("#alertsmenu").show()
      });
      $("#openalerts").on("mouseleave", function () {
        $("#alertsmenu").hide()
      });


      $("#openconfig").on("mouseover", function () {
        $("#configmenu").show();
      });
      $("#openconfig").on("mouseleave", function () {
        $("#configmenu").hide();
      });





      activeli();
    }else if (data == "administrator") {
      $("#sidebar").append(`
       <a href="/cctv_map" onclick="handlehomeclick()" id="site_logo" class="navbar-brand home">
                <img src="img/hr4logo.png" alt="" width="60%" class="branding_logo">
            </a>


             <div class="b2" >
                <a href="/cctv_map" style="padding-right: 15px !important;padding-left: 15px !important;" class="navbar-brand link-menu cctv_map">
                    <p class="menu-1 " style="text-align: center;">
                        <i class="fa fa-map-o" aria-hidden="true"></i><br><br>
                        <span class="link_p text">Map</span></p>

                </a>
            </div>


       <div class="b1" >
                <a href="/cctv_dashboard" class="navbar-brand link-menu cctv_dashboard">
                    <p class="menu-1 " style="text-align: center;">
                        <i class="fa fa-th-large" aria-hidden="true"></i>
                        <span class="link_p text">Dashboard</span></p>

                </a>
            </div>
            

           

            
            <div class="b3" >
                <a href="/cctv_analytics" class="navbar-brand link-menu cctv_analytics">
                    <p class="menu-1 " style="text-align: center;">
                        <i class="fa fa-bar-chart" aria-hidden="true"></i><br><br>
                        <span class="link_p text">Analytics</span></p>
                </a>
            </div>
            <div class="b6"  >
                <a href="/cctv_users" class="navbar-brand link-menu cctv_users">
                    <p class="menu-1 " style="text-align: center;">
                        <i class="fa fa-users"></i><br><br>
                        <span class="link_p text">Users</span></p>
                </a>
            </div>

            <div class="b6"  >
                <a href="/cctv_alerts" class="navbar-brand link-menu cctv_alerts">
                    <p class="menu-1 " style="text-align: center;">
                        <i class="fa fa-bullhorn"></i><br><br>
                        <span class="link_p text">Alerts</span></p>
                </a>
            </div>

            
            <div class="b10"  >
                <div class="navbar-brand link-menu" style="margin-right: 0;" id="openconfig">
                     <p class="menu-1 " style="text-align: center;">
                         <i class="fa fa-cog" aria-hidden="true"></i><br><br>
                        <span class="link_p text">Config <span class="caret"></span></span></p>

                        <ul id="configmenu" style="position: absolute; top: 64px; background: #212936 !important;    padding: 10px 0; box-shadow: 2px 2px 5px #000;border-radius: 8px; display: none;">
              <li><a href="/cctv_voi" style="padding: 10px 15px 0 15px;height: fit-content !important;" class="navbar-brand link-menu cctv_voi">
                    <p class="menu-1 " style="text-align: center;margin-bottom:0"">
                        <i style="width: 20px;" class="fa fa-car"></i><br><br>
                        <span class="link_p text">VOI Conf</span></p>
                </a></li>
                <hr style="width:90%;"/>
      <li><a href="/cctv_poi" style="padding: 10px 15px 0 15px;height: fit-content !important;" class="navbar-brand link-menu cctv_poi">
                    <p class="menu-1 " style="text-align: center;margin-bottom:0"">
                        <i style="width: 20px;" class="fa fa-user"></i><br><br>
                        <span class="link_p text">POI Conf</span></p>
                </a></li>
              <hr style="width:90%;"/>
              <li><a href="/cctv_downloads" style="padding: 10px 15px 0 15px;height: fit-content !important;" class="navbar-brand link-menu cctv_downloads">
                    <p class="menu-1 " style="text-align: center;margin-bottom:0"">
                        <i class="fa fa-download" style="width: 20px;"></i><br><br>
                        <span class="link_p text">Downloads</span></p>
                </a></li>
              <hr style="width:90%;"/>
                 <li>
      <div class="b7">
      <span onclick="openmodalSMTP();" class="navbar-brand link-menu" style="padding: 10px 15px !important;height: fit-content !important;padding-bottom: 0 !important;">
                     <p class="menu-1 " style="text-align: center;margin-bottom: 0 !important;">
                         <i style="width: 20px;" class="fa fa-cog"></i><br><br>
                         <span class="link_p text">Main Setup</span></p>
                 </span>
                 </div>
      </li>
      
         
            </ul>
                </div>
            </div>


            

            
            `);


            // <li><a href="/cctv_alert" class="navbar-brand link-menu cctv_alert">
            //         <p class="menu-1 " style="text-align: center;">
            //             <i class="fa fa-plus-square-o"></i><br><br>
            //             <span class="link_p text">Add alerts</span></p>
            //     </a></li>

      //       <li>
      // <div class="b7">
      // <span onclick="openmodalSMTP();" class="navbar-brand link-menu">
      //                <p class="menu-1 " style="text-align: center;">
      //                    <i class="fa fa-cog"></i><br><br>
      //                    <span class="link_p text">Main Setup</span></p>
      //            </span>
      //            </div>
      // </li>

      // <div class="b7" onclick="openmodalSMTP();" >
      //           <span  class="navbar-brand link-menu">
      //               <p class="menu-1 " style="text-align: center;">
      //                   <i class="fa fa-cog"></i><br><br>
      //                   <span class="link_p text">Main Setup</span></p>
      //           </span>
      //       </div>

      // <div class="b8" >
      //           <a href="/cctv_location" class="navbar-brand link-menu cctv_location">
      //               <p class="menu-1 " style="text-align: center;">
      //                   <i class="fa fa-map-marker"></i><br><br>
      //                   <span class="link_p text">Add Location</span></p>
      //           </a>
      //       </div>

      // <li><a href="/userprofile"><i class="glyphicon glyphicon-cog">&nbsp;</i><span>Account Settings</span></a></li><hr></hr>
      // <li><a href="/userprofile"><i class="glyphicon glyphicon-cog">&nbsp;</i><span>Account Settings</span></a></li><hr></hr>
      $("#acc_setting").append(`
      <li style="padding: 0 20px;display: flex;">
      <div class="profilecircle">
  <p class="profilecircle-inner">${initials}</p>
</div>
        <div>
        <h3 style="font-size: 18px;margin-top: 9px;text-transform: capitalize;">${userprofiledata.name}</h3>
        <h6 style="text-transform: capitalize;">${userprofiledata.userlogin_status?.replaceAll("_"," ")}</h6>
        </div>
      </li>
      <li><a href="/userprofile"><i class="glyphicon glyphicon-cog">&nbsp;</i><span>Account Settings</span></a></li><hr>
      <li><div style="cursor: pointer;font-size: 16px;font-weight: 400;padding: 10px 19px;" class="logout" onclick="logout()"><i class="glyphicon glyphicon-off">&nbsp;</i><span>Logout</span></div></li>
                `);

       $(".ipadrw").append(`
      <a href="/cctv_map" class="homelogo home"
            ><img
              src="img/Raven-logo.png"
              height="60px"
              class="branding_logomob"
          /></a>
      `);

      $("#ipad_dropdown_menu").append(`
      <li>
                        <a href="/cctv_map" class="navbar-brand link-menum cctv_map">
                            <p class="menu-1">
                                <i class="fa fa-map-o" aria-hidden="true"></i>
                                <span class="link_p text">Map</span></p>

                        </a>
                    </li>
                    <li>
                    <a href="/cctv_dashboard" class="navbar-brand link-menum cctv_dashboard">
                    <p class="menu-1">
                        <i class="fa fa-th-large" aria-hidden="true"></i>
                        <span class="link_p text">Dashboard</span></p>

                </a>
                </li>
                 
                    <li>
                        <a href="/cctv_analytics" class="navbar-brand link-menum cctv_analytics">
                            <p class="menu-1">
                                <i class="fa fa-bar-chart" aria-hidden="true"></i>
                                <span class="link_p text">Analytics</span></p>
                        </a>
                    </li>
                   
                   
                    <li>
                        <a href="/cctv_users" class="navbar-brand link-menum cctv_users">
                            <p class="menu-1">
                                <i class="fa fa-users"></i>
                                <span class="link_p text">Users</span></p>

                        </a>
                    </li>
                    <li>
                        <a href="/cctv_alerts" class="navbar-brand link-menum cctv_alerts">
                            <p class="menu-1">
                                 <i class="fa fa-bullhorn"></i>
                                <span class="link_p text">Alerts</span></p>

                        </a>
                    </li>
                  


                <li><a href="/cctv_voi" class="navbar-brand link-menum cctv_voi">
                    <p class="menu-1 ">
                        <i class="fa fa-car"></i>
                        <span class="link_p text">VOI Conf</span></p>
                </a></li>
      <li><a href="/cctv_poi" class="navbar-brand link-menum cctv_poi">
                    <p class="menu-1 ">
                        <i class="fa fa-user"></i>
                        <span class="link_p text">POI Conf</span></p>
                </a></li>

                <li><a href="/cctv_downloads" class="navbar-brand link-menum cctv_downloads">
                    <p class="menu-1 ">
                         <i class="fa fa-download" style="width: 20px;"></i>
                        <span class="link_p text">Downloads</span></p>
                </a></li>
                

               
      
                <li>
      <a onclick="openmodalSMTP();" class="navbar-brand link-menum">
                     <p class="menu-1 ">
                         <i class="fa fa-cog"></i>
                         <span class="link_p text">Main Setup</span></p>
                 </a>
      </li>




                    <li>
                        <a href="/userprofile" class="navbar-brand link-menum userprofile">
                            <p class="menu-1">
                                <i class="glyphicon glyphicon-cog select_clr"></i>
                                <span class="link_p text">Account Setting</span></p>

                        </a>
                    </li>

                    <li>
                        <a onclick="logout()" href="/" class="navbar-brand link-menum">
                            <p class="menu-1">
                                <i class="glyphicon glyphicon-off select_clr"></i>
                                <span class="link_p text">Logout</span></p>

                        </a>
                    </li>
                   
       `);

      // <li><a href="/userprofile" class="acipa"><i class="glyphicon glyphicon-cog select_clr">&nbsp;</i><span>Settings</span></a></li><hr></hr>
      $("#mobile_side_nav").append(`

      <li data-toggle="collapse" data-target=".sidebar">
                        <a href="/cctv_map" class="navbar-brand link-menum cctv_map">
                            <p class="menu-1">
                                <i class="fa fa-map-o" aria-hidden="true"></i>
                                <span class="link_p text">Map</span></p>

                        </a>
                    </li>
                    <li data-toggle="collapse" data-target=".sidebar">
                    <a href="/cctv_dashboard" class="navbar-brand link-menum cctv_dashboard">
                    <p class="menu-1">
                        <i class="fa fa-th-large" aria-hidden="true"></i>
                        <span class="link_p text">Dashboard</span></p>

                </a>
                </li>
                  
                
                    <li data-toggle="collapse" data-target=".sidebar">
                        <a href="/cctv_analytics" class="navbar-brand link-menum cctv_analytics">
                            <p class="menu-1">
                                <i class="fa fa-bar-chart" aria-hidden="true"></i>
                                <span class="link_p text">Analytics</span></p>
                        </a>
                    </li>
                   
                   
                    <li data-toggle="collapse" data-target=".sidebar">
                        <a href="/cctv_users" class="navbar-brand link-menum cctv_users">
                            <p class="menu-1">
                                <i class="fa fa-users"></i>
                                <span class="link_p text">Users</span></p>

                        </a>
                    </li>
                    <li data-toggle="collapse" data-target=".sidebar">
                        <a href="/cctv_alerts" class="navbar-brand link-menu cctv_alerts">
                    <p class="menu-1 " style="text-align: center;">
                        <i class="fa fa-bullhorn"></i><br><br>
                        <span class="link_p text">Alerts</span></p>
                </a>
                    </li>

                   


                <li data-toggle="collapse" data-target=".sidebar"><a href="/cctv_voi" class="navbar-brand link-menum cctv_voi">
                    <p class="menu-1 ">
                        <i class="fa fa-car"></i>
                        <span class="link_p text">VOI Conf</span></p>
                </a></li>
      <li data-toggle="collapse" data-target=".sidebar"><a href="/cctv_poi" class="navbar-brand link-menum cctv_poi">
                    <p class="menu-1 ">
                        <i class="fa fa-user"></i>
                        <span class="link_p text">POI Conf</span></p>
                </a></li>
                <li><a href="/cctv_poi" style="padding: 10px 15px 0 15px;height: fit-content !important;" class="navbar-brand link-menu cctv_poi">
                    <p class="menu-1 " style="text-align: center;margin-bottom:0"">
                        <i style="width: 20px;" class="fa fa-user"></i><br><br>
                        <span class="link_p text">POI Conf</span></p>
                </a></li>
      <li data-toggle="collapse" data-target=".sidebar">
      <a onclick="openmodalSMTP();" class="navbar-brand link-menum">
                     <p class="menu-1 ">
                         <i class="fa fa-cog"></i>
                         <span class="link_p text">Main Setup</span></p>
                 </a>
      </li>




                    
                     <li>
                        <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
                            <div class="panel panel-default acpn">
                                <div class="panel-heading2" role="tab" id="headingThree">
                                    <a class="collapsed acipc" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                        <i class="glyphicon glyphicon-user select_clr" style="color: #767a81;"></i> &nbsp;Account Setting
                                    </a>
                                </div>
                                <div id="collapseThree" class="panel-collapse2 collapse" role="tabpanel" aria-labelledby="headingThree">
                                    <div class="panel-body">
                                        <ul id="tables-collapse" class="panel-collapse" aria-expanded="false" style="height: 0px;">
                                            <li><a href="/userprofile" class="acipa"><i class="glyphicon glyphicon-cog select_clr">&nbsp;</i><span>Profile</span></a></li>
                                            <li><a href="/logout" class="acipa"><i class="glyphicon glyphicon-off select_clr">&nbsp;</i><span>Logout</span></a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
      `);

      // <li
      //   data-toggle="collapse"
      //   data-target=".sidebar"
      //   onclick="openmodalSMTP();"
      // >
      //   <a href="#" class="navbar-brand link-menum">
      //     <p class="menu-1 ">
      //       <i class="fa fa-cog"></i>
      //       <span class="link_p text add_cameratext">Main Setup</span>
      //     </p>
      //   </a>
      // </li>;

      //  <li data-toggle="collapse" data-target=".sidebar">
      //    <a href="/cctv_location" class="navbar-brand link-menum cctv_location">
      //      <p class="menu-1 ">
      //        <i class="fa fa-map-marker"></i>
      //        <span class="link_p text add_cameratext">Add Location</span>
      //      </p>
      //    </a>
      //  </li>;

      // <li><a href="/userprofile" class="acipa"><i class="glyphicon glyphicon-cog select_clr">&nbsp;</i><span>Settings</span></a></li><hr></hr>

      {
        /* <li data-toggle="collapse" data-target=".sidebar">
  <a href="/cctv_location" class="navbar-brand link-menum cctv_location">
    <p class="menu-1 ">
      <i class="fa fa-map-marker"></i>
      <span class="link_p text add_cameratext">Add Location</span>
    </p>
  </a>
</li>; */
      }

      {
        /* <li><a href="/userprofile" class="acipa"><i class="glyphicon glyphicon-cog select_clr">&nbsp;</i><span>Settings</span></a></li><hr></hr> */
      }



      $("#openalerts").on("mouseover", function () {
        $("#alertsmenu").show()
      });
      $("#openalerts").on("mouseleave", function () {
        $("#alertsmenu").hide()
      });


      $("#openconfig").on("mouseover", function () {
        $("#configmenu").show();
      });
      $("#openconfig").on("mouseleave", function () {
        $("#configmenu").hide();
      });





      activeli();
    }else if (data == "support") {
      $("#sidebar").append(`
       <a href="/cctv_map" onclick="handlehomeclick()" id="site_logo" class="navbar-brand home">
                <img src="img/hr4logo.png" alt="" width="60%" class="branding_logo">
            </a>

             <div class="b2" >
                <a href="/cctv_map" style="padding-right: 15px !important;padding-left: 15px !important;" class="navbar-brand link-menu cctv_map">
                    <p class="menu-1 " style="text-align: center;">
                        <i class="fa fa-map-o" aria-hidden="true"></i><br><br>
                        <span class="link_p text">Map</span></p>

                </a>
            </div>

             <div class="b1" >
                <a href="/cctv_dashboard" class="navbar-brand link-menu cctv_dashboard">
                    <p class="menu-1 " style="text-align: center;">
                        <i class="fa fa-th-large" aria-hidden="true"></i>
                        <span class="link_p text">Dashboard</span></p>

                </a>
            </div>
            

           

            
            <div class="b3" >
                <a href="/cctv_analytics" class="navbar-brand link-menu cctv_analytics">
                    <p class="menu-1 " style="text-align: center;">
                        <i class="fa fa-bar-chart" aria-hidden="true"></i><br><br>
                        <span class="link_p text">Analytics</span></p>
                </a>
            </div>
             <div class="b6"  >
                <a href="/cctv_alerts" class="navbar-brand link-menu cctv_alerts">
                    <p class="menu-1 " style="text-align: center;">
                        <i class="fa fa-bullhorn"></i><br><br>
                        <span class="link_p text">Alerts</span></p>
                </a>
            </div>


              
            <div class="b10"  >
                <div class="navbar-brand link-menu" style="margin-right: 0;" id="openconfig">
                     <p class="menu-1 " style="text-align: center;">
                         <i class="fa fa-cog" aria-hidden="true"></i><br><br>
                        <span class="link_p text">Config <span class="caret"></span></span></p>

                        <ul id="configmenu" style="position: absolute; top: 64px; background: #212936 !important;    padding: 10px 0; box-shadow: 2px 2px 5px #000;border-radius: 8px; display: none;">
              <li><a href="/cctv_voi" style="padding: 10px 15px 0 15px;height: fit-content !important;" class="navbar-brand link-menu cctv_voi">
                    <p class="menu-1 " style="text-align: center;margin-bottom:0"">
                        <i style="width: 20px;" class="fa fa-car"></i><br><br>
                        <span class="link_p text">VOI Conf</span></p>
                </a></li>
                <hr style="width:90%;"/>
      <li><a href="/cctv_poi" style="padding: 10px 15px 0 15px;height: fit-content !important;" class="navbar-brand link-menu cctv_poi">
                    <p class="menu-1 " style="text-align: center;margin-bottom:0"">
                        <i style="width: 20px;" class="fa fa-user"></i><br><br>
                        <span class="link_p text">POI Conf</span></p>
                </a></li>
      
         
            </ul>
                </div>
            </div>

            
            </div>
            </div>


            

            
            `);


      //       <li>
      // <div class="b7">
      // <span onclick="openmodalSMTP();" class="navbar-brand link-menu">
      //                <p class="menu-1 " style="text-align: center;">
      //                    <i class="fa fa-cog"></i><br><br>
      //                    <span class="link_p text">Main Setup</span></p>
      //            </span>
      //            </div>
      // </li>

      // <div class="b7" onclick="openmodalSMTP();" >
      //           <span  class="navbar-brand link-menu">
      //               <p class="menu-1 " style="text-align: center;">
      //                   <i class="fa fa-cog"></i><br><br>
      //                   <span class="link_p text">Main Setup</span></p>
      //           </span>
      //       </div>

      // <div class="b8" >
      //           <a href="/cctv_location" class="navbar-brand link-menu cctv_location">
      //               <p class="menu-1 " style="text-align: center;">
      //                   <i class="fa fa-map-marker"></i><br><br>
      //                   <span class="link_p text">Add Location</span></p>
      //           </a>
      //       </div>

      // <li><a href="/userprofile"><i class="glyphicon glyphicon-cog">&nbsp;</i><span>Account Settings</span></a></li><hr></hr>
      // <li><a href="/userprofile"><i class="glyphicon glyphicon-cog">&nbsp;</i><span>Account Settings</span></a></li><hr></hr>
      $("#acc_setting").append(`
      <li style="padding: 0 20px;display: flex;">
      <div class="profilecircle">
  <p class="profilecircle-inner">${initials}</p>
</div>
        <div>
        <h3 style="font-size: 18px;margin-top: 9px;text-transform: capitalize;">${userprofiledata.name}</h3>
        <h6 style="text-transform: capitalize;">${userprofiledata.userlogin_status?.replaceAll("_"," ")}</h6>
        </div>
      </li>
      <li><a href="/userprofile"><i class="glyphicon glyphicon-cog">&nbsp;</i><span>Account Settings</span></a></li><hr>
      <li><div style="cursor: pointer;font-size: 16px;font-weight: 400;padding: 10px 19px;" class="logout" onclick="logout()"><i class="glyphicon glyphicon-off">&nbsp;</i><span>Logout</span></div></li>
                `);

       $(".ipadrw").append(`
      <a href="/cctv_map" class="homelogo home"
            ><img
              src="img/Raven-logo.png"
              height="60px"
              class="branding_logomob"
          /></a>
      `);

      $("#ipad_dropdown_menu").append(`
      <li>
                        <a href="/cctv_map" class="navbar-brand link-menum cctv_map">
                            <p class="menu-1">
                                <i class="fa fa-map-o" aria-hidden="true"></i>
                                <span class="link_p text">Map</span></p>

                        </a>
                    </li>
                    <li>
                    <a href="/cctv_dashboard" class="navbar-brand link-menum cctv_dashboard">
                    <p class="menu-1">
                        <i class="fa fa-th-large" aria-hidden="true"></i>
                        <span class="link_p text">Dashboard</span></p>

                </a>
                </li>
                  
               
                    <li>
                        <a href="/cctv_analytics" class="navbar-brand link-menum cctv_analytics">
                            <p class="menu-1">
                                <i class="fa fa-bar-chart" aria-hidden="true"></i>
                                <span class="link_p text">Analytics</span></p>
                        </a>
                    </li>
                   
                   
                   
                   
                   <li><a href="/cctv_alerts" class="navbar-brand link-menum cctv_alerts">
                    <p class="menu-1">
                        <i class="fa fa-bullhorn"></i>
                        <span class="link_p text">Alerts</span></p>
                </a></li>


                <li><a href="/cctv_voi" class="navbar-brand link-menum cctv_voi">
                    <p class="menu-1 ">
                        <i class="fa fa-car"></i>
                        <span class="link_p text">VOI Conf</span></p>
                </a></li>

      <li><a href="/cctv_poi" class="navbar-brand link-menum cctv_poi">
                    <p class="menu-1 ">
                        <i class="fa fa-user"></i>
                        <span class="link_p text">POI Conf</span></p>
                </a></li>




                    <li>
                        <a href="/userprofile" class="navbar-brand link-menum userprofile">
                            <p class="menu-1">
                                <i class="glyphicon glyphicon-cog select_clr"></i>
                                <span class="link_p text">Account Setting</span></p>

                        </a>
                    </li>

                    <li>
                        <a onclick="logout()" href="/" class="navbar-brand link-menum">
                            <p class="menu-1">
                                <i class="glyphicon glyphicon-off select_clr"></i>
                                <span class="link_p text">Logout</span></p>

                        </a>
                    </li>
                   
       `);

      // <li><a href="/userprofile" class="acipa"><i class="glyphicon glyphicon-cog select_clr">&nbsp;</i><span>Settings</span></a></li><hr></hr>
      $("#mobile_side_nav").append(`

      <li data-toggle="collapse" data-target=".sidebar">
                        <a href="/cctv_map" class="navbar-brand link-menum cctv_map">
                            <p class="menu-1">
                                <i class="fa fa-map-o" aria-hidden="true"></i>
                                <span class="link_p text">Map</span></p>

                        </a>
                    </li>
                    <li data-toggle="collapse" data-target=".sidebar">
                    <a href="/cctv_dashboard" class="navbar-brand link-menum cctv_dashboard">
                    <p class="menu-1">
                        <i class="fa fa-th-large" aria-hidden="true"></i>
                        <span class="link_p text">Dashboard</span></p>

                </a>
                </li>
                  
                <li data-toggle="collapse" data-target=".sidebar">
                  <a href="/cctv_addition" class="navbar-brand link-menum cctv_addition">
                    <p class="menu-1">
                        <i class="fa fa-plus-square-o" aria-hidden="true"></i>
                        <span class="link_p text">Add CCTV</span></p>

                </a>
                
                </li>


                <li data-toggle="collapse" data-target=".sidebar">
                   <a href="/cctv_location" class="navbar-brand link-menum cctv_location">
                    <p class="menu-1">
                        <i class="fa fa-map-marker"></i>
                        <span class="link_p text">Location</span></p>

                </a>
                
                
                </li>
                    <li data-toggle="collapse" data-target=".sidebar">
                        <a href="/cctv_analytics" class="navbar-brand link-menum cctv_analytics">
                            <p class="menu-1">
                                <i class="fa fa-bar-chart" aria-hidden="true"></i>
                                <span class="link_p text">Analytics</span></p>
                        </a>
                    </li>
                   
                   
                    <li data-toggle="collapse" data-target=".sidebar">
                        <a href="/cctv_users" class="navbar-brand link-menum cctv_users">
                            <p class="menu-1">
                                <i class="fa fa-users"></i>
                                <span class="link_p text">Users</span></p>

                        </a>
                    </li>
                    <li data-toggle="collapse" data-target=".sidebar">
                        <a href="/cctv_pendingalerts" class="navbar-brand link-menum cctv_pendingalerts">
                            <p class="menu-1">
                                <i class="fa fa-exclamation-circle" aria-hidden="true"></i>
                                <span class="link_p text">Pending Alerts</span></p>

                        </a>
                    </li>
                   <li data-toggle="collapse" data-target=".sidebar"><a href="/cctv_resolvedalerts" class="navbar-brand link-menum cctv_resolvedalerts">
                    <p class="menu-1">
                        <i class="fa fa-check-square-o"></i></i>
                        <span class="link_p text">Resolved alerts</span></p>
                </a></li>


                <li data-toggle="collapse" data-target=".sidebar"><a href="/cctv_voi" class="navbar-brand link-menum cctv_voi">
                    <p class="menu-1 ">
                        <i class="fa fa-car"></i>
                        <span class="link_p text">VOI Conf</span></p>
                </a></li>
      <li data-toggle="collapse" data-target=".sidebar"><a href="/cctv_poi" class="navbar-brand link-menum cctv_poi">
                    <p class="menu-1 ">
                        <i class="fa fa-user"></i>
                        <span class="link_p text">POI Conf</span></p>
                </a></li>
      <li data-toggle="collapse" data-target=".sidebar">
      <a onclick="openmodalSMTP();" class="navbar-brand link-menum">
                     <p class="menu-1 ">
                         <i class="fa fa-cog"></i>
                         <span class="link_p text">Main Setup</span></p>
                 </a>
      </li>




                    
                     <li>
                        <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
                            <div class="panel panel-default acpn">
                                <div class="panel-heading2" role="tab" id="headingThree">
                                    <a class="collapsed acipc" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                        <i class="glyphicon glyphicon-user select_clr" style="color: #767a81;"></i> &nbsp;Account Setting
                                    </a>
                                </div>
                                <div id="collapseThree" class="panel-collapse2 collapse" role="tabpanel" aria-labelledby="headingThree">
                                    <div class="panel-body">
                                        <ul id="tables-collapse" class="panel-collapse" aria-expanded="false" style="height: 0px;">
                                            <li><a href="/userprofile" class="acipa"><i class="glyphicon glyphicon-cog select_clr">&nbsp;</i><span>Profile</span></a></li>
                                            <li><a href="/logout" class="acipa"><i class="glyphicon glyphicon-off select_clr">&nbsp;</i><span>Logout</span></a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
      `);

      // <li
      //   data-toggle="collapse"
      //   data-target=".sidebar"
      //   onclick="openmodalSMTP();"
      // >
      //   <a href="#" class="navbar-brand link-menum">
      //     <p class="menu-1 ">
      //       <i class="fa fa-cog"></i>
      //       <span class="link_p text add_cameratext">Main Setup</span>
      //     </p>
      //   </a>
      // </li>;

      //  <li data-toggle="collapse" data-target=".sidebar">
      //    <a href="/cctv_location" class="navbar-brand link-menum cctv_location">
      //      <p class="menu-1 ">
      //        <i class="fa fa-map-marker"></i>
      //        <span class="link_p text add_cameratext">Add Location</span>
      //      </p>
      //    </a>
      //  </li>;

      // <li><a href="/userprofile" class="acipa"><i class="glyphicon glyphicon-cog select_clr">&nbsp;</i><span>Settings</span></a></li><hr></hr>

      {
        /* <li data-toggle="collapse" data-target=".sidebar">
  <a href="/cctv_location" class="navbar-brand link-menum cctv_location">
    <p class="menu-1 ">
      <i class="fa fa-map-marker"></i>
      <span class="link_p text add_cameratext">Add Location</span>
    </p>
  </a>
</li>; */
      }

      {
        /* <li><a href="/userprofile" class="acipa"><i class="glyphicon glyphicon-cog select_clr">&nbsp;</i><span>Settings</span></a></li><hr></hr> */
      }



      $("#openalerts").on("mouseover", function () {
        $("#alertsmenu").show()
      });
      $("#openalerts").on("mouseleave", function () {
        $("#alertsmenu").hide()
      });


      $("#openconfig").on("mouseover", function () {
        $("#configmenu").show();
      });
      $("#openconfig").on("mouseleave", function () {
        $("#configmenu").hide();
      });





      activeli();
    }else if (data == "security") {
      $("#sidebar").append(`
       <a href="/cctv_map" onclick="handlehomeclick()" id="site_logo" class="navbar-brand home">
                <img src="img/hr4logo.png" alt="" width="60%" class="branding_logo">
            </a>

             <div class="b2" >
                <a href="/cctv_map" style="padding-right: 15px !important;padding-left: 15px !important;" class="navbar-brand link-menu cctv_map">
                    <p class="menu-1 " style="text-align: center;">
                        <i class="fa fa-map-o" aria-hidden="true"></i><br><br>
                        <span class="link_p text">Map</span></p>

                </a>
            </div>

             <div class="b1" >
                <a href="/cctv_dashboard" class="navbar-brand link-menu cctv_dashboard">
                    <p class="menu-1 " style="text-align: center;">
                        <i class="fa fa-th-large" aria-hidden="true"></i>
                        <span class="link_p text">Dashboard</span></p>

                </a>
            </div>
            
             <div class="b6"  >
                <a href="/cctv_alerts" class="navbar-brand link-menu cctv_alerts">
                    <p class="menu-1 " style="text-align: center;">
                        <i class="fa fa-bullhorn"></i><br><br>
                        <span class="link_p text">Alerts</span></p>
                </a>
            </div>



            
            </div>
            </div>


            

            
            `);


      //       <li>
      // <div class="b7">
      // <span onclick="openmodalSMTP();" class="navbar-brand link-menu">
      //                <p class="menu-1 " style="text-align: center;">
      //                    <i class="fa fa-cog"></i><br><br>
      //                    <span class="link_p text">Main Setup</span></p>
      //            </span>
      //            </div>
      // </li>

      // <div class="b7" onclick="openmodalSMTP();" >
      //           <span  class="navbar-brand link-menu">
      //               <p class="menu-1 " style="text-align: center;">
      //                   <i class="fa fa-cog"></i><br><br>
      //                   <span class="link_p text">Main Setup</span></p>
      //           </span>
      //       </div>

      // <div class="b8" >
      //           <a href="/cctv_location" class="navbar-brand link-menu cctv_location">
      //               <p class="menu-1 " style="text-align: center;">
      //                   <i class="fa fa-map-marker"></i><br><br>
      //                   <span class="link_p text">Add Location</span></p>
      //           </a>
      //       </div>

      // <li><a href="/userprofile"><i class="glyphicon glyphicon-cog">&nbsp;</i><span>Account Settings</span></a></li><hr></hr>
      // <li><a href="/userprofile"><i class="glyphicon glyphicon-cog">&nbsp;</i><span>Account Settings</span></a></li><hr></hr>
      $("#acc_setting").append(`
      <li style="padding: 0 20px;display: flex;">
      <div class="profilecircle">
  <p class="profilecircle-inner">${initials}</p>
</div>
        <div>
        <h3 style="font-size: 18px;margin-top: 9px;text-transform: capitalize;">${userprofiledata.name}</h3>
        <h6 style="text-transform: capitalize;">${userprofiledata.userlogin_status?.replaceAll("_"," ")}</h6>
        </div>
      </li>
      <li><a href="/userprofile"><i class="glyphicon glyphicon-cog">&nbsp;</i><span>Account Settings</span></a></li><hr>
      <li><div style="cursor: pointer;font-size: 16px;font-weight: 400;padding: 10px 19px;" class="logout" onclick="logout()"><i class="glyphicon glyphicon-off">&nbsp;</i><span>Logout</span></div></li>
                `);

       $(".ipadrw").append(`
      <a href="/cctv_map" class="homelogo home"
            ><img
              src="img/Raven-logo.png"
              height="60px"
              class="branding_logomob"
          /></a>
      `);

      $("#ipad_dropdown_menu").append(`
      <li>
                        <a href="/cctv_map" class="navbar-brand link-menum cctv_map">
                            <p class="menu-1">
                                <i class="fa fa-map-o" aria-hidden="true"></i>
                                <span class="link_p text">Map</span></p>

                        </a>
                    </li>
                    <li>
                    <a href="/cctv_dashboard" class="navbar-brand link-menum cctv_dashboard">
                    <p class="menu-1">
                        <i class="fa fa-th-large" aria-hidden="true"></i>
                        <span class="link_p text">Dashboard</span></p>

                </a>
                </li>
               
                    <li>
                        <a href="/cctv_alerts" class="navbar-brand link-menum cctv_alerts">
                            <p class="menu-1">
                                <i class="fa fa-bullhorn"></i>
                                <span class="link_p text">Alerts</span></p>

                        </a>
                    </li>

                    <li>
                        <a href="/userprofile" class="navbar-brand link-menum userprofile">
                            <p class="menu-1">
                                <i class="glyphicon glyphicon-cog select_clr"></i>
                                <span class="link_p text">Account Setting</span></p>

                        </a>
                    </li>

                    <li>
                        <a onclick="logout()" href="/" class="navbar-brand link-menum">
                            <p class="menu-1">
                                <i class="glyphicon glyphicon-off select_clr"></i>
                                <span class="link_p text">Logout</span></p>

                        </a>
                    </li>
                   
       `);

      // <li><a href="/userprofile" class="acipa"><i class="glyphicon glyphicon-cog select_clr">&nbsp;</i><span>Settings</span></a></li><hr></hr>
      $("#mobile_side_nav").append(`

      <li data-toggle="collapse" data-target=".sidebar">
                        <a href="/cctv_map" class="navbar-brand link-menum cctv_map">
                            <p class="menu-1">
                                <i class="fa fa-map-o" aria-hidden="true"></i>
                                <span class="link_p text">Map</span></p>

                        </a>
                    </li>
                    <li data-toggle="collapse" data-target=".sidebar">
                    <a href="/cctv_dashboard" class="navbar-brand link-menum cctv_dashboard">
                    <p class="menu-1">
                        <i class="fa fa-th-large" aria-hidden="true"></i>
                        <span class="link_p text">Dashboard</span></p>

                </a>
                </li>
                  
                <li data-toggle="collapse" data-target=".sidebar">
                  <a href="/cctv_addition" class="navbar-brand link-menum cctv_addition">
                    <p class="menu-1">
                        <i class="fa fa-plus-square-o" aria-hidden="true"></i>
                        <span class="link_p text">Add CCTV</span></p>

                </a>
                
                </li>


                <li data-toggle="collapse" data-target=".sidebar">
                   <a href="/cctv_location" class="navbar-brand link-menum cctv_location">
                    <p class="menu-1">
                        <i class="fa fa-map-marker"></i>
                        <span class="link_p text">Location</span></p>

                </a>
                
                
                </li>
                    <li data-toggle="collapse" data-target=".sidebar">
                        <a href="/cctv_analytics" class="navbar-brand link-menum cctv_analytics">
                            <p class="menu-1">
                                <i class="fa fa-bar-chart" aria-hidden="true"></i>
                                <span class="link_p text">Analytics</span></p>
                        </a>
                    </li>
                   
                   
                    <li data-toggle="collapse" data-target=".sidebar">
                        <a href="/cctv_users" class="navbar-brand link-menum cctv_users">
                            <p class="menu-1">
                                <i class="fa fa-users"></i>
                                <span class="link_p text">Users</span></p>

                        </a>
                    </li>
                    <li data-toggle="collapse" data-target=".sidebar">
                        <a href="/cctv_pendingalerts" class="navbar-brand link-menum cctv_pendingalerts">
                            <p class="menu-1">
                                <i class="fa fa-exclamation-circle" aria-hidden="true"></i>
                                <span class="link_p text">Pending Alerts</span></p>

                        </a>
                    </li>
                   <li data-toggle="collapse" data-target=".sidebar"><a href="/cctv_resolvedalerts" class="navbar-brand link-menum cctv_resolvedalerts">
                    <p class="menu-1">
                        <i class="fa fa-check-square-o"></i></i>
                        <span class="link_p text">Resolved alerts</span></p>
                </a></li>


                <li data-toggle="collapse" data-target=".sidebar"><a href="/cctv_voi" class="navbar-brand link-menum cctv_voi">
                    <p class="menu-1 ">
                        <i class="fa fa-car"></i>
                        <span class="link_p text">VOI Conf</span></p>
                </a></li>
      <li data-toggle="collapse" data-target=".sidebar"><a href="/cctv_poi" class="navbar-brand link-menum cctv_poi">
                    <p class="menu-1 ">
                        <i class="fa fa-user"></i>
                        <span class="link_p text">POI Conf</span></p>
                </a></li>
      <li data-toggle="collapse" data-target=".sidebar">
      <a onclick="openmodalSMTP();" class="navbar-brand link-menum">
                     <p class="menu-1 ">
                         <i class="fa fa-cog"></i>
                         <span class="link_p text">Main Setup</span></p>
                 </a>
      </li>




                    
                     <li>
                        <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
                            <div class="panel panel-default acpn">
                                <div class="panel-heading2" role="tab" id="headingThree">
                                    <a class="collapsed acipc" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                        <i class="glyphicon glyphicon-user select_clr" style="color: #767a81;"></i> &nbsp;Account Setting
                                    </a>
                                </div>
                                <div id="collapseThree" class="panel-collapse2 collapse" role="tabpanel" aria-labelledby="headingThree">
                                    <div class="panel-body">
                                        <ul id="tables-collapse" class="panel-collapse" aria-expanded="false" style="height: 0px;">
                                            <li><a href="/userprofile" class="acipa"><i class="glyphicon glyphicon-cog select_clr">&nbsp;</i><span>Profile</span></a></li>
                                            <li><a href="/logout" class="acipa"><i class="glyphicon glyphicon-off select_clr">&nbsp;</i><span>Logout</span></a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
      `);

      // <li
      //   data-toggle="collapse"
      //   data-target=".sidebar"
      //   onclick="openmodalSMTP();"
      // >
      //   <a href="#" class="navbar-brand link-menum">
      //     <p class="menu-1 ">
      //       <i class="fa fa-cog"></i>
      //       <span class="link_p text add_cameratext">Main Setup</span>
      //     </p>
      //   </a>
      // </li>;

      //  <li data-toggle="collapse" data-target=".sidebar">
      //    <a href="/cctv_location" class="navbar-brand link-menum cctv_location">
      //      <p class="menu-1 ">
      //        <i class="fa fa-map-marker"></i>
      //        <span class="link_p text add_cameratext">Add Location</span>
      //      </p>
      //    </a>
      //  </li>;

      // <li><a href="/userprofile" class="acipa"><i class="glyphicon glyphicon-cog select_clr">&nbsp;</i><span>Settings</span></a></li><hr></hr>

      {
        /* <li data-toggle="collapse" data-target=".sidebar">
  <a href="/cctv_location" class="navbar-brand link-menum cctv_location">
    <p class="menu-1 ">
      <i class="fa fa-map-marker"></i>
      <span class="link_p text add_cameratext">Add Location</span>
    </p>
  </a>
</li>; */
      }

      {
        /* <li><a href="/userprofile" class="acipa"><i class="glyphicon glyphicon-cog select_clr">&nbsp;</i><span>Settings</span></a></li><hr></hr> */
      }



      $("#openalerts").on("mouseover", function () {
        $("#alertsmenu").show()
      });
      $("#openalerts").on("mouseleave", function () {
        $("#alertsmenu").hide()
      });


      $("#openconfig").on("mouseover", function () {
        $("#configmenu").show();
      });
      $("#openconfig").on("mouseleave", function () {
        $("#configmenu").hide();
      });





      activeli();
    }else if (data == "helpdesk") {
      $("#sidebar").append(`
       <a href="/cctv_map" onclick="handlehomeclick()" id="site_logo" class="navbar-brand home">
                <img src="img/hr4logo.png" alt="" width="60%" class="branding_logo">
            </a>

             <div class="b2" >
                <a href="/cctv_map" style="padding-right: 15px !important;padding-left: 15px !important;" class="navbar-brand link-menu cctv_map">
                    <p class="menu-1 " style="text-align: center;">
                        <i class="fa fa-map-o" aria-hidden="true"></i><br><br>
                        <span class="link_p text">Map</span></p>

                </a>
            </div>

             <div class="b1" >
                <a href="/cctv_dashboard" class="navbar-brand link-menu cctv_dashboard">
                    <p class="menu-1 " style="text-align: center;">
                        <i class="fa fa-th-large" aria-hidden="true"></i>
                        <span class="link_p text">Dashboard</span></p>

                </a>
            </div>

            <div class="b3" >
                           <a href="/cctv_pendingalerts" class="navbar-brand link-menu cctv_pendingalerts">
                    <p class="menu-1 " style="text-align: center;">
                      <i style="width: 20px;" class="fa fa-exclamation-circle" aria-hidden="true"></i></i><br><br>
                        <span class="link_p text">Pending alerts</span></p>

                </a>
                        </div>
                    
            
            <div class="b4" >
                <a href="/cctv_resolvedalerts" class="navbar-brand link-menu cctv_resolvedalerts">
                    <p class="menu-1 " style="text-align: center;">
                      <i class="fa fa-check-square-o"></i></i><br><br>
                        <span class="link_p text">Resolved alerts</span></p>

                </a>
            </div>



            
            </div>
            </div>


            

            
            `);


      //       <li>
      // <div class="b7">
      // <span onclick="openmodalSMTP();" class="navbar-brand link-menu">
      //                <p class="menu-1 " style="text-align: center;">
      //                    <i class="fa fa-cog"></i><br><br>
      //                    <span class="link_p text">Main Setup</span></p>
      //            </span>
      //            </div>
      // </li>

      // <div class="b7" onclick="openmodalSMTP();" >
      //           <span  class="navbar-brand link-menu">
      //               <p class="menu-1 " style="text-align: center;">
      //                   <i class="fa fa-cog"></i><br><br>
      //                   <span class="link_p text">Main Setup</span></p>
      //           </span>
      //       </div>

      // <div class="b8" >
      //           <a href="/cctv_location" class="navbar-brand link-menu cctv_location">
      //               <p class="menu-1 " style="text-align: center;">
      //                   <i class="fa fa-map-marker"></i><br><br>
      //                   <span class="link_p text">Add Location</span></p>
      //           </a>
      //       </div>

      // <li><a href="/userprofile"><i class="glyphicon glyphicon-cog">&nbsp;</i><span>Account Settings</span></a></li><hr></hr>
      // <li><a href="/userprofile"><i class="glyphicon glyphicon-cog">&nbsp;</i><span>Account Settings</span></a></li><hr></hr>
      $("#acc_setting").append(`
      <li style="padding: 0 20px;display: flex;">
      <div class="profilecircle">
  <p class="profilecircle-inner">${initials}</p>
</div>
        <div>
        <h3 style="font-size: 18px;margin-top: 9px;text-transform: capitalize;">${userprofiledata.name}</h3>
        <h6 style="text-transform: capitalize;">${userprofiledata.userlogin_status?.replaceAll("_"," ")}</h6>
        </div>
      </li>
      <li><a href="/userprofile"><i class="glyphicon glyphicon-cog">&nbsp;</i><span>Account Settings</span></a></li><hr>
      <li><div style="cursor: pointer;font-size: 16px;font-weight: 400;padding: 10px 19px;" class="logout" onclick="logout()"><i class="glyphicon glyphicon-off">&nbsp;</i><span>Logout</span></div></li>
                `);

       $(".ipadrw").append(`
      <a href="/cctv_map" class="homelogo home"
            ><img
              src="img/Raven-logo.png"
              height="60px"
              class="branding_logomob"
          /></a>
      `);

      $("#ipad_dropdown_menu").append(`
      <li>
                        <a href="/cctv_map" class="navbar-brand link-menum cctv_map">
                            <p class="menu-1">
                                <i class="fa fa-map-o" aria-hidden="true"></i>
                                <span class="link_p text">Map</span></p>

                        </a>
                    </li>
                    <li>
                    <a href="/cctv_dashboard" class="navbar-brand link-menum cctv_dashboard">
                    <p class="menu-1">
                        <i class="fa fa-th-large" aria-hidden="true"></i>
                        <span class="link_p text">Dashboard</span></p>

                </a>
                </li>
                  
                    <li>
                        <a href="/cctv_pendingalerts" class="navbar-brand link-menum cctv_pendingalerts">
                            <p class="menu-1">
                                <i class="fa fa-exclamation-circle" aria-hidden="true"></i>
                                <span class="link_p text">Pending Alerts</span></p>

                        </a>
                    </li>
                   <li><a href="/cctv_resolvedalerts" class="navbar-brand link-menum cctv_resolvedalerts">
                    <p class="menu-1">
                        <i class="fa fa-check-square-o"></i></i>
                        <span class="link_p text">Resolved alerts</span></p>
                </a></li>



                    <li>
                        <a href="/userprofile" class="navbar-brand link-menum userprofile">
                            <p class="menu-1">
                                <i class="glyphicon glyphicon-cog select_clr"></i>
                                <span class="link_p text">Account Setting</span></p>

                        </a>
                    </li>

                    <li>
                        <a onclick="logout()" href="/" class="navbar-brand link-menum">
                            <p class="menu-1">
                                <i class="glyphicon glyphicon-off select_clr"></i>
                                <span class="link_p text">Logout</span></p>

                        </a>
                    </li>
                   
       `);

      // <li><a href="/userprofile" class="acipa"><i class="glyphicon glyphicon-cog select_clr">&nbsp;</i><span>Settings</span></a></li><hr></hr>
      $("#mobile_side_nav").append(`

      <li data-toggle="collapse" data-target=".sidebar">
                        <a href="/cctv_map" class="navbar-brand link-menum cctv_map">
                            <p class="menu-1">
                                <i class="fa fa-map-o" aria-hidden="true"></i>
                                <span class="link_p text">Map</span></p>

                        </a>
                    </li>
                    <li data-toggle="collapse" data-target=".sidebar">
                    <a href="/cctv_dashboard" class="navbar-brand link-menum cctv_dashboard">
                    <p class="menu-1">
                        <i class="fa fa-th-large" aria-hidden="true"></i>
                        <span class="link_p text">Dashboard</span></p>

                </a>
                </li>
                  
                <li data-toggle="collapse" data-target=".sidebar">
                  <a href="/cctv_addition" class="navbar-brand link-menum cctv_addition">
                    <p class="menu-1">
                        <i class="fa fa-plus-square-o" aria-hidden="true"></i>
                        <span class="link_p text">Add CCTV</span></p>

                </a>
                
                </li>


                <li data-toggle="collapse" data-target=".sidebar">
                   <a href="/cctv_location" class="navbar-brand link-menum cctv_location">
                    <p class="menu-1">
                        <i class="fa fa-map-marker"></i>
                        <span class="link_p text">Location</span></p>

                </a>
                
                
                </li>
                    <li data-toggle="collapse" data-target=".sidebar">
                        <a href="/cctv_analytics" class="navbar-brand link-menum cctv_analytics">
                            <p class="menu-1">
                                <i class="fa fa-bar-chart" aria-hidden="true"></i>
                                <span class="link_p text">Analytics</span></p>
                        </a>
                    </li>
                   
                   
                    <li data-toggle="collapse" data-target=".sidebar">
                        <a href="/cctv_users" class="navbar-brand link-menum cctv_users">
                            <p class="menu-1">
                                <i class="fa fa-users"></i>
                                <span class="link_p text">Users</span></p>

                        </a>
                    </li>
                    <li data-toggle="collapse" data-target=".sidebar">
                        <a href="/cctv_pendingalerts" class="navbar-brand link-menum cctv_pendingalerts">
                            <p class="menu-1">
                                <i class="fa fa-exclamation-circle" aria-hidden="true"></i>
                                <span class="link_p text">Pending Alerts</span></p>

                        </a>
                    </li>
                   <li data-toggle="collapse" data-target=".sidebar"><a href="/cctv_resolvedalerts" class="navbar-brand link-menum cctv_resolvedalerts">
                    <p class="menu-1">
                        <i class="fa fa-check-square-o"></i></i>
                        <span class="link_p text">Resolved alerts</span></p>
                </a></li>


                <li data-toggle="collapse" data-target=".sidebar"><a href="/cctv_voi" class="navbar-brand link-menum cctv_voi">
                    <p class="menu-1 ">
                        <i class="fa fa-car"></i>
                        <span class="link_p text">VOI Conf</span></p>
                </a></li>
      <li data-toggle="collapse" data-target=".sidebar"><a href="/cctv_poi" class="navbar-brand link-menum cctv_poi">
                    <p class="menu-1 ">
                        <i class="fa fa-user"></i>
                        <span class="link_p text">POI Conf</span></p>
                </a></li>
      <li data-toggle="collapse" data-target=".sidebar">
      <a onclick="openmodalSMTP();" class="navbar-brand link-menum">
                     <p class="menu-1 ">
                         <i class="fa fa-cog"></i>
                         <span class="link_p text">Main Setup</span></p>
                 </a>
      </li>




                    
                     <li>
                        <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
                            <div class="panel panel-default acpn">
                                <div class="panel-heading2" role="tab" id="headingThree">
                                    <a class="collapsed acipc" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                        <i class="glyphicon glyphicon-user select_clr" style="color: #767a81;"></i> &nbsp;Account Setting
                                    </a>
                                </div>
                                <div id="collapseThree" class="panel-collapse2 collapse" role="tabpanel" aria-labelledby="headingThree">
                                    <div class="panel-body">
                                        <ul id="tables-collapse" class="panel-collapse" aria-expanded="false" style="height: 0px;">
                                            <li><a href="/userprofile" class="acipa"><i class="glyphicon glyphicon-cog select_clr">&nbsp;</i><span>Profile</span></a></li>
                                            <li><a href="/logout" class="acipa"><i class="glyphicon glyphicon-off select_clr">&nbsp;</i><span>Logout</span></a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
      `);

      // <li
      //   data-toggle="collapse"
      //   data-target=".sidebar"
      //   onclick="openmodalSMTP();"
      // >
      //   <a href="#" class="navbar-brand link-menum">
      //     <p class="menu-1 ">
      //       <i class="fa fa-cog"></i>
      //       <span class="link_p text add_cameratext">Main Setup</span>
      //     </p>
      //   </a>
      // </li>;

      //  <li data-toggle="collapse" data-target=".sidebar">
      //    <a href="/cctv_location" class="navbar-brand link-menum cctv_location">
      //      <p class="menu-1 ">
      //        <i class="fa fa-map-marker"></i>
      //        <span class="link_p text add_cameratext">Add Location</span>
      //      </p>
      //    </a>
      //  </li>;

      // <li><a href="/userprofile" class="acipa"><i class="glyphicon glyphicon-cog select_clr">&nbsp;</i><span>Settings</span></a></li><hr></hr>

      {
        /* <li data-toggle="collapse" data-target=".sidebar">
  <a href="/cctv_location" class="navbar-brand link-menum cctv_location">
    <p class="menu-1 ">
      <i class="fa fa-map-marker"></i>
      <span class="link_p text add_cameratext">Add Location</span>
    </p>
  </a>
</li>; */
      }

      {
        /* <li><a href="/userprofile" class="acipa"><i class="glyphicon glyphicon-cog select_clr">&nbsp;</i><span>Settings</span></a></li><hr></hr> */
      }



      $("#openalerts").on("mouseover", function () {
        $("#alertsmenu").show()
      });
      $("#openalerts").on("mouseleave", function () {
        $("#alertsmenu").hide()
      });


      $("#openconfig").on("mouseover", function () {
        $("#configmenu").show();
      });
      $("#openconfig").on("mouseleave", function () {
        $("#configmenu").hide();
      });





      activeli();
    }







    
  $( window ).unbind("resize").on("resize",function() {
    // $(".panel-collapse").addClass("in")
  })


  
  })
 

  // $("#side-nav").append(
  //   '<li id="configSMTP" class="">\n' +
  //     '                    <a style="cursor: pointer" onclick="openmodalSMTP();"><i class="fa fa-gear"></i> <span class="name">Settings</span></a>\n' +
  //     "                </li>"
  // );

  $.getScript("js/completeScript/cctv_configuration.js", function () {});
});

/**
 * Util functions
 */

function testData(stream_names, points_count) {
  var now = new Date().getTime(),
    day = 1000 * 60 * 60 * 24, //milliseconds
    days_ago_count = 60,
    days_ago = days_ago_count * day,
    days_ago_date = now - days_ago,
    points_count = points_count || 45, //less for better performance
    day_per_point = days_ago_count / points_count;
  return stream_layers(stream_names.length, points_count, 0.1).map(function (
    data,
    i
  ) {
    return {
      key: stream_names[i],
      values: data.map(function (d, j) {
        return {
          x: days_ago_date + d.x * day * day_per_point,
          y: Math.floor(d.y * 100), //just a coefficient
        };
      }),
    };
  });
}

/* Inspired by Lee Byron's test data generator. */
function stream_layers(n, m, o) {
  if (arguments.length < 3) o = 0;
  function bump(a) {
    var x = 1 / (0.1 + Math.random()),
      y = 2 * Math.random() - 0.5,
      z = 10 / (0.1 + Math.random());
    for (var i = 0; i < m; i++) {
      var w = (i / m - y) * z;
      a[i] += x * Math.exp(-w * w);
    }
  }
  return d3.range(n).map(function () {
    var a = [],
      i;
    for (i = 0; i < m; i++) a[i] = o + o * Math.random();
    for (i = 0; i < 5; i++) bump(a);
    return a.map(stream_index);
  });
}

function stream_index(d, i) {
  return { x: i, y: Math.max(0, d) };
}





function cameraAddition(data){
  $("."+ data.location +"_location > ul").append(`
  <li id="${data.cam_name}" class="act"><a href="/cctv_monitoring" style="cursor: pointer; position: relative; overflow-wrap: break-word;"><i class="fa fa-circle text-success" style="color: rgb(30, 234, 18); position: absolute; left: 10%; top: 14%; font-size: 9px;"></i>${data.cam_name}</a></li>
  `)



  document.getElementById(data.cam_name).addEventListener(
                "click",
                function (e) {
                  // $(".navbar-dark a").removeClass("active-li");
                  // $(".cctv_monitoring a").addClass("active-li");
                  if (
                    window.location.pathname == "/cctv_monitoring" ||
                    window.location.pathname == "/"
                  ) {
                    // myfun()
                    localStorage.setItem("camName-DXB", data.cam_name);
                    var abc = "#" + data.cam_name;
                    $(".act").removeClass("active");
                    $(abc).addClass("active");
                    // clearInterval(intervalchart);
                    updateCamData(data.cam_name);
                  } else {
                    localStorage.setItem("camName-DXB", data.cam_name);
                    updateCamData(localStorage.getItem("camName-DXB"));
                    // window.location.href="/cam"
                    // getCamName();
                  }
                },
                false
              );


  var prevCamDetails = JSON.parse(localStorage.getItem("getcam"))
  var locationData = prevCamDetails.filter(location=>location.name == data.location)
  
  var newCamDetails = prevCamDetails.filter((city)=>{
    city.location.filter((location)=>{
      var cameralist = [...location.camera, data]
      location.camera = cameralist
      return location.name == data.location
    })
    return true
  })

  localStorage.setItem("getcam", JSON.stringify(newCamDetails))
}

function cameraDeletion(data){
  $("li#"+data.cam_name).remove()

  // var prevCamDetails = JSON.parse(localStorage.getItem("getcam"))
  // var locationData = prevCamDetails.filter(location=>location.name == data.location)
  
  // console.log(prevCamDetails.filter((city)=>{
  //   console.log(    city.location.filter((location)=>{
  //     var cameralist = [...location.camera, data]
  //     console.log(cameralist, data)
  //     location.camera = cameralist
  //     return location.name == data.location
  //   })
  //   )
  //   return true
  // }))
}


function imageerror(e) {
  e.src = "img/monitoringdisabled.png";
  e.title = "No Thumbnail";
}
var duration_parameter, count_parameter
function getLiveCams(){
  
  
  
     var settings = {
    async: true,
    crossDomain: true,
    url: "/get_live_cams?service=ALL",
    method: "GET",
    headers: {
      "cache-control": "no-cache",
    },
  };
  $("#camera-loading-spinner").show();
  $.ajax(settings).done(function (response) {
    

    var selectedCameraName = localStorage.getItem("camName-DXB")
 
    if(selectedCameraName == null){
      selectedCameraName = response.live_cams[0]?.camera[0]?.cam_name 
      localStorage.setItem("camName-DXB", selectedCameraName)
        function getScripts(scripts, callback) {
            var progress = 0;
            scripts.forEach(function (script) {
              $.getScript(script, function () {
                if (++progress == scripts.length) callback();
              });
            });
          }
      getScripts(["js/cctv_monitoring.js"],function(){
        updateCamData(selectedCameraName)
      })
    }



    $("#camera-loading-spinner").hide();
    if (response.Failure) {
      Messenger().post({
        message: response.Failure,
        type: "error",
        showCloseButton: true,
      });
    } else {
      if (response.live_cams.length > 0) {
        duration_parameter = response.duration_parameter
        count_parameter = response.count_parameter
        
        localStorage.setItem("getcam", JSON.stringify([{city: response.live_cams[0].camera[0].city  ,location: response.live_cams}]));
        var side_bar_dict = [{city: response.live_cams[0].camera[0].city  ,location: response.live_cams}];
        var li_DXB;
        var li_ul_li_a_DXB;
        var li_ul_li_ul_DXB;
        var li_ul_li_ul_li_DXB;
        var li_ul_li_ul_li_a_DXB;
        var live_icon;
        var countTest = 0;
        var counttest1 = 0;
        for (i = 0; i < side_bar_dict.length; i++) {
          countTest += 1;
          li_DXB = document.createElement("li");
          li_DXB.className = "panel" ;
          // var li_a_DXB = document.createElement('a');
          // li_a_DXB.className = "accordion-toggle ";
          // li_a_DXB.setAttribute('data-toggle', "collapse");
          // li_a_DXB.setAttribute('data-parent', "#menu-levels-collapse");
          // li_a_DXB.setAttribute('href',"#sub-menu-"+countTest+"-collapse");
          // li_a_DXB.textContent =side_bar_dict[i].city;
          // li_DXB.appendChild(li_a_DXB);
          var li_ul_DXB = document.createElement("ul");
          li_ul_DXB.id = "sub-menu-" + countTest + "-collapse";
          li_ul_DXB.className = "panel-collapse  in";
          for (j = 0; j < side_bar_dict[i].location.length; j++) {
            var li_ul_li_DXB = document.createElement("li");
            li_ul_li_DXB.className = "panel";
            li_ul_li_DXB.className += " paneldata";
            li_ul_li_DXB.className += " " + side_bar_dict[i].location[j].name+"_location";
            $(li_ul_li_DXB).append('<i class="fa fa-th" style= "float: right; position: absolute;top:4px;right: -5%;font-size: 11px; cursor:pointer" title="9*9 Layout" name="'+ side_bar_dict[i].location[j].name+'" onclick="Layoutfunction(this);"></i>')
            
            li_ul_li_DXB.setAttribute(
              "data",
              JSON.stringify({
                location: side_bar_dict[i].location[j].name,
                camera: [
                  ...side_bar_dict[i].location[j].camera.map(
                    (camera) => camera.cam_name
                  ),
                ],
              })
            );
            counttest1 += 1;
            li_ul_li_ul_DXB = document.createElement("ul");

            li_ul_li_ul_DXB.id = "sub-menu-1" + counttest1 + "-collapse";
            li_ul_li_a_DXB = document.createElement("div");
            if(selectedCameraName){
              if(selectedCameraName == ""){
                if(j == 0){
                li_ul_li_ul_DXB.className = "panel-collapse in";
                li_ul_li_a_DXB.className = "accordion-toggle";
              }else{
                li_ul_li_ul_DXB.className = "panel-collapse collapse";
                li_ul_li_a_DXB.className = "accordion-toggle collapsed";
              }
              }else{
                if(side_bar_dict[i].location[j].camera.find(cam=>cam.cam_name == selectedCameraName)){
                li_ul_li_ul_DXB.className = "panel-collapse in";
                li_ul_li_a_DXB.className = "accordion-toggle";
              }else{
                li_ul_li_ul_DXB.className = "panel-collapse collapse";
                li_ul_li_a_DXB.className = "accordion-toggle collapsed";
              }
              }
            }else{
              if(j == 0){
                li_ul_li_ul_DXB.className = "panel-collapse in";
                li_ul_li_a_DXB.className = "accordion-toggle";
              }else{
                li_ul_li_ul_DXB.className = "panel-collapse collapse";
                li_ul_li_a_DXB.className = "accordion-toggle collapsed";
              }

            }
            li_ul_li_a_DXB.setAttribute("data-toggle", "collapse");
            li_ul_li_a_DXB.setAttribute(
              "data-parent",
              "#sub-menu-" + countTest + "-collapse"
            );
            li_ul_li_a_DXB.setAttribute(
              "href",
              "#sub-menu-1" + counttest1 + "-collapse"
            );
            li_ul_li_a_DXB.style.cursor = "pointer";
            li_ul_li_a_DXB.textContent = side_bar_dict[i].location[j].name;
            li_ul_li_a_DXB.style.paddingLeft = "30px;";
            
            // li_ul_li_a_DXB.addEventListener(
            //   "click",
            //   function (f) {
            //     if (window.location.pathname == "/cctv_vms") {
            // myfun()
            // localStorage.setItem('camName-DXB',e.target.innerText)
            // var abc='#'+e.target.innerText;
            // $('.act').removeClass('active')
            // $(abc).addClass('active');
            // clearInterval(intervalchart);
            // updateCamData(e.target.innerText);
            //   window.location.href = "/cctv_vms";
            // } else {
            //   window.location.href = "/cctv_vms";
            // localStorage.setItem('camName-DXB',e.target.innerText)
            // updateCamData(localStorage.getItem('camName-DXB'));
            // window.location.href="/cam"
            // getCamName();
            //     }
            //   },
            //   false
            // );
            li_ul_li_DXB.appendChild(li_ul_li_a_DXB);
            li_ul_DXB.appendChild(li_ul_li_DXB);
            li_DXB.appendChild(li_ul_DXB);
            for (k = 0; k < side_bar_dict[i].location[j].camera.length; k++) {
              li_ul_li_ul_li_DXB = document.createElement("li");
              li_ul_li_ul_li_DXB.id =
                side_bar_dict[i].location[j].camera[k].cam_name;
              li_ul_li_ul_li_DXB.className = "act";
              li_ul_li_ul_li_DXB.addEventListener(
                "click",
                function (e) {
                  // $(".navbar-dark a").removeClass("active-li");
                  // $(".cctv_monitoring a").addClass("active-li");
                  if (
                    window.location.pathname == "/cctv_monitoring" ||
                    window.location.pathname == "/"
                  ) {
                    // myfun()
                    localStorage.setItem("camName-DXB", e.target.innerText);
                    var abc = "#" + e.target.innerText;
                    $(".act").removeClass("active");
                    $(abc).addClass("active");
                    // clearInterval(intervalchart);
                    updateCamData(e.target.innerText);
                  } else {
                    localStorage.setItem("camName-DXB", e.target.innerText);
                    updateCamData(localStorage.getItem("camName-DXB"));
                    // window.location.href="/cam"
                    // getCamName();
                  }
                },
                false
              );
              $(li_ul_DXB).attr(
                "title",
                side_bar_dict[i].city +
                  ", " +
                  side_bar_dict[i].location[j].camera[k].state
              );
              live_icon = document.createElement("i");
              live_icon.className = "fa fa-circle text-success";
              live_icon.style.color = "#1eea12";
              live_icon.style.position = "absolute";
              live_icon.style.left = "10%";
              live_icon.style.top = "14%";
              live_icon.style.fontSize = "9px";
              li_ul_li_ul_li_a_DXB = document.createElement("a");
              li_ul_li_ul_li_a_DXB.style.cursor = "pointer";
              li_ul_li_ul_li_a_DXB.href = "/cctv_monitoring";
              li_ul_li_ul_li_a_DXB.addEventListener(
                "dragstart",
                function (event) {
                  event.dataTransfer.setData("text", $(this).text());
                }
              );
              li_ul_li_ul_li_a_DXB.addEventListener("click", () => {
               $(".active-li").removeClass("active-li");
               $(".cctv_monitoring").addClass("active-li");
              });
              li_ul_li_ul_li_a_DXB.style.position = "relative";
              li_ul_li_ul_li_a_DXB.style.wordWrap = "break-word";
              li_ul_li_ul_li_a_DXB.style.paddingLeft = "45px;";
              li_ul_li_ul_li_a_DXB.textContent =
                side_bar_dict[i].location[j].camera[k].cam_name;
              li_ul_li_ul_li_a_DXB.insertBefore(
                live_icon,
                li_ul_li_ul_li_a_DXB.firstChild
              );
              // li_ul_li_ul_li_a_DXB.appendChild(live_icon);
              li_ul_li_ul_li_DXB.appendChild(li_ul_li_ul_li_a_DXB);
              li_ul_li_ul_DXB.appendChild(li_ul_li_ul_li_DXB);
              li_ul_li_DXB.appendChild(li_ul_li_ul_DXB);
              li_ul_DXB.appendChild(li_ul_li_DXB);
              li_DXB.appendChild(li_ul_DXB);
            }
          }

          



          if($($("#side-nav").children()[0]).prop("tagName") == "P"){

            $("#side-nav").empty().append(
        `<li class="panel">
                          <ul id="menu-levels-collapse" class="panel-collapse collapse in">
                          </ul>
                      </li>`
                      )
          }

          $("#menu-levels-collapse").empty();
          $("#menu-levels-collapse").append(li_DXB);
          
        }
        var abc = "#" + localStorage.getItem("camName-DXB");

        $(".act").removeClass("active");

        if (
          window.location.pathname == "/cctv_monitoring" ||
          window.location.pathname == "/"
        ) {
          $(abc).addClass("active");
        }

        //
        // updateCamData(abc);
        // }

        if (abc == "#null") {
          $("#prioritesTab").empty();
          $("#prioritesTab").append(
            '<li class="su" ><a href="#NoAlerts" class="NoAlerts" data-toggle="tab">Camera Alerts</a></li>'
          );

          $("#prioritesTabContent").empty();
          $("#prioritesTabContent").append(
            ' <div class="tab-pane fade " id="NoAlerts">\n' +
              '                                                <div class="row">\n' +
              '                                                    <div id="" class="tab-pane active clearfix">\n' +
              '                                                        <div id="feedP2" class="feed">\n' +
              '                                                            <ul class="news-list" id="cam-Alerts-No">\n' +
              "                                                            </ul>\n" +
              "                                                        </div>\n" +
              "                                                    </div>\n" +
              "                                                </div>\n" +
              "                                            </div>"
          );
          $("#cam-Alerts-No").empty();
          $("#cam-Alerts-No").append(
            '<li id="alertsDXBA" > <div class="position" style="text-align:center ">No Alerts Found</div> </li>'
          );
          $("#prioritesTab li:first").addClass("active");
          $("#prioritesTabContent div:first").addClass("in active");
        }
      } else {
        // $("#prioritesTabContent").append('<li id="alertsDXBA" > <div class="position" style="text-align:center ">No Alerts Found</div> </li>');

        localStorage.removeItem("camName-DXB");

        if (
          window.location.pathname == "/cctv_monitoring" ||
          window.location.pathname == "/"
        ) {
          Messenger().post({
            message: "No Live Camera Found",
            type: "error",
            showCloseButton: true,
          });
          $("#side-nav").empty();
          $("#side-nav").append(`
          <p style="
    text-align: center;
">No Live Camera</p>`);
        } else {
          $("#side-nav").empty();
          $("#side-nav").append(`
          <p style="
    text-align: center;
">No Live Camera</p>`);
        }
        $("#prioritesTab").empty();
        $("#prioritesTabContent").empty();
        $("#prioritesTab").append(
          '<li class="su" ><a href="#NoAlerts" class="NoAlerts" data-toggle="tab">Camera Alerts</a></li>'
        );

        //
        $("#prioritesTabContent").append(
          ' <div class="tab-pane fade " id="NoAlerts">\n' +
            '                                                <div class="row">\n' +
            '                                                    <div id="" class="tab-pane active clearfix">\n' +
            '                                                        <div id="feedP2" class="feed">\n' +
            '                                                            <ul class="news-list" id="cam-Alerts-No">\n' +
            "                                                            </ul>\n" +
            "                                                        </div>\n" +
            "                                                    </div>\n" +
            "                                                </div>\n" +
            "                                            </div>"
        );

        $("#cam-Alerts-No").append(
          '<li id="alertsDXBA" > <div class="position" style="text-align:center ">No Alerts Found</div> </li>'
        );
        $("#prioritesTab li:first").addClass("active");
        $("#prioritesTabContent div:first").addClass("in active");
        getScripts(["js/index.js"], function () {
          // modifyPerimeter();
        });
      }
      localStorage.setItem("getlivecams", JSON.stringify(response))
      // modify_services(response);
    }
  })
}

$("body").keydown(function(e) {
 if(e.originalEvent.key == "x"){
  if(window.location.pathname == "/cctv_monitoring"){
    refreshAlertsCurrentCam();
  }else if(window.location.pathname == "/cctv_pendingalerts"){
    var priority = $("#myTabAdd > li.active").attr("priority_value")
    var query = $("#pendingRealTimeAdd > li.active").attr("query")
    if(query == "realtime"){
    onload_Alerts(priority, "pending");
    }else{
    onload_All_Alerts(priority, "pending");
    }
  }else if(window.location.pathname == "/cctv_resolvedalerts"){
    var priority = $("#myTabAdd > li.active").attr("priority_value")
    onload_All_Alerts(priority, "resolved");
  }
 }
})


function updatevehicleNumber(){

  var alert_id = $("#alert_id_s").text() !== "" ? $("#alert_id_s").text().replaceAll("#",""): $("#alert_id").text().replaceAll("#","")
  var vehicle_number = $("#voi_det_api_text").val().split("\n").find(kv=>kv.includes("Vehicle Number")).split(" : ")[1]
  if(vehicle_number){
      var payload = {
    alert_id,
    vehicle_number,
  }
  $.post("/changealertname",payload,function (res) {
        if (typeof res == "string") {
          logout();
        }
        if (res.Failure) {
          Messenger().post({
            message: res.Failure,
            type: "error",
            showCloseButton: true,
          });
          return;
        }else{
          if($(`*[flight_id="${alert_id}"]`).length > 0){

            $(`*[flight_id="${alert_id}"]`).attr("voi_details", $("#voi_det_api_text").val())
          }else{
            $(`#${alert_id}`).attr("voi_details", $("#voi_det_api_text").val())
          }
          Messenger().post({
            message: "Vehicle Number updated",
            type: "success",
            showCloseButton: true,
          });
  $(".updatevehicleNumber").hide()

        }
      })
  }
}


function showupdateVehicleNumber(e){
  if(userprofiledata.userlogin_status == "super_administrator" || userprofiledata.userlogin_status == "helpdesk"){
    $(".updatevehicleNumber").show()
  }else{
  $(e).attr("disabled",true)

  }
}



function Layoutfunction(e){
  localStorage.setItem("selected_Area",$(e).attr('name'))
  window.location.href="/cctv_vms"

}
