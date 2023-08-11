var alertsdata;
var camdata;
var baseIp;
var atmId;
var camName;
var qrtMap;
var addressPoints = [];
// document.addEventListener("contextmenu", (event) => event.preventDefault());

$.get("/ip", function (ip) {
  baseIp = ip;
});

$(".bdf").removeClass("bdf").addClass("over");

$(".tagbt").click(function () {
  $(".user_select").addClass("rightrm");
});

function capitalizeFirstLetter(string) {
  if (string) {
    return string?.charAt(0).toUpperCase() + string?.slice(1);
  } else {
    return string;
  }
}

close_modal = function () {
  document.getElementById("videoAlerts").pause();
};

function mapqrtimageerror(e) {
  $($(".qrt_video").parent()).hide();
  $(e).hide();
  $("#qrt_map_container").removeClass("col-lg-8").addClass("col-lg-12");
}

function timeformatam(hh, mm) {
  var hour = Number(hh);
  var suffix = hour >= 12 ? "PM" : "AM";
  var hours = ((hour + 11) % 12) + 1 + mm + " " + suffix;
  return hours;
}

function formatDate(date) {
  var datearray = date?.split("/");
  var newdate = datearray
    ? datearray[0] + "/" + datearray[1] + "/20" + datearray[2]
    : "";
  return newdate;
  return date;
}
function nothumbnail(e) {
  e.src = "img/monitoringdisabled.png";
  e.title = "No Thumbnail";
}
function formatQRTDate(date) {
  if (date) {
    var datearray = date?.split("/");
    var newdate =
      datearray[0] + "/" + datearray[1] + "/20" + datearray[2]?.trim();
    return newdate;
  }
  return date;
}
function live_camera(e) {
  //   var atm_id = $(e).attr("atm_id");
  //   var cam_name = $(e).attr("cam_name");
  //   var newstream = window.open(
  //     "/cctv_livestream?atm_id=" + atm_id + "&cam_name=" + cam_name,
  //     "livestream",
  //     "width=600,height=400,top=250, left=960"
  //   );
  //   if (
  //     !newstream ||
  //     newstream.closed ||
  //     typeof newstream.closed == "undefined"
  //   ) {
  //     Messenger().post({
  //       message: "Popup is blocked !!",
  //       type: "error",
  //       showCloseButton: true,
  //     });
  //   }
  //   window.location.href = "/cctv_monitoring";
  $(".active-li").removeClass("active-li");
  $(".cctv_monitoring").addClass("active-li");
  localStorage.setItem("isFromMap", true);
  localStorage.setItem("camName-DXB", $(e).attr("cam_name"));
}

function stepanim(step, assign, accept, reach, resolve) {
  $(".step_li .step__icon").attr("data-toggle", "tooltip");
  $(".step_li .step__icon").attr("data-placement", "top");
  if (step == "1") {
    $(".step-1").removeClass("step--incomplete").addClass("step--complete");
    $(".step-1").removeClass("step--active").addClass("step--inactive");
    $(".step-1").next().removeClass("step--inactive").addClass("step--active");
    $(".step-1").addClass("lastcompletedstep");
    $(".step-1 .step__icon").attr(
      "data-original-title",
      "Assigned at: " +
        formatDate(assign.slice("0", "-8")) +
        " " +
        timeformatam(assign.slice("-8", "-6"), assign.slice("-6", "-3"))
    );
  } else if (step == "2") {
    $(".step-1").removeClass("step--incomplete").addClass("step--complete");
    $(".step-1").removeClass("step--active").addClass("step--inactive");
    $(".step-1").next().removeClass("step--inactive").addClass("step--active");
    $(".step-1 .step__icon").attr(
      "data-original-title",
      "Assigned at: " +
        formatDate(assign.slice("0", "-8")) +
        " " +
        timeformatam(assign.slice("-8", "-6"), assign.slice("-6", "-3"))
    );
    setTimeout(() => {
      $(".step-2").removeClass("step--incomplete").addClass("step--complete");
      $(".step-2").removeClass("step--active").addClass("step--inactive");
      $(".step-2").addClass("lastcompletedstep");
      $(".step-2")
        .next()
        .removeClass("step--inactive")
        .addClass("step--active");
      $(".step-2 .step__icon").attr(
        "data-original-title",
        "Accepted at: " +
          formatQRTDate(accept.slice("0", "-8")) +
          " " +
          timeformatam(accept.slice("-8", "-6"), accept.slice("-6", "-3"))
      );
    }, 500);
  } else if (step == "3") {
    $(".step-1").removeClass("step--incomplete").addClass("step--complete");
    $(".step-1").removeClass("step--active").addClass("step--inactive");
    $(".step-1").next().removeClass("step--inactive").addClass("step--active");
    $(".step-1 .step__icon").attr(
      "data-original-title",
      "Assigned at: " +
        formatDate(assign.slice("0", "-8")) +
        " " +
        timeformatam(assign.slice("-8", "-6"), assign.slice("-6", "-3"))
    );
    setTimeout(() => {
      $(".step-2").removeClass("step--incomplete").addClass("step--complete");
      $(".step-2").removeClass("step--active").addClass("step--inactive");
      $(".step-2")
        .next()
        .removeClass("step--inactive")
        .addClass("step--active");
      $(".step-2 .step__icon").attr(
        "data-original-title",
        "Accepted at: " +
          formatQRTDate(accept.slice("0", "-8")) +
          " " +
          timeformatam(accept.slice("-8", "-6"), accept.slice("-6", "-3"))
      );
    }, 500);

    setTimeout(() => {
      $(".step-3").removeClass("step--incomplete").addClass("step--complete");
      $(".step-3").removeClass("step--active").addClass("step--inactive");
      $(".step-3").addClass("lastcompletedstep");
      $(".step-3")
        .next()
        .removeClass("step--inactive")
        .addClass("step--active");
      $(".step-3 .step__icon").attr(
        "data-original-title",
        "Reached at: " +
          formatQRTDate(reach.slice("0", "-8")) +
          " " +
          timeformatam(reach.slice("-8", "-6"), reach.slice("-6", "-3"))
      );
    }, 1000);
  } else {
    $(".step-1").removeClass("step--incomplete").addClass("step--complete");
    $(".step-1").removeClass("step--active").addClass("step--inactive");
    $(".step-1").next().removeClass("step--inactive").addClass("step--active");
    $(".step-1 .step__icon").attr(
      "data-original-title",
      "Assigned at: " +
        formatDate(assign?.slice("0", "-8")) +
        " " +
        timeformatam(assign?.slice("-8", "-6"), assign?.slice("-6", "-3"))
    );
    setTimeout(() => {
      $(".step-2").removeClass("step--incomplete").addClass("step--complete");
      $(".step-2").removeClass("step--active").addClass("step--inactive");
      $(".step-2")
        .next()
        .removeClass("step--inactive")
        .addClass("step--active");
      $(".step-2 .step__icon").attr(
        "data-original-title",
        "Accepted at: " +
          formatQRTDate(accept?.slice("0", "-8")) +
          " " +
          timeformatam(accept?.slice("-8", "-6"), accept?.slice("-6", "-3"))
      );
    }, 500);

    setTimeout(() => {
      $(".step-3").removeClass("step--incomplete").addClass("step--complete");
      $(".step-3").removeClass("step--active").addClass("step--inactive");
      $(".step-3")
        .next()
        .removeClass("step--inactive")
        .addClass("step--active");
      $(".step-3 .step__icon").attr(
        "data-original-title",
        "Reached at: " +
          formatQRTDate(reach?.slice("0", "-8")) +
          " " +
          timeformatam(reach?.slice("-8", "-6"), reach?.slice("-6", "-3"))
      );
    }, 1000);

    setTimeout(() => {
      $(".step-4").removeClass("step--incomplete").addClass("step--complete");
      $(".step-4").removeClass("step--active").addClass("step--inactive");
      $(".step-4").addClass("lastcompletedstep");
      $(".step-4")
        .next()
        .removeClass("step--inactive")
        .addClass("step--active");
      $(".step-4 .step__icon").attr(
        "data-original-title",
        "Resolved at: " +
          formatQRTDate(resolve?.slice("0", "-8")) +
          " " +
          timeformatam(resolve?.slice("-8", "-6"), resolve?.slice("-6", "-3"))
      );
    }, 1500);
  }
  $('[data-toggle="tooltip"]').tooltip({ html: "false" });
}
// $("#search-criteria").on("keyup", function () {
//   var g = $(this).val().toLowerCase();
//   atm_cam_details = camdata.atm_cam_details.filter(function (cam) {
//     return cam.cam_name.toLowerCase().includes(g);
//   });
//   $("#sidecontent").empty();
//   if (atm_cam_details) {
//     $("#camera_counter").text(atm_cam_details.length);
//   } else {
//     $("#camera_counter").text("0");
//   }
//   var outputHtml = "";
//   if (atm_cam_details.length < 1) {
//     outputHtml = "No Live Camera Found!";
//   } else {
//     atm_cam_details.length > 0 &&
//       atm_cam_details.forEach((obj) => {
//         // obj.location.length > 0 &&
//         //   obj.location.forEach((obj1) => {
//         //     obj1.camera.length > 0 &&
//         //       obj1.camera.forEach((obj2) => {
//         var status;
//         if (obj.cam_status == "live") {
//           status = "Online";
//         } else {
//           status = "Offline";
//         }
//         outputHtml += `
//            <div class="cam_row">
//       <div class="row" style="color: #fff;margin-bottom: 15px;">
//                             <div class="col-md-6">
//                                 <p style="opacity: 0.5;font-weight: 100;line-height: 21px;font-size: 11px"><span class="clock-icon"><img src="img/clock.png" style="width: 15px !important;height: 15px !important;margin-top: 0px !important;"></span><span class="clocktime" style="padding-left: 5px;"> ${obj.cam_add_time}</span></p>
//                             </div>
//                             <div class="col-md-3"><p onclick="live_camera()" class="live_camera" style="margin-left: 22px;color: red;background: transparent;border: 1px solid red;outline: none;font-size: 11px;text-align: center;padding: 2px 5px;width: 100%;border-radius:2px;
// ">LIVE</p></div>
//                             <div class="col-md-3">
//                                 <p style="background-color: #2d3643;width: 100%;padding: 3px 5px;text-align: center;border-radius:2px;font-size: 11px;"><i class="fa fa-circle blink2" style="color: green;font-size: 11px;display: initial;"></i> ${status}</p>
//                             </div>
//                         </div>
//                         <div onclick="openright('${obj.atm_id}','${obj.cam_name}')" class="row" style="margin-top: -13px;">
//                             <div class="col-md-2">
//                                 <img src="img/10.jpg" style="border-color: rgb(0, 128, 0);width: 60px !important;height: 50px !important;">
//                             </div>
//                             <div id="sidedt" class="col-md-10" style="    padding-top: 3px;padding-left: 40px; color: #fff;">
//                                 <p style="margin-bottom: 0px;font-weight: 500;">${obj.cam_name}</p>
//                                 <ul class="">
//                                     <li><span style="line-height: 19px;font-weight: 500;opacity: 0.5;font-size: 12px;">${obj.area}, ${obj.city}</span></li>
//                                 </ul>
//                             </div>
//                         </div>
//                     </div>
//                    <hr style="margin-top: 10px;"/>
//                    </div>
//      `;
//       });
//   }
//   //     });
//   // });
//   document.getElementById("sidecontent").innerHTML = outputHtml;
// $(".leftsrh").each(function () {
//   var s = $(this).text().toLowerCase();
//   $(this).closest(".leftsrh")[s.indexOf(g) !== -1 ? "show" : "hide"]();
// });
// });

// $("#rightsrch").on("keyup", function () {
// $("#rightsidecont").empty();
// var g = $(this).val().toLowerCase();
// location_cam_alerts = alertsdata.location_cam_alerts.filter(function (alert) {
//   return (
//     alert.alert_1.toLowerCase().includes(g) ||
//     alert.alert_id.toLowerCase().includes(g) ||
//     alert.priority.toLowerCase().includes(g)
//   );
// });
// $("#alerts_counter").text(location_cam_alerts.length);
// if (location_cam_alerts.length == "0") {
//   $("#rightsidecont").append("No Alerts Found!!");
// } else {
//   $("#right_loader").show();
//   location_cam_alerts.length > 0 &&
//     location_cam_alerts.forEach((obj) => {
//       $("#rightsidecont").append(`<div class="item-side rightsrh">
//                       <div class="row" style="color: #fff;">
//                           <div class="col-md-8">
//                               <p>${obj.alert_1}</p>
//                           </div>
//                           <div class="col-md-4">
//                               <p style="font-size: 11px;">${obj.priority}</p>
//                           </div>
//                       </div>
//                       <div class="row" style="margin-top: -13px;">
//                           <div class="col-md-2">
//                               <img src="img/10.jpg" style="border-color: rgb(0, 128, 0);width: 60px !important;height: 50px !important;">
//                           </div>
//                           <div class="col-md-10" style="    padding-top: 16px;padding-left: 40px; color: #fff;">
//                               <p style="margin-bottom: 0px;font-weight: 500;">Alert Id : ${obj.alert_id}</p>
//                               <p style="opacity: 0.5;font-weight: 100;line-height: 29px;font-size: 11px"><span class="clock-icon"><img src="img/clock.png" style="width: 15px !important;height: 15px !important;margin-top: 0px !important;"></span><span class="clocktime" style="padding-left: 5px;"> ${obj.date}</span></p>
//                           </div>
//                       </div>
//                       <hr />
//                   </div>
//                   `);
//     });
//   $("#right_loader").hide();
// }
// $(".rightsrh").each(function () {
//   var s = $(this).text().toLowerCase();
//   $(this).closest(".rightsrh")[s.indexOf(g) !== -1 ? "show" : "hide"]();
// });
// });

function closebtn() {
  $("#map_card").css("transform", "translatey(0%)");
  $(".nav-left").css("transform", "translatex(-110%)");
  $(".nav-right").css({ transform: "translatex(105%)" });
}

function closebtn1() {
  $(".nav-right").css({ transform: "translatex(105%)" });
}

function openright(atm_id, cam_name) {
  atmId = atm_id;
  camName = cam_name;
  $("#map_card").css("transform", "translatey(-80%)");
  var isopen = $(".nav-right").css("transform").split(",")[4] == 0;
  $(".nav-right").css({ transform: "translatex(105%)" });
  if (!isopen) {
    $("#map_loader").show();
  }
  $("#right_loader").show();
  $("#rightsidecont").empty();
  $("#alerts_counter").hide();
  // $("#rightsrch").val("");
  var settings = {
    async: true,
    crossDomain: true,
    url: "/getatmcamalerts?id=" + atm_id + "&cam=" + cam_name,
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
    if (typeof response == "string" || response.status == "token invalid") {
      logout();
    }
    $("#navright_camname").empty();
    $("#navright_camname").append(
      atm_id + " - " + capitalizeFirstLetter(cam_name)
    );
    $("#map_loader").hide();

    if (
      !(response.status == "success") ||
      response.location_cam_alerts?.length == 0
    ) {
      $(".nav-right").css({ transform: "translatex(105%)" });
      Messenger().post({
        message: response.status,
        type: "error",
        showCloseButton: true,
      });
    } else {
      if (isopen) {
        setTimeout(function () {
          $(".nav-right").css({
            transform: "translatex(0%)",
            "z-index": "999",
            transition: "all 0.5s ease-in-out",
          });
        }, 500);
      } else {
        $("#map_loader").hide();
        $(".nav-right").css({
          transform: "translatex(0%)",
          "z-index": "999",
          transition: "all 0.5s ease-in-out",
        });
      }
      $("#right_loader").hide();
      alertsdata = response.location_cam_alerts;
      $("#alerts_counter").show();

      $("#alerts_counter").text(response.location_cam_alerts?.length);
      response.location_cam_alerts?.length > 0 &&
        response.location_cam_alerts?.forEach((obj) => {
          var image = baseIp + "/nginx/" + obj.thumbnail;
          $("#rightsidecont").append(`<div class="item-side rightsrh ${
            obj?.alert_id
          }" style="cursor:default;" data='${JSON.stringify(obj)}'">
                        <div class="row text-white">
                            <div class="col-md-7">
                                <p class="map_time mapalert_time"><span class="clock-icon"><img src="img/clock.png"></span><span class="clocktime" title="Alert Time"> ${
                                  formatDate(obj?.date?.slice("0", "-8")) +
                                  timeformatam(
                                    obj.date?.slice("-8", "-6"),
                                    obj.date?.slice("-6", "-3")
                                  )
                                }</span></p>
                            </div>
                            <div class="col-md-3">
                               <p onclick="showAlertDetails(this)" class="live_camera alertview" title="Open Alert Details">Play</p>
                            </div>
                            <div class="col-md-2">
                                <p class="mapcam_status" title="Alert Priority">${
                                  obj.priority
                                }</p>
                            </div>
                        </div>
                        <div class="row mtn13">
                            <div class="col-md-2">
                                <img loading="lazy" title="Alert Image" alt="${image}" src='${image}' class="mapthumbail_image" onerror='nothumbnail(this)'>
                            </div>
                            <div class="col-md-10 text-white alertdatarow">
                                <p class="mb-0 font-weight-500" title="Alert Name">${
                                  obj.alert_1
                                }</p>
                                <p class="map_time mapalert_time" title="Alert Id"> ${
                                  obj.alert_id
                                }</p>
                            </div>
                        </div>
                        
                    <hr />
                    </div>`);
        });
    }
  });
}
function openleft(location) {
  var isopen = $(".nav-left").css("transform").split(",")[4] == 0;
  $(".nav-left").css("transform", "translatex(-110%)");
  $(".nav-right").css({ transform: "translatex(105%)" });
  if (!isopen) {
    $("#map_loader").show();
  }
  var settings = {
    async: true,
    crossDomain: true,
    url: "/getatmcammap?id=" + location,
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
    if (typeof response == "string" || response.status == "token invalid") {
      logout();
    }
    if (response.Failure) {
      Messenger().post({
        message: response.Failure,
        showCloseButton: true,
        type: "error",
      });
      $("#map_loader").hide();
      return;
    }

    $("#sidecontent").empty();
    $("#navleft_atmid").empty();
    $("#navleft_atmid").append(location);
    $("#map_loader").hide();
    if (
      !(response.status == "success") ||
      response.atm_cam_details?.length == 0
    ) {
      $("#map_card").css("transform", "translatey(0)");
      Messenger().post({
        message: "No Camera Found!!",
        type: "error",
        showCloseButton: true,
      });
    } else {
      $("#map_card").css("transform", "translatey(-80%)");

      // console.log($(".nav-left").css("transform").split(",")[4] == 0);
      if (isopen) {
        setTimeout(function () {
          $(".nav-left").css({
            transform: "translatex(0%)",
            transition: "all 0.5s ease-in-out 0s;",
          });
        }, 500);
      } else {
        $(".nav-left").css({
          transform: "translatex(0%)",
          transition: "all 0.5s ease-in-out 0s;",
        });
      }
      camdata = response;
      // if (response.atm_cam_details) {
      //   $("#camera_counter").text(response.atm_cam_details.length);
      // } else {
      //   $("#camera_counter").text("0");
      // }

      var outputHtml = "";

      response.atm_cam_details?.length > 0 &&
        response.atm_cam_details?.forEach((obj) => {
          // obj.location.length > 0 &&
          //   obj.location.forEach((obj1) => {
          //     obj1.camera.length > 0 &&
          //       obj1.camera.forEach((obj2) => {
          var status;
          var livebtn;
          var alertsbtn;
          if (obj?.cam_status == "live") {
            status = "Online";
            livebtn = `<a href="/cctv_monitoring" title="Open Live" onclick="live_camera(this)" atm_id='${obj?.location}' cam_name='${obj?.cam_name}' class="live_camera">LIVE</a>`;
          } else {
            status = "Offline";
            livebtn = "";
          }
          if (obj?.alert_count > 0) {
            alertsbtn = `<p title="Open Alerts" onclick="openright('${obj?.location}','${obj?.cam_name}')" class="live_camera alertsbtn">Alerts</p>`;
          } else {
            alertsbtn = "";
          }

          var image = "http://" + baseIp + "/nginx/" + obj?.atm_cam_thumb;
          outputHtml += `
          <div class="cam_row">
            <div class="row text-white mb-15">
              <div class="col-md-5 p0">
                 <p class="map_time"><span class="clock-icon"><img src="img/clock.png"></span><span title="Camera Add Time" class="clocktime"> ${
                   formatDate(obj.cam_add_time?.slice("0", "-8")) +
                   timeformatam(
                     obj.cam_add_time?.slice("-8", "-6"),
                     obj.cam_add_time?.slice("-6", "-3")
                   )
                 }</span>
                  </p>
                </div>
                <div class="col-md-2 p0">${livebtn}</div>
                <div class="col-md-3">
            
                  </div>
                  <div class="col-md-2 p0">
                    <p class="mapcam_status" title="Camera Status"><i class="fa fa-circle ${status?.trim()}"></i> ${status}</p>
                  </div>
                </div>
                
              <div class="row mtn13">
                  <div class="col-md-2">
                      <img alt'${image}' title='Camera Thumbnail' src='${image}' class="mapthumbail_image" onerror='nothumbnail(this)'>
                    </div>
                    <div id="sidedt" class="col-md-7 text-white">
                      <p class="font-weight-500 mb-0" title="Camera Name">${capitalizeFirstLetter(
                        obj.cam_name
                      )}</p>
                      <ul>
                        <li><span class="mapcam_location" title="Camera Location">${capitalizeFirstLetter(
                          obj.location
                        )}, ${capitalizeFirstLetter(obj.city)}</span></li>
                        </ul>
                      </div>
                      <div style="display: flex;justify-content: end;align-items:end;" class="col-md-3">
                      <p style="font-size:11px;opacity:0.5;" title="Alerts Count">${
                        obj.alert_count
                      } Alerts</p>
                    </div>
                    </div>
                  </div>
                  <hr class="mt-10"/>
                  </div>
     `;
        });

      //     });
      // });

      document.getElementById("sidecontent").innerHTML = outputHtml;
    }
  });
}

function createQRTmap(rowData) {
  $("#qrt_map").remove();
  $("#qrt_map_container").append(
    ` <div id="qrt_map" style="height: 100%;min-height:256px;overflow: hidden; outline: none;"></div>`
  );
  setTimeout(() => {
    if (
      rowData?.qrt_details?.lat_1 !== " " &&
      rowData?.qrt_details?.long_1 !== " "
    ) {
      var latlongarr = [];

      qrtMap = L.map("qrt_map", {
        attributionControl: false,
        zoomControl: false,
      }).setView(
        L.latLng([
          Number(rowData?.qrt_details?.lat_1),
          Number(rowData?.qrt_details?.long_1),
        ]),
        12
      );

      if (localStorage.getItem("Theme") == "Light") {
        L.tileLayer(
          "https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png",
          {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: "abcd",
            minZoom: 10,
          }
        ).addTo(qrtMap);
      } else {
        L.tileLayer(
          "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
          {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: "abcd",
            minZoom: 10,
          }
        ).addTo(qrtMap);
      }
      var southWest = L.latLng(-89.98155760646617, -180),
        northEast = L.latLng(89.99346179538875, 180);
      var bounds = L.latLngBounds(southWest, northEast);

      qrtMap.setMaxBounds(bounds);
      qrtMap.on("drag", function () {
        qrtMap.panInsideBounds(bounds, { animate: false });
      });
      var blueIcon = L.icon({
        iconUrl: "img/opin.png",
        iconSize: [30, 40],
        iconAnchor: [15, 40],
        popupAnchor: [-3, -76],
        className: "image_invert_blue",
      });

      var grayIcon = L.icon({
        iconUrl: "img/opin.png",
        iconSize: [30, 40],
        iconAnchor: [15, 40],
        popupAnchor: [-3, -76],
        className: "image_invert_gray",
      });

      var orangeIcon = L.icon({
        iconUrl: "img/opin.png",
        iconSize: [30, 40],
        iconAnchor: [15, 40],
        popupAnchor: [-3, -76],
        className: "image_invert_no",
      });

      L.marker(
        [
          Number(rowData?.qrt_details?.lat_1),
          Number(rowData?.qrt_details?.long_1),
        ],
        {
          icon: blueIcon,
        }
      ).addTo(qrtMap);
      latlongarr.push([
        Number(rowData?.qrt_details?.lat_1),
        Number(rowData?.qrt_details?.long_1),
      ]);

      if (
        rowData?.qrt_details?.lat_2 !== " " &&
        rowData?.qrt_details?.long_2 !== " "
      ) {
        L.marker(
          [
            Number(rowData?.qrt_details?.lat_2),
            Number(rowData?.qrt_details?.long_2),
          ],
          {
            icon: grayIcon,
          }
        ).addTo(qrtMap);
        latlongarr.push([
          Number(rowData?.qrt_details?.lat_2),
          Number(rowData?.qrt_details?.long_2),
        ]);
        if (
          rowData?.qrt_details?.lat_3 !== " " &&
          rowData?.qrt_details?.long_3 !== " "
        ) {
          L.marker(
            [
              Number(rowData?.qrt_details?.lat_3),
              Number(rowData?.qrt_details?.long_3),
            ],
            {
              icon: orangeIcon,
            }
          ).addTo(qrtMap);
          latlongarr.push([
            Number(rowData?.qrt_details?.lat_3),
            Number(rowData?.qrt_details?.long_3),
          ]);
        }
      }
      if (latlongarr.length > 1) {
        var polyline = L.polyline(latlongarr, {
          color: "white",
          className: "qrt_mappath",
        }).addTo(qrtMap);

        $($(".qrt_mappath").parents("svg"))
          .css("height", "auto")
          .css("width", "auto");
        qrtMap.fitBounds(polyline.getBounds());
      }
    }
  }, 500);
}

function showAlertDetails(e) {
  e = $(e).parents("div.rightsrh")[0];
  const rowData = JSON.parse($(e).attr("data"));
  $(".step_li")
    .removeClass("step--complete")
    .removeClass("step--active")
    .removeClass("lastcompletedstep")
    .addClass("step--inactive")
    .addClass("step--incomplete");
  $(".step_li .step__icon").removeAttr("data-original-title");
  $("#qrt_name_span").hide();
  $("#qrt_status_span").hide();
  $(".qrt_message").hide();
  $("#qrt_accepted_span").hide();
  $("#qrt_reached_span").hide();
  $("#qrt_resolved_span").hide();
  $(".support_messagediv").hide();
  $("#qrt_details").hide();
  $(".qrt_image").hide();
  $(".qrt_video").hide();
  $(".qrt_video").attr("src", "");

  var alert_name =
    rowData.alert_2 !== ""
      ? rowData.alert_1 + " | " + rowData.alert_2
      : rowData.alert_1;
  var alert_id = rowData.alert_id;
  var alert_date = formatDate(rowData.date.slice("0", "-8"));
  var alert_time = timeformatam(
    rowData.date.slice("-8", "-6"),
    rowData.date.slice("-6", "-3")
  );
  var status =
    rowData.helpdesk_resolved_status == "closed"
      ? "Resolved"
      : rowData.qrt_frontend_status;
  var atm_id = rowData.atm_id;
  var camName = rowData.cam_name;
  var city = rowData.city;
  var location = rowData.location;
  var support_message = rowData.comment;
  var video_url = rowData.video;
  // var video_url = rowData.video.replace(".mp4", "") + "_p.mp4";
  video_url = baseIp + "/nginx/" + video_url;
  var thumbnail = "http://" + baseIp + "/nginx/" + rowData.thumbnail;
  var qrt_image = baseIp + "/nginx/" + rowData.qrt_details?.qrt_image;
  var qrt_name = rowData.qrt_name;
  var qrt_status = rowData.qrt_frontend_status;
  var qrt_message = rowData.qrt_details?.qrt_msg;
  var qrt_accepted = rowData.qrt_details?.accepted_time;
  var qrt_resolved = rowData.qrt_details?.resolved_time;
  var qrt_reached = rowData.qrt_details?.reached_time;

  if (rowData.helpdesk_resolved_status == "closed") {
    $(".alreadyresolved").show();
    $(".support_messagediv").show();
  } else if (rowData.qrt_flag == "assigned") {
    $("#qrt_details").show();
    createQRTmap(rowData);
    $("#qrt_map_container").removeClass("col-lg-8").addClass("col-lg-12");
    if (rowData.qrt_details?.accepted_time == " ") {
      $(".alreadyresolved").hide();
      $(".support_messagediv").hide();
      $("#qrt_details").hide();
      setTimeout(() => {
        stepanim("1", rowData.qrt_flag_time);
      }, 1000);
    } else if (rowData.qrt_frontend_status == "accepted") {
      $(".alreadyresolved").hide();
      $(".support_messagediv").hide();
      $("#qrt_name_span").show();
      $("#qrt_status_span").show();
      $(".qrt_message").hide();
      $("#qrt_accepted_span").show();
      $("#qrt_reached_span").hide();
      $("#qrt_resolved_span").hide();
      setTimeout(() => {
        stepanim(
          "2",
          rowData.qrt_flag_time,
          rowData.qrt_details?.accepted_time
        );
      }, 1000);
    } else if (rowData.qrt_frontend_status == "reached") {
      $(".alreadyresolved").hide();
      $("#qrt_name_span").show();
      $("#qrt_status_span").show();
      $(".qrt_message").hide();
      $("#qrt_accepted_span").show();
      $("#qrt_reached_span").show();
      $("#qrt_resolved_span").hide();
      setTimeout(() => {
        stepanim(
          "3",
          rowData.qrt_flag_time,
          rowData.qrt_details?.accepted_time,
          rowData.qrt_details?.reached_time
        );
      }, 1000);
    } else if (rowData.qrt_frontend_status == "resolved") {
      $(".alreadyresolved").show();
      $("#qrt_name_span").show();
      $("#qrt_status_span").show();
      $(".qrt_message").show();
      $("#qrt_accepted_span").show();
      $("#qrt_reached_span").show();
      $("#qrt_resolved_span").show();
      $("#qrt_map_container").removeClass("col-lg-12").addClass("col-lg-8");
      $($(".qrt_video").parent()).show();
      if (!qrt_image.includes("mp4")) {
        $(".qrt_image").attr("src", qrt_image);
        $(".qrt_image").attr("onerror", "qrtimageerror(this)");
        $(".qrt_image").show();
        $(".qrt_video").hide();
      } else {
        $(".qrt_image").hide();
        $(".qrt_video").attr("src", qrt_image);
        $(".qrt_video").show();
      }
      setTimeout(() => {
        stepanim(
          "4",
          rowData.qrt_flag_time,
          rowData.qrt_details?.accepted_time,
          rowData.qrt_details?.reached_time,
          rowData.qrt_details?.resolved_time
        );
      }, 1000);
    }
  }

  $("#alert_name").empty();
  $("#alert_id").empty();
  $("#alert_date").empty();
  $("#alert_time").empty();
  $("#alert_status").empty();
  $("#alert_atmid").empty();
  $("#alert_camname").empty();
  $("#alert_city").empty();
  $("#alert_area").empty();
  $("#support_message").empty();
  $(".qrt_name").empty();
  $(".qrt_status").empty();
  $(".qrt_message").empty();
  $(".qrt_accepted").empty();
  $(".qrt_reached").empty();
  $(".qrt_resolved").empty();

  $("#alert_name").append(alert_name);
  $("#alert_id").append("#" + alert_id);
  $("#alert_date").append(alert_date);
  $("#alert_time").append(alert_time);
  $("#alert_status").append(capitalizeFirstLetter(status));
  $("#alert_atmid").append("#" + atm_id);
  $("#alert_camname").append(capitalizeFirstLetter(camName));
  $("#alert_city").append(capitalizeFirstLetter(city));
  $("#alert_area").append(capitalizeFirstLetter(location));
  $("#support_message").append(support_message);
  $(".qrt_name").append(capitalizeFirstLetter(qrt_name));
  $(".qrt_status").append(capitalizeFirstLetter(qrt_status));
  $(".qrt_message").append(qrt_message);
  $(".qrt_accepted").append(
    formatQRTDate(qrt_accepted?.slice("0", "-8")) +
      " " +
      timeformatam(
        qrt_accepted?.slice("-8", "-6"),
        qrt_accepted?.slice("-6", "-3")
      )
  );
  $(".qrt_reached").append(
    formatQRTDate(qrt_reached?.slice("0", "-8")) +
      " " +
      timeformatam(
        qrt_reached?.slice("-8", "-6"),
        qrt_reached?.slice("-6", "-3")
      )
  );
  $(".qrt_resolved").append(
    formatQRTDate(qrt_resolved?.slice("0", "-8")) +
      " " +
      timeformatam(
        qrt_resolved?.slice("-8", "-6"),
        qrt_resolved?.slice("-6", "-3")
      )
  );
  changeSource(video_url, thumbnail);
  $("#showAlertDetailsModal").modal("show");
  setTimeout(() => {
    $("#qrt_map").css("height", $(".qrt_image").height() + "px");
  }, 150);
}

$(document).ready(function () {
  $(".leftsrh").click(function () {
    $(".leftsrh").removeClass("active");
    $(this).addClass("active");
  });
});

$("#search-autocomplete").on("input", function () {
  if ($("#search-autocomplete").val() == "") {
    setTimeout(() => {
      $("#searchiconformap").show();
    }, 500);
  } else {
    $("#searchiconformap").hide();
  }
});

function createMap() {
  try {
    map = L.map("map", {
      attributionControl: false,
      zoomControl: false,
    }).setView(L.latLng([20.988013449999997, 82.75252935]), 5);
  } catch (e) {
    console.log(e);
  }

  new Autocomplete("search-autocomplete", {
    selectFirst: true,
    insertToInput: true,
    cache: true,
    howManyCharacters: 2,
    // onSearch
    onSearch: ({ currentValue }) => {
      const api = `https://nominatim.openstreetmap.org/search?format=geocodejson&limit=5&countrycodes=in&q=${encodeURI(
        currentValue
      )}`;

      // You can also use static files
      // const api = './search.json'

      /**
       * jquery
       * If you want to use jquery you have to add the
       * jquery library to head html
       * https://cdnjs.com/libraries/jquery
       */
      // return $.ajax({
      //   url: api,
      //   method: 'GET',
      // })
      //   .done(function (data) {
      //     return data
      //   })
      //   .fail(function (xhr) {
      //     console.error(xhr);
      //   });

      // OR ----------------------------------

      /**
       * axios
       * If you want to use axios you have to add the
       * axios library to head html
       * https://cdnjs.com/libraries/axios
       */
      // return axios.get(api)
      //   .then((response) => {
      //     return response.data;
      //   })
      //   .catch(error => {
      //     console.log(error);
      //   });

      // OR ----------------------------------

      /**
       * Promise
       */
      return new Promise((resolve) => {
        fetch(api)
          .then((response) => response.json())
          .then((data) => {
            addressPoints.filter((addressPoint) => {
              if (
                addressPoint.location
                  ?.toLowerCase()
                  .includes(currentValue?.toLowerCase())
              ) {
                data.features.push({
                  location: addressPoint.location,
                  geometry: {
                    coordinates: [
                      addressPoint.longitude,
                      addressPoint.latitude,
                    ],
                    type: "ATM",
                  },
                  properties: {
                    geocoding: {
                      label: `${addressPoint.location} - ${addressPoint.city}`,
                    },
                  },
                });
              }
            });

            // data.features.append({
            //   geometry: {
            //     coordinates: [73.8544541, 18.521428],
            //     type: "Point",
            //   },
            //   properties: {
            //     display_name:
            //       "Pune, Pune City, Pune District, Maharashtra, 411001, India",
            //   },
            // });
            resolve(data.features.splice(0, 10));
          })
          .catch((error) => {
            console.error(error);
          });
      });
    },

    // nominatim GeoJSON format
    onResults: ({ currentValue, matches, template }) => {
      const regex = new RegExp(currentValue, "gi");

      // if the result returns 0 we
      // show the no results element
      return matches === 0
        ? template
        : matches
            .map((element) => {
              return `
          <li class="loupe">
            <p>
              ${element.properties.geocoding.label.replace(
                regex,
                (str) => `<b>${str}</b>`
              )}
            </p>
          </li> `;
            })
            .join("");
    },

    onSubmit: ({ object }) => {
      const { type } = object.properties.geocoding;
      const [lat, lng] = object.geometry.coordinates;
      // custom id for marker
      const customId = Math.random();

      // const marker = L.marker([lng, lat], {
      //   title: display_name,
      //   id: customId,
      // });

      // marker.addTo(map).bindPopup(display_name);
      if (object.geometry.type == "ATM") {
        map.setView([lng, lat], 20);
        openleft(object.location);
      } else if (type == "state") {
        map.setView([lng, lat], 7);
      } else if (type == "city" || type == "county" || type == "district") {
        map.setView([lng, lat], 12);
      } else if (type == "country") {
        map.setView([lng, lat], 5);
      } else {
        map.setView([lng, lat], 16);
      }

      map.eachLayer(function (layer) {
        if (layer.options && layer.options.pane === "markerPane") {
          if (layer.options.id !== customId) {
            map.removeLayer(layer);
          }
        }
      });
    },

    // get index and data from li element after
    // hovering over li with the mouse or using
    // arrow keys ↓ | ↑
    onSelectedItem: ({ index, element, object }) => {
      // console.log("onSelectedItem:", { index, element, object });
    },

    // the method presents no results
    // no results
    noResults: ({ currentValue, template }) =>
      template(`<li>No results found: "${currentValue}"</li>`),
  });

  // L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
  //     detectRetina: true,
  //     maxNativeZoom: 19
  // }).addTo(map);

  if (localStorage.getItem("Theme") == "Light") {
    // L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png", {
    L.tileLayer(
      "https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png",
      {
        // L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        minZoom: 3,
        // maxZoom: 6,
      }
    ).addTo(map);
  } else {
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png", {
      // L.tileLayer(
      //   "https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png",
      //   {
      // L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      minZoom: 5,
    }).addTo(map);
    // L.tileLayer(
    //   "http://" + base_domainip + "/nginx/drdo_map/{z}/{y}/{x}.jpeg",
    //   {
    //     // L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {

    //     // L.tileLayer(
    //     //   "https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png",
    //     //   {
    //     // L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png', {
    //     attribution:
    //       '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    //     subdomains: "abcd",
    //     minZoom: 15,
    //   }
    // ).addTo(map);
  }

  leafletView = new PruneClusterForLeaflet(120, 20, 2);

  var size = 100;
  markers = [];
  onlineATMS = [];
  ATMwithAlerts = [];

  var helicopterIcon = L.icon({
    iconUrl:
      "http://sintef-9012.github.io/PruneCluster/examples/helicopter.png",
    iconSize: [48, 48],
  });
  var airplaneIcon = L.icon({
    iconUrl: "http://sintef-9012.github.io/PruneCluster/examples/airplane.png",
    iconSize: [48, 48],
  });
  var southWest = L.latLng(17.656835, 78.362317),
    northEast = L.latLng(17.696603, 78.431412);
  var bounds = L.latLngBounds(southWest, northEast);

  map.setMaxBounds(bounds);
  map.on("drag", function () {
    map.panInsideBounds(bounds, { animate: false });
  });
  var settings = {
    async: true,
    crossDomain: true,
    url: "/getatmlatlongmap",
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
    if (typeof response == "string" || response.status == "token invalid") {
      logout();
    }
    if (response.Failure) {
      Messenger().post({
        message: response.Failure,
        type: "error",
        showCloseButton: true,
      });
    } else if (!(response.status == "success")) {
      Messenger().post({
        message: "Some Error Occured!",
        type: "error",
        showCloseButton: true,
      });
    } else {
      $("#mapatm_card_count").empty();
      $("#mapcamera_card_count").empty();
      $("#mapalert_card_count").empty();
      $("#mapatm_card_count").append(response.location_lat_long?.length);
      $("#mapcamera_card_count").append(response?.total_live_cams);
      $("#mapalert_card_count").append(response?.total_alert_count);
      $(".count-numbers").each(function () {
        $(this)
          .prop("Counter", 0)
          .animate(
            {
              Counter: $(this).text(),
            },
            {
              duration: 3000,
              easing: "swing",
              step: function (now) {
                $(this).text(Math.ceil(now));
              },
            }
          );
      });
      $("#map_loader").hide();
      addressPoints = response.location_lat_long;
      for (var i = 0; i < addressPoints?.length; ++i) {
        // var marker = new PruneCluster.Marker( 59.91111 + (Math.random() - 0.5) * 0.1 * size, 10.752778 + (Math.random() - 0.5) * 0.2 * size,
        // var class_text = "count_" + addressPoints[i].area.replace(" ", "_");
        var atm_id = addressPoints[i]?.location.replaceAll(" ", "__");
        var count;
        if (addressPoints[i]?.alert_count > 999) {
          count = "999+";
        } else {
          count = addressPoints[i]?.alert_count;
        }
        // if (addressPoints[i][3] > 200) {
        // var marker = new PruneCluster.Marker(
        //   addressPoints[i].latitude,
        //   addressPoints[i].longitude,
        //   {
        // popup: "Location Counter "  + i,
        // popup:'<div style="padding:10px">Willowbrook  Place 123  Street Address City, ST, 12345 (555) 555-5555 Website Coming in Spring 2015 </div>' + i,
        //     icon: new L.DivIcon({
        //       iconSize: [30, 30],
        //       iconAnchor: [15, 30],
        //       popupAnchor: [0, -25],
        //       className: atm_id,
        //       html:
        //         '<img class="my-div-image" src="opin.png"/ style="width:56px;"><span class="my-div-span" style="color:#090909;font-size:14px;position: absolute;top: 28px;left: 5px;font-weight: 700;margin:auto;right:0;bottom:0;text-align: center;">' +
        //         count +
        //         "</span>",
        //     }),
        //   }
        // );
        // } else {
        // var pulsateMargin;
        // if (window.InstallTrigger) {
        //   pulsateMargin = "margin: 23px 0 0 -39px";
        // } else {
        //   pulsateMargin = "margin: -20px 0 0 -3px";
        // }

        var marker = new PruneCluster.Marker(
          addressPoints[i]?.latitude,
          addressPoints[i]?.longitude,
          {
            // popup: "Location Counter "  + i,
            // popup:'<div style="padding:10px">Willowbrook  Place 123  Street Address City, ST, 12345 (555) 555-5555 Website Coming in Spring 2015 </div>' + i,
            icon: new L.DivIcon({
              iconSize: [30, 30],
              iconAnchor: [15, 30],
              popupAnchor: [0, -25],
              className: atm_id,
              area: addressPoints[i]?.location + ", " + addressPoints[i]?.city,
              html: `<img class="my-div-image w-36 atmstatus_online" src="img/opin.png">
                    <span class="my-div-span mapatm_count">${count}</span>
                    <span class='pulsate' style='margin: -20px 0 0 -3px'></span>`,
            }),
          }
        );

        // var LeafIcon = L.Icon.extend({
        //   iconSize: [30, 30],
        //   iconAnchor: [15, 30],
        //   popupAnchor: [0, -25],
        //   className: atm_id,
        //   area: addressPoints[i].location + ", " + addressPoints[i].city,
        // });

        // var greenIcon = new LeafIcon({
        //   iconUrl:
        //     addressPoints[i].Vendor == "TSI"
        //       ? "img/redmarker.png"
        //       : "img/greenmarker.png",
        // });

        // if (addressPoints[i].Vendor == "Aurionpro") {
        //   var marker = L.marker(
        //     [
        //       Number(addressPoints[i].latitude),
        //       Number(addressPoints[i].longitude),
        //     ],
        //     { icon: greenIcon }
        //   ).addTo(map);
        // }
        if (addressPoints[i]?.atm_status == "online") {
          onlineATMS.push(marker);
        }
        if (addressPoints[i]?.alert_count > 0) {
          ATMwithAlerts.push(marker);
        }
        markers.push(marker);
        leafletView.RegisterMarker(marker);
      }
      map.addLayer(leafletView);
      // map.on("click", function (e) {
      //   alert("Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng);
      // });
    }
  });

  // var addressPoints = [
  //   {
  //     name: "Mumbai",
  //     state: "Maharashtra",
  //     area: "borwali",
  //     lat: "18.975",
  //     lon: "72.825833",
  //   },
  //   {
  //     name: "Delhi",
  //     state: "Delhi",
  //     area: "sector17",
  //     lat: "28.666667",
  //     lon: "77.216667",
  //   },
  //   {
  //     name: "Bangalore",
  //     state: "Karnataka",
  //     area: "adesh nagar",
  //     lat: "12.983333",
  //     lon: "77.583333",
  //   },
  //   {
  //     name: "Hyderabad",
  //     state: "Telangana",
  //     area: "MG road",
  //     lat: "17.375278",
  //     lon: "78.474444",
  //   },
  // ];
}

// Create XMLHttpRequest object.
// var oXHR = new XMLHttpRequest();
//
// // Initiate request.
// oXHR.onreadystatechange = reportStatus;
// oXHR.open("GET", "http://3.139.234.98/event-app/get_live_cams/saurabh/saurabh", true);  // get json file.
// oXHR.send();
//
// function reportStatus() {
//     if (oXHR.readyState == 4) {		// Check if request is complete.
//         // Write data to a DIV element.
//         document.getElementById('sidedt').innerHTML = this.responseText;
//     }
// }

// var xmlhttp = new XMLHttpRequest();
// var url = "http://3.139.234.98/event-app/get_live_cams/saurabh/saurabh";
//
// xmlhttp.onreadystatechange = function() {
//     if (this.readyState == 4 && this.status == 200) {
//         var myArr = JSON.parse(this.responseText);
//         myFunction(myArr);
//     }
// };
// xmlhttp.open("GET", url, true);
// xmlhttp.send();
//
// function myFunction(arr) {
//     var out = "";
//     var i;
//     for(i = 0; i < arr.length; i++) {
//         out += '<a href="' + arr[i].url + '">' +
//             arr[i].display + '</a><br>';
//     }
//     document.getElementById("sidedt").innerHTML = out;
// }

// var licm = document.getElementById("sidedt")
//
// function gtdata(){
// fetch("http://3.139.234.98/event-app/get_live_cams/saurabh/saurabh")
//     .then(res => res.json())
//     .then(data => console.log(data))
//     // .then(data => {licm.innerHTML= `<div>City : ${data.live_cams}</div>`})
//     .then(function (data) {
//         appendData(data);
//     })
// }

// fetch('http://3.139.234.98/event-app/get_live_cams/saurabh/saurabh')
//     .then(function (response) {
//         return response.json();
//     })
//     .then(function (data) {
//         appendData(data);
//     })
//     .catch(function (err) {
//         console.log(err);
//     });
//
// function appendData(data) {
//     var mainContainer = document.getElementById("sidedt");
//     for (var i = 0; i < data.length; i++) {
//         var div = document.createElement("div");
//         div.innerHTML = 'live_cams: ' + data[i].city + ' ' + data[i].location;
//         mainContainer.appendChild(div);
//     }
// }

// api url
// const api_url =
//     "http://3.139.234.98/event-app/get_live_cams/saurabh/saurabh";
//
// // Defining async function
// async function getapi(url) {
//
//     // Storing response
//     const response = await fetch(url);
//
//     // Storing data in form of JSON
//     var data = await response.json();
//     console.log(data);
//     // if (response) {
//     //     hideloader();
//     // }
//     show(data);
// }
// // Calling that async function
// getapi(api_url);
//
// // Function to define innerHTML for HTML table
// function show(data) {
//     let tab =
//         `<ul>
// <!--          <li>city</li>-->
// <!--          <li>location</li>-->
//           <code>
//            ${JSON.stringify(data)}
//
//           </code>
//           console.log(data);
//          </ul>`;
//
//     // Loop to access all rows
//     for (let r of data.live_cams) {
//         tab += `<ul>
//         <li>${r.city} </li>
//         <li>${r.location}</li>
//         </ul>`;
//     }
//     // Setting innerHTML as tab variable
//     document.getElementById("sidedt").innerHTML = tab;
// }

// var data_map = JSON.stringify({
//   live_cams: [
//     {
//       city: "Algeciras",
//       location: [
//         {
//           camera: [
//             {
//               account_id: "saurabh",
//               alert_array: ["calculate wait time detection"],
//               alert_detection_arr: [],
//               area: "Port",
//               breach_image: "saurabh/f5c80c67-447c-4c8e-9bb9-6332d081fb73.jpg",
//               calculate_wait_time_flag: 0,
//               cam_add_time: "04/11/21 17:12:38",
//               cam_delete_time: "",
//               cam_input_url: "/app/images/170_24hr_scaled.mp4",
//               cam_name: "a170",
//               cam_output_url:
//                 "http://3.139.234.98/nginx/hls/a170/manifest.m3u8",
//               cam_status: "live",
//               cam_url: "/app/images/170_24hr_scaled.mp4",
//               city: "Algeciras",
//               intrusion_breach_coordinates: {},
//               intrusion_from_time: "",
//               intrusion_to_time: "",
//               liotering_breach_coordinates: {},
//               location: "Port",
//               one_atm_one_person_breach_coordinates: {},
//               region: "Road",
//               state: "Spain",
//               stream_status: "connected",
//               to_phone_no: [],
//               user_contact: "",
//               user_email: ["raven@pivotchain.com"],
//               user_name: "saurabh",
//             },
//             {
//               account_id: "saurabh",
//               alert_array: ["calculate wait time detection"],
//               alert_detection_arr: [],
//               area: "Port",
//               breach_image: "saurabh/3a34f3b6-6a5c-45ca-8ed4-e73fa6efb89f.jpg",
//               calculate_wait_time_flag: 0,
//               cam_add_time: "04/11/21 17:13:12",
//               cam_delete_time: "",
//               cam_input_url: "/app/images/port_24hr_25fps.mp4",
//               cam_name: "portcamera",
//               cam_output_url:
//                 "http://3.139.234.98/nginx/hls/portcamera/manifest.m3u8",
//               cam_status: "live",
//               cam_url: "/app/images/port_24hr_25fps.mp4",
//               city: "Algeciras",
//               intrusion_breach_coordinates: {},
//               intrusion_from_time: "",
//               intrusion_to_time: "",
//               liotering_breach_coordinates: {},
//               location: "Port",
//               one_atm_one_person_breach_coordinates: {},
//               region: "Port_Entry",
//               state: "Spain",
//               stream_status: "connected",
//               to_phone_no: [],
//               user_contact: "",
//               user_email: ["raven@pivotchain.com"],
//               user_name: "saurabh",
//             },
//           ],
//           name: "Port",
//         },
//       ],
//     },
//   ],
// });

// var text = JSON.parse(data);
//
// /* Displaying the JSON data by linking the #test paragraph tag and the JSON object*/
// document.getElementById("sidedt").innerHTML = text.city + "<br>" + text.cam_name;
//
//
// function ftdata(){
//     fetch("http://3.139.234.98/event-app/get_live_cams/saurabh/saurabh")
//         .then(response => {
//             if(!response.ok){
//                 throw Error("Error");
//             }
//             return response.json();
//         })
//
//         .then(data => {
//             console.log(data.data);
//             const html = data.data
//                 .map(user =>{
//                     return `
//                         <div class="dat">
//                             <a>City : ${live_cams.city}</a>
//
//                         </div>
//                     `;
//                     // console.log(city);
//                 })
//                 .join("");
//             document.querySelector("sidedt").insertAsjacentHTML("afterbegin", html);
//
//         })
//         .catch(error => {
//             console.log(error);
//         });
// }
//
// ftdata();
//
// function postData(){
//     fetch("http://3.139.234.98/event-app/get_live_cams/saurabh/saurabh", {
//         method: "POST",
//         headers: {
//             "content-Type" : "applicaiton/json"
//         },
//         body: JSON.stringify({
//             city: "algeciras"
//         })
//     })
//         .then(response => {
//             if(!response.ok){
//                 throw Error("Error");
//             }
//             return response.json();
//         })
//         .then(data => {
//             console.log(data);
//         })
//         .catch(error =>{
//         console.log(error);
//     });
// }
//
// postData();

$(window).on("keydown", (e) => {
  if (e.ctrlKey && e.key == "k") {
    e.preventDefault();
    $("#search-autocomplete").focus();
  }
});

$("#loading-logs").hide();

function addToMapAlerts(MQTTalert) {
  mapalert_card_count = parseInt($("#mapalert_card_count").text()) + 1;
  $("#mapalert_card_count").text(mapalert_card_count);

  count = $("." + MQTTalert.atm_id + " .mapatm_count").text();
  $("." + MQTTalert.atm_id + " .mapatm_count").text(parseInt(count) + 1);

  if (
    atmId == MQTTalert.atm_id &&
    camName == MQTTalert.cam_name &&
    MQTTalert.verified == "true" &&
    $(".nav-right").css("transform").split(",")[4] == 0
  ) {
    var count = $("#alerts_counter").text();
    $("#alerts_counter").empty();
    $("#alerts_counter").append(parseInt(count) + 1);
    var image = baseIp + "/nginx/" + MQTTalert.thumbnail;
    $("#rightsidecont").prepend(`<div class="item-side rightsrh ${
      MQTTalert.alert_id
    }" style="cursor:default;" data='${JSON.stringify(MQTTalert)}'">
                        <div class="row text-white">
                            <div class="col-md-7">
                                <p class="map_time mapalert_time"><span class="clock-icon"><img src="img/clock.png"></span><span class="clocktime" title="Alert Time"> ${
                                  formatDate(MQTTalert.date.slice("0", "-8")) +
                                  timeformatam(
                                    MQTTalert.date.slice("-8", "-6"),
                                    MQTTalert.date.slice("-6", "-3")
                                  )
                                }</span></p>
                            </div>
                            <div class="col-md-3">
                               <p onclick="showAlertDetails(this)" class="live_camera alertview" title="Open Alert Details">Play</p>
                            </div>
                            <div class="col-md-2">
                                <p class="mapcam_status" title="Alert Priority">${
                                  MQTTalert.priority
                                }</p>
                            </div>
                        </div>
                        <div class="row mtn13">
                            <div class="col-md-2">
                                <img title="Alert Image" alt="${image}" src='${image}' class="mapthumbail_image" onerror='nothumbnail(this)'>
                            </div>
                            <div class="col-md-10 text-white alertdatarow">
                                <p class="mb-0 font-weight-500" title="Alert Name">${
                                  MQTTalert.alert_1
                                }</p>
                                <p class="map_time mapalert_time" title="Alert Id"> ${
                                  MQTTalert.alert_id
                                }</p>
                            </div>
                        </div>
                        
                    <hr />
                    </div>`);
  }
}

function updateAlertStatus(data) {
  var row;

  if ($(`.${data.alert_id}`).attr("data")) {
    row = JSON.parse($(`.${data.alert_id}`).attr("data"));
  }

  if (row) {
    if ($("#alert_id").text().replace("#", "") == data.alert_id) {
      row = {
        ...row,
        qrt_frontend_status: data.qrt_frontend_status,
        qrt_details: { ...row.qrt_details, assigned_time: data.time },
      };
      $($(".qrt_video").parent()).hide();
      $("#qrt_map_container").removeClass("col-lg-8").addClass("col-lg-12");
      $(".step_li").removeClass("lastcompletedstep");
      $(".qrt_status").empty();
      $(".qrt_status").append(data.qrt_frontend_status);
      if (data.qrt_frontend_status == "assigned") {
        row = {
          ...row,
          qrt_flag: "assigned",
        };
        $("#qrt_name_span").hide();
        $("#qrt_status_span").hide();
        $(".qrt_message").hide();
        $("#qrt_accepted_span").hide();
        $("#qrt_reached_span").hide();
        $("#qrt_resolved_span").hide();
        stepanim("1", data.time);
        $("#qrt_details").hide();
      } else if (data.qrt_frontend_status == "accepted") {
        row = {
          ...row,
          qrt_frontend_status: data.qrt_frontend_status,
          qrt_details: {
            ...row.qrt_details,
            accepted_time: data.time,
            lat_1: data.lat,
            long_1: data.long,
          },
          qrt_name: data.qrt_name,
        };
        $("#qrt_details").show();
        $(".alreadyresolved").hide();
        $(".support_messagediv").hide();

        $(".qrt_name").empty();
        $(".qrt_accepted").empty();
        $(".qrt_name").append(data.qrt_name);
        $(".qrt_accepted").append(
          formatQRTDate(data.time.slice("0", "-8")) +
            " " +
            timeformatam(
              data.time.slice("-8", "-6"),
              data.time.slice("-6", "-3")
            )
        );
        $("#qrt_name_span").show();
        $("#qrt_status_span").show();
        $(".qrt_message").hide();
        $("#qrt_accepted_span").show();
        $("#qrt_reached_span").hide();
        $("#qrt_resolved_span").hide();
        setTimeout(() => {
          createQRTmap(row);
          stepanim("2", row.qrt_details.assigned_time + data.time);
        }, 500);
      } else if (data.qrt_frontend_status == "reached") {
        row = {
          ...row,
          qrt_frontend_status: data.qrt_frontend_status,
          qrt_details: {
            ...row.qrt_details,
            reached_time: data.time,
            lat_2: data.lat,
            long_2: data.long,
          },
        };

        $(".qrt_reached").empty();
        $(".qrt_reached").append(
          formatQRTDate(data.time.slice("0", "-8")) +
            " " +
            timeformatam(
              data.time.slice("-8", "-6"),
              data.time.slice("-6", "-3")
            )
        );
        $("#qrt_name_span").show();
        $("#qrt_status_span").show();
        $(".qrt_message").hide();
        $("#qrt_accepted_span").show();
        $("#qrt_reached_span").show();
        $("#qrt_resolved_span").hide();
        createQRTmap(row);
        setTimeout(() => {
          stepanim(
            "3",
            row.qrt_details.assigned_time,
            row.qrt_details.accepted_time,
            data.time
          );
        }, 500);
      } else if (data.qrt_frontend_status == "resolved") {
        row = {
          ...row,
          qrt_frontend_status: data.qrt_frontend_status,
          qrt_details: {
            ...row.qrt_details,
            resolved_time: data.time,
            lat_3: data.lat,
            long_3: data.long,
            qrt_image: data.qrt_image,
            qrt_msg: data.qrt_msg,
          },
        };

        $(".qrt_message").empty();
        $(".qrt_resolved").empty();
        $(".qrt_resolved").append(
          formatQRTDate(data.time.slice("0", "-8")) +
            " " +
            timeformatam(
              data.time.slice("-8", "-6"),
              data.time.slice("-6", "-3")
            )
        );
        $(".qrt_message").append(data.qrt_msg);
        $("#qrt_name_span").show();
        $("#qrt_status_span").show();
        $(".qrt_message").show();
        $("#qrt_accepted_span").show();
        $("#qrt_reached_span").show();
        $("#qrt_resolved_span").show();
        createQRTmap(row);
        setTimeout(() => {
          stepanim(
            "4",
            row.qrt_details.assigned_time,
            row.qrt_details.accepted_time,
            row.qrt_details.reached_time,
            data.time
          );
        }, 500);

        $($(".qrt_video").parent()).show();
        $("#qrt_map_container").removeClass("col-lg-12").addClass("col-lg-8");
        if (data.qrt_image.includes("mp4")) {
          $(".qrt_image").hide();
          $(".qrt_video").attr("src", baseIp + "/nginx/" + data.qrt_image);
          $(".qrt_image").attr("onerror", "qrtimageerror(this)");
          $(".qrt_video").show();
        } else {
          $(".qrt_video").hide();
          $(".qrt_image").show();
          $(".qrt_image").attr("src", baseIp + "/nginx/" + data.qrt_image);
        }
        setTimeout(() => {
          qrtMap?.invalidateSize();
        }, 1000);
      } else if (data.qrt_frontend_status == "pending") {
        row = {
          ...row,
          qrt_flag: "unassigned",
        };
        $(`#` + data.alert_id).attr("qrt", "unassigned");
      }
    } else {
      row = {
        ...row,
        qrt_frontend_status: data.qrt_frontend_status,
        qrt_details: { ...row.qrt_details, assigned_time: data.time },
      };
      if (data.qrt_frontend_status == "assigned") {
        row = {
          ...row,
          qrt_flag: "assigned",
        };
      } else if (data.qrt_frontend_status == "accepted") {
        row = {
          ...row,
          qrt_frontend_status: data.qrt_frontend_status,
          qrt_details: {
            ...row.qrt_details,
            accepted_time: data.time,
            lat_1: data.lat,
            long_1: data.long,
          },
          qrt_name: data.qrt_name,
        };
      } else if (data.qrt_frontend_status == "reached") {
        row = {
          ...row,
          qrt_frontend_status: data.qrt_frontend_status,
          qrt_details: {
            ...row.qrt_details,
            reached_time: data.time,
            lat_2: data.lat,
            long_2: data.long,
          },
        };
      } else if (data.qrt_frontend_status == "resolved") {
        row = {
          ...row,
          qrt_frontend_status: data.qrt_frontend_status,
          qrt_details: {
            ...row.qrt_details,
            resolved_time: data.time,
            lat_3: data.lat,
            long_3: data.long,
            qrt_image: data.qrt_image,
            qrt_msg: data.qrt_msg,
          },
        };
      }
    }
    $(`.${data.alert_id}`).attr("data", JSON.stringify(row));
  }
}

function deleteMQTTalert(data) {
  if (data.alert_id) {
    var count = $("#alerts_counter").text();
    $("#alerts_counter").empty();
    $("#alerts_counter").append(parseInt(count) - 1);
    $(`.${data.alert_id}`).remove();
    if ($("#alert_id").text().replace("#", "") == data.alert_id) {
      close_modal();
    }
  }
}

function handleCameraCardClick(e) {
  $("#alertcounter")
    .css("border-color", "var(--main-bg-color)")
    .removeClass("filtered");
  leafletView.RemoveMarkers(markers);
  if (!$(e).hasClass("filtered")) {
    onlineATMS.forEach((atm) => {
      leafletView.RegisterMarker(atm);
    });

    $(e).css("border-color", "var(--link-hover-color)");
    $(e).addClass("filtered");
    leafletView.ProcessView();
  } else {
    markers.forEach((marker) => {
      leafletView.RegisterMarker(marker);
    });
    $(e).css("border-color", "var(--main-bg-color)");
    $(e).removeClass("filtered");
    leafletView.ProcessView();
  }
}

function handleAlertCardClick(e) {
  $("#cameracounter")
    .css("border-color", "var(--main-bg-color)")
    .removeClass("filtered");
  leafletView.RemoveMarkers(markers);
  if (!$(e).hasClass("filtered")) {
    ATMwithAlerts.forEach((atm) => {
      leafletView.RegisterMarker(atm);
    });
    $(e).css("border-color", "var(--link-hover-color)");
    $(e).addClass("filtered");
  } else {
    markers.forEach((marker) => {
      leafletView.RegisterMarker(marker);
    });
    $(e).css("border-color", "var(--main-bg-color)");
    $(e).removeClass("filtered");
  }
  leafletView.ProcessView();
}
