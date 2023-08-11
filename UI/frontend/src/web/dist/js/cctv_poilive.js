  $("footer").hide()

  $(".active-li").removeClass("active-li");







           function closebtn1() {
               $(".nav-right").css({ transform: "translatex(105%)" });
        }
   
        

         function openallalerts(){
          let pageCount = 0;
          let totalCount

          $("#rightsidecont").empty();

          
          $(".side-nav.nav-right.nav_com").unbind("scroll").scroll(function () {
            console.log($("#rightsidecont"))
            if ($(".side-nav.nav-right.nav_com").scrollTop() + $(".side-nav.nav-right.nav_com").height() >= $("#rightsidecont").height() + 0) {
                if($.active === 0 && $(".getAlertData").length < totalCount){
                  pageCount++;
                  loadData();
                }
            }
        });

            $(".nav-right").css({
            transform: "translatex(0%)",
            "z-index": "999",
            transition: "all 0.5s ease-in-out",
          });



          loadData()
          function loadData(){
            var settings = {
            async: true,
            crossDomain: true,
            url: "/get_cam_alerts_nop?name=" + localStorage.getItem("poicamName-DXB") + "&page="+pageCount,
            // "url": "http://"+base_domainip+"/event-app/get_cam_alerts/saurabh/saurabh/cam-test",
            method: "GET",
            headers: {
              "cache-control": "no-cache",
              "postman-token": "1af61694-676e-5ee6-116a-41b0da1c82f6",
            },
          };

          $.ajax(settings).done(function (response) {
    var responseAlerts = response;
    totalCount = responseAlerts.total_alerts_count
            $("#right_loader").hide()
            if (responseAlerts.cam_alerts.length > 0) {
              // $(".count"+responseAlerts.cam_alertsappend('<span class="label label-success" style="font-size: 10px;font-weight: 400;position: relative;right: -5px;padding: 1px 5px;" id='+id_count+'>'+couningval+'</span>');
              
              for (
                p1 = 0;
                p1 < responseAlerts.cam_alerts.length;
                p1++
              ) {
                // var event_name;
                // if (responseAlerts.cam_alerts[p1].alert_2 == "") {
                //     event_name = responseAlerts.cam_alerts[p1].alert_1;
                // } else {
                //     event_name = responseAlerts.cam_alerts[p1].alert_1 + " | " + responseAlerts.cam_alerts[p1].alert_2
                // }
                //
                // var imageAlert = "http://" + localStorage.getItem('DXB_ip') + "/nginx/" + responseAlerts.cam_alerts[p1].thumbnail;
                //
                // var cityName = responseAlerts.cam_alerts[p1].city + ", " + responseAlerts.cam_alerts[p1].state;
                //
                // if(event_name == "Stream Disconnected"){
                //
                //     $("#camAlerts").prepend('<li  class="getAlertData" style="margin: 0 -9px;padding: 10px; border-bottom: 1px solid #ffffff30;" flight_id="' + responseAlerts.cam_alerts[p1].alert_id + '" airport="' + cityName + '"  terminal="' + responseAlerts.cam_alerts[p1].location + '"  camName="' + responseAlerts.cam_alerts[p1].cam_name + '"  camera_id="' + responseAlerts.cam_alerts[p1].cam_name + '"  event_name="' + event_name + '" event_url="' + responseAlerts.cam_alerts[p1].video + '" event_time="' + responseAlerts.cam_alerts[p1].date + '" status="' + responseAlerts.cam_alerts[p1].alert_status + '"> <img src="img/camDis.jpg" alt="" class="pull-left img-circle" onerror="imageerror(this)" loading="lazy" style="border-radius: 10px;height: 50px;width: 60px;margin-right: 20px"/> <div class="news-item-info"> <div class="name"><a href="#" style="padding: 0 !important; font-weight: 600;">' + event_name + '</a></div> <div class="position">' + "Alert Id: " + responseAlerts.cam_alerts[p1].alert_id + '</div> < class="time" style="font-size: 11px;">Time: ' + responseAlerts.cam_alerts[p1].date +</div> </li>        //
                // }else{
                //
                //     $("#camAlerts").prepend('<li  class="getAlertData" style="margin: 0 -9px;padding: 10px; border-bottom: 1px solid #ffffff30;" flight_id="' + responseAlerts.cam_alerts[p1].alert_id + '" airport="' + cityName + '"  terminal="' + responseAlerts.cam_alerts[p1].location + '"   camName="' + responseAlerts.cam_alerts[p1].cam_name + '"  camera_id="' + responseAlerts.cam_alerts[p1].cam_name + '"  event_name="' + event_name + '" event_url="' + responseAlerts.cam_alerts[p1].video + '" event_time="' + responseAlerts.cam_alerts[p1].date + '" status="' + responseAlerts.cam_alerts[p1].alert_status + '"> <img src=' + imageAlert + ' alt="" class="pull-left img-circle" onerror="imageerror(this)" loading="lazy" style="border-radius: 10px;height: 50px;width: 60px;margin-right: 20px"/> <div class="news-item-info"> <div class="name"><a href="#" style="padding: 0 !important; font-weight: 600;">' + event_name + '</a></div> <div class="position">' + "Alert Id: " + responseAlerts.cam_alerts[p1].alert_id + '</div> < class="time" style="font-size: 11px;">Time: ' + responseAlerts.cam_alerts[p1].date +</div> </li>        //
                // }

                if (
                  responseAlerts.cam_alerts[
                    p1
                  ].hasOwnProperty("poi_details")
                ) {
                  console.log("poi_here");
                  // $('#poi_deatils_text').show();

                  var string_text = "";
                  for (var key in responseAlerts.cam_alerts[p1].poi_details) {
                    if (
                      key != "_id" &&
                      key != "poi_face_path" &&
                      key != "poi_id"
                    ) {
                      string_text +=
                        key +
                        " : " +
                        responseAlerts.cam_alerts[p1]
                          .poi_details[key] +
                        "&#13;&#10;";
                    }
                  }

                  var event_name;
                  if (
                    responseAlerts.cam_alerts[p1]
                      .alert_2 == ""
                  ) {
                    event_name =
                      responseAlerts.cam_alerts[p1]
                        .alert_1;
                  } else {
                    event_name =
                      responseAlerts.cam_alerts[p1]
                        .alert_1 +
                      " | " +
                      responseAlerts.cam_alerts[p1]
                        .alert_2;
                  }

                  var imageAlert =
                    "http://" +
                    base_domainip +
                    "/nginx/" +
                    responseAlerts.cam_alerts[p1]
                      .thumbnail;

                  var cityName =
                    responseAlerts.cam_alerts[p1].city +
                    ", " +
                    responseAlerts.cam_alerts[p1].state;

                  if (event_name == "Stream Disconnected") {
                    $(
                      "#rightsidecont"
                    ).append(
                      '<li  class="getAlertData" style="margin: 0 -9px;padding: 10px; border-bottom: 1px solid #ffffff30;" flight_id="' +
                        responseAlerts.cam_alerts[p1]
                          .alert_id +
                        '" airport="' +
                        cityName +
                        '"  terminal="' +
                        responseAlerts.cam_alerts[p1]
                          .location +
                        '"   camName="' +
                        responseAlerts.cam_alerts[p1]
                          .cam_name +
                        '"  camera_id="' +
                        responseAlerts.cam_alerts[p1]
                          .cam_name +
                        '"  event_name="' +
                        event_name +
                        '" event_url="' +
                        responseAlerts.cam_alerts[p1]
                          .video +
                          '" thumbnail_url="' +
                        responseAlerts.cam_alerts[p1]
                          .thumbnail +
                        '" event_time="' +
                        responseAlerts.cam_alerts[p1]
                          .date +
                        '" status="' +
                        responseAlerts.cam_alerts[p1]
                          .alert_status +
                        '"> <img src="img/camDis.jpg" alt="" class="pull-left img-circle" onerror="imageerror(this)" loading="lazy" style="border-radius: 10px;height: 50px;width: 60px;margin-right: 20px"/> <div class="news-item-info"> <div class="name"><a href="#" style="padding: 0 !important; font-weight: 600;">' +
                        event_name +
                        '</a></div> <div class="position">' +
                        "Alert Id: " +
                        responseAlerts.cam_alerts[p1]
                          .alert_id +
                        '</div> <div class="time" style="font-size: 11px;">Time: ' +
                        responseAlerts.cam_alerts[p1]
                          .date +
                        "</div> </div> </li>"
                    );
                  } else {
                    $(
                      "#rightsidecont"
                    ).append(
                      '<li  class="getAlertData" style="margin: 0 -9px;padding: 10px; border-bottom: 1px solid #ffffff30;" flight_id="' +
                        responseAlerts.cam_alerts[p1]
                          .alert_id +
                        '" airport="' +
                        cityName +
                        '"  terminal="' +
                        responseAlerts.cam_alerts[p1]
                          .location +
                        '"   camName="' +
                        responseAlerts.cam_alerts[p1]
                          .cam_name +
                        '"  camera_id="' +
                        responseAlerts.cam_alerts[p1]
                          .cam_name +
                        '"  event_name="' +
                        event_name +
                        '" event_url="' +
                        responseAlerts.cam_alerts[p1]
                          .video +
                          '" thumbnail_url="' +
                        responseAlerts.cam_alerts[p1]
                          .thumbnail +
                        '" event_time="' +
                        responseAlerts.cam_alerts[p1]
                          .date +
                        '" status="' +
                        responseAlerts.cam_alerts[p1]
                          .alert_status +
                        '" poi_or_voi="poi_details" poi_details="' +
                        string_text +
                        '" > <img src=' +
                        imageAlert +
                        ' alt="" class="pull-left img-circle" onerror="imageerror(this)" loading="lazy" style="border-radius: 10px;height: 50px;width: 60px;margin-right: 20px"/> <div class="news-item-info"> <div class="name"><a href="#" style="padding: 0 !important; font-weight: 600;">' +
                        event_name +
                        '</a></div> <div class="position">' +
                        "Alert Id: " +
                        responseAlerts.cam_alerts[p1]
                          .alert_id +
                        '</div> <div class="time" style="font-size: 11px;">Time: ' +
                        responseAlerts.cam_alerts[p1]
                          .date +
                        "</div> </div> </li>"
                    );
                  }
                } else if (
                  responseAlerts.cam_alerts[
                    p1
                  ].hasOwnProperty("voi_details")
                ) {
                  var string_text = "";
                  for (var key in responseAlerts.cam_alerts.Alerts[p1].voi_details) {
                    if (key != "_id" && key != "voi_id") {
                      string_text +=
                        key +
                        " : " +
                        responseAlerts.cam_alerts[p1]
                          .voi_details[key] +
                        "&#13;&#10;";
                    }
                  }

                  var event_name;
                  if (
                    responseAlerts.cam_alerts[p1]
                      .alert_2 == ""
                  ) {
                    event_name =
                      responseAlerts.cam_alerts[p1]
                        .alert_1;
                  } else {
                    event_name =
                      responseAlerts.cam_alerts[p1]
                        .alert_1 +
                      " | " +
                      responseAlerts.cam_alerts[p1]
                        .alert_2;
                  }

                  var imageAlert =
                    "http://" +
                    base_domainip +
                    "/nginx/" +
                    responseAlerts.cam_alerts[p1]
                      .thumbnail;

                  var cityName =
                    responseAlerts.cam_alerts[p1].city +
                    ", " +
                    responseAlerts.cam_alerts[p1].state;

                  if (event_name == "Stream Disconnected") {
                    $(
                      "#rightsidecont"
                    ).append(
                      '<li  class="getAlertData" style="margin: 0 -9px;padding: 10px; border-bottom: 1px solid #ffffff30;" flight_id="' +
                        responseAlerts.cam_alerts[p1]
                          .alert_id +
                        '" airport="' +
                        cityName +
                        '"  terminal="' +
                        responseAlerts.cam_alerts[p1]
                          .location +
                        '"   camName="' +
                        responseAlerts.cam_alerts[p1]
                          .cam_name +
                        '"  camera_id="' +
                        responseAlerts.cam_alerts[p1]
                          .cam_name +
                        '"  event_name="' +
                        event_name +
                        '" event_url="' +
                        responseAlerts.cam_alerts[p1]
                          .video +
                          '" thumbnail_url="' +
                        responseAlerts.cam_alerts[p1]
                          .thumbnail +
                        '" event_time="' +
                        responseAlerts.cam_alerts[p1]
                          .date +
                        '" status="' +
                        responseAlerts.cam_alerts[p1]
                          .alert_status +
                        '"> <img src="img/camDis.jpg" alt="" class="pull-left img-circle" onerror="imageerror(this)" loading="lazy" style="border-radius: 10px;height: 50px;width: 60px;margin-right: 20px"/> <div class="news-item-info"> <div class="name"><a href="#" style="padding: 0 !important; font-weight: 600;">' +
                        event_name +
                        '</a></div> <div class="position">' +
                        "Alert Id: " +
                        responseAlerts.cam_alerts[p1]
                          .alert_id +
                        '</div> <div class="time" style="font-size: 11px;">Time: ' +
                        responseAlerts.cam_alerts[p1]
                          .date +
                        "</div> </div> </li>"
                    );
                  } else {
                    $(
                      "#rightsidecont"
                    ).append(
                      '<li  class="getAlertData" style="margin: 0 -9px;padding: 10px; border-bottom: 1px solid #ffffff30;" flight_id="' +
                        responseAlerts.cam_alerts[p1]
                          .alert_id +
                        '" airport="' +
                        cityName +
                        '"  terminal="' +
                        responseAlerts.cam_alerts[p1]
                          .location +
                        '"   camName="' +
                        responseAlerts.cam_alerts[p1]
                          .cam_name +
                        '"  camera_id="' +
                        responseAlerts.cam_alerts[p1]
                          .cam_name +
                        '"  event_name="' +
                        event_name +
                        '" event_url="' +
                        responseAlerts.cam_alerts[p1]
                          .video +
                          '" thumbnail_url="' +
                        responseAlerts.cam_alerts[p1]
                          .thumbnail +
                        '" event_time="' +
                        responseAlerts.cam_alerts[p1]
                          .date +
                        '" status="' +
                        responseAlerts.cam_alerts[p1]
                          .alert_status +
                        '" poi_or_voi="voi_details" voi_details="' +
                        string_text +
                         '" voi_numberplate="'+ responseAlerts.cam_alerts[p1]
                          .number_plate +'"  > <img src=' +
                        imageAlert +
                        ' alt="" class="pull-left img-circle" onerror="imageerror(this)" loading="lazy" style="border-radius: 10px;height: 50px;width: 60px;margin-right: 20px"/> <div class="news-item-info"> <div class="name"><a href="#" style="padding: 0 !important; font-weight: 600;">' +
                        event_name +
                        '</a></div> <div class="position">' +
                        "Alert Id: " +
                        responseAlerts.cam_alerts[p1]
                          .alert_id +
                        '</div> <div class="time" style="font-size: 11px;">Time: ' +
                        responseAlerts.cam_alerts[p1]
                          .date +
                        "</div> </div> </li>"
                    );
                  }
                } else {
                  var event_name;
                  if (
                    responseAlerts.cam_alerts[p1]
                      .alert_2 == ""
                  ) {
                    event_name =
                      responseAlerts.cam_alerts[p1]
                        .alert_1;
                  } else {
                    event_name =
                      responseAlerts.cam_alerts[p1]
                        .alert_1 +
                      " | " +
                      responseAlerts.cam_alerts[p1]
                        .alert_2;
                  }

                  var imageAlert =
                    "http://" +
                    base_domainip +
                    "/nginx/" +
                    responseAlerts.cam_alerts[p1]
                      .thumbnail;

                  var cityName =
                    responseAlerts.cam_alerts[p1].city +
                    ", " +
                    responseAlerts.cam_alerts[p1].state;

                  if (event_name == "Stream Disconnected") {
                    $(
                      "#rightsidecont"
                    ).append(
                      '<li  class="getAlertData" style="margin: 0 -9px;padding: 10px; border-bottom: 1px solid #ffffff30;" flight_id="' +
                        responseAlerts.cam_alerts[p1]
                          .alert_id +
                        '" airport="' +
                        cityName +
                        '"  terminal="' +
                        responseAlerts.cam_alerts[p1]
                          .location +
                        '"   camName="' +
                        responseAlerts.cam_alerts[p1]
                          .cam_name +
                        '"  camera_id="' +
                        responseAlerts.cam_alerts[p1]
                          .cam_name +
                        '"  event_name="' +
                        event_name +
                        '" event_url="' +
                        responseAlerts.cam_alerts[p1]
                          .video +
                          '" thumbnail_url="' +
                        responseAlerts.cam_alerts[p1]
                          .thumbnail +
                        '" event_time="' +
                        responseAlerts.cam_alerts[p1]
                          .date +
                        '" status="' +
                        responseAlerts.cam_alerts[p1]
                          .alert_status +
                        '"> <img src="img/camDis.jpg" alt="" class="pull-left img-circle" onerror="imageerror(this)" loading="lazy" style="border-radius: 10px;height: 50px;width: 60px;margin-right: 20px"/> <div class="news-item-info"> <div class="name"><a href="#" style="padding: 0 !important; font-weight: 600;">' +
                        event_name +
                        '</a></div> <div class="position">' +
                        "Alert Id: " +
                        responseAlerts.cam_alerts[p1]
                          .alert_id +
                        '</div> <div class="time" style="font-size: 11px;">Time: ' +
                        responseAlerts.cam_alerts[p1]
                          .date +
                        "</div> </div> </li>"
                    );
                  } else {
                    $(
                      "#rightsidecont"
                    ).append(
                      '<li  class="getAlertData" style="margin: 0 -9px;padding: 10px; border-bottom: 1px solid #ffffff30;" flight_id="' +
                        responseAlerts.cam_alerts[p1]
                          .alert_id +
                        '" airport="' +
                        cityName +
                        '"  terminal="' +
                        responseAlerts.cam_alerts[p1]
                          .location +
                        '"   camName="' +
                        responseAlerts.cam_alerts[p1]
                          .cam_name +
                        '"  camera_id="' +
                        responseAlerts.cam_alerts[p1]
                          .cam_name +
                        '"  event_name="' +
                        event_name +
                        '" event_url="' +
                        responseAlerts.cam_alerts[p1]
                          .video +
                          '" thumbnail_url="' +
                        responseAlerts.cam_alerts[p1]
                          .thumbnail +
                        '" event_time="' +
                        responseAlerts.cam_alerts[p1]
                          .date +
                        '" status="' +
                        responseAlerts.cam_alerts[p1]
                          .alert_status +
                        '"> <img src=' +
                        imageAlert +
                        ' alt="" class="pull-left img-circle" onerror="imageerror(this)" loading="lazy" style="border-radius: 10px;height: 50px;width: 60px;margin-right: 20px"/> <div class="news-item-info"> <div class="name"><a href="#" style="padding: 0 !important; font-weight: 600;">' +
                        event_name +
                        '</a></div> <div class="position">' +
                        "Alert Id: " +
                        responseAlerts.cam_alerts[p1]
                          .alert_id +
                        '</div> <div class="time" style="font-size: 11px;">Time: ' +
                        responseAlerts.cam_alerts[p1]
                          .date +
                        "</div> </div> </li>"
                    );
                  }
                }
              }
            } else {
              
              $("#rightsidecont" ).append(
                '<h4 style="text-align: center;">No alerts found</h4>'
              );
            }
  });

          }





         }
















$(document).ready(()=>{
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

setTimeout(()=>{
  let player;

    var cameraName = localStorage.getItem("poicamName-DXB")
  var getpoivoicamli = JSON.parse(localStorage.getItem("getpoivoicam"));


  if(getpoivoicamli && getpoivoicamli.length > 0){
      $(".openallalerts").show()
      $("#sidebarangle").css("display","flex")


    for (i = 0; i < getpoivoicamli.length; i++) {
    for (j = 0; j < getpoivoicamli[i].location.length; j++) {
      for (k = 0; k < getpoivoicamli[i].location[j].camera.length; k++) {
        console.log(getpoivoicamli[i].location[j].camera[k].cam_name)
        if (cameraName == getpoivoicamli[i].location[j].camera[k].cam_name) {
          $("#CameraName__span").text(cameraName)
          $("#canvas_vid1").remove();
          $("#videoDiv1").append(
            '<canvas ondblclick="closenavsidebar()"  id="canvas_vid1" style="width:100%;height:100%;top:0;left:0;position: absolute;"></canvas>'
          );

          $("#fralertdetails").html(`<h3 style="font-weight: 500;">No Face Found!</h3>`)

          if (player) {
            player.destroy();
          }

          player = new JSMpeg.Player("ws://" + base_domainip.split(":")[0] + ":" + getpoivoicamli[i].location[j].camera[k].cam_output_url.split(":")[2], {
            canvas: document.getElementById("canvas_vid1"), // Canvas should be a canvas DOM element
          });
        }
      }
    }
  }
  }else{
    $("#videoDiv1").append(
      "<div style='margin-top: 50px;    width: 100%;display: flex; justify-content: center;align-items: center;'>No stream found, Please select camera or add POI service to camera.</div>"
      );
      $(".openallalerts").hide()
      $("#sidebarangle").hide()
    }

  
  // closenavsidebar()
},1000)
})





$(document).on("click", ".getAlertData", function () {
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
    var event_url = $(this).attr("event_url");
    var thumbnail_url = "http://" + base_domainip + "/nginx/" + $(this).attr("thumbnail_url")
      event_url  = event_url == "" ? "img/video/monitoringdisabled.mp4" : "http://" + base_domainip + "/nginx/" + event_url;
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
    var numberplateimg = $(this).attr("voi_numberplate")

    $("#poi_deatils_text").hide();
    $("#voi_deatils_text").show();
    $("#voi_det_api_text").empty();
    $("#voi_det_api_text").append(voi_details_fromapi);
    $("#voi_det_number_img").attr("src", "http://" + base_domainip + "/nginx/" + numberplateimg)
    var flight_id = $(this).attr("flight_id");
    var airport = $(this).attr("airport");
    var terminal = $(this).attr("terminal");
    // var stand_type=$(this).attr("stand_type");
    var event_name = $(this).attr("event_name");
    var camName = $(this).attr("camName");
    var event_time = $(this).attr("event_time");
    var status = $(this).attr("status");
    var event_url = $(this).attr("event_url");
    var thumbnail_url = "http://" + base_domainip + "/nginx/" + $(this).attr("thumbnail_url")
    event_url  = event_url == "" ? "img/video/monitoringdisabled.mp4" : "http://" + base_domainip + "/nginx/" + event_url;
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
    var event_url = $(this).attr("event_url");
    var thumbnail_url = "http://" + base_domainip + "/nginx/" + $(this).attr("thumbnail_url")
    event_url  = event_url == "" ? "img/video/monitoringdisabled.mp4" : "http://" + base_domainip + "/nginx/" + event_url;
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



function closenavsidebar() {
  $("footer").hide()
  $("#desktop_header").css("transition","all 1s")
  $("nav#sidebar").css("transition","all 1s")
  $("#ipad_header").css("transition","all 1s")
  $("#mobile_header").css("transition","all 1s")
  if($("#sidebar.sidebar.nav-collapse.collapse.homeside").css("margin-left") == "0px"){
    $("#sidebar.sidebar.nav-collapse.collapse.homeside").css("margin-left","-265px")
    $(".widget.user-bdy").css("height","100vh").css("padding","0px").css("margin-left","0px").css("margin-top","0px").css("margin-right","0px").attr("style",$(".widget.user-bdy").attr("style")+ "margin: 0 !important;")
     $("#ipad_header").attr("style","margin-top: -80px !important;position: relative;")
    $("#desktop_header").attr("style","margin-top: -80px !important;")
    $("#mobile_header").attr("style","margin-top: -80px !important;")
    $("#sidebar").css("margin-top","-80px")
    $("#nav.side-nav.nav-right.nav_com").attr("style","overflow-y: scroll;overflow-x: hidden; transform: translatex(130%);box-shadow: 2px 2px 20px #000;height: 100vh; top:0")
    $("#sidebarangle").empty().append('<i class="fa fa-arrows-alt" aria-hidden="true"></i>')
    // if (document.documentElement.requestFullscreen) {
    //   document.documentElement.requestFullscreen();
    // } else if (document.documentElement.webkitRequestFullscreen) { /* Safari */
    //   document.documentElement.webkitRequestFullscreen();
    // } else if (document.documentElement.msRequestFullscreen) { /* IE11 */
    //   document.documentElement.msRequestFullscreen();
    // }
  }else{
    $("#sidebar.sidebar.nav-collapse.collapse.homeside").css("margin-left","0px").css("margin-top","65px")
    $(".widget.user-bdy").css("height","calc(100vh - 160px)").css("padding","15px").css("margin-left","280px").css("margin-top","94px").css("margin-right","15px")
    $("#desktop_header").attr("style","margin-top: 0px !important;")
     $("#ipad_header").attr("style","margin-top: 0px !important;position: sticky;")
     $("#mobile_header").attr("style","margin-top: 0px !important;")
    $("#sidebar").css("margin-top","0px")
    $("#nav.side-nav.nav-right.nav_com").attr("style","overflow-y: scroll;overflow-x: hidden; transform: translatex(130%);box-shadow: 2px 2px 20px #000;height: 89.5vh;top:10.5vh")
    $("#sidebarangle").empty().append('<i class="fa fa-arrows-alt" aria-hidden="true"></i>')
    // if (document.exitFullscreen) {
    //   document.exitFullscreen();
    // } else if (document.webkitExitFullscreen) { /* Safari */
    //   document.webkitExitFullscreen();
    // } else if (document.msExitFullscreen) { /* IE11 */
    //   document.msExitFullscreen();
    // }
  }
}










function appendMQTTAuth(data){
  // clearTimeoutPOI(clearTimeoutPOI)

  if(localStorage.getItem("poicamName-DXB") == data.cam_name ){
    $(".widget.user-bdy").css("height","auto")
  if(data.auth_person === "N"){
    // $("#fralertdetails").html(`<div style="
    //       height: 100%;
    //       width: 100%;
    //   "><h3 style="font-weight: 500;height: 80px;width: 100%;padding: 0 20px;margin: 0;background: red;display: flex;align-items: center;position: absolute;left: 0;top: 0;font-size: 48px;justify-content:center;">Unauthorized</h3>
    //   </div>`)



      $("#vehicleauthounautoheader").css("background","red").css("transform","translateY(0)").empty().append(`<h3 style="font-weight: 500;width: 100%;font-size: 10vw;">Unauthorized</h3>`)

    $("#persoininfocontainer").hide()



if($("#nav").css("transform")?.split(",")[4]?.trim() == 0 && localStorage.getItem("poicamName-DXB") == data.cam_name){
  $("#rightsidecont").prepend(
    `<li class="getAlertData" style="margin: 0 -9px;padding: 10px; border-bottom: 1px solid #ffffff30;" flight_id="${data.alert_id}" airport="${data.city}, ${data.state}" terminal="${data.location}" camname="${data.cam_name}" camera_id="${data.cam_name}" event_name="${data.alert_1}" event_url="${data.video}" thumbnail_url="${data.thumbnail}" event_time="${data.alert_date}" status="${data.alert_status}" poi_or_voi=""> <img src="http://${base_domainip}/nginx/${data.thumbnail}" alt="" class="pull-left img-circle" onerror="imageerror(this)" loading="lazy" style="border-radius: 10px;height: 50px;width: 60px;margin-right: 20px"> <div class="news-item-info"> <div class="name"><a href="#" style="padding: 0 !important; font-weight: 600;">${data.alert_1}</a></div> <div class="position">Alert Id: ${data.alert_id}</div> <div class="time" style="font-size: 11px;">Time: ${data.alert_date}</div> </div> </li>`
  )
}


  }else{
    $("#persoininfocontainer").show()

    $("#fralertdetails").html(`<div style="
    height: 100%;
    width: 100%;
"><h3 style="font-weight: 500;height: 80px;width: 100%;padding: 0 20px;margin: 0;background: green;display: flex;align-items: center;position: absolute;left: 0;top: 0;font-size: 48px;justify-content:center;">Authorized</h3>

<div style="
    margin: 20px 0;
    padding: 0 20px;
    margin-top: 100px;
">
<div style="display: flex; justify-content: center;"><img style="height: 300px;margin-bottom: 20px;" src="http://${base_domainip}/nginx/${data.poi_details.poi_face_path}" id="personfaceimg" ></img></div> </br>
<div id="personinfodetails"></div>
</div>
</div>`)


    $("#vehicleauthounautoimage > img").attr("src", `http://${base_domainip}/nginx/${data.poi_details.poi_face_path}`)

      $("#vehicleauthounautoheader").css("background","green").css("transform","translateY(0)").empty().append(`<h3 style="font-weight: 500;width: 100%;font-size: 10vw;">Authorized</h3>`)


      $("#persoininfocontainer").css("transform","translateX(0)")
// ${Object.entries(data.poi_details).map(poi=>{
//   if(poi[0]!="poi_id" && poi[0]!="poi_face_path"){

//     return `<span style="text-transform: capitalize;">${poi[0]}: </span> <a>${poi[1]}</a> </br>`
//   }
// }).join("")}    

     $("#vehicleauthounautoinfo").empty().append(`
      <table id="personinfotable" class="table table-striped table-hover dataTable no-footer" style="width:100%"></table>
      `)

  $("#personinfotable").append(
    `<thead> <tr> <th></th><th></th></tr> </thead><tbody id="personinfobody"></tbody>`
  )


  Object.entries(data.poi_details).forEach(function(data){
    if(data[0]!="poi_id" && data[0]!="poi_face_path"){
      if(data[0] == "name"){
         $("#personinfobody").prepend(`<tr style="font-size: 18px;text-transform: capitalize;"><td>${data[0]}</td><td>${data[1]}</td></tr>`)   
      }else{
      $("#personinfobody").append(`<tr style="font-size: 18px;text-transform: capitalize;"><td>${data[0]?.replaceAll("_"," ")}</td><td>${data[1]}</td></tr>`)
      }
    }
  })




    var string_text = "";
                  for (var key in data.poi_details) {
                    if (
                      key != "_id" &&
                      key != "poi_face_path" &&
                      key != "poi_id"
                    ) {
                      string_text +=
                        key +
                        " : " +
                        data
                          .poi_details[key] +
                        "&#13;&#10;";
                    }
                  }




if($("#nav").css("transform")?.split(",")[4]?.trim() == 0 && localStorage.getItem("poicamName-DXB") == data.cam_name){
  $("#rightsidecont").prepend(
    `<li class="getAlertData" style="margin: 0 -9px;padding: 10px; border-bottom: 1px solid #ffffff30;" flight_id="${data.alert_id}" airport="${data.city}, ${data.state}" terminal="${data.location}" camname="${data.cam_name}" camera_id="${data.cam_name}" event_name="${data.alert_1}" event_url="${data.video}" thumbnail_url="${data.thumbnail}" event_time="${data.alert_date}" status="${data.alert_status}" poi_or_voi="poi_details" poi_details="${string_text}"> <img src="http://${base_domainip}/nginx/${data.thumbnail}" alt="" class="pull-left img-circle" onerror="imageerror(this)" loading="lazy" style="border-radius: 10px;height: 50px;width: 60px;margin-right: 20px"> <div class="news-item-info"> <div class="name"><a href="#" style="padding: 0 !important; font-weight: 600;">${data.alert_1}</a></div> <div class="position">Alert Id: ${data.alert_id}</div> <div class="time" style="font-size: 11px;">Time: ${data.alert_date}</div> </div> </li>`
  )
}

  }

  clearTimeoutPOI = setTimeout(()=>{
    $("#fralertdetails").hide()
      $("#persoininfocontainer").css("transform","translateX(150%)")
      $("#vehicleauthounautoheader").css("transform","translateY(-130%)")

    if($("#sidebar.sidebar.nav-collapse.collapse.homeside").css("margin-left") == "0px"){
      $(".widget.user-bdy").css("height","100vh")
    }else{
      $(".widget.user-bdy").css("height","calc(100vh - 160px)")

    }

  },12000)
  }
}