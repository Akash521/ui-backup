// console.log("%cStop!", "color:red; font-size: 90px");
// console = {
//   assert: function () {},
//   clear: function () {},
//   context: function () {},
//   count: function () {},
//   countReset: function () {},
//   debug: function () {},
//   dir: function () {},
//   dirxml: function () {},
//   error: function () {},
//   group: function () {},
//   groupCollapsed: function () {},
//   groupEnd: function () {},
//   info: function () {},
//   log: function () {},
//   memory: function () {},
//   profile: function () {},
//   profileEnd: function () {},
//   table: function () {},
//   time: function () {},
//   timeEnd: function () {},
//   timeLog: function () {},
//   timeStamp: function () {},
//   trace: function () {},
//   warn: function () {},
// };

var base_domainip = window.location.origin.replaceAll("http://","")

$.post("/storedomain", { domain: base_domainip }, function () {});

$.get("/ip",function(data){
  base_domainip = data
   if(!(window.location.pathname == "/login")){
   getScripts(["js/sockjs.min.js","js/stomp.min.js", "js/chart/mqt.js"], function () {
    MQTTconnect();
  });
}
})




$(document).ready(function () {
  $(".mob-menu span").click(function () {
    $(".main-menu").slideToggle();
  });
});

$(".panel-collapse2").on("show.bs.collapse", function () {
  $(this).siblings(".panel-heading2").addClass("active");
});

$(".panel-collapse2").on("hide.bs.collapse", function () {
  $(this).siblings(".panel-heading2").removeClass("active");
});

$(document).on(
  "click.bs.dropdown.data-api",
  ".dropdown.keep-inside-clicks-open",
  function (e) {
    e.stopPropagation();
  }
);

function check() {
 if(!(window.location.pathname == "/login")){
  //  getScripts(["js/sockjs.min.js","js/stomp.min.js", "js/chart/mqt.js"], function () {
  //   MQTTconnect();
  // });
      $(".footer").show();

  if(window.location.pathname == "/cctv_poilive"){
    var settings = {
    async: true,
    crossDomain: true,
    url: "/get_live_cams?service=POI",
    method: "GET",
    headers: {
      "cache-control": "no-cache",
    },
  };
  $("#camera-loading-spinner").show();
  $.ajax(settings).done(function (response) {
    

    $("#side-nav").empty().append(
      `<li class="panel">
                        <ul id="menu-levels-collapse" class="panel-collapse collapse in">
                        </ul>
                    </li>`
    )

    var selectedCameraName = localStorage.getItem("poicamName-DXB")
    $("#camera-loading-spinner").hide();
    if (response.Failure) {
      Messenger().post({
        message: response.Failure,
        type: "error",
        showCloseButton: true,
      });
    } else {
      if (response.live_cams.length > 0) {
        if(localStorage.getItem("poicamName-DXB")){
          localStorage.setItem("camName-DXB", localStorage.getItem("poicamName-DXB"))
        }else{
          localStorage.setItem("poicamName-DXB", response.live_cams[0]?.camera[0]?.cam_name)
          localStorage.setItem("camName-DXB", response.live_cams[0]?.camera[0]?.cam_name)
        }
        
        localStorage.setItem("getpoivoicam", JSON.stringify([{city: response.live_cams[0].camera[0].city  ,location: response.live_cams}]));
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
          li_DXB.className = "panel";
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
            li_ul_li_a_DXB.textContent = side_bar_dict[i].location[j].name + " - POI";
            li_ul_li_a_DXB.style.paddingLeft = "30px;";
            // li_ul_li_a_DXB.addEventListener(
            //   "click",
            //   function (f) {
            //     if (window.location.pathname == "/cctv_vms") {
            // myfun()
            // localStorage.setItem('poicamName-DXB',e.target.innerText)
            // var abc='#'+e.target.innerText;
            // $('.act').removeClass('active')
            // $(abc).addClass('active');
            // clearInterval(intervalchart);
            // updateCamData(e.target.innerText);
            //   window.location.href = "/cctv_vms";
            // } else {
            //   window.location.href = "/cctv_vms";
            // localStorage.setItem('poicamName-DXB',e.target.innerText)
            // updateCamData(localStorage.getItem('poicamName-DXB'));
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
                    window.location.pathname == "/cctv_poilive"
                  ) {
                    // myfun()
                    localStorage.setItem("poicamName-DXB", e.target.innerText);
                    localStorage.setItem("camName-DXB", e.target.innerText)
                    var abc = "#" + e.target.innerText;
                    $(".act").removeClass("active");
                    $(abc).addClass("active");
                    // clearInterval(intervalchart);
                    // updateCamData(e.target.innerText);
                  } else {
                    localStorage.setItem("poicamName-DXB", e.target.innerText);
                    localStorage.setItem("camName-DXB", e.target.innerText)
                    // updateCamData(localStorage.getItem("poicamName-DXB"));
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
              li_ul_li_ul_li_a_DXB.href = "/cctv_poilive";
              // li_ul_li_ul_li_a_DXB.addEventListener("click", () => {
              //  $(".active-li").removeClass("active-li");
              //  $(".cctv_monitoring").addClass("active-li");
              // });
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

          $("#menu-levels-collapse").empty();
          $("#menu-levels-collapse").append(li_DXB);
        }
        var abc = "#" + localStorage.getItem("poicamName-DXB");

        $(".act").removeClass("active");

        if (
          window.location.pathname == "/cctv_poilive" ||
          window.location.pathname == "/"
        ) {
          $(abc).addClass("active");
        }

        //
        // updateCamData(abc);
        // }
      } else {
        // $("#prioritesTabContent").append('<li id="alertsDXBA" > <div class="position" style="text-align:center ">No Alerts Found</div> </li>');

        localStorage.removeItem("poicamName-DXB");

        if (
          window.location.pathname == "/cctv_poilive" ||
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
        
      }}
  });
 }else if(window.location.pathname == "/cctv_voilive"){
  var settings = {
    async: true,
    crossDomain: true,
    url: "/get_live_cams?service=VOI",
    method: "GET",
    headers: {
      "cache-control": "no-cache",
    },
  };
  $("#camera-loading-spinner").show();
  $.ajax(settings).done(function (response) {
    $("#side-nav").empty().append(
      `<li class="panel">
                        <ul id="menu-levels-collapse" class="panel-collapse collapse in">
                        </ul>
                    </li>`
    )
    var selectedCameraName = localStorage.getItem("voicamName-DXB")
    $("#camera-loading-spinner").hide();
    if (response.Failure) {
      Messenger().post({
        message: response.Failure,
        type: "error",
        showCloseButton: true,
      });
    } else {
      if (response.live_cams.length > 0) {
        if(localStorage.getItem("voicamName-DXB")){

        }else{
          localStorage.setItem("voicamName-DXB", response.live_cams[0]?.camera[0]?.cam_name)
          localStorage.setItem("camName-DXB", response.live_cams[0]?.camera[0]?.cam_name)
        }

        localStorage.setItem("getpoivoicam", JSON.stringify([{city: response.live_cams[0].camera[0].city  ,location: response.live_cams}]));
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
          li_DXB.className = "panel";
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
            li_ul_li_a_DXB.textContent = side_bar_dict[i].location[j].name + " - VOI";
            li_ul_li_a_DXB.style.paddingLeft = "30px;";
            // li_ul_li_a_DXB.addEventListener(
            //   "click",
            //   function (f) {
            //     if (window.location.pathname == "/cctv_vms") {
            // myfun()
            // localStorage.setItem('voicamName-DXB',e.target.innerText)
            // var abc='#'+e.target.innerText;
            // $('.act').removeClass('active')
            // $(abc).addClass('active');
            // clearInterval(intervalchart);
            // updateCamData(e.target.innerText);
            //   window.location.href = "/cctv_vms";
            // } else {
            //   window.location.href = "/cctv_vms";
            // localStorage.setItem('voicamName-DXB',e.target.innerText)
            // updateCamData(localStorage.getItem('voicamName-DXB'));
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
                    window.location.pathname == "/cctv_voilive"
                  ) {
                    // myfun()
                    localStorage.setItem("voicamName-DXB", e.target.innerText);
                    localStorage.setItem("camName-DXB", e.target.innerText)
                      
                    var abc = "#" + e.target.innerText;
                    $(".act").removeClass("active");
                    $(abc).addClass("active");
                    // clearInterval(intervalchart);
                    // updateCamData(e.target.innerText);
                  } else {
                    localStorage.setItem("voicamName-DXB", e.target.innerText);
                    localStorage.setItem("voicamName-DXB", e.target.innerText)
                    // updateCamData(localStorage.getItem("voicamName-DXB"));
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
              li_ul_li_ul_li_a_DXB.href = "/cctv_voilive";
              // li_ul_li_ul_li_a_DXB.addEventListener("click", () => {
              //  $(".active-li").removeClass("active-li");
              //  $(".cctv_monitoring").addClass("active-li");
              // });
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

          $("#menu-levels-collapse").empty();
          $("#menu-levels-collapse").append(li_DXB);
        }
        var abc = "#" + localStorage.getItem("voicamName-DXB");

        $(".act").removeClass("active");

        if (
          window.location.pathname == "/cctv_voilive" ||
          window.location.pathname == "/"
        ) {
          $(abc).addClass("active");
        }

        //
        // updateCamData(abc);
        // }
      } else {
        // $("#prioritesTabContent").append('<li id="alertsDXBA" > <div class="position" style="text-align:center ">No Alerts Found</div> </li>');

        localStorage.removeItem("voicamName-DXB");

        if (
          window.location.pathname == "/cctv_voilive" ||
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
        
      }}
  });
 }else if(window.location.pathname == "/cctv_map"){
      $(".footer").hide();
 } else{
  var sidebarListText = $("div[href='#sub-menu-11-collapse']")?.text()
  if(sidebarListText?.includes(" - POI") || sidebarListText?.includes(" - VOI") || $($("#side-nav").children()[0]).prop("tagName") == "P"){
    getLiveCams() 
  }
 }
 }


 $("#search").attr("maxlength", "20");
  $("#search").on("keyup", function (e) {
    var nosearchresultcount = 0;
    $("#nosearchresult").remove();
    var value = $(this).val().toLowerCase();

    $(".paneldata").filter(function (i, ele) {
      var data = JSON.parse($(ele).attr("data"));

      if ($(ele).text().toLowerCase().includes(value)) {
        $(ele).show();
        if (data.location.toLowerCase().includes(value)) {
          $(ele)
            .children("ul")
            .children("li")
            .filter((i, liele) => {
              $(liele).show();
            });
        } else {
          var count = 0;
          $(ele)
            .children("ul")
            .children("li")
            .filter((i, liele) => {
              if ($(liele).attr("id").includes(value)) {
                $(liele).show();
              } else {
                count++;
                $(liele).hide();
              }
            });

          if (count == $(ele).children("ul").children("li").length) {
            $(ele).hide();
          }
        }
      } else {
        $(ele).hide();
      }

      if ($(ele).css("display") == "none") {
        nosearchresultcount += 1;
      }
    });

    if (nosearchresultcount == $(".paneldata").length) {
      $("#nosearchresult").remove();
      $("#sub-menu-1-collapse").append(
        `<li id="nosearchresult" style="padding: 0 20px; word-break:break-word;">No search results found for "${value}"</li>`
      );
    }

    // $(".panel-collapse .paneldata").filter(function () {
    //   $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    //   var data = JSON.parse($(this).attr("data"));
    //   var isCamera = false;

    //   if (data.location.toLowerCase().includes(value)) {
    //     $(this).show();
    //     data.camera.map((camera) => {
    //       console.log(camera);
    //       $("#" + camera).show();
    //     });
    //   } else {
    //     data.camera.map((camera) => {
    //       if (camera.toLowerCase().includes(value)) {
    //         $("#" + camera).show();
    //         isCamera = true;
    //       } else {
    //         $("#" + camera).hide();
    //       }
    //     });

    //     if (!isCamera) {
    //       $(this).hide();
    //     }
    //   }
    // });

    // $(".panel-collapse .panel a").filter(function () {
    //   $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    //   if ($(this).text().toLowerCase().indexOf(value) > -1 == true) {
    //   } else if ($(this).text().toLowerCase().indexOf(value) > -1 == false) {
    //     $(".panel-collapse").show();
    //   }
    //   console.log($(this).text().toLowerCase());
    // });
  });


 

 if(window.location.pathname == "/cctv_dashboard"){
  $("#randommonitoringimage").attr("src",`/img/dashboard${Math.floor(Math.random() * 5)}.png`)

 }


// $("#sidebar.sidebar.nav-collapse.collapse.homeside").show()
  if (window.location.pathname == "/cctv_addition") {
    var videoJsDXB = typeof videojs;
    if (videoJsDXB == "undefined") {
      console.log("videojs is undefined");
    } else {
      if (videojs.getPlayers()["my_video_1"]) {
        videojs("my_video_1").dispose();
      }
    }
    $(".act").removeClass("active");
    $("#addcampage").addClass("active");

    $("head").append(
      '<style id="add_style_css">\n' +
        "        /*.wickedpicker {*/\n" +
        "        /*    position:absolute;*/\n" +
        "        /*    z-index: 100 ;*/\n" +
        "        /*}*/\n" +
        "\n" +
        "\n" +
        "        .bootstrap-datetimepicker-widget.timepicker-picker table td,\n" +
        "        .bootstrap-datetimepicker-widget.timepicker-picker table td span,\n" +
        "        .bootstrap-datetimepicker-widget.timepicker-picker table td a span\n" +
        "        {height: 30px; line-height: 30px; width: 30px; padding:0px;}\n" +
        "\n" +
        "        .bootstrap-datetimepicker-widget table td span {\n" +
        "            display: inline-block;\n" +
        "            width: 30px;\n" +
        "            height: 30px;\n" +
        "            line-height: 30px;\n" +
        "            margin: 2px 1.5px;\n" +
        "            cursor: pointer;\n" +
        "            border-radius: 4px;\n" +
        "        }\n" +
        "        .bootstrap-datetimepicker-widget table td {\n" +
        "            height: 30px;\n" +
        "            line-height: 30px;\n" +
        "            width: 30px;\n" +
        "        }\n" +
        "        .bootstrap-datetimepicker-widget a[data-action] {\n" +
        "            padding: 3px 0;\n" +
        "        }\n" +
        "        .bootstrap-datetimepicker-widget.dropdown-menu {width: auto;}\n" +
        "        .bootstrap-datetimepicker-widget .datepicker table {width: 19em;}\n" +
        "\n" +
        "    </style>"
    );
    getScripts(["js/cctv_monitoring.js"], function () {
      // sidebarlist();
    });

    getScripts(["js/cctv_addition.js"], function () {
      load_page();
    });

    // $('#tags_1_tagsinput').remove();
    // $('#tags_2_tagsinput').remove();
    // var head= document.getElementsByTagName('head')[0];
    // var script= document.createElement('script');
    // script.src= 'lib/Tags-Input/jquery.tagsinput.js';
    // head.appendChild(script);

    $.getScript("js/perimeter/addCamPerimeter.js", function () {
      console.log("Script loaded and executed.");
      $("#svg_div").empty();
      svg_div_var_cc = null;
      videoDict_cc_p_s["Intrusion Detection"] = [];
      polygon_no = 0;
      RoadDict = {};
      $("#transparent-input").val("");
      drawing = true;
      dragging = false;
      localStorage.removeItem("perimeterBoundary");
      // here you can use anything you defined in the loaded script
    });
  } else if (
    window.location.pathname == "/cctv_monitoring" ||
    window.location.pathname == "/"
  ) {
    getScripts(
      [
        "js/pagination/paginathing.min.js",
        "js/jsmpeg/jsmpeg.min.js",
        "js/cctv_monitoring.js",
      ],
      function () {
        // sidebarlist();
        // display();
        // testAlertaSig();
        // testfun();
      }
    );

    $("head").append(
      '<style id="add_style_css">\n' +
        "        /*.wickedpicker {*/\n" +
        "        /*    position:absolute;*/\n" +
        "        /*    z-index: 100 ;*/\n" +
        "        /*}*/\n" +
        "\n" +
        "\n" +
        "        .bootstrap-datetimepicker-widget.timepicker-picker table td,\n" +
        "        .bootstrap-datetimepicker-widget.timepicker-picker table td span,\n" +
        "        .bootstrap-datetimepicker-widget.timepicker-picker table td a span\n" +
        "        {height: 30px; line-height: 30px; width: 30px; padding:0px;}\n" +
        "\n" +
        "        .bootstrap-datetimepicker-widget table td span {\n" +
        "            display: inline-block;\n" +
        "            width: 30px;\n" +
        "            height: 30px;\n" +
        "            line-height: 30px;\n" +
        "            margin: 2px 1.5px;\n" +
        "            cursor: pointer;\n" +
        "            border-radius: 4px;\n" +
        "        }\n" +
        "        .bootstrap-datetimepicker-widget table td {\n" +
        "            height: 30px;\n" +
        "            line-height: 30px;\n" +
        "            width: 30px;\n" +
        "        }\n" +
        "        .bootstrap-datetimepicker-widget a[data-action] {\n" +
        "            padding: 3px 0;\n" +
        "        }\n" +
        "        .bootstrap-datetimepicker-widget.dropdown-menu {width: auto;}\n" +
        "        .bootstrap-datetimepicker-widget .datepicker table {width: 19em;}\n" +
        "\n" +
        "    </style>"
    );

    $.getScript("js/perimeter/addCamPerimeter.js", function () {
      console.log("Script loaded and executed.");
      $("#svg_div").empty();
      svg_div_var_cc = null;
      videoDict_cc_p_s["Intrusion Detection"] = [];
      polygon_no = 0;
      RoadDict = {};
      $("#transparent-input").val("");
      drawing = true;
      dragging = false;
      localStorage.removeItem("perimeterBoundary");
      // here you can use anything you defined in the loaded script
    });

    // $(".navbar-dark a").removeClass("active-li");
    // $("#cam_moni").addClass("active-li");
      console.log($($(".act")[0]).children("a"))

    if (localStorage.getItem("camName-DXB") == null) {
      // getScripts(["js/chart/scriptFusion/ganttscript.js"], function () {
      //     fusioncharts();
      // });
      console.log($($(".act")[0]).children("a"))
      $($(".act")[0]).children("a").trigger("click")
      $("#airportName").empty();
      $("#terminalName").empty();
      $("#aircraftStandName").empty();
      $("#camName").empty();
      $("#airportName").append("-");
      $("#terminalName").append("-");
      $("#aircraftStandName").append("-");
      $("#camName").append("-");
      $("#eventsDXB").append(
        '<div id="loadingEvent" class="position eventsDXBA" style="text-align:center ">No Events Found</div>'
      );
      $("#camAlertsDXB").append(
        '<li id="alertsDXBA" > <div class="position" style="text-align:center ">No Alerts Found</div> </li>'
      );
    } else {
      // updateCamData(localStorage.getItem('camName-DXB'))
      getScripts(["js/cctv_monitoring.js"], function () {
        updateCamData(localStorage.getItem("camName-DXB"));
      });

      $("#cam-style").remove();
      $("head").append('<style id="cam-style"></style>');
      $("#cam-style").append(
        " .feed > nav {\n" +
          "            background-color: #373b3f;\n" +
          "            border-top: 1px solid transparent;\n" +
          "            padding: 0px 15px;\n" +
          "        }\n" +
          "        .pagination > .active > a, .pagination > .active > a:hover, .pagination > .active > a:focus, .pagination > .active > span, .pagination > .active > span:hover, .pagination > .active > span:focus {\n" +
          "            background-color: rgb(76 84 89);\n" +
          "        }\n" +
          "\n" +
          "        .pagination > li > a:hover, .pagination > li > a:focus, .pagination > li > span:hover, .pagination > li > span:focus {\n" +
          "            background-color: rgb(76 84 89);\n" +
          "        }\n" +
          "\n" +
          "        .feed > nav > ul {\n" +
          "            margin: 5px 0;\n" +
          "        }\n" +
          "\n" +
          "        .news-list {\n" +
          "            height:562px;\n" +
          "        }"
      );

    }

    
      // getScripts(["js/mqttws31.js", "js/chart/mqt.js"], function () {
      //   MQTTconnect();
      // });
  } else if (window.location.pathname == "/logs") {
    var videoJsDXB = typeof videojs;
    if (videoJsDXB == "undefined") {
      console.log("videojs is undefined");
    } else {
      if (videojs.getPlayers()["my_video_1"]) {
        videojs("my_video_1").dispose();
      }
    }

    $(".act").removeClass("active");
    $("#logspage").addClass("active");
    getScripts(["js/logsDXB.js"], function () {
      logs();
      testfun();
    });
    getScripts(["js/cctv_monitoring.js"], function () {
      // sidebarlist();
    });
  } else if (window.location.pathname == "/cctv_analytics") {
    var videoJsDXB = typeof videojs;
    if (videoJsDXB == "undefined") {
      console.log("videojs is undefined");
    } else {
      if (videojs.getPlayers()["my_video_1"]) {
        videojs("my_video_1").dispose();
      }
    }
    $("#downloadCollectionCSS").remove();

    $(".act").removeClass("active");
    // $('#analyticsPage').addClass('active');
    getScripts(["js/cctv_analytics.js"], function () {
      // getStates();
      // getAnalytics("initial");
      $("#analyticsPage").addClass("active");
      $("#analytics-style").remove();
      $("head").append('<style id="analytics-style"></style>');
      $("#analytics-style").append(
        ".nvd3.nv-pie path {\n" +
          "            stroke: transparent ! important;\n" +
          "        }\n" +
          "        .table-condensed{\n" +
          "\n" +
          "            color:#666;\n" +
          "        }\n" +
          "\n" +
          "        /* Ensure that the demo table scrolls */\n" +
          "        th, td { white-space: nowrap; }\n" +
          "        div.dataTables_wrapper {\n" +
          "            width: 100%;\n" +
          "            margin: 0 auto;\n" +
          "        }\n" +
          "\n" +
          "        #datatable-table_wrapper > div.DTFC_ScrollWrapper > div.DTFC_LeftWrapper > div.DTFC_LeftHeadWrapper > table > thead > tr {\n" +
          "            background: #525a63;\n" +
          "        }\n" +
          "\n" +
          "\n" +
          "        #datatable-table_wrapper > div.DTFC_ScrollWrapper > div.DTFC_LeftWrapper > div.DTFC_LeftBodyWrapper > div > table > tbody > tr {\n" +
          "            background: #525a63;\n" +
          "        }\n" +
          "\n" +
          "\n" +
          "        #datatable-table_wrapper > div.DTFC_ScrollWrapper > div.DTFC_RightWrapper > div.DTFC_RightHeadWrapper > table > thead > tr {\n" +
          "            background: #6f777f;\n" +
          "        }\n" +
          "\n" +
          "        #datatable-table_wrapper > div.DTFC_ScrollWrapper > div.DTFC_RightWrapper > div.DTFC_RightBodyWrapper {\n" +
          "            background: #6f777f;\n" +
          "        }"
      );
    });
    // // sidebarlist();
    getScripts(["js/cctv_monitoring.js"], function () {
      // sidebarlist();
    });
  } else if (window.location.pathname == "/cctv_users") {
    var videoJsDXB = typeof videojs;
    if (videoJsDXB == "undefined") {
      console.log("videojs is undefined");
    } else {
      if (videojs.getPlayers()["my_video_1"]) {
        videojs("my_video_1").dispose();
      }
    }

    // $('.act').removeClass('active');
    // $('#usersPage').addClass('active');
    // logs();
    getScripts(["js/cctv_monitoring.js"], function () {
      // sidebarlist();
    });
    getScripts(["js/cctv_users.js"], function () {
      getusers();
    });
  }else if (window.location.pathname == "/cctv_downloads") {
    getScripts(["js/cctv_monitoring.js"], function () {
      // sidebarlist();
    });
    getScripts(["js/cctv_downloads.js"], function () {
    });
  } else if (window.location.pathname == "/cctv_vms") {
    $("#comp_vmscss").remove();
    $("head").append(
      '<link id="comp_vmscss" rel="stylesheet" href="css/custom-css/vmscss.css">'
    );
    var videoJsDXB = typeof videojs;
    if (videoJsDXB == "undefined") {
      console.log("videojs is undefined");
    } else {
      if (videojs.getPlayers()["my_video_1"]) {
        videojs("my_video_1").dispose();
      }
    }

    // $('.act').removeClass('active');
    // $('#usersPage').addClass('active');
    // logs();
    getScripts(["js/cctv_monitoring.js"], function () {
      // sidebarlist();
    });

    getScripts(["js/cctv_vms.js"], function () {
      get_all_VMScams9();
    });
  } else if (window.location.pathname == "/cctv_location") {
    $("#autocomplete").remove();
    $("#mapLeafletCss").remove();
    $("head").append(
      '<link id="mapLeafletCss" rel="stylesheet" href="js/mapJS/leaflet.css"><link id="autocomplete" rel="stylesheet" href="js/https/autocomplete.css">'
    );

    $("#mapLeaflet").remove();
    $("#mapPurne").remove();

    $("body").append(
      '<script id="mapLeaflet" src="js/mapJS/leaflet.js"></script>'
    );
    $("body").append(
      '<script id="mapPurne" src="js/pruneCluster.js"></script>'
    );

    // getScripts(["js/mapJS/leaflet.js"], function () {
    // });
    //
    // getScripts(["js/pruneCluster.js"], function () {
    //
    // });
    // var container = L.DomUtil.get("map");
    // if (container != null) {
    //   container._leaflet = null;

    var videoJsDXB = typeof videojs;
    if (videoJsDXB == "undefined") {
      console.log("videojs is undefined");
    } else {
      if (videojs.getPlayers()["my_video_1"]) {
        videojs("my_video_1").dispose();
      }
    }

    // $('.act').removeClass('active');
    // $('#usersPage').addClass('active');
    // logs();
    getScripts(["js/cctv_monitoring.js"], function () {
      // sidebarlist();
    });

    getScripts(
      ["js/https/autocomplete.js", "js/cctv_location.js"],
      function () {
        getlocations();
      }
    );
  } else if (window.location.pathname == "/cctv_helpdesk") {
    var videoJsDXB = typeof videojs;
    if (videoJsDXB == "undefined") {
      console.log("videojs is undefined");
    } else {
      if (videojs.getPlayers()["my_video_1"]) {
        videojs("my_video_1").dispose();
      }
    }

    // $('.act').removeClass('active');
    // $('#usersPage').addClass('active');
    // logs();
    getScripts(["js/cctv_monitoring.js"], function () {
      // sidebarlist();
    });
    getScripts(["js/cctv_helpdesk.js"], function () {
      onload_Alerts();
    });
  } else if (window.location.pathname == "/cctv_poi") {
    var videoJsDXB = typeof videojs;
    if (videoJsDXB == "undefined") {
      console.log("videojs is undefined");
    } else {
      if (videojs.getPlayers()["my_video_1"]) {
        videojs("my_video_1").dispose();
      }
    }

    // $('.act').removeClass('active');
    // $('#usersPage').addClass('active');
    // logs();
    getScripts(["js/cctv_monitoring.js"], function () {
      // sidebarlist();
    });
    getScripts(["js/cctv_poi.js"], function () {
      get_all_track_poi_images();
    });
  } else if (window.location.pathname == "/cctv_voi") {
    // var videoJsDXB=typeof videojs;
    // if(videoJsDXB == "undefined" ){
    //     console.log("videojs is undefined")
    // }else {
    //     if(videojs.getPlayers()['my_video_1']) {
    //         videojs('my_video_1').dispose();
    //     }
    // }
    //
    // $('.act').removeClass('active');
    // $('#usersPage').addClass('active');
    // // logs();
    // getScripts(["js/cctv_monitoring.js"], function () {
    //     // sidebarlist();
    // });
    // getScripts(["js/cctv_poi.js"], function () {
    //     get_all_track_poi_images();
    // });

    var videoJsDXB = typeof videojs;
    if (videoJsDXB == "undefined") {
      console.log("videojs is undefined");
    } else {
      if (videojs.getPlayers()["my_video_1"]) {
        videojs("my_video_1").dispose();
      }
    }

    var element = document.createElement("link");
    element.setAttribute("rel", "stylesheet");
    element.setAttribute("type", "text/css");
    element.setAttribute("href", "css/normalize/normalize.min.css");
    document.getElementsByTagName("head")[0].appendChild(element);

    getScripts(["css/normalize/normalize.min.js"], function () {
      console.log("here");
    });

    getScripts(["js/cctv_voi.js"], function () {
      onPageLoadVOI();
      make_datatable_tracked_vehicle();
    });

    getScripts(["js/cctv_monitoring.js"], function () {
      // sidebarlist();
    });
  }
  // else if(window.location.pathname == '/cctv_voi'){
  //     var videoJsDXB=typeof videojs;
  //     if(videoJsDXB == "undefined" ){
  //         console.log("videojs is undefined")
  //     }else {
  //         if(videojs.getPlayers()['my_video_1']) {
  //             videojs('my_video_1').dispose();
  //         }
  //     }
  //
  //
  //     // logs();
  //     getScripts(["js/cctv_monitoring.js"], function () {
  //         // sidebarlist();
  //     });
  //     getScripts(["js/cctv_voi.js"], function () {
  //         onPageLoadVOI();
  //     });
  // }

  else if (
    window.location.pathname == "/cctv_voilive"
  ) {
    getScripts(
      [
        "js/pagination/paginathing.min.js",
        "js/jsmpeg/jsmpeg.min.js",
        "js/cctv_voilive.js"
      ],
      function () {
        // sidebarlist();
        // display();
        // testAlertaSig();
        // testfun();
        // MQTTconnect()
      }
    );

    $("head").append(
      '<style id="add_style_css">\n' +
        "        /*.wickedpicker {*/\n" +
        "        /*    position:absolute;*/\n" +
        "        /*    z-index: 100 ;*/\n" +
        "        /*}*/\n" +
        "\n" +
        "\n" +
        "        .bootstrap-datetimepicker-widget.timepicker-picker table td,\n" +
        "        .bootstrap-datetimepicker-widget.timepicker-picker table td span,\n" +
        "        .bootstrap-datetimepicker-widget.timepicker-picker table td a span\n" +
        "        {height: 30px; line-height: 30px; width: 30px; padding:0px;}\n" +
        "\n" +
        "        .bootstrap-datetimepicker-widget table td span {\n" +
        "            display: inline-block;\n" +
        "            width: 30px;\n" +
        "            height: 30px;\n" +
        "            line-height: 30px;\n" +
        "            margin: 2px 1.5px;\n" +
        "            cursor: pointer;\n" +
        "            border-radius: 4px;\n" +
        "        }\n" +
        "        .bootstrap-datetimepicker-widget table td {\n" +
        "            height: 30px;\n" +
        "            line-height: 30px;\n" +
        "            width: 30px;\n" +
        "        }\n" +
        "        .bootstrap-datetimepicker-widget a[data-action] {\n" +
        "            padding: 3px 0;\n" +
        "        }\n" +
        "        .bootstrap-datetimepicker-widget.dropdown-menu {width: auto;}\n" +
        "        .bootstrap-datetimepicker-widget .datepicker table {width: 19em;}\n" +
        "\n" +
        "    </style>"
    );


    // $(".navbar-dark a").removeClass("active-li");
    // $("#cam_moni").addClass("active-li");
    if (localStorage.getItem("camName-DXB") == null) {
      // getScripts(["js/chart/scriptFusion/ganttscript.js"], function () {
      //     fusioncharts();
      // });
      $("#airportName").empty();
      $("#terminalName").empty();
      $("#aircraftStandName").empty();
      $("#camName").empty();
      $("#airportName").append("-");
      $("#terminalName").append("-");
      $("#aircraftStandName").append("-");
      $("#camName").append("-");
      $("#eventsDXB").append(
        '<div id="loadingEvent" class="position eventsDXBA" style="text-align:center ">No Events Found</div>'
      );
      $("#camAlertsDXB").append(
        '<li id="alertsDXBA" > <div class="position" style="text-align:center ">No Alerts Found</div> </li>'
      );
    } else {
      // updateCamData(localStorage.getItem('camName-DXB'))
      getScripts(["js/cctv_monitoring.js"], function () {
        updateCamData(localStorage.getItem("camName-DXB"));
      });

      $("#cam-style").remove();
      $("head").append('<style id="cam-style"></style>');
      $("#cam-style").append(
        " .feed > nav {\n" +
          "            background-color: #373b3f;\n" +
          "            border-top: 1px solid transparent;\n" +
          "            padding: 0px 15px;\n" +
          "        }\n" +
          "        .pagination > .active > a, .pagination > .active > a:hover, .pagination > .active > a:focus, .pagination > .active > span, .pagination > .active > span:hover, .pagination > .active > span:focus {\n" +
          "            background-color: rgb(76 84 89);\n" +
          "        }\n" +
          "\n" +
          "        .pagination > li > a:hover, .pagination > li > a:focus, .pagination > li > span:hover, .pagination > li > span:focus {\n" +
          "            background-color: rgb(76 84 89);\n" +
          "        }\n" +
          "\n" +
          "        .feed > nav > ul {\n" +
          "            margin: 5px 0;\n" +
          "        }\n" +
          "\n" +
          "        .news-list {\n" +
          "            height:600px;\n" +
          "        }"
      );
    }
  }else if (
    window.location.pathname == "/cctv_poilive"
  ) {
    getScripts(
      [
        "js/pagination/paginathing.min.js",
        "js/jsmpeg/jsmpeg.min.js",
        "js/cctv_poilive.js"
      ],
      function () {
        // sidebarlist();
        // display();
        // testAlertaSig();
        // testfun();
      // MQTTconnect();

      }
    );

    $("head").append(
      '<style id="add_style_css">\n' +
        "        /*.wickedpicker {*/\n" +
        "        /*    position:absolute;*/\n" +
        "        /*    z-index: 100 ;*/\n" +
        "        /*}*/\n" +
        "\n" +
        "\n" +
        "        .bootstrap-datetimepicker-widget.timepicker-picker table td,\n" +
        "        .bootstrap-datetimepicker-widget.timepicker-picker table td span,\n" +
        "        .bootstrap-datetimepicker-widget.timepicker-picker table td a span\n" +
        "        {height: 30px; line-height: 30px; width: 30px; padding:0px;}\n" +
        "\n" +
        "        .bootstrap-datetimepicker-widget table td span {\n" +
        "            display: inline-block;\n" +
        "            width: 30px;\n" +
        "            height: 30px;\n" +
        "            line-height: 30px;\n" +
        "            margin: 2px 1.5px;\n" +
        "            cursor: pointer;\n" +
        "            border-radius: 4px;\n" +
        "        }\n" +
        "        .bootstrap-datetimepicker-widget table td {\n" +
        "            height: 30px;\n" +
        "            line-height: 30px;\n" +
        "            width: 30px;\n" +
        "        }\n" +
        "        .bootstrap-datetimepicker-widget a[data-action] {\n" +
        "            padding: 3px 0;\n" +
        "        }\n" +
        "        .bootstrap-datetimepicker-widget.dropdown-menu {width: auto;}\n" +
        "        .bootstrap-datetimepicker-widget .datepicker table {width: 19em;}\n" +
        "\n" +
        "    </style>"
    );


    // $(".navbar-dark a").removeClass("active-li");
    // $("#cam_moni").addClass("active-li");

    if (localStorage.getItem("camName-DXB") == null) {
      // getScripts(["js/chart/scriptFusion/ganttscript.js"], function () {
      //     fusioncharts();
      // });
      $("#airportName").empty();
      $("#terminalName").empty();
      $("#aircraftStandName").empty();
      $("#camName").empty();
      $("#airportName").append("-");
      $("#terminalName").append("-");
      $("#aircraftStandName").append("-");
      $("#camName").append("-");
      $("#eventsDXB").append(
        '<div id="loadingEvent" class="position eventsDXBA" style="text-align:center ">No Events Found</div>'
      );
      $("#camAlertsDXB").append(
        '<li id="alertsDXBA" > <div class="position" style="text-align:center ">No Alerts Found</div> </li>'
      );
    } else {
      // updateCamData(localStorage.getItem('camName-DXB'))
      getScripts(["js/cctv_monitoring.js"], function () {
        updateCamData(localStorage.getItem("camName-DXB"));
      });

      $("#cam-style").remove();
      $("head").append('<style id="cam-style"></style>');
      $("#cam-style").append(
        " .feed > nav {\n" +
          "            background-color: #373b3f;\n" +
          "            border-top: 1px solid transparent;\n" +
          "            padding: 0px 15px;\n" +
          "        }\n" +
          "        .pagination > .active > a, .pagination > .active > a:hover, .pagination > .active > a:focus, .pagination > .active > span, .pagination > .active > span:hover, .pagination > .active > span:focus {\n" +
          "            background-color: rgb(76 84 89);\n" +
          "        }\n" +
          "\n" +
          "        .pagination > li > a:hover, .pagination > li > a:focus, .pagination > li > span:hover, .pagination > li > span:focus {\n" +
          "            background-color: rgb(76 84 89);\n" +
          "        }\n" +
          "\n" +
          "        .feed > nav > ul {\n" +
          "            margin: 5px 0;\n" +
          "        }\n" +
          "\n" +
          "        .news-list {\n" +
          "            height:600px;\n" +
          "        }"
      );
    }
  } 
  else if (window.location.pathname == "/userprofile") {
    var videoJsDXB = typeof videojs;
    if (videoJsDXB == "undefined") {
      console.log("videojs is undefined");
    } else {
      if (videojs.getPlayers()["my_video_1"]) {
        videojs("my_video_1").dispose();
      }
    }

    $(".act").removeClass("active");
    getScripts(["js/cctv_monitoring.js"], function () {
      // sidebarlist();
    });
    getScripts(["js/userprofile.js"], function () {
      getUserprofileDXB();
    });
  } else if (window.location.pathname == "/camDetails") {
    getScripts(["js/completeScript/script.js"], function () {
      camdetailsPage();
    });
    getScripts(["js/cctv_monitoring.js"], function () {
      // sidebarlist();
    });
  } else if (window.location.pathname == "/flightDetails") {
    $(".act").removeClass("active");

    getScripts(
      [
        "lib/slimScroll/jquery.slimscroll.min.js",
        "js/index.js",
        "js/completeScript/script.js",
      ],
      function () {
        flightDetailsPage();
      }
    );
  } else if (window.location.pathname == "/camLogs") {
    getScripts(["js/completeScript/cameralogs.js"], function () {
      cameralogs();
    });
    getScripts(["js/cctv_monitoring.js"], function () {
      // sidebarlist();
    });
  } else if (window.location.pathname == "/all_notifications") {
    getScripts(["js/completeScript/all_notification.js"], function () {
      cameralogs();
    });
    $(".act").removeClass("active");
    getScripts(["js/cctv_monitoring.js"], function () {
      // sidebarlist();
    });
  } else if (window.location.pathname == "/cctv_vms") {
    getScripts(["js/vms-layout.js"], function () {
      get_all_VMScams9();
    });
    $(".act").removeClass("active");
    getScripts(["js/cctv_monitoring.js"], function () {
      // sidebarlist();
    });
  }else if (window.location.pathname == "/cctv_deviceInfo") {
    getScripts(["js/cctv_deviceInfo.js"], function () {
      getusers();
    });
    $(".act").removeClass("active");
    getScripts(["js/cctv_monitoring.js"], function () {
      // sidebarlist();
    });
  } else if (window.location.pathname == "/cctv_playback") {
    var videoJsDXB = typeof videojs;
    if (videoJsDXB == "undefined") {
      console.log("videojs is undefined");
    } else {
      if (videojs.getPlayers()["my_video_1"]) {
        videojs("my_video_1").dispose();
      }
    }

    $("#font-aw").remove();
    $("#date-rangepicker").remove();
    $("#single_vmscss").remove();
    $("#comp_vmscss").remove();
    $("head").append(
      '<link id="comp_vmscss" rel="stylesheet" href="css/custom-css/vmscss.css">'
    );
    // $('head').append('<link id="font-aw" rel="stylesheet" href="css/vms/font-awesome.min.css">');
    $("head").append(
      '<link id="date-rangepicker" rel="stylesheet" href="css/vms/daterangepicker.css">'
    );
    $("head").append(
      '<link id="single_vmscss" rel="stylesheet" href="css/vms/singlecss.css">'
    );

    $("#downloadCollectionCSS").remove();
    $("head").append(
      '<style id="downloadCollectionCSS">\n' +
        "  .vjs-picture-in-picture-control, .vjs-volume-panel, .vjs-error-display, .vjs-audio-button {\n" +
        "    display: none !important;\n" +
        "  }\n" +
        "\n" +
        "  .vjs-control-bar {\n" +
        "    opacity: 1 !important;\n" +
        "  }\n" +
        "\n" +
        "  .iframe-button {\n" +
        "        position: absolute;\n" +
        "        top: 1%;\n" +
        "        right: 1.8%;\n" +
        "    }\n" +
        "    body > div.wrap > div > div > section > div > div > div.vdo > div > div.col-md-6.speed > div > div > button{\n" +
        "      background-color: #384350 !important;\n" +
        "    }\n" +
        "\n" +
        "  .bootstrap-datetimepicker-widget.dropdown-menu {\n" +
        "    background-color: #293746;\n" +
        "    border-color: 1px solid #2b3135;\n" +
        "    width: 50%;\n" +
        "    /*height:230px;*/\n" +
        "  }\n" +
        "\n" +
        "  .bootstrap-datetimepicker-widget table td span:hover{\n" +
        "    background-color: rgb(37, 47, 59);\n" +
        "    color:#fff;\n" +
        "  }\n" +
        "\n" +
        "  </style>"
    );

    // getScripts(["js/vms/jquery-ui.js","js/vms/daterangepicker.js","js/vms/custom-js-vms.js","js/vms/TimeSlider.js","js/vms/custom-daterangepicker.js"], function () {
    //     // get_all_VMScams9();
    //
    // });

    getScripts(
      [
        "js/vms/jquery-ui.js",
        "js/vms/custom-single-page-vms.js",
        "js/vms/playback-timeline.js",
        "js/vms/singleVMS.js",
        "js/vms/VideoFrame.min.js",
        "js/vms/snapshot.js",
        "js/vms/fabric.js",
        // "js/mqttws31.js", "js/chart/mqt.js"

      ],
      function () {
        // get_all_VMScams9();

        playbackVideoGet("");
        downloadTableStatus();
        // MQTTconnect()
      }
    );

    // js/vms/custom-single-page-vms.js
    // $('.act').removeClass('active');
    getScripts(["js/cctv_monitoring.js"], function () {
      // sidebarlist();
    });
  } else if (window.location.pathname == "/cctv_pendingalerts") {
    
    getScripts(["js/cctv_pendingalerts.js"], function () {
      onload_Alerts("P1", "pending");
    });
    getScripts(["js/cctv_monitoring.js"], function () {
      // sidebarlist();
    });
    // getScripts(["js/mqttws31.js", "js/chart/mqt.js"], function () {
    //   MQTTconnect();
    // });
  }else if (window.location.pathname == "/cctv_resolvedalerts") {
    
    getScripts(["js/cctv_resolvedalerts.js"], function () {
      onload_All_Alerts("P1", "resolved");
    });
    getScripts(["js/cctv_monitoring.js"], function () {
      // sidebarlist();
    });
  }else if (window.location.pathname == "/cctv_alerts") {
    
    getScripts(["js/cctv_resolvedalerts.js"], function () {
      onload_All_Alerts("P1", "resolved");
    });
    getScripts(["js/cctv_monitoring.js"], function () {
      // sidebarlist();
    });
  }else if (window.location.pathname == "/cctv_alert") {
    $("#taginputcss").remove();
    $("head").append(
      '<link id="taginputcss" rel="stylesheet" href="lib/Tags-Input/jquery.tagsinput.css">'
    );
    getScripts(
      ["lib/Tags-Input/jquery.tagsinput.js", "js/cctv_alert.js"],
      function () {}
    );
  } else if (window.location.pathname == "/cctv_map") {
    // $("#sidebar.sidebar.nav-collapse.collapse.homeside").hide()

    // getScripts(["js/mqttws31.js", "js/chart/mqt.js"], function () {
    //   MQTTconnect();
    // });
    // $(".main_body").addClass("mbdy");
    $("#autocomplete").remove();
    $("#mapLeafletCss").remove();
    $("head").append(
      '<link id="mapLeafletCss" rel="stylesheet" href="js/mapJS/leaflet.css"><link id="autocomplete" rel="stylesheet" href="js/https/autocomplete.css">'
    );

    $("#mapLeaflet").remove();
    $("#mapPurne").remove();

    $("body").append(
      '<script id="mapLeaflet" src="js/mapJS/leaflet.js"></script>'
    );
    $("body").append(
      '<script id="mapPurne" src="js/pruneCluster.js"></script>'
    );

    // getScripts(["js/mapJS/leaflet.js"], function () {
    // });
    //
    // getScripts(["js/pruneCluster.js"], function () {
    //
    // });
    // var container = L.DomUtil.get("map");
    // if (container != null) {
    //   container._leaflet = null;
    getScripts(["js/https/autocomplete.js", "js/map-nav.js"], function () {
      $("#map").remove();
      $(
        `<div id="map"  style="position: static !important;display: block; height: 100vh;" ></div>`
      ).insertBefore("#map_loader");
      createMap();
    });
    // }

    $(".act").removeClass("active");
    // getScripts(["js/cctv_monitoring.js"], function () {
    //     // sidebarlist();
    // });
  } else if (window.location.pathname == "/login") {
    // getScripts(["js/config/config.js"], function () {
      localStorage.clear();
    //   configFun();
    // });

    var videoJsDXB = typeof videojs;
    if (videoJsDXB == "undefined") {
      console.log("videojs is undefined");
    } else {
      if (videojs.getPlayers()["my_video_1"]) {
        videojs("my_video_1").dispose();
      }
    }
  }
}

function getScripts(scripts, callback) {
  var progress = 0;
  scripts.forEach(function (script) {
    $.getScript(script, function () {
      if (++progress == scripts.length) callback();
    });
  });
}

function check_test() {
  getScripts(["js/cctv_monitoring.js"], function () {
    updateCamData(localStorage.getItem("camName-DXB"));
  });

  // getScripts(["js/mqttws31.js", "js/chart/mqt.js"], function () {
  //   MQTTconnect();
  // });
}

function logout() {
  // $.post("/active_status", { status: "offline" }, function () {
    window.location.href = "/logout";
  // });
}









