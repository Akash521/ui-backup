//get all live cam in left side bar
// var userstatus

var canvasHeight = 700;

if (
  window.location.pathname == "/cctv_monitoring" &&
  (userloginstatus == "super_administrator" || userloginstatus == "helpdesk")
) {
  $("#cctvplaybackbtn").remove();
  $("#resetErl").empty().css("height", "50px").append(` 
    <span style="width: 31px; float: right !important; margin-top: 8px;margin-right: 5px; height: 34px;margin-bottom: 0px;  padding: 7px;" class="btn btn-transparent btn-sm  pull-left " id="back-btn" onclick="deleteCamDXB();"> <i class="fa fa-trash"></i> </span>
    <a href="cctv_playback" id="cctvplaybackbtn" onclick="navigateToPlayback()" style="width: 83px; float: left !important; margin-top: 8px;height: 34px; margin-bottom: 0px; margin-right: 5px; padding: 7px;border-right: 1px solid #ffffff42;" class="btn btn-transparent btn-sm pull-left " id="flip" onclick=""> <i class="fa fa-video-camera" style="margin-left: 5px;"></i> Playback</a>
                            <span style="width: 130px; float: left! important; margin-top: 8px;height: 34px;    margin-bottom: 0px; margin-right: 5px; padding: 7px; border-right: 1px solid #ffffff42;     font-size: 13px;
    font-weight: 500; " class="btn btn-transparent btn-sm  pull-left " id="flip" onclick="clickFlip();">Select Services  <i class="fa fa-edit" style="margin-left: 5px;"></i></span>`);
} else {
  $("#resetErl").empty().css("height", "50px").append(`
                            <span style="width: 130px; float: left! important; margin-top: 8px;height: 34px;    margin-bottom: 0px; margin-right: 5px; padding: 7px; border-right: 1px solid #ffffff42;     font-size: 13px;
    font-weight: 500; " class="btn btn-transparent btn-sm  pull-left " id="flip" onclick="clickFlip();">Select Services  <i class="fa fa-edit" style="margin-left: 5px;"></i></span>`);
}

// })
if (
  window.location.pathname == "/cctv_poilive" ||
  window.location.pathname == "/cctv_voilive" ||
  window.location.pathname == "/cctv_monitoring" ||
  window.location.pathname == "/cctv_vms"
) {
  $(".active-li").removeClass("active-li");
}

var player;
$("#camera-loading-spinner").hide();
function sidebarlist() {
  $("#menu-levels-collapse").empty();
  // localStorage.getItem("getcam").remove();

  // if (
  //   JSON.parse(localStorage.getItem("getcam")) == null ||
  //   JSON.parse(localStorage.getItem("getcam")) !== null
  // ) {
  var a = [];

  getLiveCams();
  // }

  // $('#formElementsSelect').remove();
  $("#switchTabDXB").empty();
  // $('small').remove()
  // $('#formElementsSwitch').remove();
  $("body").append(
    '<script id="formElementsSwitch" src="lib/switchery/dist/switchery.min.js"></script>'
  );

  $("#switchTabDXB").append(`<div style="float: left" id ="textGraph">
      <h4>Event Display in Gantt Chart </h4>
                          </div><label class="ganttswitch" style="float: right;">
                    <input type="checkbox" id="ganttswitch" onchange="toggletable()">
                    <span class="ganttslider">
                </span>
                </label>`);

  $("body").append(
    //
    "<script id='formElementsSelect' src='js/forms-elements.js'></script>"
  );
}

//click any live camera to get details of that camera events,ganntchart,alerts
function updateCamData(camName, isfromMap) {
  console.log("camName", camName);
  if (
    localStorage.getItem("isFromMap") &&
    $($($("#" + camName).parent()).siblings()).hasClass("collapsed")
  ) {
    $($($("#" + camName).parent()).siblings()).trigger("click");
    $("#" + camName).trigger("click");
  }
  localStorage.removeItem("isFromMap");
  var camlistservices = JSON.parse(localStorage.getItem("getlivecams"));

  // $.get("/status",function(data1){
  //   userloginstatus = data1
  $("#service_list_modification").empty();

  camlistservices.services?.forEach(function (data) {
    modify_services(data);
  });
  // })

  var getCamList = JSON.parse(localStorage.getItem("getcam"));
  for (i = 0; i < getCamList.length; i++) {
    for (j = 0; j < getCamList[i].location.length; j++) {
      for (k = 0; k < getCamList[i].location[j].camera.length; k++) {
        if (camName == getCamList[i].location[j].camera[k].cam_name) {
          for (
            check_val = 0;
            check_val < getCamList[i].location[j].camera[k].alert_array.length;
            check_val++
          ) {
            console.log(
              "Hello",
              getCamList[i].location[j].camera[k].alert_array[
                check_val
              ].replaceAll(/\s/g, "")
            );
            var ele = document.getElementById(
              "checkbox" +
                getCamList[i].location[j].camera[k].alert_array[
                  check_val
                ].replaceAll(/\s/g, "")
            );
            if (ele) {
              ele.checked = true;
            }

            EventsArrayList_Demo.push(
              getCamList[i].location[j].camera[k].alert_array[check_val]
            );
          }
        }
      }
    }
  }

  console.log(camName);
  getScripts(["js/pagination/paginathing.min.js"], function () {
    // updateCamData(localStorage.getItem('camName-DXB'));
  });
  var abc = "#" + localStorage.getItem("camName-DXB");

  $(".act").removeClass("active");
  $(abc).addClass("active");
  localStorage.removeItem("breach_image_perimeter");
  var settings = {
    async: true,
    crossDomain: true,
    url: "/get_cam_alerts?name=" + camName,
    // "url": "http://"+base_domainip+"/event-app/get_cam_alerts/saurabh/saurabh/cam-test",
    method: "GET",
    headers: {
      "cache-control": "no-cache",
      "postman-token": "1af61694-676e-5ee6-116a-41b0da1c82f6",
    },
  };

  $.ajax(settings).done(function (response) {
    $("#prioritesTab").empty();
    $("#prioritesTabContent").empty();
    var responseAlerts = response;

    if (responseAlerts.cam_alerts.length > 0) {
      $("#prioritesTab").empty();

      $("#prioritesTabContent").empty();
      for (
        priorites = 0;
        priorites < responseAlerts.priorities.length;
        priorites++
      ) {
        var prioritiesHref = "#" + responseAlerts.priorities[priorites];
        var prioritesFeed = "feed" + responseAlerts.priorities[priorites];
        var listId = "camAlerts" + responseAlerts.priorities[priorites];
        var countNum = "count" + responseAlerts.priorities[priorites];
        $("#prioritesTab").append(
          '<li class="su" ><a href=' +
            prioritiesHref +
            " class=" +
            countNum +
            ' data-toggle="tab">' +
            responseAlerts.priorities[priorites] +
            "</a></li>"
        );
        $("#prioritesTabContent").append(
          ' <div class="tab-pane fade " id=' +
            responseAlerts.priorities[priorites] +
            ">\n" +
            '                                                <div style="margin:0;" class="row">\n' +
            '                                                    <div id="" class="tab-pane active clearfix">\n' +
            "                                                        <div id=" +
            prioritesFeed +
            ' class="feed">\n' +
            '                                                            <ul class="news-list" id=' +
            listId +
            ">\n" +
            "                                                            </ul>\n" +
            "                                                        </div>\n" +
            "                                                    </div>\n" +
            "                                                </div>\n" +
            "                                            </div>"
        );

        // $("#camAlerts" + responseAlerts.cam_alerts[prioritesAlerts].name).append('<li id="alertsDXBA" > <div class="position" style="text-align:center ">No Alerts Found</div> </li>');
      }
      $("#prioritesTab li:first").addClass("active");
      $("#prioritesTabContent div:first").addClass("in active");
      //

      getScripts(["js/index.js"], function () {
        // modifyPerimeter();
      });

      for (
        priorites_name = 0;
        priorites_name < responseAlerts.priorities.length;
        priorites_name++
      ) {
        for (
          prioritesAlerts = 0;
          prioritesAlerts < responseAlerts.cam_alerts.length;
          prioritesAlerts++
        ) {
          if (
            responseAlerts.priorities[priorites_name] ==
            responseAlerts.cam_alerts[prioritesAlerts].name
          ) {
            if (responseAlerts.cam_alerts[prioritesAlerts].Alerts.length > 0) {
              var id_count =
                "countId" + responseAlerts.cam_alerts[prioritesAlerts].name;

              $(
                ".count" + responseAlerts.cam_alerts[prioritesAlerts].name
              ).append(
                '<span class="label label-success" style="font-size: 10px;font-weight: 400;position: relative;right: -5px;padding: 1px 5px;" id=' +
                  id_count +
                  ">" +
                  responseAlerts.cam_alerts[prioritesAlerts].Alerts.length +
                  "</span>"
              );
              // $(".count"+responseAlerts.cam_alerts[prioritesAlerts].name).append('<span class="label label-success" style="font-size: 10px;font-weight: 400;position: relative;right: -5px;padding: 1px 5px;" id='+id_count+'>'+couningval+'</span>');
              $(
                "#camAlerts" + responseAlerts.cam_alerts[prioritesAlerts].name
              ).empty();
              for (
                p1 = 0;
                p1 < responseAlerts.cam_alerts[prioritesAlerts].Alerts.length;
                p1++
              ) {
                // var event_name;
                // if (responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1].alert_2 == "") {
                //     event_name = responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1].alert_1;
                // } else {
                //     event_name = responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1].alert_1 + " | " + responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1].alert_2
                // }
                //
                // var imageAlert = "http://" + localStorage.getItem('DXB_ip') + "/nginx/" + responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1].thumbnail;
                //
                // var cityName = responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1].city + ", " + responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1].state;
                //
                // if(event_name == "Stream Disconnected"){
                //
                //     $("#camAlerts" + responseAlerts.cam_alerts[prioritesAlerts].name).append('<li  class="getAlertData" style="margin: 0 -9px;" flight_id="' + responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1].alert_id + '" airport="' + cityName + '"  terminal="' + responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1].location + '"  camName="' + responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1].cam_name + '"  camera_id="' + responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1].cam_name + '"  event_name="' + event_name + '" event_url="' + responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1].video + '" event_time="' + responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1].date + '" status="' + responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1].alert_status + '"> <img loading="lazy" src="img/camDis.jpg" alt="" class="pull-left img-circle"  onerror="imageerror(this)"/> <div class="news-item-info"> <div class="name"><a href="#">' + event_name + '</a></div> <div class="position">' + "Alert Id: " + responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1].alert_id + '</div> <div class="time" style="font-size: 11px;">Time: ' + responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1].date + '</div> </div> </li>');
                //
                // }else{
                //
                //     $("#camAlerts" + responseAlerts.cam_alerts[prioritesAlerts].name).append('<li  class="getAlertData" style="margin: 0 -9px;" flight_id="' + responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1].alert_id + '" airport="' + cityName + '"  terminal="' + responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1].location + '"   camName="' + responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1].cam_name + '"  camera_id="' + responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1].cam_name + '"  event_name="' + event_name + '" event_url="' + responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1].video + '" event_time="' + responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1].date + '" status="' + responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1].alert_status + '"> <img loading="lazy" src=' + imageAlert + ' alt="" class="pull-left img-circle"  onerror="imageerror(this)"/> <div class="news-item-info"> <div class="name"><a href="#">' + event_name + '</a></div> <div class="position">' + "Alert Id: " + responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1].alert_id + '</div> <div class="time" style="font-size: 11px;">Time: ' + responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1].date + '</div> </div> </li>');
                //
                // }

                if (
                  responseAlerts.cam_alerts[prioritesAlerts].Alerts[
                    p1
                  ].hasOwnProperty("poi_details")
                ) {
                  console.log("poi_here");
                  // $('#poi_deatils_text').show();

                  var string_text = "";
                  for (var key in responseAlerts.cam_alerts[prioritesAlerts]
                    .Alerts[p1].poi_details) {
                    if (
                      key != "_id" &&
                      key != "poi_face_path" &&
                      key != "poi_id"
                    ) {
                      string_text +=
                        key +
                        " : " +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .poi_details[key] +
                        "&#13;&#10;";
                    }
                  }

                  var event_name;
                  if (
                    responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                      .alert_2 == ""
                  ) {
                    event_name =
                      responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                        .alert_1;
                  } else {
                    event_name =
                      responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                        .alert_1 +
                      " | " +
                      responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                        .alert_2;
                  }

                  var imageAlert =
                    "http://" +
                    base_domainip +
                    "/nginx/" +
                    responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                      .thumbnail;

                  var cityName =
                    responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1].city +
                    ", " +
                    responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1].state;

                  if (event_name == "Stream Disconnected") {
                    $(
                      "#camAlerts" +
                        responseAlerts.cam_alerts[prioritesAlerts].name
                    ).append(
                      '<li  class="getAlertData" style="margin: 0 -9px;" flight_id="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .alert_id +
                        '" airport="' +
                        cityName +
                        '"  terminal="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .location +
                        '"   camName="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .cam_name +
                        '"  camera_id="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .cam_name +
                        '"  event_name="' +
                        event_name +
                        '" event_url="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .video +
                        '" thumbnail_url="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .thumbnail +
                        '" event_time="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .date +
                        '" status="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .alert_status +
                        '"> <img loading="lazy" src="img/camDis.jpg" alt="" class="pull-left img-circle"  onerror="imageerror(this)"/> <div class="news-item-info"> <div class="name"><a href="#">' +
                        event_name +
                        '</a></div> <div class="position">' +
                        "Alert Id: " +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .alert_id +
                        '</div> <div class="time" style="font-size: 11px;">Time: ' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .date +
                        "</div> </div> </li>"
                    );
                  } else {
                    $(
                      "#camAlerts" +
                        responseAlerts.cam_alerts[prioritesAlerts].name
                    ).append(
                      '<li  class="getAlertData" style="margin: 0 -9px;" flight_id="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .alert_id +
                        '" airport="' +
                        cityName +
                        '"  terminal="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .location +
                        '"   camName="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .cam_name +
                        '"  camera_id="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .cam_name +
                        '"  event_name="' +
                        event_name +
                        '" event_url="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .video +
                        '" thumbnail_url="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .thumbnail +
                        '" event_time="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .date +
                        '" status="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .alert_status +
                        '" poi_or_voi="poi_details" poi_details="' +
                        string_text +
                        '" > <img loading="lazy" src=' +
                        imageAlert +
                        ' alt="" class="pull-left img-circle"  onerror="imageerror(this)"/> <div class="news-item-info"> <div class="name"><a href="#">' +
                        event_name +
                        '</a></div> <div class="position">' +
                        "Alert Id: " +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .alert_id +
                        '</div> <div class="time" style="font-size: 11px;">Time: ' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .date +
                        "</div> </div> </li>"
                    );
                  }
                } else if (
                  responseAlerts.cam_alerts[prioritesAlerts].Alerts[
                    p1
                  ].hasOwnProperty("voi_details")
                ) {
                  var string_text = "";
                  for (var key in responseAlerts.cam_alerts[prioritesAlerts]
                    .Alerts[p1].voi_details) {
                    if (key != "_id" && key != "voi_id") {
                      string_text +=
                        key +
                        " : " +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .voi_details[key] +
                        "&#13;&#10;";
                    }
                  }

                  var event_name;
                  if (
                    responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                      .alert_2 == ""
                  ) {
                    event_name =
                      responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                        .alert_1;
                  } else {
                    event_name =
                      responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                        .alert_1 +
                      " | " +
                      responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                        .alert_2;
                  }

                  var imageAlert =
                    "http://" +
                    base_domainip +
                    "/nginx/" +
                    responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                      .thumbnail;

                  var cityName =
                    responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1].city +
                    ", " +
                    responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1].state;

                  if (event_name == "Stream Disconnected") {
                    $(
                      "#camAlerts" +
                        responseAlerts.cam_alerts[prioritesAlerts].name
                    ).append(
                      '<li  class="getAlertData" style="margin: 0 -9px;" flight_id="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .alert_id +
                        '" airport="' +
                        cityName +
                        '"  terminal="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .location +
                        '"   camName="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .cam_name +
                        '"  camera_id="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .cam_name +
                        '"  event_name="' +
                        event_name +
                        '" event_url="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .video +
                        '" thumbnail_url="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .thumbnail +
                        '" event_time="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .date +
                        '" status="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .alert_status +
                        '"> <img loading="lazy" src="img/camDis.jpg" alt="" class="pull-left img-circle"  onerror="imageerror(this)"/> <div class="news-item-info"> <div class="name"><a href="#">' +
                        event_name +
                        '</a></div> <div class="position">' +
                        "Alert Id: " +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .alert_id +
                        '</div> <div class="time" style="font-size: 11px;">Time: ' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .date +
                        "</div> </div> </li>"
                    );
                  } else {
                    $(
                      "#camAlerts" +
                        responseAlerts.cam_alerts[prioritesAlerts].name
                    ).append(
                      '<li  class="getAlertData" style="margin: 0 -9px;" flight_id="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .alert_id +
                        '" airport="' +
                        cityName +
                        '"  terminal="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .location +
                        '"   camName="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .cam_name +
                        '"  camera_id="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .cam_name +
                        '"  event_name="' +
                        event_name +
                        '" event_url="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .video +
                        '" thumbnail_url="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .thumbnail +
                        '" event_time="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .date +
                        '" status="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .alert_status +
                        '" poi_or_voi="voi_details" voi_details="' +
                        string_text +
                        '" voi_numberplate="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .number_plate +
                        '" > <img loading="lazy" src=' +
                        imageAlert +
                        ' alt="" class="pull-left img-circle"  onerror="imageerror(this)"/> <div class="news-item-info"> <div class="name"><a href="#">' +
                        event_name +
                        '</a></div> <div class="position">' +
                        "Alert Id: " +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .alert_id +
                        '</div> <div class="time" style="font-size: 11px;">Time: ' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .date +
                        "</div> </div> </li>"
                    );
                  }
                } else {
                  var event_name;
                  if (
                    responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                      .alert_2 == ""
                  ) {
                    event_name =
                      responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                        .alert_1;
                  } else {
                    event_name =
                      responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                        .alert_1 +
                      " | " +
                      responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                        .alert_2;
                  }

                  var imageAlert =
                    "http://" +
                    base_domainip +
                    "/nginx/" +
                    responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                      .thumbnail;

                  var cityName =
                    responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1].city +
                    ", " +
                    responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1].state;

                  if (event_name == "Stream Disconnected") {
                    $(
                      "#camAlerts" +
                        responseAlerts.cam_alerts[prioritesAlerts].name
                    ).append(
                      '<li  class="getAlertData" style="margin: 0 -9px;" flight_id="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .alert_id +
                        '" airport="' +
                        cityName +
                        '"  terminal="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .location +
                        '"   camName="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .cam_name +
                        '"  camera_id="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .cam_name +
                        '"  event_name="' +
                        event_name +
                        '" event_url="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .video +
                        '" thumbnail_url="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .thumbnail +
                        '" event_time="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .date +
                        '" status="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .alert_status +
                        '"> <img loading="lazy" src="img/camDis.jpg" alt="" class="pull-left img-circle"  onerror="imageerror(this)"/> <div class="news-item-info"> <div class="name"><a href="#">' +
                        event_name +
                        '</a></div> <div class="position">' +
                        "Alert Id: " +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .alert_id +
                        '</div> <div class="time" style="font-size: 11px;">Time: ' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .date +
                        "</div> </div> </li>"
                    );
                  } else {
                    $(
                      "#camAlerts" +
                        responseAlerts.cam_alerts[prioritesAlerts].name
                    ).append(
                      '<li  class="getAlertData" style="margin: 0 -9px;" flight_id="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .alert_id +
                        '" airport="' +
                        cityName +
                        '"  terminal="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .location +
                        '"   camName="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .cam_name +
                        '"  camera_id="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .cam_name +
                        '"  event_name="' +
                        event_name +
                        '" event_url="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .video +
                        '" thumbnail_url="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .thumbnail +
                        '" event_time="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .date +
                        '" status="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .alert_status +
                        '"> <img loading="lazy" src=' +
                        imageAlert +
                        ' alt="" class="pull-left img-circle"  onerror="imageerror(this)"/> <div class="news-item-info"> <div class="name"><a href="#">' +
                        event_name +
                        '</a></div> <div class="position">' +
                        "Alert Id: " +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .alert_id +
                        '</div> <div class="time" style="font-size: 11px;">Time: ' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .date +
                        "</div> </div> </li>"
                    );
                  }
                }
              }
              $(
                "#camAlerts" + responseAlerts.cam_alerts[prioritesAlerts].name
              ).paginathing({
                perPage: 8,
                limitPagination:
                  responseAlerts.cam_alerts[prioritesAlerts].Alerts.length > 40
                    ? 5
                    : "",
                containerClass: "panel-footer",
                pageNumbers: true,
              });
            } else {
              $(
                "#camAlerts" + responseAlerts.cam_alerts[prioritesAlerts].name
              ).empty();
              $(
                "#camAlerts" + responseAlerts.cam_alerts[prioritesAlerts].name
              ).append(
                '<li id="alertsDXBA" > <div class="position" style="text-align:center ">No Alerts Found</div> </li>'
              );
            }
          }
        }
      }
    }
  });

  // getScripts(["js/chart/scriptFusion/ganttscript.js"], function () {
  //   fusioncharts();
  // });
  //
  // eventDataTable();

  var camNameDXB = localStorage.getItem("camName-DXB");
  var getcamli = JSON.parse(localStorage.getItem("getcam"));
  // refreshAlertsCurrentCam();
  for (i = 0; i < getcamli.length; i++) {
    for (j = 0; j < getcamli[i].location.length; j++) {
      for (k = 0; k < getcamli[i].location[j].camera.length; k++) {
        if (camNameDXB == getcamli[i].location[j].camera[k].cam_name) {
          if (
            getcamli[i].location[j].camera[k].alert_array.indexOf(
              "Stevedore"
            ) !== -1
          ) {
            display_ganttChart();
          } else {
            console.log("Value does not exists!");
          }
          $("#airportName").empty();
          $("#terminalName").empty();
          // $('#aircraftStandName').empty();
          $("#camName").empty();
          $("#camStatus").empty();
          $("#camurl_bank").empty();
          $("#airportName").append(
            getcamli[i].city + ", " + getcamli[i].location[j].camera[k].state
          );
          $("#terminalName").append(getcamli[i].location[j].name);
          // $('#aircraftStandName').append(getcamli[i].location[j].camera[k].area);
          $("#camName").append(getcamli[i].location[j].camera[k].cam_name);
          $("#camurl_bank").append(
            getcamli[i].location[j].camera[k].cam_input_url
          );
          var statusCamDXB;
          if (getcamli[i].location[j].camera[k].cam_status == "live") {
            statusCamDXB = "Online";
          } else if (
            getcamli[i].location[j].camera[k].cam_status ==
            "Change in Camera Angle"
          ) {
            statusCamDXB = "Offline (Please Reset ERL)";
          }

          $("#camStatus").append(statusCamDXB);

          
          var head = document.getElementsByTagName("head")[0];
          var link = document.createElement("link");
          link.rel = "stylesheet";
          link.type = "text/css";
          link.href = "js/video-js/video-js.css";
          link.media = "all";
          head.appendChild(link);
          display();

          var rtmp_ur =
            "ws://" +
            base_domainip.split(":")[0] +
            ":" +
            getcamli[i].location[j].camera[k].cam_output_url?.split(":")[2];

          // var rtmp_ur = "rtmp://3.129.60.82/live/test.flv";
          //var rtmp_ur ="rtmp://18.222.116.6/live/raven.flv"

          $("#videoDiv").empty();
          $("#videoDiv").show();
          $("body").css("overflow", "auto");

          string1 = rtmp_ur;

          $("#canvas_vid").remove();
          $("#videoDiv").append(
            '<canvas id="canvas_vid" style="width:100%;height:' +
              canvasHeight +
              'px"></canvas>'
          );

          if (player) {
            player.destroy();
          }

          getScripts(["js/jsmpeg/jsmpeg.min.js"], function () {
            player = new JSMpeg.Player(rtmp_ur, {
              canvas: document.getElementById("canvas_vid"), // Canvas should be a canvas DOM element
            });
          });

          // if (videojs.getPlayers()["my_video_1"]) {
          //   videojs("my_video_1").dispose();
          //   $("#videoDiv").append(
          //     '<video id="my_video_1" muted class="video-js vjs-default-skin" controls preload="auto" style="width:100%;height:625px"\n' +
          //       "               data-setup='{}'>\n" +
          //       "            <source src=" +
          //       string1 +
          //       "  type='application/x-mpegURL'>\n" +
          //       "        </video>"
          //   );
          //   // $('#videoDiv').append(' <source src="http://192.168.10.8/nginx/hls/aka/manifest.m3u8"  type=\'application/x-mpegURL\'>');
          //   videojs("my_video_1").play();
          //   // player.play();
          //   setTimeout(function () {
          //     // $('.vjs-big-play-button').trigger('click');
          //   }, 500);
          //   $("#my_video_1_html5_api").css("height", "-webkit-fill-available");
          $("#videoDiv").append(
            '<div class="alert alert-warning alert-sm pull-right no-margin" id="app-alert" style=" padding:6px; background-color:rgb(10 10 10);; border-color:#373b3f; position: absolute;top: 55px;right: 2px; display:none;">\n' +
              '                            <span class="fw-semi-bold">Person Count:</span> <span id="person_count">-</span>\n' +
              "                        </div>"
          );
          // }
          // else {
          //   $("#videoDiv").append(
          //     '<video id="my_video_1" muted class="video-js vjs-default-skin" controls preload="auto" style="width:100%;height:625px"\n' +
          //       "               data-setup='{}'>\n" +
          //       "            <source src=" +
          //       string1 +
          //       "  type='application/x-mpegURL'>\n" +
          //       "        </video>"
          //   );
          //   // $('#videoDiv').append(' <source src="http://192.168.10.8/nginx/hls/aka/manifest.m3u8"  type=\'application/x-mpegURL\'>');
          //   videojs("my_video_1").play();
          //   // player.play();
          //   setTimeout(function () {
          //     // $('.vjs-big-play-button').trigger('click');
          //   }, 500);
          //   $("#my_video_1_html5_api").css("height", "-webkit-fill-available");
          //
          //   $(".vjs-default-skin").append(
          //     '<div class="alert alert-warning alert-sm pull-right no-margin" id="app-alert" style=" padding:6px; background-color:rgb(10 10 10);; border-color:#373b3f; position: absolute;top: 2px;right: 2px; display:none;">\n' +
          //       '                            <span class="fw-semi-bold">Person Count:</span> <span id="person_count">-</span>\n' +
          //       "                        </div>"
          //   );
          // }

          // $('#videoDiv').empty();

          // videojs('vid1').dispose();

          // string1 = string1.slice(0, -4);

          // if(videojs.getPlayers()['vid1']) {
          //     videojs('vid1').dispose();
          //     var videoDiv = document.getElementById('videoDiv');
          //     var video = document.createElement('video');
          //     var source = document.createElement('source');
          //     video.id = 'vid1';
          //     video.className = 'video-js vjs-default-skin';
          //     video.setAttribute('controls', 'controls');
          //     video.setAttribute('preload', 'auto');
          //     video.setAttribute('data-setup', '{}');
          //     source.setAttribute('src', string1);
          //     source.setAttribute('type', 'application/x-mpegURL');
          //     video.appendChild(source);
          //     videoDiv.appendChild(video);
          //     document.getElementById("vid1").style["width"] = "100%";
          //     document.getElementById("vid1").style["height"] = "659px";
          //
          //     // videojs('vid1');
          //     // videojs('vid1', {}, function () {
          //     // });
          //     // videojs('vid1').load();
          //     // videojs('vid1').play();
          //     videojs('vid1');
          // }
          // else {
          //     var videoDiv = document.getElementById('videoDiv');
          //     var video = document.createElement('video');
          //     var source = document.createElement('source');
          //     video.id = 'vid1';
          //     video.className = 'video-js vjs-default-skin';
          //     video.setAttribute('controls', 'controls');
          //     video.setAttribute('preload', 'auto');
          //     video.setAttribute('data-setup', '{}');
          //     source.setAttribute('src', string1);
          //     source.setAttribute('type', 'application/x-mpegURL');
          //     video.appendChild(source);
          //     videoDiv.appendChild(video);
          //     document.getElementById("vid1").style["width"] = "100%";
          //     document.getElementById("vid1").style["height"] = "659px";
          //
          //     // videojs('vid1');
          //     // videojs('vid1', {}, function () {
          //     // });
          //     // videojs('vid1').load();
          //     // videojs('vid1').play();
          //     videojs('vid1');
          //
          // }

          // refreshAlertsCurrentCam();

          return;
        } else {
          // if(camNameDXB != getcamli[i].Terminals[j].camera[k].camName){

          $("#airportName").empty();
          $("#terminalName").empty();
          $("#aircraftStandName").empty();
          $("#camName").empty();
          $("#camStatus").empty();
          $("#airportName").append("-");
          $("#terminalName").append("-");
          $("#aircraftStandName").append("-");
          $("#camName").append("-");
          $("#camStatus").append("-");

          $("#eventsDXB").empty();
          $("#eventsDXB").append(
            '<div id="loadingEvent" class="position eventsDXBA" style="text-align:center ">No Events Found</div>'
          );

          $("#camAlertsDXB").empty();

          $("#camAlertsDXB").append(
            '<li id="alertsDXBA" > <div class="position" style="text-align:center ">No Alerts Found</div> </li>'
          );
          // }
        }
      }
    }
  }
}

refreshAlertsCurrentCam = function () {
  $("#camAlertsDXB").empty();
  $("#prioritesTab").empty();
  $("#prioritesTabContent").empty();

  var settings = {
    async: true,
    crossDomain: true,
    url: "/get_cam_alerts?name=" + $("li.active").attr("id"),
    method: "GET",
    headers: {
      "cache-control": "no-cache",
      "postman-token": "1af61694-676e-5ee6-116a-41b0da1c82f6",
    },
  };

  $.ajax(settings).done(function (response) {
    $("#prioritesTab").empty();
    $("#prioritesTabContent").empty();
    var responseAlerts = response;

    if (responseAlerts.cam_alerts.length > 0) {
      $("#prioritesTab").empty();

      $("#prioritesTabContent").empty();
      for (
        priorites = 0;
        priorites < responseAlerts.priorities.length;
        priorites++
      ) {
        var prioritiesHref = "#" + responseAlerts.priorities[priorites];
        var prioritesFeed = "feed" + responseAlerts.priorities[priorites];
        var listId = "camAlerts" + responseAlerts.priorities[priorites];
        var countNum = "count" + responseAlerts.priorities[priorites];
        $("#prioritesTab").append(
          '<li class="su" ><a href=' +
            prioritiesHref +
            " class=" +
            countNum +
            ' data-toggle="tab">' +
            responseAlerts.priorities[priorites] +
            "</a></li>"
        );
        $("#prioritesTabContent").append(
          ' <div class="tab-pane fade " id=' +
            responseAlerts.priorities[priorites] +
            ">\n" +
            '                                                <div style="margin:0;" class="row">\n' +
            '                                                    <div id="" class="tab-pane active clearfix">\n' +
            "                                                        <div id=" +
            prioritesFeed +
            ' class="feed">\n' +
            '                                                            <ul class="news-list" id=' +
            listId +
            ">\n" +
            "                                                            </ul>\n" +
            "                                                        </div>\n" +
            "                                                    </div>\n" +
            "                                                </div>\n" +
            "                                            </div>"
        );

        // $("#camAlerts" + responseAlerts.cam_alerts[prioritesAlerts].name).append('<li id="alertsDXBA" > <div class="position" style="text-align:center ">No Alerts Found</div> </li>');
      }
      $("#prioritesTab li:first").addClass("active");
      $("#prioritesTabContent div:first").addClass("in active");
      //

      getScripts(["js/index.js"], function () {
        // modifyPerimeter();
      });

      for (
        priorites_name = 0;
        priorites_name < responseAlerts.priorities.length;
        priorites_name++
      ) {
        for (
          prioritesAlerts = 0;
          prioritesAlerts < responseAlerts.cam_alerts.length;
          prioritesAlerts++
        ) {
          if (
            responseAlerts.priorities[priorites_name] ==
            responseAlerts.cam_alerts[prioritesAlerts].name
          ) {
            if (responseAlerts.cam_alerts[prioritesAlerts].Alerts.length > 0) {
              var id_count =
                "countId" + responseAlerts.cam_alerts[prioritesAlerts].name;

              $(
                ".count" + responseAlerts.cam_alerts[prioritesAlerts].name
              ).append(
                '<span class="label label-success" style="font-size: 10px;font-weight: 400;position: relative;right: -5px;padding: 1px 5px;" id=' +
                  id_count +
                  ">" +
                  responseAlerts.cam_alerts[prioritesAlerts].Alerts.length +
                  "</span>"
              );
              // $(".count"+responseAlerts.cam_alerts[prioritesAlerts].name).append('<span class="label label-success" style="font-size: 10px;font-weight: 400;position: relative;right: -5px;padding: 1px 5px;" id='+id_count+'>'+couningval+'</span>');
              $(
                "#camAlerts" + responseAlerts.cam_alerts[prioritesAlerts].name
              ).empty();
              for (
                p1 = 0;
                p1 < responseAlerts.cam_alerts[prioritesAlerts].Alerts.length;
                p1++
              ) {
                // var event_name;
                // if (responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1].alert_2 == "") {
                //     event_name = responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1].alert_1;
                // } else {
                //     event_name = responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1].alert_1 + " | " + responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1].alert_2
                // }
                //
                // var imageAlert = "http://" + localStorage.getItem('DXB_ip') + "/nginx/" + responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1].thumbnail;
                //
                // var cityName = responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1].city + ", " + responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1].state;
                //
                // if(event_name == "Stream Disconnected"){
                //
                //     $("#camAlerts" + responseAlerts.cam_alerts[prioritesAlerts].name).append('<li  class="getAlertData" style="margin: 0 -9px;" flight_id="' + responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1].alert_id + '" airport="' + cityName + '"  terminal="' + responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1].location + '"  camName="' + responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1].cam_name + '"  camera_id="' + responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1].cam_name + '"  event_name="' + event_name + '" event_url="' + responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1].video + '" event_time="' + responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1].date + '" status="' + responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1].alert_status + '"> <img loading="lazy" src="img/camDis.jpg" alt="" class="pull-left img-circle"  onerror="imageerror(this)"/> <div class="news-item-info"> <div class="name"><a href="#">' + event_name + '</a></div> <div class="position">' + "Alert Id: " + responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1].alert_id + '</div> <div class="time" style="font-size: 11px;">Time: ' + responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1].date + '</div> </div> </li>');
                //
                // }else{
                //
                //     $("#camAlerts" + responseAlerts.cam_alerts[prioritesAlerts].name).append('<li  class="getAlertData" style="margin: 0 -9px;" flight_id="' + responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1].alert_id + '" airport="' + cityName + '"  terminal="' + responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1].location + '"   camName="' + responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1].cam_name + '"  camera_id="' + responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1].cam_name + '"  event_name="' + event_name + '" event_url="' + responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1].video + '" event_time="' + responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1].date + '" status="' + responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1].alert_status + '"> <img loading="lazy" src=' + imageAlert + ' alt="" class="pull-left img-circle"  onerror="imageerror(this)"/> <div class="news-item-info"> <div class="name"><a href="#">' + event_name + '</a></div> <div class="position">' + "Alert Id: " + responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1].alert_id + '</div> <div class="time" style="font-size: 11px;">Time: ' + responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1].date + '</div> </div> </li>');
                //
                // }

                if (
                  responseAlerts.cam_alerts[prioritesAlerts].Alerts[
                    p1
                  ].hasOwnProperty("poi_details")
                ) {
                  console.log("poi_here");
                  // $('#poi_deatils_text').show();

                  var string_text = "";
                  for (var key in responseAlerts.cam_alerts[prioritesAlerts]
                    .Alerts[p1].poi_details) {
                    if (
                      key != "_id" &&
                      key != "poi_face_path" &&
                      key != "poi_id"
                    ) {
                      string_text +=
                        key +
                        " : " +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .poi_details[key] +
                        "&#13;&#10;";
                    }
                  }

                  var event_name;
                  if (
                    responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                      .alert_2 == ""
                  ) {
                    event_name =
                      responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                        .alert_1;
                  } else {
                    event_name =
                      responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                        .alert_1 +
                      " | " +
                      responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                        .alert_2;
                  }

                  var imageAlert =
                    "http://" +
                    base_domainip +
                    "/nginx/" +
                    responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                      .thumbnail;

                  var cityName =
                    responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1].city +
                    ", " +
                    responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1].state;

                  if (event_name == "Stream Disconnected") {
                    $(
                      "#camAlerts" +
                        responseAlerts.cam_alerts[prioritesAlerts].name
                    ).append(
                      '<li  class="getAlertData" style="margin: 0 -9px;" flight_id="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .alert_id +
                        '" airport="' +
                        cityName +
                        '"  terminal="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .location +
                        '"   camName="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .cam_name +
                        '"  camera_id="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .cam_name +
                        '"  event_name="' +
                        event_name +
                        '" event_url="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .video +
                        '" thumbnail_url="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .thumbnail +
                        '" event_time="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .date +
                        '" status="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .alert_status +
                        '"> <img loading="lazy" src="img/camDis.jpg" alt="" class="pull-left img-circle"  onerror="imageerror(this)"/> <div class="news-item-info"> <div class="name"><a href="#">' +
                        event_name +
                        '</a></div> <div class="position">' +
                        "Alert Id: " +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .alert_id +
                        '</div> <div class="time" style="font-size: 11px;">Time: ' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .date +
                        "</div> </div> </li>"
                    );
                  } else {
                    $(
                      "#camAlerts" +
                        responseAlerts.cam_alerts[prioritesAlerts].name
                    ).append(
                      '<li  class="getAlertData" style="margin: 0 -9px;" flight_id="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .alert_id +
                        '" airport="' +
                        cityName +
                        '"  terminal="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .location +
                        '"   camName="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .cam_name +
                        '"  camera_id="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .cam_name +
                        '"  event_name="' +
                        event_name +
                        '" event_url="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .video +
                        '" thumbnail_url="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .thumbnail +
                        '" event_time="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .date +
                        '" status="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .alert_status +
                        '" poi_or_voi="poi_details" poi_details="' +
                        string_text +
                        '" > <img loading="lazy" src=' +
                        imageAlert +
                        ' alt="" class="pull-left img-circle"  onerror="imageerror(this)"/> <div class="news-item-info"> <div class="name"><a href="#">' +
                        event_name +
                        '</a></div> <div class="position">' +
                        "Alert Id: " +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .alert_id +
                        '</div> <div class="time" style="font-size: 11px;">Time: ' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .date +
                        "</div> </div> </li>"
                    );
                  }
                } else if (
                  responseAlerts.cam_alerts[prioritesAlerts].Alerts[
                    p1
                  ].hasOwnProperty("voi_details")
                ) {
                  var string_text = "";
                  for (var key in responseAlerts.cam_alerts[prioritesAlerts]
                    .Alerts[p1].voi_details) {
                    if (key != "_id" && key != "voi_id") {
                      string_text +=
                        key +
                        " : " +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .voi_details[key] +
                        "&#13;&#10;";
                    }
                  }

                  var event_name;
                  if (
                    responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                      .alert_2 == ""
                  ) {
                    event_name =
                      responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                        .alert_1;
                  } else {
                    event_name =
                      responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                        .alert_1 +
                      " | " +
                      responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                        .alert_2;
                  }

                  var imageAlert =
                    "http://" +
                    base_domainip +
                    "/nginx/" +
                    responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                      .thumbnail;

                  var cityName =
                    responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1].city +
                    ", " +
                    responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1].state;

                  if (event_name == "Stream Disconnected") {
                    $(
                      "#camAlerts" +
                        responseAlerts.cam_alerts[prioritesAlerts].name
                    ).append(
                      '<li  class="getAlertData" style="margin: 0 -9px;" flight_id="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .alert_id +
                        '" airport="' +
                        cityName +
                        '"  terminal="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .location +
                        '"   camName="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .cam_name +
                        '"  camera_id="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .cam_name +
                        '"  event_name="' +
                        event_name +
                        '" event_url="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .video +
                        '" thumbnail_url="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .thumbnail +
                        '" event_time="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .date +
                        '" status="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .alert_status +
                        '"> <img loading="lazy" src="img/camDis.jpg" alt="" class="pull-left img-circle"  onerror="imageerror(this)"/> <div class="news-item-info"> <div class="name"><a href="#">' +
                        event_name +
                        '</a></div> <div class="position">' +
                        "Alert Id: " +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .alert_id +
                        '</div> <div class="time" style="font-size: 11px;">Time: ' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .date +
                        "</div> </div> </li>"
                    );
                  } else {
                    $(
                      "#camAlerts" +
                        responseAlerts.cam_alerts[prioritesAlerts].name
                    ).append(
                      '<li  class="getAlertData" style="margin: 0 -9px;" flight_id="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .alert_id +
                        '" airport="' +
                        cityName +
                        '"  terminal="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .location +
                        '"   camName="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .cam_name +
                        '"  camera_id="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .cam_name +
                        '"  event_name="' +
                        event_name +
                        '" event_url="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .video +
                        '" thumbnail_url="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .thumbnail +
                        '" event_time="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .date +
                        '" status="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .alert_status +
                        '" poi_or_voi="voi_details" voi_details="' +
                        string_text +
                        '" voi_numberplate="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .number_plate +
                        '"  > <img loading="lazy" src=' +
                        imageAlert +
                        ' alt="" class="pull-left img-circle"  onerror="imageerror(this)"/> <div class="news-item-info"> <div class="name"><a href="#">' +
                        event_name +
                        '</a></div> <div class="position">' +
                        "Alert Id: " +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .alert_id +
                        '</div> <div class="time" style="font-size: 11px;">Time: ' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .date +
                        "</div> </div> </li>"
                    );
                  }
                } else {
                  var event_name;
                  if (
                    responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                      .alert_2 == ""
                  ) {
                    event_name =
                      responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                        .alert_1;
                  } else {
                    event_name =
                      responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                        .alert_1 +
                      " | " +
                      responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                        .alert_2;
                  }

                  var imageAlert =
                    "http://" +
                    base_domainip +
                    "/nginx/" +
                    responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                      .thumbnail;

                  var cityName =
                    responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1].city +
                    ", " +
                    responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1].state;

                  if (event_name == "Stream Disconnected") {
                    $(
                      "#camAlerts" +
                        responseAlerts.cam_alerts[prioritesAlerts].name
                    ).append(
                      '<li  class="getAlertData" style="margin: 0 -9px;" flight_id="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .alert_id +
                        '" airport="' +
                        cityName +
                        '"  terminal="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .location +
                        '"   camName="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .cam_name +
                        '"  camera_id="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .cam_name +
                        '"  event_name="' +
                        event_name +
                        '" event_url="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .video +
                        '" thumbnail_url="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .thumbnail +
                        '" event_time="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .date +
                        '" status="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .alert_status +
                        '"> <img loading="lazy" src="img/camDis.jpg" alt="" class="pull-left img-circle"  onerror="imageerror(this)"/> <div class="news-item-info"> <div class="name"><a href="#">' +
                        event_name +
                        '</a></div> <div class="position">' +
                        "Alert Id: " +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .alert_id +
                        '</div> <div class="time" style="font-size: 11px;">Time: ' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .date +
                        "</div> </div> </li>"
                    );
                  } else {
                    $(
                      "#camAlerts" +
                        responseAlerts.cam_alerts[prioritesAlerts].name
                    ).append(
                      '<li  class="getAlertData" style="margin: 0 -9px;" flight_id="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .alert_id +
                        '" airport="' +
                        cityName +
                        '"  terminal="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .location +
                        '"   camName="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .cam_name +
                        '"  camera_id="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .cam_name +
                        '"  event_name="' +
                        event_name +
                        '" event_url="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .video +
                        '" thumbnail_url="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .thumbnail +
                        '" event_time="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .date +
                        '" status="' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .alert_status +
                        '"> <img loading="lazy" src=' +
                        imageAlert +
                        ' alt="" class="pull-left img-circle"  onerror="imageerror(this)"/> <div class="news-item-info"> <div class="name"><a href="#">' +
                        event_name +
                        '</a></div> <div class="position">' +
                        "Alert Id: " +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .alert_id +
                        '</div> <div class="time" style="font-size: 11px;">Time: ' +
                        responseAlerts.cam_alerts[prioritesAlerts].Alerts[p1]
                          .date +
                        "</div> </div> </li>"
                    );
                  }
                }
              }
              $(
                "#camAlerts" + responseAlerts.cam_alerts[prioritesAlerts].name
              ).paginathing({
                perPage: 8,
                limitPagination:
                  responseAlerts.cam_alerts[prioritesAlerts].Alerts.length > 40
                    ? 5
                    : "",
                containerClass: "panel-footer",
                pageNumbers: true,
              });
            } else {
              $(
                "#camAlerts" + responseAlerts.cam_alerts[prioritesAlerts].name
              ).empty();
              $(
                "#camAlerts" + responseAlerts.cam_alerts[prioritesAlerts].name
              ).append(
                '<li id="alertsDXBA" > <div class="position" style="text-align:center ">No Alerts Found</div> </li>'
              );
            }
          }
        }
      }
    }
  });
};

//click any alert to play alert video
$(document).on("click", ".getAlertData", function () {
  $(".updatevehicleNumber").hide();

  // data-toggle="modal" data-target="#alertsModal"
  var exit_attr = $(this).attr("poi_or_voi");

  console.log(typeof exit_attr);
  if (["poi_details"].includes(exit_attr)) {
    var poi_details_fromapi = $(this).attr("poi_details");
    $("#voi_deatils_text").hide();
    $("#poi_deatils_text").show();
    $("#poi_det_api_text").empty();
    $("#poi_det_api_text").append(poi_details_fromapi);
    console.log(exit_attr);

    var flight_id = $(this).attr("flight_id");
    var airport = $(this).attr("airport");
    var terminal = $(this).attr("terminal");
    // var stand_type=$(this).attr("stand_type");
    var event_name = $(this).attr("event_name");
    var camName = $(this).attr("camName");
    var event_time = $(this).attr("event_time");
    var status = $(this).attr("status");
    var thumbnail_url =
      "http://" + base_domainip + "/nginx/" + $(this).attr("thumbnail_url");
    var event_url = $(this).attr("event_url");
    var event_url = (event_url =
      event_url == ""
        ? "img/video/monitoringdisabled.mp4"
        : "http://" + base_domainip + "/nginx/" + event_url);
    // show modal box
    $("#alertsModal").modal("show");
    // $('#alertsModal').modal({backdrop: 'static', keyboard: false})

    // empty all alert info.
    $("#airport_Alerts").empty();
    $("#terminal_Alerts").empty();
    // $('#stand_type_Alerts').empty();
    $("#event_name_Alerts").empty();
    $("#cam_name_Alerts").empty();
    $("#event_time_Alerts").empty();
    $("#status_Alerts").empty();

    $("#alert_id_s").empty();

    // fill all details for alert info.
    $("#alert_id_s").append("#" + flight_id);
    $("#airport_Alerts").append(airport);
    $("#terminal_Alerts").append(terminal);
    // $('#stand_type_Alerts').append(stand_type);
    $("#event_name_Alerts").append(event_name);
    $("#cam_name_Alerts").append(camName);
    $("#event_time_Alerts").append(event_time);
    $("#status_Alerts").append(status);

    changeSource(event_url, thumbnail_url);
  } else if (["voi_details"].includes(exit_attr)) {
    var voi_details_fromapi = $(this).attr("voi_details");
    var numberplateimg = $(this).attr("voi_numberplate");

    $("#poi_deatils_text").hide();
    $("#voi_deatils_text").show();
    $("#voi_det_api_text").empty();
    $("#voi_det_api_text").val(voi_details_fromapi);
    $("#voi_det_number_img").attr(
      "src",
      "http://" + base_domainip + "/nginx/" + numberplateimg
    );

    var flight_id = $(this).attr("flight_id");
    var airport = $(this).attr("airport");
    var terminal = $(this).attr("terminal");
    // var stand_type=$(this).attr("stand_type");
    var event_name = $(this).attr("event_name");
    var camName = $(this).attr("camName");
    var event_time = $(this).attr("event_time");
    var status = $(this).attr("status");
    var thumbnail_url =
      "http://" + base_domainip + "/nginx/" + $(this).attr("thumbnail_url");
    var event_url = $(this).attr("event_url");
    event_url =
      event_url == ""
        ? "img/video/monitoringdisabled.mp4"
        : "http://" + base_domainip + "/nginx/" + event_url;

    // show modal box
    $("#alertsModal").modal("show");
    // $('#alertsModal').modal({backdrop: 'static', keyboard: false})

    // empty all alert info.
    $("#airport_Alerts").empty();
    $("#terminal_Alerts").empty();
    // $('#stand_type_Alerts').empty();
    $("#event_name_Alerts").empty();
    $("#cam_name_Alerts").empty();
    $("#event_time_Alerts").empty();
    $("#status_Alerts").empty();

    $("#alert_id_s").empty();

    // fill all details for alert info.
    $("#alert_id_s").append("#" + flight_id);
    $("#airport_Alerts").append(airport);
    $("#terminal_Alerts").append(terminal);
    // $('#stand_type_Alerts').append(stand_type);
    $("#event_name_Alerts").append(event_name);
    $("#cam_name_Alerts").append(camName);
    $("#event_time_Alerts").append(event_time);
    $("#status_Alerts").append(status);

    changeSource(event_url, thumbnail_url);
  } else {
    $("#voi_det_api_text").empty();
    $("#poi_det_api_text").empty();
    $("#poi_deatils_text").hide();
    $("#voi_deatils_text").hide();

    var flight_id = $(this).attr("flight_id");
    var airport = $(this).attr("airport");
    var terminal = $(this).attr("terminal");
    // var stand_type=$(this).attr("stand_type");
    var event_name = $(this).attr("event_name");
    var camName = $(this).attr("camName");
    var event_time = $(this).attr("event_time");
    var status = $(this).attr("status");
    var thumbnail_url =
      "http://" + base_domainip + "/nginx/" + $(this).attr("thumbnail_url");
    var event_url = $(this).attr("event_url");
    event_url =
      event_url == ""
        ? "img/video/monitoringdisabled.mp4"
        : "http://" + base_domainip + "/nginx/" + event_url;

    // show modal box
    $("#alertsModal").modal("show");
    // $('#alertsModal').modal({backdrop: 'static', keyboard: false})

    // empty all alert info.
    $("#airport_Alerts").empty();
    $("#terminal_Alerts").empty();
    // $('#stand_type_Alerts').empty();
    $("#event_name_Alerts").empty();
    $("#cam_name_Alerts").empty();
    $("#event_time_Alerts").empty();
    $("#status_Alerts").empty();

    $("#alert_id_s").empty();

    // fill all details for alert info.
    $("#alert_id_s").append("#" + flight_id);
    $("#airport_Alerts").append(airport);
    $("#terminal_Alerts").append(terminal);
    // $('#stand_type_Alerts').append(stand_type);
    $("#event_name_Alerts").append(event_name);
    $("#cam_name_Alerts").append(camName);
    $("#event_time_Alerts").append(event_time);
    $("#status_Alerts").append(status);

    changeSource(event_url, thumbnail_url);
  }
});

//update url in alert modal box
function changeSource(url, thumbnail) {
  var getVideo = document.getElementById("videoAlerts");
  var getSource = document.getElementById("videoSourceAlerts");
  getSource.setAttribute("src", url);
  getVideo.setAttribute("poster", thumbnail);
  getVideo.load();
  getVideo.play();
}

//colse alert box
close_modal = function () {
  document.getElementById("videoAlerts").pause();
};

// modify ERL
modalModifyPerimeter = function () {
  // $('#svg_div').remove();
  // getScripts(["js/perimeter/modifyPerimeter.js"], function () {
  //     modifyPerimeter()
  //
  // });
  if ($("li.active").attr("id") == undefined) {
    Messenger().post({
      message: "Please select camera or add new camera to reset ERL",
      type: "error",
      showCloseButton: true,
    });
  } else {
    $("body").append(
      '<div class="modal-backdrop fade in" style="opacity: 0.5;"><i style="position: absolute;top: 15%;left: 50%; font-size: 24px;" class="fa fa-circle-o-notch fa-spin"></i></div>'
    );
    $("#svg_div").remove();
    getScripts(["js/perimeter/modifyPerimeter.js"], function () {
      modifyPerimeter();
    });
  }
};

deleteCamDXB = function () {
  if ($("li.active").attr("id") == undefined) {
    Messenger().post({
      message: "Please select camera or add new camera to delete camera",
      type: "error",
      showCloseButton: true,
    });
  } else {
    $("#deleteCamDXB").modal("show");
    $("#camDxblocal").empty();
    $("#camDxblocal").append($("li.active").attr("id"));
  }
  // $('#deleteCamDXB').modal('show');
  // $('#camDxblocal').empty();
  // $('#camDxblocal').append(localStorage.getItem('camName-DXB'));
};

var arraymodifyList = [];

modifyCamDXB = function () {
  if ($("li.active").attr("id") == undefined) {
    Messenger().post({
      message: "Please select camera or add new camera to delete camera",
      type: "error",
      showCloseButton: true,
    });
  } else {
    var getcamli = JSON.parse(localStorage.getItem("getcam"));
    var camNameDXB = localStorage.getItem("camName-DXB");

    for (i = 0; i < getcamli.length; i++) {
      for (j = 0; j < getcamli[i].location.length; j++) {
        for (k = 0; k < getcamli[i].location[j].camera.length; k++) {
          if (camNameDXB == getcamli[i].location[j].camera[k].cam_name) {
            arraymodifyList =
              getcamli[i].location[j].camera[k].alert_detection_arr;
          }
        }
      }
    }

    document.getElementById("checkboxArson").checked = false;
    document.getElementById("checkboxExplosion").checked = false;
    document.getElementById("checkboxFighting").checked = false;
    document.getElementById("checkboxRoadAccident").checked = false;
    document.getElementById("checkboxRobbery").checked = false;
    document.getElementById("checkboxShooting").checked = false;
    document.getElementById("checkboxVandalism").checked = false;
    // document.getElementById("checkboxFire").checked = false;
    document.getElementById("checkboxSnatching").checked = false;
    document.getElementById("checkboxProtest").checked = false;
    document.getElementById("checkboxRiot").checked = false;
    EventsArrayList_DemoLive = [];
    EventsArrayListLive = [];
    for (l = 0; l < arraymodifyList.length; l++) {
      for (n = 0; n < defultAlertDict.length; n++) {
        if (arraymodifyList[l] == defultAlertDict[n].alert_name) {
          autochecklist(defultAlertDict[n]);
        }
      }
    }

    $("#modifycctvDXB").modal("show");

    // $('#camDxbmodify').empty();
    // $('#camDxbmodify').append($('li.active').attr('id'));
  }

  // $('#deleteCamDXB').modal('show');
  // $('#camDxblocal').empty();
  // $('#camDxblocal').append(localStorage.getItem('camName-DXB'));
};

var EventsArrayListLive = [];
var EventsArrayList_DemoLive = [];
var perimeter_Val;
var motion_Val;

var defultAlertDict = [
  { id: "checkboxArson", alert_name: "Arson" },
  { id: "checkboxExplosion", alert_name: "Explosion" },
  { id: "checkboxRoadAccident", alert_name: "Road Accident" },
  { id: "checkboxSnatching", alert_name: "Snatching" },
  { id: "checkboxFighting", alert_name: "Fighting" },
  { id: "checkboxFire", alert_name: "Fire" },
  { id: "checkboxRobbery", alert_name: "Robbery" },
  { id: "checkboxShooting", alert_name: "Shooting" },
  { id: "checkboxVandalism", alert_name: "Vandalism" },
  { id: "checkboxProtest", alert_name: "Protest" },
  { id: "checkboxRiot", alert_name: "Riot" },
  { id: "checkboxSelectAll", alert_name: "Select All" },
];

var autochecklist = function (eventName) {
  var idx = $.inArray(EventName, EventsArrayList_DemoLive);
  var EventName = eventName.alert_name;
  var id = eventName.id;
  if (idx == -1) {
    EventsArrayListLive.push(EventName);
    EventsArrayList_DemoLive.push(EventName);
    document.getElementById(id).checked = true;
  }
};

var getArrayEventsListLive = function (eventName) {
  var EventName = $(eventName).attr("value");

  var idx = $.inArray(EventName, EventsArrayList_DemoLive);

  if (EventName == "Perimeter Breach") {
    if (idx == -1) {
      $("#ERLDraw").show();
      perimeter_Val = 1;
      EventsArrayList_DemoLive.push(EventName);
    } else {
      perimeter_Val = 0;
      $("#ERLDraw").hide();
      EventsArrayList_DemoLive.splice(idx, 1);
    }
  } else if (EventName == "Motion Detection") {
    if (idx == -1) {
      motion_Val = 1;
      // EventsArrayList.push(EventName);
      EventsArrayList_DemoLive.push(EventName);
    } else {
      motion_Val = 0;
      // EventsArrayList.splice(idx, 1);
      EventsArrayList_DemoLive.splice(idx, 1);
    }
  } else if (EventName == "Select All") {
    // if (idx == -1) {
    //     motion_Val=1;
    //     // EventsArrayList.push(EventName);
    //     EventsArrayList_Demo.push(EventName);
    // } else {
    //     motion_Val=0;
    //     // EventsArrayList.splice(idx, 1);
    //     EventsArrayList_Demo.splice(idx, 1);
    // EventsArrayList_Demo.push("Robbery");
    // }

    if (document.getElementById("checkboxSelectAll").checked) {
      EventsArrayList_DemoLive = [];

      document.getElementById("checkboxArson").checked = true;
      EventsArrayList_DemoLive.push(
        document.getElementById("checkboxArson").value
      );
      document.getElementById("checkboxExplosion").checked = true;
      EventsArrayList_DemoLive.push(
        document.getElementById("checkboxExplosion").value
      );
      document.getElementById("checkboxFighting").checked = true;
      EventsArrayList_DemoLive.push(
        document.getElementById("checkboxFighting").value
      );
      document.getElementById("checkboxRoadAccident").checked = true;
      EventsArrayList_DemoLive.push(
        document.getElementById("checkboxRoadAccident").value
      );
      document.getElementById("checkboxRobbery").checked = true;
      EventsArrayList_DemoLive.push(
        document.getElementById("checkboxRobbery").value
      );
      document.getElementById("checkboxShooting").checked = true;
      EventsArrayList_DemoLive.push(
        document.getElementById("checkboxShooting").value
      );
      document.getElementById("checkboxVandalism").checked = true;
      EventsArrayList_DemoLive.push(
        document.getElementById("checkboxVandalism").value
      );
      // document.getElementById("checkboxFire").checked = true;
      // EventsArrayList_DemoLive.push(document.getElementById("checkboxFire").value);
      document.getElementById("checkboxSnatching").checked = true;
      EventsArrayList_DemoLive.push(
        document.getElementById("checkboxSnatching").value
      );
      document.getElementById("checkboxProtest").checked = true;
      EventsArrayList_DemoLive.push(
        document.getElementById("checkboxProtest").value
      );
      document.getElementById("checkboxRiot").checked = true;
      EventsArrayList_DemoLive.push(
        document.getElementById("checkboxRiot").value
      );
    } else {
      document.getElementById("checkboxArson").checked = false;
      document.getElementById("checkboxExplosion").checked = false;
      document.getElementById("checkboxFighting").checked = false;
      document.getElementById("checkboxRoadAccident").checked = false;
      document.getElementById("checkboxRobbery").checked = false;
      document.getElementById("checkboxShooting").checked = false;
      document.getElementById("checkboxVandalism").checked = false;
      // document.getElementById("checkboxFire").checked = false;
      document.getElementById("checkboxSnatching").checked = false;
      document.getElementById("checkboxProtest").checked = false;
      document.getElementById("checkboxRiot").checked = false;
      EventsArrayList_DemoLive = [];
    }
  } else {
    if (idx == -1) {
      EventsArrayListLive.push(EventName);
      EventsArrayList_DemoLive.push(EventName);
    } else {
      EventsArrayListLive.splice(idx, 1);
      EventsArrayList_DemoLive.splice(idx, 1);
    }
  }
};

var modifyCCTVDetails = function () {
  var getcamli = JSON.parse(localStorage.getItem("getcam"));
  var listModifyServices;
  if (EventsArrayList_DemoLive.length > 0) {
    $(".modifyCamLoad").show();
    for (i = 0; i < getcamli.length; i++) {
      for (j = 0; j < getcamli[i].location.length; j++) {
        for (k = 0; k < getcamli[i].location[j].camera.length; k++) {
          if (
            $("li.active").attr("id") ==
            getcamli[i].location[j].camera[k].cam_name
          ) {
            getcamli[i].location[j].camera[k].alert_detection_arr =
              EventsArrayList_DemoLive;
            listModifyServices = getcamli[i].location[j].camera[k];
          }
        }
      }
    }

    var modifyJSON = listModifyServices;
    console.log(listModifyServices);
    var settings = {
      async: true,
      crossDomain: true,
      url: "/modify_service",
      method: "POST",
      headers: {
        "content-type": "application/json",
        "cache-control": "no-cache",
      },
      processData: false,
      data: JSON.stringify(modifyJSON),
    };

    $.ajax(settings).done(function (response) {
      $(".modifyCamLoad").hide();
      $("#modifycctvDXB").modal("hide");
      if (response.Failure) {
        Messenger().post({
          message: response.Failure,
          type: "error",
          showCloseButton: true,
        });
      }
      if (response.status == "success") {
        // successFillDetails();
        Messenger().post({
          message: "Service modification successfully",
          type: "success",
          showCloseButton: true,
        });
        updategetCamList();
      } else {
        Messenger().post({
          message: "Some error encountered please try again",
          type: "error",
          showCloseButton: true,
        });
      }
    });
  } else {
    Messenger().post({
      message: "Please select atleast one service to modify cctv",
      type: "error",
      showCloseButton: true,
    });
  }
};

var updategetCamList = function () {
  getLiveCams();
};

// delete camera and stop monetering
emptyCamDetailsDXB = function () {
  $(".deleteCamLoad").show();

  var jsonDeleteCam = {
    cam_name_list: [$("li.active").attr("id")],
  };

  var settings = {
    async: true,
    crossDomain: true,
    url: "/stop_process",
    method: "POST",
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
    },
    processData: false,
    data: JSON.stringify(jsonDeleteCam),
  };

  $.ajax(settings).done(function (response) {
    if (response.Failure) {
      Messenger().post({
        message: response.Failure,
        type: "error",
        showCloseButton: true,
      });
    }
    if (response.data.status == "success") {
      Messenger().post({
        message: "Camera Deleted Successfully!",
        type: "success",
        showCloseButton: true,
      });
      $(".deleteCamLoad").hide();
      // sidebarlist();
      var videoJsDXB = typeof videojs;
      if (videoJsDXB == "undefined") {
        console.log("videojs is undefined");
      } else {
        if (videojs.getPlayers()["vid1"]) {
          videojs("vid1").dispose();
        }
      }
      $("#" + localStorage.getItem("camName-DXB")).remove();
      $("#videoDiv").empty();
      $("#videoDiv").css({
        width: "100%",
        height: "625px",
        "text-align": "center",
        "line-height": "90px",
      });
      $("#videoDiv").append(
        "<div style='margin-top: 50px;'>No stream found, Please select camera or add new camera.</div>"
      );
      $("#deleteCamDXB").modal("hide");
      $("#airportName").empty();
      $("#terminalName").empty();
      $("#aircraftStandName").empty();
      $("#camName").empty();
      $("#camStatus").empty();
      $("#airportName").append("-");
      $("#terminalName").append("-");
      $("#aircraftStandName").append("-");
      $("#camName").append("-");
      $("#camStatus").append("-");
      $("#eventsDXB").empty();
      $("#eventsDXB").append(
        '<div id="loadingEvent" class="position eventsDXBA" style="text-align:center ">No Events Found</div>'
      );
      $("#camAlertsDXB").empty();
      $("#camAlertsDXB").append(
        '<li id="alertsDXBA" > <div class="position" style="text-align:center ">No Alerts Found</div> </li>'
      );

      $("#chart-gantt").empty();
      $("#chart-gantt").append(
        '<div id="test-chart" style="background-color: rgba(51, 51, 51, 0.425)!important;border-radius: 3px;"></div>'
      );
      $("#test-chart").empty();
      $("#prioritesTab").empty();
      $("#prioritesTabContent").empty();
      // $('#prioritesTab').append('<li class="su" ><a href="#NoAlerts" class="NoAlerts" data-toggle="tab">Camera Alerts</a></li>')

      //
      // $('#prioritesTabContent').append(' <div class="tab-pane fade " id="NoAlerts">\n' +
      //     '                                                <div class="row">\n' +
      //     '                                                    <div id="" class="tab-pane active clearfix">\n' +
      //     '                                                        <div id="feedP2" class="feed">\n' +
      //     '                                                            <ul class="news-list" id="cam-Alerts-No">\n' +
      //     '                              /                              </ul>\n' +
      //     '                                                        </div>\n' +
      //     '                                                    </div>\n' +
      //     '                                                </div>\n' +
      //     '                                            </div>')

      // $("#cam-Alerts-No").append('<li id="alertsDXBA" > <div class="position" style="text-align:center ">No Alerts Found</div> </li>');
      // $('#prioritesTab li:first').addClass('active');
      // $('#prioritesTabContent div:first').addClass('in active');
      // mqtt.disconnect();
      getScripts(
        [
          "js/chart/fusioncharts.js",
          "js/chart/fusioncharts.theme.fusion.js",
          "js/chart/fusioncharts.theme.candy.js",
        ],
        function () {
          FusionCharts.ready(function () {
            var chartconf = {
              dateformat: "dd/mm/yyyy",
              outputdateformat: "dd/mm/yyyy hh12:mn:ss ampm",
              canvasborderalpha: "40",
              ganttlinealpha: "50",
              theme: "candy",
            };
            var myChart = new FusionCharts({
              type: "gantt",
              renderAt: "test-chart",
              width: "100%",
              height: "365",
              dataFormat: "json",
              containerBackgroundOpacity: "0",
              dataSource: {
                tasks: {
                  showlabels: "1",
                  color: "#57b955",
                },
                processes: {
                  fontsize: "12",
                  isbold: "1",
                  align: "Center",
                  headertext: "Events",
                  headerfontsize: "14",
                  headervalign: "middle",
                  headeralign: "center",
                },
                categories: [
                  {
                    bgcolor: "#262a33",
                    category: [
                      {
                        start: "00:00:00",
                        end: "23:59:59",
                        label: "Time",
                      },
                    ],
                  },
                ],
                chart: chartconf,
              },
            }).render();
          });
        }
      );
      localStorage.removeItem("camName-DXB");
      localStorage.removeItem("EventsDXB");
      // mqtt.disconnect();
    } else {
    }
  });

  // emptyCamDetailsDXBBrowser = function() {
  //     $('#videoDiv').empty();
  //     $('#videoDiv').css({"width":"100%","height":"300px","text-align": "center","line-height": "90px"});
  //     $('#videoDiv').append('<span>No stream found, Please select camera or add new camera.</span>')
  //     $('#camDeletedDXB').modal('hide');
  //     $('#airportName').empty();
  //     $('#terminalName').empty();
  //     $('#aircraftStandName').empty();
  //     $('#camName').empty();
  //     $('#airportName').append("-");
  //     $('#terminalName').append("-");
  //     $('#aircraftStandName').append("-");
  //     $('#camName').append("-");
  //     $('#eventsDXB').empty();
  //     $('#eventsDXB').append('<div id="loadingEvent" class="position eventsDXBA" style="text-align:center ">No Events Found</div>');
  //     $('#camAlertsDXB').empty();
  //     $('#camAlertsDXB').append('<li id="alertsDXBA" > <div class="position" style="text-align:center ">No Alerts Found</div> </li>');
  //
  //     $('#chart-container').empty();
  //     mqtt.disconnect();
  //     getScripts(["js/chart/fusioncharts.js", "js/chart/fusioncharts.theme.fusion.js","js/chart/fusioncharts.theme.candy.js"], function () {
  //         FusionCharts.ready(function() {
  //
  //             var chartconf={
  //                 dateformat: "dd/mm/yyyy",
  //                 outputdateformat: "dd/mm/yyyy hh12:mn:ss ampm",
  //                 canvasborderalpha: "40",
  //                 ganttlinealpha: "50",
  //                 theme: "candy",
  //
  //             }
  //             var  myChart = new FusionCharts({
  //                 type: "gantt",
  //                 renderAt: "chart-container",
  //                 width: "100%",
  //                 height: "365",
  //                 dataFormat: "json",
  //                 containerBackgroundOpacity: '0',
  //                 dataSource:{
  //                     tasks: {
  //                         showlabels: "1",
  //                         color: "#57b955"
  //
  //                     },
  //                     processes: {
  //                         fontsize: "12",
  //                         isbold: "1",
  //                         align: "Center",
  //                         headertext: "Events",
  //                         headerfontsize: "14",
  //                         headervalign: "middle",
  //                         headeralign: "center",
  //
  //                     },
  //                     categories: [
  //                         {
  //                             bgcolor: "#262a33",
  //                             category: [
  //                                 {
  //                                     start: "00:00:00",
  //                                     end: "23:59:59",
  //                                     label: "Time"
  //                                 }
  //                             ]
  //                         }
  //                     ],
  //                     chart: chartconf
  //                 }
  //             }).render();
  //
  //
  //
  //         });
  //     });
  //     localStorage.removeItem('camName-DXB');
  //     localStorage.removeItem('EventsDXB');
  //     mqtt.disconnect();
  //
  //
  // }
};

// empty live cam page when user delete any camera
emptyCamDetailsDXBBrowser = function () {
  $("#" + localStorage.getItem("camName-DXB")).remove();
  $("#videoDiv").empty();
  $("#videoDiv").css({
    width: "100%",
    height: "300px",
    "text-align": "center",
    "line-height": "90px",
  });
  $("#videoDiv").append(
    "<div style='margin-top: 50px;'>No stream found, Please select camera or add new camera.</div>"
  );

  $("#camDeletedDXB").modal("hide");
  $("#airportName").empty();
  $("#terminalName").empty();
  $("#aircraftStandName").empty();
  $("#camName").empty();
  $("#camStatus").empty();
  $("#airportName").append("-");
  $("#terminalName").append("-");
  $("#aircraftStandName").append("-");
  $("#camName").append("-");
  $("#camStatus").append("-");
  $("#eventsDXB").empty();
  $("#eventsDXB").append(
    '<div id="loadingEvent" class="position eventsDXBA" style="text-align:center ">No Events Found</div>'
  );
  $("#camAlertsDXB").empty();
  $("#camAlertsDXB").append(
    '<li id="alertsDXBA" > <div class="position" style="text-align:center ">No Alerts Found</div> </li>'
  );

  $("#" + localStorage.getItem("camName-DXB") + "c").empty();
  // mqtt.disconnect();
  getScripts(
    [
      "js/chart/fusioncharts.js",
      "js/chart/fusioncharts.theme.fusion.js",
      "js/chart/fusioncharts.theme.candy.js",
    ],
    function () {
      FusionCharts.ready(function () {
        var chartconf = {
          dateformat: "dd/mm/yyyy",
          outputdateformat: "dd/mm/yyyy hh12:mn:ss ampm",
          canvasborderalpha: "40",
          ganttlinealpha: "50",
          theme: "candy",
        };
        var myChart = new FusionCharts({
          type: "gantt",
          renderAt: localStorage.getItem("camName-DXB") + "c",
          width: "100%",
          height: "365",
          dataFormat: "json",
          containerBackgroundOpacity: "0",
          dataSource: {
            tasks: {
              showlabels: "1",
              color: "#57b955",
            },
            processes: {
              fontsize: "12",
              isbold: "1",
              align: "Center",
              headertext: "Events",
              headerfontsize: "14",
              headervalign: "middle",
              headeralign: "center",
            },
            categories: [
              {
                bgcolor: "#262a33",
                category: [
                  {
                    start: "00:00:00",
                    end: "23:59:59",
                    label: "Time",
                  },
                ],
              },
            ],
            chart: chartconf,
          },
        }).render();
      });
    }
  );
  localStorage.removeItem("camName-DXB");
  localStorage.removeItem("EventsDXB");
  // mqtt.disconnect();
};

function display() {
  setInterval(function () {
    var asiaTime = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    });
    asiaTime = new Date(asiaTime);
    var a =
      asiaTime.getHours() +
      ":" +
      ("0" + asiaTime.getMinutes()).slice(-2) +
      ":" +
      ("0" + asiaTime.getSeconds()).slice(-2) +
      " (IST)";
    var b =
      asiaTime.toLocaleDateString("en-US", { weekday: "short" }) +
      " " +
      asiaTime.toLocaleDateString("en-US", { day: "numeric" }) +
      " " +
      asiaTime.toLocaleDateString("en-US", { month: "short" }) +
      " " +
      asiaTime.toLocaleDateString("en-US", { year: "numeric" });
    $("#camCurTime").empty();
    $("#camCurTime").append(a);
    $("#camCurDate").empty();
    $("#camCurDate").append(b);
  }, 1000);
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

// document.getElementById("search").oninput=function(){
//     var matcher = new RegExp(document.getElementById("searchBox").value, "i");
//     for (var i=0;i<document.getElementsByClassName("panel-collapse").length;i++) {
//         if (matcher.test(document.getElementsByClassName("accordion-toggle ")[i].innerHTML) || matcher.test(document.getElementsByClassName("panel-collapse li a")[i].innerHTML)) {
//             document.getElementsByClassName("panel-collapse li a")[i].style.display="inline-block";
//         } else {
//             document.getElementsByClassName("connect-cat")[i].style.display="none";
//         }
//
//     }
// }

// document.getElementById("searchBox").oninput=function(){
//     var matcher = new RegExp(document.getElementById("searchBox").value, "i");
//     for (var i=0;i<document.getElementsByClassName("connect-cat-state").length;i++) {
//         if (matcher.test(document.getElementsByClassName("stateName")[i].innerHTML)) {
//             document.getElementsByClassName("connect-cat-state")[i].style.display="inline-block";
//         } else {
//             document.getElementsByClassName("connect-cat-state")[i].style.display="none";
//         }
//
//     }
// }

// document.addEventListener("visibilitychange", function () {
//   if (document.visibilityState == "hidden") {
//   } else {
//     var getCamList = JSON.parse(localStorage.getItem("getcam"));

//     for (i = 0; i < getCamList.length; i++) {
//       for (j = 0; j < getCamList[i].location.length; j++) {
//         for (k = 0; k < getCamList[i].location[j].camera.length; k++) {
//           if (
//             $("li.active").attr("id") ==
//             getCamList[i].location[j].camera[k].cam_name
//           ) {
//             videojs("my_video_1").dispose();
//             $("#videoDiv").empty();
//             $("#videoDiv").append(
//               '<video id="my_video_1" muted class="video-js vjs-default-skin" controls preload="auto" style="width:100%;height:625px"\n' +
//                 "               data-setup='{}'>\n" +
//                 "            <source src=" +
//                 "ws://" + base_domainip.split(":")[0] + ":" + getCamList[i].location[j].camera[k].cam_output_url?.split(":")[2] +
//                 "  type='application/x-mpegURL'>\n" +
//                 "        </video>"
//             );
//             // // $('#videoDiv').append(' <source src="http://192.168.10.8/nginx/hls/aka/manifest.m3u8"  type=\'application/x-mpegURL\'>');
//             // videojs('my_video_1').load();
//             videojs("my_video_1").play();
//             setTimeout(function () {
//               $(".vjs-big-play-button").trigger("click");
//             }, 500);
//             $("#my_video_1_html5_api").css("height", "-webkit-fill-available");
//             $(".vjs-default-skin").append(
//               '<div class="alert alert-warning alert-sm pull-right no-margin" id="app-alert" style=" padding:6px; background-color:rgb(10 10 10);; border-color:#373b3f; position: absolute;top: 2px;right: 2px; display:none;">\n' +
//                 '                            <span class="fw-semi-bold">Person Count:</span> <span id="person_count">-</span>\n' +
//                 "                        </div>"
//             );
//           }
//         }
//       }
//     }
//   }
// });

// var switchStatus = false;
// $("#flip").click(function(){
//     if (switchStatus == false) {
//         switchStatus = true
//
//     }
//     else {
//        switchStatus =false;
//
//     }
// });

function clickFlip() {
  if ($("li.active").attr("id") == undefined) {
    Messenger().post({
      message: "Please select camera or add new camera for service list.",
      type: "error",
      showCloseButton: true,
    });
  } else {
    if ($("#service_list_modification > div").length > 1) {
      $("#panel").slideToggle("slow");
    } else {
      Messenger().post({
        message: "Please wait for service list.",
        type: "error",
        showCloseButton: true,
      });
    }
  }
}

// modify_services();

function modify_services(data) {
  console.log("dataModify", data);
  var response = data.data;
  var isDisabled;

  isDisabled =
    userloginstatus == "security" || userloginstatus == "support"
      ? "disabled"
      : "";

  if (isDisabled) {
    $("#savechangesbtn").remove();
  }

  // alert(isDisabled)

  $("#service_list_modification").append(
    `<p style="margin-bottom: 10px;margin-top: 10px;font-size:16px;font-weight:400;">${
      data.name
    }</p><div class="row" style="margin-left:0;margin-right:0;" id="${data.name
      ?.replaceAll(" ", "_")
      ?.replaceAll("/", "_")}"> </div> <hr/>`
  );

  // $('#service_list').empty();
  // $('#perimeterList').empty();
  EventsArrayList = [];
  EventsArrayList_Demo = [];
  perimeter_arr = [];

  var arr_service_non_perimeter_without_time = response.perimeter_without_time;
  var arr_service_non_perimeter_with_time = response.perimeter_with_time;
  var arr_service = response.non_perimeter_without_time;
  var arr_service_with_time = response.non_perimeter_with_time;

  console.log(arr_service_non_perimeter_without_time);
  // $("#selectservicestabviewperimeter").hide()
  for (
    perimeter_index_with_time = 0;
    perimeter_index_with_time < arr_service_non_perimeter_with_time.length;
    perimeter_index_with_time++
  ) {
    var input_id =
      "checkbox" +
      arr_service_non_perimeter_with_time[perimeter_index_with_time];
    var input_id_modify = input_id.replace(/\s+/g, "");
    var input_id_perimeter =
      "draw" + arr_service_non_perimeter_with_time[perimeter_index_with_time];
    var input_id_perimeter_modify = input_id_perimeter.replace(/\s+/g, "");

    var input_id_perimeter_data =
      "display" +
      arr_service_non_perimeter_with_time[perimeter_index_with_time];
    var input_id_perimeter_data_modify = input_id_perimeter_data.replace(
      /\s+/g,
      ""
    );
    var placeholer_text =
      "Define " +
      arr_service_non_perimeter_with_time[perimeter_index_with_time];
    console.log(placeholer_text);

    // $('#branch_service_list').empty();
    // $('#catagory_name_with_service').empty();
    // $('#catagory_name_with_service').append(name_main_cat);
    // $('#branch_icici').show();
    $(`#${data.name?.replaceAll(" ", "_")?.replaceAll("/", "_")}`).append(
      ' <div class="checkbox checkbox-primary col-sm-3" style="margin-top: 5px;">\n' +
        "                                                     <input  id='" +
        input_id_modify +
        "' type=\"checkbox\" value='" +
        arr_service_non_perimeter_with_time[perimeter_index_with_time] +
        "' time=\"perimeter_with_time\" display_perimeter_name='" +
        input_id_perimeter_data_modify +
        "' draw_perimeter_name='" +
        input_id_perimeter_modify +
        '\'  onclick="getArrayEventsList(this);" ' +
        isDisabled +
        " >\n" +
        "                                                     <label for='" +
        input_id_modify +
        "'>\n" +
        "                                                         " +
        arr_service_non_perimeter_with_time[perimeter_index_with_time] +
        "\n" +
        "                                                     </label>\n" +
        "                                                 </div>"
    );

    // $('#perimeterList').empty();
    $("#perimeterList").append(
      '<div class="col-sm-6" style="display:none; " id=\'' +
        input_id_perimeter_data_modify +
        "'>\n" +
        '                                                    <div class="input-group">\n' +
        "                                                        <input  id='" +
        input_id_perimeter_modify +
        "' readonly class=\"form-control input-transparent\" placeholder='" +
        placeholer_text +
        "' title='" +
        placeholer_text +
        '\' type="text"/>\n' +
        '                                                        <span class="input-group-addon ">\n' +
        '                                                            <i style="cursor: pointer"  title="Click me to draw" value=\'' +
        input_id_perimeter_modify +
        '\'   class="fa fa-camera" time="perimeter_with_time" onclick="say_thanks_overlay_1(this);"></i>\n' +
        "                                                        </span>\n" +
        "                                                     </div>\n" +
        "                                                </div>"
    );
  }
  for (
    perimeter_index = 0;
    perimeter_index < arr_service_non_perimeter_without_time.length;
    perimeter_index++
  ) {
    var input_id =
      "checkbox" + arr_service_non_perimeter_without_time[perimeter_index];
    var input_id_modify = input_id.replace(/\s+/g, "");
    var input_id_perimeter =
      "draw" + arr_service_non_perimeter_without_time[perimeter_index];
    var input_id_perimeter_modify = input_id_perimeter.replace(/\s+/g, "");

    var input_id_perimeter_data =
      "display" + arr_service_non_perimeter_without_time[perimeter_index];
    var input_id_perimeter_data_modify = input_id_perimeter_data.replace(
      /\s+/g,
      ""
    );
    var placeholer_text =
      "Define " + arr_service_non_perimeter_without_time[perimeter_index];
    console.log(placeholer_text);

    // $('#catagory_name_with_service').empty();
    // $('#catagory_name_with_service').append(name_main_cat);
    // $('#branch_icici').show();
    $(`#${data.name?.replaceAll(" ", "_")?.replaceAll("/", "_")}`).append(
      ' <div class="checkbox checkbox-primary col-sm-3" style="margin-top: 5px;">\n' +
        "                                                     <input  id='" +
        input_id_modify +
        "' type=\"checkbox\" value='" +
        arr_service_non_perimeter_without_time[perimeter_index] +
        "' time=\"perimeter_without_time\" display_perimeter_name='" +
        input_id_perimeter_data_modify +
        "' draw_perimeter_name='" +
        input_id_perimeter_modify +
        '\' onclick="getArrayEventsList(this);" ' +
        isDisabled +
        "  >\n" +
        "                                                     <label for='" +
        input_id_modify +
        "'>\n" +
        "                                                         " +
        arr_service_non_perimeter_without_time[perimeter_index] +
        "\n" +
        "                                                     </label>\n" +
        "                                                 </div>"
    );

    // $('#perimeterList').empty();

    $("#perimeterList").append(
      '<div class="col-sm-6" style="display:none; " id=\'' +
        input_id_perimeter_data_modify +
        "'>\n" +
        '                                                    <div class="input-group">\n' +
        "                                                        <input  id='" +
        input_id_perimeter_modify +
        "' readonly class=\"form-control input-transparent\" placeholder='" +
        placeholer_text +
        "' title='" +
        placeholer_text +
        '\' type="text"/>\n' +
        '                                                        <span class="input-group-addon ">\n' +
        '                                                            <i style="cursor: pointer"  title="Click me to draw" value=\'' +
        input_id_perimeter_modify +
        '\'   class="fa fa-camera" time="perimeter_without_time" onclick="say_thanks_overlay_1(this);"></i>\n' +
        "                                                        </span>\n" +
        "                                                     </div>\n" +
        "                                                </div>"
    );
  }
  for (service_index = 0; service_index < arr_service.length; service_index++) {
    var input_id = "checkbox" + arr_service[service_index];
    var input_id_modify = input_id.replace(/\s+/g, "");
    var input_id_perimeter = "draw_" + arr_service[service_index];
    var input_id_perimeter_modify = input_id_perimeter.replace(/\s+/g, "");

    // console.log(input_id);

    $(`#${data.name?.replaceAll(" ", "_")?.replaceAll("/", "_")}`).append(
      ' <div class="checkbox checkbox-primary col-sm-3" style="margin-top: 5px;">\n' +
        "                                                     <input id=" +
        input_id_modify +
        ' type="checkbox" value=\'' +
        arr_service[service_index] +
        '\' onclick="getArrayEventsList(this);" ' +
        isDisabled +
        "  >\n" +
        "                                                     <label for=" +
        input_id_modify +
        ">\n" +
        "                                                         " +
        arr_service[service_index] +
        "\n" +
        "                                                     </label>\n" +
        "                                                 </div>"
    );
  }
  for (
    list_val_with_time = 0;
    list_val_with_time < arr_service_with_time.length;
    list_val_with_time++
  ) {
    var input_id = "checkbox" + arr_service_with_time[list_val_with_time];
    var input_id_modify = input_id.replace(/\s+/g, "");
    var input_id_perimeter = "draw" + arr_service_with_time[list_val_with_time];
    var input_id_perimeter_modify = input_id_perimeter.replace(/\s+/g, "");

    // $('#catagory_name_with_service').empty();
    // $('#catagory_name_with_service').append(name_main_cat);
    // $('#branch_icici').show();
    $(`#${data.name?.replaceAll(" ", "_")?.replaceAll("/", "_")}`).append(
      ' <div class="checkbox checkbox-primary col-sm-3" style="margin-top: 5px;">\n' +
        "                                                     <input id=" +
        input_id_modify +
        ' type="checkbox" value=\'' +
        arr_service_with_time[list_val_with_time] +
        '\' time="non_perimeter_with_time" onclick="getArrayEventsList(this);" ' +
        isDisabled +
        "  >\n" +
        "                                                     <label for=" +
        input_id_modify +
        ">\n" +
        "                                                         " +
        arr_service_with_time[list_val_with_time] +
        "\n" +
        "                                                     </label>\n" +
        "                                                 </div>"
    );
  }
  // $("#service_list_modification").empty();

  // response.services?.forEach(function (data){
  //   modify_services(data);
  // })
}

var EventsArrayList = [];
var EventsArrayList_Demo = [];
var perimeter_arr = [];
var non_perimeter_with_time_arr = [];

var perimeter_Val;
var motion_Val;

var getArrayEventsList = function (eventName) {
  var EventName = $(eventName).attr("value");

  var idx = $.inArray(EventName, EventsArrayList_Demo);

  if (EventName == "Perimeter Breach") {
    if (idx == -1) {
      $("#ERLDraw").show();
      perimeter_Val = 1;
      EventsArrayList_Demo.push(EventName);
      // EventsArrayList = EventsArrayList.filter(item => item !== EventName)
      EventsArrayList_Demo = EventsArrayList_Demo.filter(
        (item) => item !== EventName
      );
    } else {
      perimeter_Val = 0;
      $("#ERLDraw").hide();
      // EventsArrayList_Demo.splice(idx, 1);
      // EventsArrayList = EventsArrayList.filter(item => item !== EventName)
      EventsArrayList_Demo = EventsArrayList_Demo.filter(
        (item) => item !== EventName
      );
    }
  }
  // else if(EventName == "Motion Detection"){
  //     if (idx == -1) {
  //         motion_Val=1;
  //         // EventsArrayList.push(EventName);
  //         EventsArrayList_Demo.push(EventName);
  //     } else {
  //         motion_Val=0;
  //         // EventsArrayList.splice(idx, 1);
  //         EventsArrayList_Demo.splice(idx, 1);
  //     }
  //
  // }
  else if (EventName == "Select All") {
    // if (idx == -1) {
    //     motion_Val=1;
    //     // EventsArrayList.push(EventName);
    //     EventsArrayList_Demo.push(EventName);
    // } else {
    //     motion_Val=0;
    //     // EventsArrayList.splice(idx, 1);
    //     EventsArrayList_Demo.splice(idx, 1);
    // EventsArrayList_Demo.push("Robbery");
    // }

    if (document.getElementById("checkboxSelectAll").checked) {
      EventsArrayList_Demo = [];

      document.getElementById("checkboxArson").checked = true;
      EventsArrayList_Demo.push(document.getElementById("checkboxArson").value);
      document.getElementById("checkboxExplosion").checked = true;
      EventsArrayList_Demo.push(
        document.getElementById("checkboxExplosion").value
      );
      document.getElementById("checkboxFighting").checked = true;
      EventsArrayList_Demo.push(
        document.getElementById("checkboxFighting").value
      );
      document.getElementById("checkboxRoadAccident").checked = true;
      EventsArrayList_Demo.push(
        document.getElementById("checkboxRoadAccident").value
      );
      document.getElementById("checkboxRobbery").checked = true;
      EventsArrayList_Demo.push(
        document.getElementById("checkboxRobbery").value
      );
      document.getElementById("checkboxShooting").checked = true;
      EventsArrayList_Demo.push(
        document.getElementById("checkboxShooting").value
      );
      document.getElementById("checkboxVandalism").checked = true;
      EventsArrayList_Demo.push(
        document.getElementById("checkboxVandalism").value
      );
      // document.getElementById("checkboxFire").checked = true;
      // EventsArrayList_Demo.push(document.getElementById("checkboxFire").value);
      document.getElementById("checkboxSnatching").checked = true;
      EventsArrayList_Demo.push(
        document.getElementById("checkboxSnatching").value
      );
      document.getElementById("checkboxProtest").checked = true;
      EventsArrayList_Demo.push(
        document.getElementById("checkboxProtest").value
      );
      document.getElementById("checkboxRiot").checked = true;
      EventsArrayList_Demo.push(document.getElementById("checkboxRiot").value);
    } else {
      document.getElementById("checkboxArson").checked = false;
      document.getElementById("checkboxExplosion").checked = false;
      document.getElementById("checkboxFighting").checked = false;
      document.getElementById("checkboxRoadAccident").checked = false;
      document.getElementById("checkboxRobbery").checked = false;
      document.getElementById("checkboxShooting").checked = false;
      document.getElementById("checkboxVandalism").checked = false;
      // document.getElementById("checkboxFire").checked = false;
      document.getElementById("checkboxSnatching").checked = false;
      document.getElementById("checkboxProtest").checked = false;
      document.getElementById("checkboxRiot").checked = false;
      EventsArrayList_Demo = [];
    }
  }
  // else if(){
  //
  //
  // }
  else {
    console.log(EventName);

    var id_perimeter_name = "display" + EventName.replace(/\s+/g, "");
    if (idx == -1) {
      // if (typeof attr !== typeof undefined && attr !== false) {
      //   // Element has this attribute
      // }
      // var myEle = document.getElementById(id_perimeter_name);
      // if(myEle != null) {
      //
      //   console.log(myEle);
      //     // $("[id="+id_perimeter_name+"]").show();
      //
      // }
      if (eventName.getAttribute("time") == "perimeter_with_time") {
        $("body").append(
          '<div class="modal-backdrop fade in" style="opacity: 0.8;"><div class="loader-wrap verify-url-load-save " style="position:absolute; display: block; left:-187px;top:40%;text-align: center;"><img loading="lazy" src="img/edlo3.gif" width="50px"></div></div>'
        );
        console.log(eventName + " " + eventName.getAttribute("time"));

        var getCamList = JSON.parse(localStorage.getItem("getcam"));

        for (i = 0; i < getCamList.length; i++) {
          for (j = 0; j < getCamList[i].location.length; j++) {
            for (k = 0; k < getCamList[i].location[j].camera.length; k++) {
              if (
                $("li.active").attr("id") ==
                getCamList[i].location[j].camera[k].cam_name
              ) {
                var jsonObjVerify = {
                  cam_url: getCamList[i].location[j].camera[k].cam_input_url,
                };
                var settings = {
                  async: true,
                  crossDomain: true,
                  url: "/capture_frame",
                  method: "POST",
                  headers: {
                    "content-type": "application/json",
                    "cache-control": "no-cache",
                  },
                  processData: false,
                  data: JSON.stringify(jsonObjVerify),
                };
                $.ajax(settings).done(function (response) {
                  if (response.Failure) {
                    $(".modal-backdrop.fade.in").remove();
                    eventName.checked = false;
                    if (response.Failure == "Invalid RTSP/RTMP url") {
                      Messenger().post({
                        message:
                          "Stream not found, Please try again after some time.",
                        type: "error",
                        showCloseButton: true,
                      });
                    } else {
                      Messenger().post({
                        message: response.Failure,
                        type: "error",
                        showCloseButton: true,
                      });
                    }
                    return;
                  }
                  var PerimiterJSON = {
                    img: response.data.breach_image,
                    width: response.data.image_width,
                    height: response.data.image_height,
                  };

                  localStorage.setItem(
                    "breach_image_perimeter",
                    JSON.stringify(PerimiterJSON)
                  );

                  // perimeter_checkbox_value
                  // console.log(eventName)
                  say_thanks_overlay_1(eventName);
                  perimeter_arr.push(EventName);
                  EventsArrayList.push(EventName);
                  EventsArrayList_Demo.push(EventName);
                });
              }
            }
          }
        }
      } else if (eventName.getAttribute("time") == "perimeter_without_time") {
        // say_thanks_overlay_1(eventName);
        // perimeter_arr.push(EventName);
        // EventsArrayList.push(EventName);
        // EventsArrayList_Demo.push(EventName);

        $("body").append(
          '<div class="modal-backdrop fade in" style="opacity: 0.8;"><div class="loader-wrap verify-url-load-save " style="position:absolute; display: block; left:-187px;top:40%;text-align: center;"><img loading="lazy" src="img/edlo3.gif" width="50px"></div></div>'
        );
        var getCamList = JSON.parse(localStorage.getItem("getcam"));

        for (i = 0; i < getCamList.length; i++) {
          for (j = 0; j < getCamList[i].location.length; j++) {
            for (k = 0; k < getCamList[i].location[j].camera.length; k++) {
              if (
                $("li.active").attr("id") ==
                getCamList[i].location[j].camera[k].cam_name
              ) {
                var jsonObjVerify = {
                  cam_url: getCamList[i].location[j].camera[k].cam_input_url,
                };
                var settings = {
                  async: true,
                  crossDomain: true,
                  url: "/capture_frame",
                  method: "POST",
                  headers: {
                    "content-type": "application/json",
                    "cache-control": "no-cache",
                  },
                  processData: false,
                  data: JSON.stringify(jsonObjVerify),
                };
                $.ajax(settings).done(function (response) {
                  if (response.Failure) {
                    $(".modal-backdrop.fade.in").remove();
                    eventName.checked = false;
                    if (response.Failure == "Invalid RTSP/RTMP url") {
                      Messenger().post({
                        message:
                          "Stream not found, Please try again after some time.",
                        type: "error",
                        showCloseButton: true,
                      });
                    } else {
                      Messenger().post({
                        message: response.Failure,
                        type: "error",
                        showCloseButton: true,
                      });
                    }
                    return;
                  }
                  var PerimiterJSON = {
                    img: response.data.breach_image,
                    width: response.data.image_width,
                    height: response.data.image_height,
                  };

                  localStorage.setItem(
                    "breach_image_perimeter",
                    JSON.stringify(PerimiterJSON)
                  );

                  say_thanks_overlay_1(eventName);
                  perimeter_arr.push(EventName);
                  EventsArrayList.push(EventName);
                  EventsArrayList_Demo.push(EventName);
                });
              }
            }
          }
        }
      } else if (eventName.getAttribute("time") == "non_perimeter_with_time") {
        // $('#selectTime').modal('show');

        $("#checkbox" + EventName).on("change", function () {
          if ($(this).is(":checked")) {
            $(this).attr("value", "true");

            localStorage.setItem("event_name_service", EventName);

            $("#selectTime").modal({
              backdrop: "static",
              keyboard: false,
            });
            $(".from_time_service").val("00:00");
            $(".to_time_service").val("00:00");

            // console.log(id_perimeter_name)
            EventsArrayList.push(EventName);
            EventsArrayList_Demo.push(EventName);
            non_perimeter_with_time_arr.push(EventName);
          } else {
            $(this).attr("value", "false");
            // EventsArrayList.splice(idx, 1);
            // EventsArrayList_Demo.splice(idx, 1);
            // non_perimeter_with_time_arr.splice(idx, 1);
            EventsArrayList = EventsArrayList.filter(
              (item) => item !== EventName
            );
            EventsArrayList_Demo = EventsArrayList_Demo.filter(
              (item) => item !== EventName
            );
            non_perimeter_with_time_arr = non_perimeter_with_time_arr.filter(
              (item) => item !== EventName
            );
          }
        });
      } else {
        console.log(id_perimeter_name);
        EventsArrayList.push(EventName);
        EventsArrayList_Demo.push(EventName);
      }
      // $('#'+id_perimeter_name).show();
    } else {
      // $('#'+id_perimeter_name).hide();
      // one_atm_one_person_breach_coordinates

      localStorage.removeItem(
        EventName.toLowerCase().split(" ").join("_") + "_breach_coordinates"
      );
      localStorage.removeItem(EventName.toLowerCase() + "_service_perimeter");

      $("[id=" + id_perimeter_name + "]").hide();

      perimeter_arr = perimeter_arr.filter((item) => item !== EventName);
      EventsArrayList = EventsArrayList.filter((item) => item !== EventName);
      EventsArrayList_Demo = EventsArrayList_Demo.filter(
        (item) => item !== EventName
      );
      non_perimeter_with_time_arr = non_perimeter_with_time_arr.filter(
        (item) => item !== EventName
      );
      // EventsArrayList.splice(idx, 1);
      // EventsArrayList_Demo.splice(idx, 1);

      // non_perimeter_with_time_arr.splice(idx, 1);
    }
  }
};

$(".datetimepicker3").datetimepicker({
  format: "HH:mm",
  showClose: true,
  // use24hours: true
});
$(".datetimepicker4").datetimepicker({
  format: "HH:mm",
  showClose: true,
  // use24hours: true
});

$(".datetimepicker5").datetimepicker({
  format: "HH:mm",
  showClose: true,
  // use24hours: true
});
$(".datetimepicker6").datetimepicker({
  format: "HH:mm",
  showClose: true,
  // use24hours: true
});

function saveSelectedService(e) {
  console.log(EventsArrayList_Demo);

  $("input[type='checkbox']").map((i, ele) => {
    if (ele.checked) {
      var service_name = $(ele).attr("value");
      if (EventsArrayList_Demo.includes(service_name)) {
      } else {
        EventsArrayList_Demo.push(service_name);
      }
    }
  });

  console.log(EventsArrayList_Demo);
  $(".submitServiceLoad").show();
  console.log(perimeter_arr);
  $(e).attr("disabled", true);
  var jsonDataDXB = {
    alert_array: EventsArrayList_Demo,
  };
  if (perimeter_arr.length > 0) {
    for (
      perimeter_name = 0;
      perimeter_name < perimeter_arr.length;
      perimeter_name++
    ) {
      if (
        Object.keys(duration_parameter).includes(perimeter_arr[perimeter_name])
      ) {
        var namedict =
          perimeter_arr[perimeter_name].toLowerCase().replace(/\s+/g, "_") +
          "_duration";
        jsonDataDXB[namedict] = localStorage.getItem(namedict);
      }

      if (
        Object.keys(count_parameter).includes(perimeter_arr[perimeter_name])
      ) {
        var namedict =
          perimeter_arr[perimeter_name].toLowerCase().replace(/\s+/g, "_") +
          "_person_count";
        jsonDataDXB[namedict] = localStorage.getItem(namedict);
      }

      var name_perimeter = perimeter_arr[perimeter_name];
      var name_dict = name_perimeter.split(/(?=[A-Z])/).join("_");
      var name_lowercase = name_dict.toLowerCase() + "_breach_coordinates";
      var remove_spaces_name = name_lowercase.replace(/\s+/g, "");

      var name_perimeter_time = perimeter_arr[perimeter_name];
      var name_dict_time = name_perimeter_time.split(/(?=[A-Z])/).join("_");
      var name_lowercase_time =
        name_dict_time.toLowerCase() + "_service_perimeter";
      var remove_spaces_name_time = name_lowercase_time.replace(/\s+/g, "");

      // console.log(remove_spaces_name_time)

      if (localStorage.getItem(remove_spaces_name) == null) {
        // console.log(remove_spaces_name);
      } else {
        console.log(remove_spaces_name);
        console.log(JSON.parse(localStorage.getItem(remove_spaces_name)));
        jsonDataDXB[remove_spaces_name] = JSON.parse(
          localStorage.getItem(remove_spaces_name)
        );
      }
      if (localStorage.getItem(remove_spaces_name_time) == null) {
        console.log(remove_spaces_name_time);
      } else {
        var str_name = remove_spaces_name_time;
        str_name = str_name.slice(0, -18);

        var timeDict_from_local = JSON.parse(
          localStorage.getItem(remove_spaces_name_time)
        );

        jsonDataDXB[str_name + "_from_time"] = timeDict_from_local.from_time;
        jsonDataDXB[str_name + "_to_time"] = timeDict_from_local.to_time;
        console.log(jsonDataDXB);
        // jsonDataDXB[remove_spaces_name] = JSON.parse(localStorage.getItem(remove_spaces_name));
      }
    }
  }

  if (non_perimeter_with_time_arr.length > 0) {
    for (
      non_peri_servic_name = 0;
      non_peri_servic_name < non_perimeter_with_time_arr.length;
      non_peri_servic_name++
    ) {
      var name_perimeter = non_perimeter_with_time_arr[non_peri_servic_name];
      var name_dict = name_perimeter.split(/(?=[A-Z])/).join("_");
      var name_lowercase = name_dict.toLowerCase() + "service";
      var remove_spaces_name = name_lowercase.replace(/\s+/g, "");

      var name_lowercase = name_dict.toLowerCase() + "service";

      if (localStorage.getItem(remove_spaces_name) == null) {
        console.log(remove_spaces_name);
      } else {
        console.log(remove_spaces_name);

        var str_name = remove_spaces_name;
        str_name = str_name.slice(0, -7);

        var timeDict_from_local = JSON.parse(
          localStorage.getItem(remove_spaces_name)
        );
        jsonDataDXB[str_name + "_from_time"] = timeDict_from_local.from_time;
        jsonDataDXB[str_name + "_to_time"] = timeDict_from_local.to_time;

        // jsonDataDXB[remove_spaces_name] = JSON.parse(localStorage.getItem(remove_spaces_name));
      }
    }
  }

  // if(jsonDataDXB.alert_array.indexOf("Stevedore") !== -1){
  //
  // }

  var settings = {
    async: true,
    crossDomain: true,
    url: "/modify_service?name=" + $("li.active").attr("id"),
    method: "POST",
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
      "postman-token": "6a580c4e-6ee9-5d2f-a4d9-ce067e86879d",
    },
    processData: false,
    data: JSON.stringify(jsonDataDXB),
  };

  $.ajax(settings).done(function (response) {
    $(e).removeAttr("disabled");
    $(".submitServiceLoad").hide();
    if (response.Failure) {
      Messenger().post({
        message: response.Failure,
        type: "error",
        showCloseButton: true,
      });
    } else {
      if (response.data.status == "success") {
        update_localStorageItem();

        Messenger().post({
          message: "service added successfully",
          type: "success",
          showCloseButton: true,
        });

        for (breach_val = 0; breach_val < perimeter_arr.length; breach_val++) {
          var breach_val_name = perimeter_arr[breach_val];
          // console.log(breach_val_name)
          localStorage.removeItem(
            breach_val_name.toLowerCase() + "_service_perimeter"
          );
          localStorage.removeItem(
            breach_val_name.toLowerCase().split(" ").join("_") +
              "_breach_coordinates"
          );
        }
        $("#panel").slideToggle("slow");
        if (response.data.alert_array.indexOf("stevedore detection") !== -1) {
          display_ganttChart();
        } else {
          $(".ganttchart_service").hide();
          if (FusionCharts("fusionDXB")) {
            FusionCharts("fusionDXB").dispose();
          }
          console.log("Value does not exists!");
        }
        // $("#panel").css({"transform": "translateY(-120px)", "transition": ".5s ease-in-out"});
      } else {
      }
    }

    console.log(response);
  });
  console.log(jsonDataDXB);
}

var closeModal_perimeter = function () {
  if (localStorage.getItem("perimeter_with_time_service") == null) {
    if (localStorage.getItem("PerimeterElement") == "drawVOI") {
      if ($(".voi_service_perimeter_distance").val() != "") {
        localStorage.setItem(
          "VOIDistance",
          $(".voi_service_perimeter_distance").val()
        );
        if ($(".voi_service_perimeter_speed").val() != "") {
          localStorage.setItem(
            "VOISpeed",
            $(".voi_service_perimeter_speed").val()
          );
          $("#myModal2").modal("hide");
        } else {
          Messenger().post({
            message: "Please add speed",
            type: "error",
            showCloseButton: true,
          });
        }
      } else {
        Messenger().post({
          message: "Please add distance",
          type: "error",
          showCloseButton: true,
        });
      }
    } else {
      $("#myModal2").modal("hide");
    }
    $("#myModal2").modal("hide");
  } else {
    if (
      $(".from_time_service_perimeter").val() !== "00:00" &&
      $(".to_time_service_perimeter").val() !== "00:00"
    ) {
      var selected_service_name = localStorage.getItem(
        "perimeter_with_time_service"
      );
      var time_dict_service_perimeter = {
        from_time: $(".from_time_service_perimeter").val(),
        to_time: $(".to_time_service_perimeter").val(),
      };

      var element_perimeter_name = localStorage.getItem(
        "perimeter_with_time_service"
      );

      var new_str = element_perimeter_name
        .split(/(?=[A-Z])/)
        .join("_")
        .replaceAll(" ", "");
      var new_str_m = new_str + "_service_perimeter";
      localStorage.setItem(
        new_str_m.toLowerCase(),
        JSON.stringify(time_dict_service_perimeter)
      );
      $("#myModal2").modal("hide");
    } else {
      Messenger().post({
        message: "Please add start time and end time",
        type: "error",
        showCloseButton: true,
      });
    }
  }

  var new_str = element_perimeter_name
    ? element_perimeter_name
        .split(/(?=[A-Z])/)
        .join("_")
        .replaceAll(" ", "")
    : localStorage
        .getItem("PerimeterElement")
        .split(/(?=[A-Z])/)
        .join("_")
        .replaceAll(" ", "")
        .replaceAll("draw_", "");

  if ($("#duration_parameter_icici").css("display") == "block") {
    var new_str_m = new_str + "_duration";
    localStorage.setItem(
      new_str_m.toLowerCase(),
      $("#duration_service_perimeter").val()
    );
  }

  if ($("#personcount_parameter_icici").css("display") == "block") {
    var new_str_m = new_str + "_person_count";
    localStorage.setItem(
      new_str_m.toLowerCase(),
      $("#personcount_service_perimeter").val()
    );
  }
};

function close_modal_fun_peri(e) {
  $("#myModal2").modal("hide");
  document.getElementById(
    "checkbox" + $(e).attr("perimeter_checkbox_value").replace(/ /g, "")
  ).checked = false;

  const index1 = EventsArrayList_Demo.indexOf(
    $(e).attr("perimeter_checkbox_value")
  );
  if (index1 > -1) {
    EventsArrayList_Demo.splice(index1, 1);
  }

  const index2 = EventsArrayList.indexOf($(e).attr("perimeter_checkbox_value"));
  if (index2 > -1) {
    EventsArrayList.splice(index2, 1);
  }

  const index3 = perimeter_arr.indexOf($(e).attr("perimeter_checkbox_value"));
  if (index3 > -1) {
    perimeter_arr.splice(index3, 1);
  }

  // var removeItem = $(e).attr("perimeter_checkbox_value");
  // EventsArrayList_Demo.filter(element => element !== removeItem);
}

function openLiveStream(e) {
  localStorage.setItem("camName-DXB", $(e).attr("cam_name_layout"));
  localStorage.setItem("isFromMap", "true");
  window.location.href = "/cctv_monitoring";
  updateCamData($(e).attr("cam_name_layout"), true);
}

var Events_Boolean = false;
var toggletable = function () {
  if (Events_Boolean == false) {
    Events_Boolean = true;
    $("#ganttChartEventGraph").hide();
    $("#ganttChartEventTable").show();
    $("#tble_cc").empty();
    $("#loading-spinnerEventTable").show();
    $("#textGraph").empty();
    $("#textGraph").append("<h4>Event Display in Table Format </h4>");

    console.log("true");
    eventDataTable();
    FusionCharts("fusionDXB").dispose();
  } else {
    Events_Boolean = false;
    console.log("false");
    $("#ganttChartEventTable").hide();
    $("#ganttChartEventGraph").show();
    $("#textGraph").empty();
    $("#textGraph").append("<h4>Event Display in Gantt Chart </h4>");
    getScripts(["js/chart/scriptFusion/ganttscript.js"], function () {
      fusioncharts();
    });
  }
};

var eventDataTable = function () {
  var settings = {
    async: true,
    crossDomain: true,
    url: "/gettruckevents?name=" + localStorage.getItem("camName-DXB"),
    // "http://" +
    // base_domainip +
    // "/event-app/get_users/saurabh/saurabh",
    method: "GET",
    headers: {
      "cache-control": "no-cache",
      "postman-token": "8fc0de8d-d948-de36-ee89-0ec4493fb82a",
    },
  };

  $.ajax(settings).done(function (response) {
    if (response.Failure) {
      Messenger().post({
        message: response.Failure,
        type: "error",
        showCloseButton: true,
      });
    } else {
      $("#datatable-table").empty();

      console.log("i am here for graph");
      console.log(response);

      // for (p = 0; p < response.graph_event_data.length; p++) {
      //     if (response.graph_event_data[p].event_name == "PBB") {
      //         response.graph_event_data[p].event_name = "PBS"
      //     }
      //
      // }
      // localStorage.setItem(localStorage.getItem('camName-DXB'),);
      if (response.graph_event_data.length > 0) {
        localStorage.setItem(
          localStorage.getItem("camName-DXB"),
          JSON.stringify(response.graph_event_data)
        );
        $("#loading-spinnerEventTable").hide();
        $("#tble_cc").append(
          '<table id="datatable-table" class="table table-striped table-hover"> <thead> <tr> <th>Id</th> <th>Event Name</th> <th class=" hidden-xs">Event Duration</th> <th class="hidden-xs">Event Start Time</th> <th class="hidden-xs">Event End Time</th> </tr> </thead> <tbody id="allcamsDXB" ></tbody> </table>'
        );

        console.log("here");
        var count = 0;

        for (i = 0; i < response.graph_event_data.length; i++) {
          count += 1;
          // $("#allcamsDXB").append('<tr><td>'+count+'</td><td><a class="fw-semi-bold getFlightDetails" href="/camDetails" get_camDXB='+response.cam_flight_count_dict[i].aircraft_stand+' get_terminalDXB='+response.cam_flight_count_dict[i].terminal+' get_airportDXB='+response.cam_flight_count_dict[i].airport_name+'  style="cursor: pointer">' + response.cam_flight_count_dict[i].airport_name + "--" + response.cam_flight_count_dict[i].terminal + "--" + response.cam_flight_count_dict[i].aircraft_stand + '</a></td> <td class="hidden-xs"> <span class="">' + response.cam_flight_count_dict[i].stand_type + '</span> </td> <td class="hidden-xs"><span >' + response.cam_flight_count_dict[i].flight_count + '</span></td> </tr>');
          // $("#allcamsDXB").append('<tr><td>'+count+'</td><td><a class="fw-semi-bold getFlightDetails" href="/camDetails" get_camDXB='+response.cam_flight_count_dict[i].aircraft_stand+' get_terminalDXB='+response.cam_flight_count_dict[i].terminal+' get_airportDXB='+response.cam_flight_count_dict[i].airport_name+'   style="cursor: pointer">' + response.cam_flight_count_dict[i].airport_name + "--" + response.cam_flight_count_dict[i].terminal + "--" + response.cam_flight_count_dict[i].aircraft_stand + '</a></td> <td class="hidden-xs"> <span class="">' + response.cam_flight_count_dict[i].stand_type + '</span> </td> <td class="hidden-xs"><span >' + response.cam_flight_count_dict[i].flight_count + '</span></td><td class="hidden-xs"> <span class="" style="color: #439efb; text-decoration: underline; cursor: pointer;" camnName='+response.cam_flight_count_dict[i].cam_name+'><a href="/camLogs">See All</a> </span> </td> </tr>');

          if (
            response.graph_event_data[i].event_start_time != "" &&
            response.graph_event_data[i].event_end_time != ""
          ) {
            $("#allcamsDXB").append(
              "<tr><td>" +
                count +
                '</td><td><a class="fw-semi-bold "  style="cursor: pointer">' +
                response.graph_event_data[i].event_name +
                '</a></td> <td class="hidden-xs"> <span class="">' +
                getTimeDuration(
                  response.graph_event_data[i].event_start_time,
                  response.graph_event_data[i].event_end_time
                ) +
                '</span> </td> <td class="hidden-xs"><span >' +
                response.graph_event_data[i].event_start_time +
                '</span></td><td class="hidden-xs"> <span class="" style="cursor: pointer;" ><span >' +
                response.graph_event_data[i].event_end_time +
                "</span> </span> </tr>"
            );
          } else {
            $("#allcamsDXB").append(
              "<tr><td>" +
                count +
                '</td><td><a class="fw-semi-bold "  style="cursor: pointer">' +
                response.graph_event_data[i].event_name +
                '</a></td> <td class="hidden-xs"> <span class="">-</span> </td> <td class="hidden-xs"><span >' +
                response.graph_event_data[i].event_start_time +
                '</span></td><td class="hidden-xs"> <span class="" style="cursor: pointer;" ><span >-</span> </span> </td>  </tr>'
            );
          }

          // $("#allcamsDXB").append('<tr><td>'+count+'</td><td><a class="fw-semi-bold getFlightDetails" get_camDXB='+response.cam_list[i].cam_name+'  style="cursor: pointer">' + response.cam_list[i].airport_name + "--" + response.cam_list[i].terminal + "--" + response.cam_list[i].cam_name + '</a></td> <td class="hidden-xs"> <span class="">' + response.cam_list[i].stand_type + '</span> </td> <td class="hidden-xs"><span >' + response.cam_list[i].aircraft_stand + '</span></td> <td class="hidden-xs">' + response.cam_list[i].cam_add_time + '</td></tr>');
        }
      } else {
        $("#loading-spinnerEventTable").hide();
        $("#tble_cc").append(
          '<table id="datatable-table" class="table table-striped table-hover"> <thead> <tr> <th>Id</th> <th>Event Name</th> <th class=" hidden-xs">Event Duration</th> <th class="hidden-xs">Event Start Time</th> <th class="hidden-xs">Event End Time</th> </tr> </thead> <tbody id="allcamsDXB" ></tbody> </table>'
        );

        // a=[];
        // var arrtest = null;
        localStorage.setItem(localStorage.getItem("camName-DXB"), null);
      }

      var unsortableColumns = [];
      $("#datatable-table")
        .find("thead th")
        .each(function () {
          if ($(this).hasClass("no-sort")) {
            unsortableColumns.push({ bSortable: false });
          } else {
            unsortableColumns.push(null);
          }
        });

      $("#datatable-table").dataTable({
        order: [],
        // "sDom": "<'row'<'col-md-6 hidden-xs'l><'col-md-6'f>r>t<'row'<'col-md-6'i><'col-md-6'p>>",
        destroy: true,
        // sDom: "Bfrtip",
        sDom: "<'row'<'col-md-6 hidden-xs'l><'col-md-6'f>r>t<'row'<'col-md-6'i><'col-md-6'p>>",
        buttons: [
          {
            extend: "pdfHtml5",
            messageTop: "Camera",
          },
        ],
        oLanguage: {
          sLengthMenu: "_MENU_",
          sInfo: "Showing <strong>_START_ to _END_</strong> of _TOTAL_ entries",
        },

        oClasses: {
          sFilter: "pull-right",
          sFilterInput: "form-control input-transparent ",
        },
        aoColumns: unsortableColumns,
      });

      $("#datatable-table_length > label > select").css({
        "background-color": "rgba(51, 51, 51, 0.425)",
        border: "none",
      });
      $("#datatable-table_wrapper > div.dt-buttons").css({
        display: "inline-block",
        "max-width": "100%",
        "margin-bottom": "5px",
        "font-weight": "bold",
        float: "right",
      });
      // $('#datatable-table_wrapper > div.dt-buttons > button.dt-button.buttons-copy.buttons-html5').css({"border": "none", "color": "#f8f8f8", "background": "5px 5px no-repeat rgba(51, 51, 51, 0.425)", "padding": "4px", "border-radius": "2px"})
      $(
        "#datatable-table_wrapper > div.dt-buttons > button.dt-button.buttons-pdf.buttons-html5"
      ).css({
        border: "none",
        color: "#f8f8f8",
        background: "5px 5px no-repeat rgba(51, 51, 51, 0.425)",
        padding: "4px",
        "border-radius": "2px",
      });
      // $('#datatable-table_wrapper > div.dt-buttons').css({""})
      $("#datatable-table_filter").removeClass("pull-right");
      $("#datatable-table_filter").css({ float: "left !important" });
    }
  });
};

function display_ganttChart() {
  $(".ganttchart_service").show();
  getScripts(["js/chart/scriptFusion/ganttscript.js"], function () {
    fusioncharts();
  });

  eventDataTable();
}

function update_localStorageItem() {
  getLiveCams();
}

function navigateToPlayback() {
  $(".active-li").removeClass("active-li");
  return false;
}

function openPerimeterModal(open) {
  if (open) {
    $("#savechangesbtn").hide();

    if (localStorage.getItem("camName-DXB") !== null) {
      $.get(
        "/getimgncoord?name=" + localStorage.getItem("camName-DXB"),
        function (data) {
          $(".viewperimeterimages").empty();

          if (data.Failure) {
            console.log($(".viewperimeterimages"));
            $(".viewperimeterimages").append(
              `<div style="display: flex; justify-content: center; margin: 30px;">${data.Failure}</div>`
            );
            Messenger().post({
              message: data.Failure,
              type: "error",
              showCloseButton: true,
            });
          } else {
            //       $(".viewperimeterimages").empty().append(`
            //       <div class="panel bg-clr helppan" style="height: 40px;margin-top:-30px;margin-bottom: 20px;">
            //                         <div class="panel-heading helppanel" style="
            //     display: flex;
            //     justify-content: space-between;
            //     align-items: center;
            // ">
            //                           <h4 style="width: 90%;" class="under hideitem">${localStorage.getItem("camName-DXB")} Perimeter</h4>
            //                           <a class="close" onclick="closemodalbtn();" title="Close">×</a>
            //                         </div>
            //                         <hr style="margin-top: -10px;margin-left: -40px;width: calc(100% + 80px)" class="helpbr hideitem">
            //                     </div>`)

            // $(".viewperimeterimages").empty().append(`
            // <li class="panel paneldata okservice" style="background: transparent;">
            // <div class="accordion-toggle" data-toggle="collapse" data-parent="#sub-menu-1-collapse" href="#${key.replaceAll(" ","_")}_perimeter" style="cursor: pointer;"> ${key}</div>
            //   <ul id=" ${key.replaceAll(" ","_")}_perimeter" class="panel-collapse in">
            //       <img style="width: 50%;" src="http://${base_domainip}/nginx/${value}" />
            //   </ul>
            // </li>`)

            var dataArray = Object.entries(data.data);
            if (dataArray.length > 0) {
              var count = 0;
              for (const [key, value] of dataArray) {
                if (count == 0) {
                  $(".viewperimeterimages")
                    .append(`<div class="panel paneldata" style="background: transparent;margin: 20px 0;">
                      <div class="accordion-toggle" data-toggle="collapse" data-parent="#viewperimeter" href="#${key.replaceAll(
                        " ",
                        "_"
                      )}_perimeter" style="cursor: pointer;"> ${key}</div>
                        <div id="${key.replaceAll(
                          " ",
                          "_"
                        )}_perimeter" class="panel-collapse in collapse">
                            <div style="display: flex;justify-content: center;"><img style="width: 50%;margin: 20px 0;" src="http://${base_domainip}/nginx/${value}" /></div>
                        </div>
                      </div>`);
                } else {
                  $(".viewperimeterimages")
                    .append(`<div class="panel paneldata" style="background: transparent;margin: 20px 0;">
                      <div class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#viewperimeter" href="#${key.replaceAll(
                        " ",
                        "_"
                      )}_perimeter" style="cursor: pointer;"> ${key}</div>
                        <div id="${key.replaceAll(
                          " ",
                          "_"
                        )}_perimeter" class="panel-collapse collapse">
                            <div style="display: flex;justify-content: center;"><img style="width: 50%;margin: 20px 0;" src="http://${base_domainip}/nginx/${value}" /></div>
                        </div>
                      </div>`);
                }
                count = count + 1;
              }

              // $("#viewperimetermodal").css("transform", "translatex(0%)");
              // $("body").css("overflow","hidden")
            } else {
              $(".viewperimeterimages").append(
                `<div style="display: flex; justify-content: center; margin: 30px;">Perimeter services not added!</div>`
              );

              Messenger().post({
                message: "Perimeter services not added!",
                type: "error",
                showCloseButton: true,
              });
            }
          }
        }
      );
    } else {
      Messenger().post({
        message: "Please select camera!",
        type: "error",
        showCloseButton: true,
      });
    }
  } else {
    $("#savechangesbtn").show();
  }
}

function closemodalbtn() {
  $(".helpdesknav").css("transform", "translatex(110%)");
  $("body").css("overflow", "auto");
  $("#viewperimetermodal").css("transform", "translatex(110%)");
}
