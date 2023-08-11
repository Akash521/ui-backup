var table;
var base_url;
var alert_data;
var active_status;
var priorityvalueAlerts = "P1";
var type = "realtime";
var dateNow;
var d = new Date();
var month = d.getMonth() + 1;
var day = d.getDate();
var storealertdata;
var ajxreq;
var map;
var alertnames;

$.get("/status", function (res) {
  if (res == "administrator") {
    // $("#resolvedalerts").css("margin-left", "220px");
    // $("#pendingalerts").css("margin-left", "220px");
    // $(".menusidebar").show();
    $(".menusidebar").empty();
    $(".menusidebar").append(`<div style="width:100%;" class="b9" >
                <a href="/cctv_pendingaction" style="border:none !important;height:auto !important;display:flex;justify-content:center;align-items:center;padding:0 !important;font-size:14px;" class="navbar-brand link-menu cctv_pendingaction">
                    <p class="menu-1 "  style="text-align: center;display:flex;justify-content:center;align-items:center;">
                        <i class="fa fa-exclamation-circle" aria-hidden="true"></i><br><br>
                        <span class="link_p text" style="font-size:14px;margin-left: 10px;">Pending Action</span>
                    </p>

                </a>
            </div>
            <div style="width:100%;" class="b6" >
                <a href="/cctv_helpdesk" style="border:none !important;height:auto !important;display:flex;justify-content:center;align-items:center;padding:0 !important;font-size:14px;" class="navbar-brand link-menu cctv_helpdesk">
                    <p class="menu-1 " style="text-align: center;display:flex;justify-content:center;align-items:center;">
                        <i class="fa fa-bullhorn"></i><br><br>
                        <span class="link_p text" style="font-size:14px;margin-left: 10px;">Pending Alerts</span></p>

                </a>
            </div>
            <div style="width:100%;" class="b4">
                <a href="/cctv_resolvedalerts" style="border:none !important;height:auto !important;display:flex;justify-content:center;align-items:center;padding: 0 !important;font-size:14px;" class="navbar-brand link-menu cctv_resolvedalerts">
                    <p class="menu-1 " style="text-align: center;display:flex;justify-content:center;align-items:center;">
                        <i class="fa fa-check-square-o"></i><br><br>
                        <span class="link_p text" style="font-size:14px;margin-left: 10px;">Resolved Alerts</span></p>

                </a>
            </div>
             <div style="width:100%;" class="b4">
                <a href="/cctv_alert" style="border:none !important;height:auto !important;display:flex;justify-content:center;align-items:center;padding: 0 !important;font-size: 14px" class="navbar-brand link-menu cctv_alert">
                    <p class="menu-1 " style="text-align: center;display:flex;justify-content:center;align-items:center;">
                       <i class="fa fa-pencil" aria-hidden="true"></i></i><br><br>
                        <span class="link_p text" style="margin-left: 10px;font-size: 14px;">Update Alert</span></p>

                </a>
            </div>
             <div style="width:100%;" class="b4">
                <a href="/cctv_transferalerts" style="border:none !important;height:auto !important;display:flex;justify-content:center;align-items:center;padding: 0 !important;font-size: 14px" class="navbar-brand link-menu cctv_transferalerts">
                    <p class="menu-1 " style="text-align: center;display:flex;justify-content:center;align-items:center;">
                       <i class='fa fa-exchange' aria-hidden='true'></i><br><br>
                        <span class="link_p text" style="margin-left: 10px;font-size: 14px;">Transfer Alerts</span></p>

                </a>
            </div>
            <div style="width:100%;" class="b3">
                <a href="/cctv_atms" style="border:none !important;height:auto !important;display:flex;justify-content:center;align-items:center;padding: 0 !important;font-size:14px;" class="navbar-brand link-menu cctv_atms">
                    <p class="menu-1 " style="text-align: center;display:flex;justify-content:center;align-items:center;">
                       <i class="fa fa-credit-card-alt" aria-hidden="true"  style="font-size: 11px;"></i>
                        <span class="link_p text" style="font-size:14px;margin-left: 10px;">ATM's</span></p>

                </a>
            </div>
            <div style="width:100%;" class="b9" >
                <a href="/cctv_tickets" style="border:none !important;height:auto !important;display:flex;justify-content:center;align-items:center;padding: 0 !important;font-size: 14px;;" class="navbar-brand link-menu cctv_tickets">
                    <p class="menu-1 " style="text-align: center;display:flex;justify-content:center;align-items:center;">
                       <i class="fa fa-ticket" aria-hidden="true"></i>
                        <span class="link_p text" style="margin-left: 10px;font-size: 14px;">Tickets</span></p>

                </a>
            </div>
            `);
    $(".switch").hide();
  } else {
    // $("#resolvedalerts").css("margin-left", "20px");
    // $("#pendingalerts").css("margin-left", "20px");
    // $(".menusidebar").hide();
    $(".menusidebar").empty();
    $(".menusidebar").append(`
            <div class="b6" >
                <a href="/cctv_helpdesk" style="border:none !important;height:auto !important;display:flex;justify-content:center;align-items:center;padding:0 !important;font-size:14px;" class="navbar-brand link-menu cctv_helpdesk">
                    <p class="menu-1 " style="text-align: center;display:flex;justify-content:center;align-items:center;">
                        <i class="fa fa-bullhorn"></i><br><br>
                        <span class="link_p text" style="margin-left: 10px;font-size:14px;">Pending Alerts</span></p>

                </a>
            </div>
            <div class="b4">
                <a href="/cctv_resolvedalerts" style="border:none !important;height:auto !important;display:flex;justify-content:center;align-items:center;padding: 0 !important;font-size:14px;" class="navbar-brand link-menu cctv_resolvedalerts">
                    <p class="menu-1 " style="text-align: center;display:flex;justify-content:center;align-items:center;">
                        <i class="fa fa-check-square-o"></i><br><br>
                        <span class="link_p text" style="margin-left: 10px;font-size:14px;">Resolved Alerts</span></p>

                </a>
            </div>
             <div style="width:100%;" class="b9" >
                <a href="/cctv_tickets" style="border:none !important;height:auto !important;display:flex;justify-content:center;align-items:center;padding: 0 !important;font-size: 14px;;" class="navbar-brand link-menu cctv_tickets">
                    <p class="menu-1 " style="text-align: center;display:flex;justify-content:center;align-items:center;">
                       <i class="fa fa-ticket" aria-hidden="true"></i>
                        <span class="link_p text" style="margin-left: 10px;font-size: 14px;">Tickets</span></p>

                </a>
            </div>
            `);
    $(".switch").show();
  }
  $(".active-li").removeClass("active-li");
  $("." + window.location.pathname.replace("/", "")).addClass("active-li");
});

$("#addclosecomment").hide();
$.get("/ip", function (ip) {
  base_url = ip;
});
dateNow =
  d.getFullYear() +
  "-" +
  (("" + month).length < 2 ? "0" : "") +
  month +
  "-" +
  (("" + day).length < 2 ? "0" : "") +
  day;
function capitalizeFirstLetter(string) {
  if (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  } else {
    return string;
  }
}

function getpriorityval(e) {
  alert_status = e.getAttribute("status");
  priorityvalueAlerts = e.getAttribute("priority_value");
  $(".helpdesknav").css("transform", "translatex(110%)");
  if (type == "history" || alert_status == "resolved") {
    onload_All_Alerts(priorityvalueAlerts, alert_status);
  } else {
    onload_Alerts(priorityvalueAlerts, alert_status);
  }
}
$(".datepickerHelpDesk").datetimepicker({
  // format: "DD-MM-YYYY",
  format: "YYYY-MM-DD",
  defaultDate: dateNow,
  maxDate: dateNow,
  // debug: true,
  keyBinds: {
    escape: null,
    up: null,
    down: null,
    right: null,
    left: null,
  },
});

$("#dateDesk").on("blur", function (e) {
  dateNow = $("#dateDesk").val();
  onload_All_Alerts(priorityvalueAlerts, storealertdata);
});

function timeformatam(hh, mm) {
  if (hh && mm) {
    var hour = Number(hh);
    var suffix = hour >= 12 ? "PM" : "AM";
    var hours = ((hour + 11) % 12) + 1 + mm + " " + suffix;
    return hours;
  }
  return "";
}
function formatDate(date) {
  var datearray = date.split("/");
  var newdate = datearray[0] + "/" + datearray[1] + "/20" + datearray[2];
  return newdate;
  // return date;
}
function formatQrtDate(date) {
  if (date) {
    var datearray = date.split("/");
    var newdate =
      datearray[0]?.trim() + "/" + datearray[1] + "/20" + datearray[2];
    return newdate;
  }
  return date;
}

function qrtimageerror(e) {
  $($(".qrt_video").parent()).hide();
  $(e).hide();
  $("#qrt_map_container").removeClass("col-lg-8").addClass("col-lg-12");
}
function nothumbnail(e) {
  e.src = "img/nothumbnail.png";
  e.title = "No Thumbnail";
}

function createQRTmap(alert_id) {
  $("#qrt_map").remove();
  $("#qrt_map_container").append(
    ` <div id="qrt_map" style="height: 100%;min-height:256px;overflow: hidden; outline: none;"></div>`
  );

  if (
    $("#" + alert_id).attr("lat_1") !== " " &&
    $("#" + alert_id).attr("long_1") !== " "
  ) {
    if (
      $("#" + alert_id).attr("lat_1") !== "undefined" &&
      $("#" + alert_id).attr("long_1") !== "undefined"
    ) {
      var latlongarr = [];

      map = L.map("qrt_map", {
        attributionControl: false,
        zoomControl: false,
      }).setView(
        L.latLng([
          Number($("#" + alert_id).attr("lat_1")),
          Number($("#" + alert_id).attr("long_1")),
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
        ).addTo(map);
      } else {
        L.tileLayer(
          "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
          {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: "abcd",
            minZoom: 10,
          }
        ).addTo(map);
      }
      var southWest = L.latLng(-89.98155760646617, -180),
        northEast = L.latLng(89.99346179538875, 180);
      var bounds = L.latLngBounds(southWest, northEast);

      map.setMaxBounds(bounds);
      map.on("drag", function () {
        map.panInsideBounds(bounds, { animate: false });
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
          Number($("#" + alert_id).attr("lat_1")),
          Number($("#" + alert_id).attr("long_1")),
        ],
        {
          icon: blueIcon,
        }
      ).addTo(map);
      latlongarr.push([
        Number($("#" + alert_id).attr("lat_1")),
        Number($("#" + alert_id).attr("long_1")),
      ]);

      if (
        $("#" + alert_id).attr("lat_2") !== " " &&
        $("#" + alert_id).attr("long_2") !== " "
      ) {
        L.marker(
          [
            Number($("#" + alert_id).attr("lat_2")),
            Number($("#" + alert_id).attr("long_2")),
          ],
          {
            icon: grayIcon,
          }
        ).addTo(map);
        latlongarr.push([
          Number($("#" + alert_id).attr("lat_2")),
          Number($("#" + alert_id).attr("long_2")),
        ]);
        if (
          $("#" + alert_id).attr("lat_3") !== " " &&
          $("#" + alert_id).attr("long_3") !== " "
        ) {
          L.marker(
            [
              Number($("#" + alert_id).attr("lat_3")),
              Number($("#" + alert_id).attr("long_3")),
            ],
            {
              icon: orangeIcon,
            }
          ).addTo(map);
          latlongarr.push([
            Number($("#" + alert_id).attr("lat_3")),
            Number($("#" + alert_id).attr("long_3")),
          ]);
        }
      }

      // L.marker([18.52038, 73.930748], {
      //   icon: greenIcon,
      // }).addTo(map);
      // L.marker([18.502897, 73.927742], {
      //   icon: greenIcon,
      // }).addTo(map);

      // L.marker([18.519354, 73.914034], {
      //   icon: greenIcon,
      // }).addTo(map);
      if (latlongarr.length > 1) {
        var polyline = L.polyline(latlongarr, {
          color: "white",
          className: "qrt_mappath",
        }).addTo(map);

        $($(".qrt_mappath").parents("svg"))
          .css("height", "auto")
          .css("width", "auto");
        map.fitBounds(polyline.getBounds());
      }
    }
  }
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

    setTimeout(() => {
      $(".step-2").removeClass("step--incomplete").addClass("step--complete");
      $(".step-2").removeClass("step--active").addClass("step--inactive");
      $(".step-2").addClass("lastcompletedstep");
      $(".step-2")
        .next()
        .removeClass("step--inactive")
        .addClass("step--active");
      $(".step-1 .step__icon").attr(
        "data-original-title",
        "Assigned at: " +
          formatDate(assign.slice("0", "-8")) +
          " " +
          timeformatam(assign.slice("-8", "-6"), assign.slice("-6", "-3"))
      );
      $(".step-2 .step__icon").attr(
        "data-original-title",
        "Accepted at: " +
          formatQrtDate(accept.slice("0", "-8")) +
          " " +
          timeformatam(accept.slice("-8", "-6"), accept.slice("-6", "-3"))
      );
    }, 500);
  } else if (step == "3") {
    $(".step-1").removeClass("step--incomplete").addClass("step--complete");
    $(".step-1").removeClass("step--active").addClass("step--inactive");
    $(".step-1").next().removeClass("step--inactive").addClass("step--active");

    setTimeout(() => {
      $(".step-2").removeClass("step--incomplete").addClass("step--complete");
      $(".step-2").removeClass("step--active").addClass("step--inactive");
      $(".step-2")
        .next()
        .removeClass("step--inactive")
        .addClass("step--active");
      $(".step-1 .step__icon").attr(
        "data-original-title",
        "Assigned at: " +
          formatDate(assign?.slice("0", "-8")) +
          " " +
          timeformatam(assign?.slice("-8", "-6"), assign?.slice("-6", "-3"))
      );
      $(".step-2 .step__icon").attr(
        "data-original-title",
        "Accepted at: " +
          formatQrtDate(accept?.slice("0", "-8")) +
          " " +
          timeformatam(accept?.slice("-8", "-6"), accept?.slice("-6", "-3"))
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
          formatQrtDate(reach?.slice("0", "-8")) +
          " " +
          timeformatam(reach?.slice("-8", "-6"), reach?.slice("-6", "-3"))
      );
    }, 1000);
  } else {
    $(".step-1").removeClass("step--incomplete").addClass("step--complete");
    $(".step-1").removeClass("step--active").addClass("step--inactive");
    $(".step-1").next().removeClass("step--inactive").addClass("step--active");

    setTimeout(() => {
      $(".step-2").removeClass("step--incomplete").addClass("step--complete");
      $(".step-2").removeClass("step--active").addClass("step--inactive");
      $(".step-2")
        .next()
        .removeClass("step--inactive")
        .addClass("step--active");
      $(".step-1 .step__icon").attr(
        "data-original-title",
        "Assigned at: " +
          formatDate(assign?.slice("0", "-8")) +
          " " +
          timeformatam(assign?.slice("-8", "-6"), assign?.slice("-6", "-3"))
      );
      $(".step-2 .step__icon").attr(
        "data-original-title",
        "Accepted at: " +
          formatQrtDate(accept?.slice("0", "-8")) +
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
          formatQrtDate(reach?.slice("0", "-8")) +
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
      if (resolve.trim() != "") {
        $(".step-4 .step__icon").attr(
          "data-original-title",
          "Resolved at: " +
            formatQrtDate(resolve?.slice("0", "-8")) +
            " " +
            timeformatam(resolve?.slice("-8", "-6"), resolve?.slice("-6", "-3"))
        );
      }
    }, 1500);
  }
  $('[data-toggle="tooltip"]').tooltip({ html: "false" });
}

// window.onkeyup = function (e) {
//   alert(e.key);
// };

function onload_Alerts(priorityvalueAlerts, alert_status) {
  type = "realtime";
  storealertdata = alert_status;
  $(".tab-pane").empty();
  var table_name = "datatable-table-" + priorityvalueAlerts;
  $("#helpdesk_" + priorityvalueAlerts).append(
    "<table id=" +
      table_name +
      ' class="' +
      dateNow.replaceAll("-", "") +
      ' table table-striped table-hover dataTable no-footer datatableloader" style="width:100%">\n' +
      "                </table>"
  );

  $("#" + table_name).empty();
  // $("body").css("pointer-events", "none");
  var settings = {
    async: true,
    crossDomain: true,
    url: "/gethelpdeskalerts",
    // "http://" +
    // base_domainip +
    // "/event-app/get_users/saurabh/saurabh",
    method: "POST",
    data: {
      priority: priorityvalueAlerts,
      date:
        d.getFullYear() +
        "-" +
        (("" + month).length < 2 ? "0" : "") +
        month +
        "-" +
        (("" + day).length < 2 ? "0" : "") +
        day,
      status: alert_status,
    },
    headers: {
      "cache-control": "no-cache",
      "postman-token": "8fc0de8d-d948-de36-ee89-0ec4493fb82a",
    },
  };
  // $("#loading-spinner").show();

  if (ajxreq) {
    ajxreq.abort();
  }
  $(".page-500").hide();
  ajxreq = $.ajax(settings).done(function (response) {
    // console.log(response);
    if (typeof response == "string" || response.status == "token invalid") {
      logout();
    }

    $("body").css("pointer-events", "auto");
    var head = document.getElementsByTagName("head")[0];
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = "js/video-js/video-js.css";
    link.media = "all";
    head.appendChild(link);
    if (response.Failure) {
      if (response.Failure == "Server side error, Please try again later") {
        $(".datatableloader").removeClass("datatableloader").hide();
        $(".page-500").show();
      }
      Messenger().post({
        message: response.Failure,
        type: "error",
        showCloseButton: true,
      });
      $("#dateDesk").prop("disabled", true);
      $("#switch").prop("disabled", true);
      $("li[priority_value]").attr("onclick", "");
    } else {
      if (response.status == "success") {
        $("#loading-spinner").hide();
        $(".datatableloader").removeClass("datatableloader").show();

        alertnames = response.alert_names;
        active_status = response.active_status;
        if (active_status == "online") {
          $("#switch").prop("checked", true);
        }
        // var res=
        $("#" + table_name).empty();
        $("#" + table_name).append(
          '<thead> <tr> <th>Alert Name</th><th>Alert Id</th><th>Camera Name</th> <th class=" hidden-xs">Alert Location</th> <th class="hidden-xs">Time</th> <th class="hidden-xs">Verified</th><th class=" hidden-xs" style="display:none">Hidden</th>  </tr> </thead> <tbody id="allalerts" ></tbody>'
        );
        var count;

        $("#closecommentselect").empty();
        $("#closecommentselect").append(
          "<option value=''>Select Comment</option>"
        );
        for (var i = 0; i < response.comments?.length; i++) {
          $("#closecommentselect").append(
            `<option value="${response.comments[i]}">${response.comments[i]}</option>`
          );
        }

        $("#closecommentselect")
          .off("change")
          .on("change", function () {
            if ($(this).val() == "Other") {
              $("#closecomment").show();
            } else {
              $("#closecomment").hide();
            }
          });

        if (response.priority_count?.P1 == 0) {
          $("#count_span_P1").remove();
        } else {
          var color = "label-success";
          if (
            $("#count_span_P1").hasClass("label-danger") &&
            !$(".count_P1").parent().hasClass("active")
          ) {
            color = "label-danger";
          }
          $("#count_span_P1").remove();

          $(".count_P1").append(
            '<span class="label ' +
              color +
              '" style="font-size: 10px;font-weight: 400;position: relative;right: -5px;padding: 1px 5px;" id="count_span_P1">' +
              response.priority_count?.P1 +
              "</span>"
          );
        }

        if (response.priority_count?.P2 == 0) {
          $("#count_span_P2").remove();
        } else {
          var color = "label-success";
          if (
            $("#count_span_P2").hasClass("label-danger") &&
            !$(".count_P2").parent().hasClass("active")
          ) {
            color = "label-danger";
          }
          $("#count_span_P2").remove();
          $(".count_P2").append(
            '<span class="label ' +
              color +
              '" style="font-size: 10px;font-weight: 400;position: relative;right: -5px;padding: 1px 5px;" id="count_span_P2">' +
              response.priority_count?.P2 +
              "</span>"
          );
        }
        if (response.priority_count?.P3 == 0) {
          $("#count_span_P3").remove();
        } else {
          var color = "label-success";
          if (
            $("#count_span_P3").hasClass("label-danger") &&
            !$(".count_P2").parent().hasClass("active")
          ) {
            color = "label-danger";
          }
          $("#count_span_P3").remove();
          $(".count_P3").append(
            '<span class="label ' +
              color +
              '" style="font-size: 10px;font-weight: 400;position: relative;right: -5px;padding: 1px 5px;" id="count_span_P3">' +
              response.priority_count?.P3 +
              "</span>"
          );
        }

        for (i = 0; i < response.data?.length; i++) {
          count += 1;
          var event_name;
          var current_status;
          if (response.data[i]?.alert_2 == "") {
            event_name = response.data[i]?.alert_1;
          } else {
            event_name =
              response.data[i]?.alert_1 + " | " + response.data[i]?.alert_2;
          }
          // if (response.data[i]?.verified == "false") {
          //   current_status = "-";
          // } else {
          //   switch (response.data[i]?.qrt_frontend_status) {
          //     case "pending":
          //       current_status = "Pending";
          //       break;
          //     case "assigned":
          //       current_status = "Assigned to QRT";
          //       break;
          //     case "accepted":
          //       current_status = "Accepted by QRT";
          //       break;
          //     case "reached":
          //       current_status = "QRT Reached";
          //       break;
          //     case "escalated":
          //       current_status = "QRT Escalated";
          //       break;
          //     case "resolved":
          //       current_status = "Resolved";
          //       break;
          //     default:
          //       current_status = "-";
          //       break;
          //   }
          // }
          $("#allalerts").append(
            "<tr data='" +
              JSON.stringify(response.data[i]) +
              "' id='" +
              response.data[i]?.alert_id +
              "'" +
              "alert_1='" +
              response.data[i]?.alert_1 +
              "' alert_2='" +
              response.data[i]?.alert_2 +
              "' close='" +
              response.data[i]?.helpdesk_resolved_status +
              "'" +
              "qrt='" +
              response.data[i]?.qrt_flag +
              "'" +
              "action='" +
              response.data[i]?.verified +
              "'" +
              "status='" +
              response.data[i]?.qrt_frontend_status +
              "'" +
              "ticket='" +
              response.data[i]?.ticket_raised_flag +
              "'" +
              "helpdeskmessage='" +
              response.data[i]?.comment +
              "'" +
              "assigned_time='" +
              response.data[i]?.qrt_flag_time +
              "'" +
              "accepted_time='" +
              response.data[i]?.qrt_details?.accepted_time +
              "'" +
              "reached_time='" +
              response.data[i]?.qrt_details?.reached_time +
              "'" +
              "resolved_time='" +
              response.data[i]?.qrt_details?.resolved_time +
              "'" +
              "qrt_name='" +
              response.data[i]?.qrt_name +
              "'" +
              "qrt_image='" +
              response.data[i]?.qrt_details?.qrt_image +
              "'" +
              "qrt_message='" +
              response.data[i]?.qrt_details?.qrt_msg +
              "'lat_1='" +
              response.data[i]?.qrt_details?.lat_1 +
              "'long_1='" +
              response.data[i]?.qrt_details?.long_1 +
              "'lat_2='" +
              response.data[i]?.qrt_details?.lat_2 +
              "'long_2='" +
              response.data[i]?.qrt_details?.long_2 +
              "'lat_3='" +
              response.data[i]?.qrt_details?.lat_3 +
              "'long_3='" +
              response.data[i]?.qrt_details?.long_3 +
              "' role='row' class='odd'><td class='sorting_1' style='vertical-align: middle !important;'><a onclick='view(this)' class='fw-semi-bold alert" +
              response.data[i]?.read_flag +
              "' style='cursor: pointer'>" +
              event_name +
              "</a></td><td class='hidden-xs'> <span >" +
              response.data[i]?.alert_id +
              "</span> </td> <td class='hidden-xs'> <span >" +
              response.data[i]?.cam_name +
              "</span> </td><td class='hidden-xs'> <span >" +
              capitalizeFirstLetter(response.data[i]?.location) +
              "</span> </td> <td class='hidden-xs'><span style='display:none'>" +
              response.data[i]?.date?.slice(
                response.data[i]?.date?.length - 8,
                response.data[i]?.date?.length
              ) +
              "</span>" +
              timeformatam(
                response.data[i]?.date?.slice("-8", "-6"),
                response.data[i]?.date?.slice("-6", "-3")
              ) +
              "</td> <td class='hidden-xs " +
              response.data[i]?.alert_id +
              "_verified'" +
              "><span class='" +
              response.data[i]?.verified +
              "'>" +
              capitalizeFirstLetter(response.data[i]?.verified ? response.data[i]?.verified : "-") +
              "</span></td><td class='hidden-xs' style='display:none'>" +
              i +
              "</td></tr>"
          );
        }
        var unsortableColumns = [];
        $("#" + table_name)
          .find("thead th")
          .each(function () {
            if ($(this).hasClass("no-sort")) {
              unsortableColumns.push({ bSortable: false });
            } else {
              unsortableColumns.push(null);
            }
          });

        table = $("#datatable-table-" + priorityvalueAlerts).DataTable({
          order: [],
          destroy: true,
          order: [],

          scrollX: true,
          scrollCollapse: true,

          aaSortingFixed: [[6, "asc"]],
          sDom: "<'row searchrowdisplay'<'col-md-6 hidden-xs'l><'col-md-6'f>r>t<'row'<'col-md-6'i><'col-md-6'p>>",
          oLanguage: {
            sLengthMenu: "_MENU_",
            sInfo:
              "Showing <strong>_START_ to _END_</strong> of _TOTAL_ Alerts",
            sEmptyTable: "No Alerts Found !!",
            sInfoEmpty: "Showing <strong>0 to _END_</strong> of _TOTAL_ Alerts",
            sInfoFiltered: "( Filterd from _MAX_ Alerts )",
            sZeroRecords: "No matching Alerts found !!",
          },
          oClasses: {
            sFilter: "pull-right",
            sFilterInput: "form-control input-transparent",
          },
          aoColumns: unsortableColumns,
          columnDefs: [
            {
              target: 5,
              visible: false,
            },
            { width: "15%", targets: [2, 3, 4,5] },
            { width: "20%", targets: [0, 1] },

            {
              targets: [0, 1, 2, 3, 4,5],
              orderable: false,
            },
          ],
          pageLength: 50,
          initComplete: function () {
            $(this.api().table().container())
              .find("input")
              .parent()
              .wrap("<form>")
              .parent()
              .attr("autocomplete", "off");
          },

          // sDom: "<'row'<'col-md-6 hidden-xs'l><'col-md-6'f>r>t<'row'<'col-md-6'i><'col-md-6'p>>",
          // oLanguage: {
          //   sLengthMenu: "_MENU_",
          //   sInfo: "Showing <strong>_START_ to _END_</strong> of _TOTAL_ entries",
          //   sProcessing: `<img src="img/edlo3.gif" width="28px">`,
          // },
          // oClasses: {
          //   sFilter: "pull-right",
          //   sFilterInput: "form-control input-transparent",
          // },
          // processing: true,
          // serverSide: true,
          // paging: true,
          // pageLength: 10,

          // ajax: {
          //   type: "POST",
          //   url: "/gethelpdeskalerts",
          //   dataType: "json",
          //   contentType: "application/json; charset=utf-8",
          //   data: function (data) {
          //     // Grab form values containing user options
          //     // var form = {};
          //     // $.each($("form").serializeArray(), function (i, field) {
          //     //     form[field.name] = field.value || "";
          //     // });
          //     // // Add options used by Datatables
          //     // // var info = { "start": 0, "length": 10, "draw": 1 };
          //     // var info = (table == null) ? { "start": 0, "length": 10 } : table.page.info();
          //     // $.extend(form, info);
          //     data.priority = priorityvalueAlerts;
          //     return JSON.stringify(data);
          //   },
          //   complete: function (response) {
          //     active_status = response.responseJSON.active_status;
          //     if (active_status == "online") {
          //       $("#switch").prop("checked", true);
          //     }
          //   },
          // },
          // columns: [
          //   { title: "Alert Name", data: "alert_1" },
          //   { title: "Alert Location", data: "location" },
          //   { title: "Time", data: "date" },
          //   { title: "Assigned", data: "assigned_to" },
          //   { title: "Status", data: "alert_status" },
          //   { title: "Action", data: null, defaultContent: "" },
          // ],
          // columnDefs: [
          //   {
          //     targets: -1,
          //     createdCell: function (td, cellData, rowData, row, col) {
          //       $(td).prepend(
          //         `<button onclick="view(this)" style="float:left;background-color:#315a83;border-color:#315a83"; class="btn btn-primary btn-sm">View</button>`
          //       );
          //     },
          //   },
          // ],
        });
        $("#datatable-table_length > label > select").css({
          "background-color": "rgba(51, 51, 51, 0.425)",
          border: "none",
        });
      } else {
        Messenger().post({
          message: "Some error occurred, Please try later",
          type: "error",
          showCloseButton: true,
        });
      }
    }

    // $("#allalerts").append(
    //   "<tr data=" + "q"+
    //     '><td><a class="fw-semi-bold"' +
    //     // response.data.users[i].username +
    //     // " designation=" +
    //     // response.data.users[i].designation +
    //     // " email=" +
    //     // response.data.users[i].email +
    //     // "  contact=" +
    //     // response.data.users[i].contact +
    //     '  style="cursor: pointer">' +
    //     response.data.data[i].alert_1 +
    //     '</a></td> <td class="hidden-xs"> <span class="">' +
    //     response.data.data[i].location +
    //     '</span> </td> <td class="hidden-xs"><span >' +
    //     response.data.data[i].date +
    //     '</span></td>  <td class="hidden-xs"><span >' +
    //     response.data[i]?.assigned_to +
    //     '</span></td>  <td class="hidden-xs"><span >' +
    //     response.data[i]?.alert_status +
    //     '</span></td>  <td class="hidden-xs"><span> <button onclick="view(this)" style="float:left;background-color:#315a83;border-color:#315a83"; class="btn btn-primary btn-sm">View</button> </span></td> </tr>'
    // );
    // $("#allcamsDXB").append('<tr><td>'+count+'</td><td><a class="fw-semi-bold getFlightDetails" get_camDXB='+response.cam_list[i].cam_name+'  style="cursor: pointer">' + response.cam_list[i].airport_name + "--" + response.cam_list[i].terminal + "--" + response.cam_list[i].cam_name + '</a></td> <td class="hidden-xs"> <span class="">' + response.cam_list[i].stand_type + '</span> </td> <td class="hidden-xs"><span >' + response.cam_list[i].aircraft_stand + '</span></td> <td class="hidden-xs">' + response.cam_list[i].cam_add_time + '</td></tr>');
  });
}

function view(e) {
  // $(e).css("font-weight", "900");
  $(".updatevehicleNumber").hide()

  changealertname(true);
  const rowData = JSON.parse($(e).parents("tr").attr("data"));
  alert_data = rowData;

  $(".step_li")
    .removeClass("step--complete")
    .removeClass("step--active")
    .removeClass("lastcompletedstep")
    .addClass("step--inactive")
    .addClass("step--incomplete");
  $("#assignqrt").show();
  $("#assignqrt_label").show();
  $("#qrt_email_span").hide();
  $("#qrt_status_span").hide();
  $(".qrt_message").hide();
  $("#qrt_accepted_span").hide();
  $("#qrt_reached_span").hide();
  $("#qrt_resolved_span").hide();
  $(".step_li .step__icon").removeAttr("data-original-title");
  $(".qrt_video").attr("src", "");
  var isopen = $(".helpdesknav").css("transform").split(",")[4] == 0;
  $(".helpdesknav").css("transform", "translatex(110%)");
  $($(".qrt_video").parent()).hide();
  $("#qrt_map_container").removeClass("col-lg-8").addClass("col-lg-12");
  $(e).attr("id", rowData.alert_id);
  $("#assignqrt").prop("checked", false);
  $("#assignclose").prop("checked", false);
  $("#assignfalse").prop("checked", false);
  $("#addclosecomment").hide();
  $(".alreadyresolved").hide();
  $(".assignoptions").hide();
  $("#ticketRaiseButton").hide();
  $(".ticketRaised").hide();
  $(".support_messagediv").hide();
  $("#qrt_details").hide();
  $("#nameeditbutton").hide();
  
  if (
    alertnames.includes($("#" + rowData.alert_id).attr("alert_1"))
  ) {
    $("#nameeditbutton").show();
  }

  // if ($("#" + rowData.alert_id).attr("action") == "true") {
  //   $("#QRT").removeClass("qrt_disabled");
  //   $("#QRT_label").removeClass("qrt_disabled");
  //   $("#assignclose").removeClass("qrt_disabled");
  //   $("#assignclose_label").removeClass("qrt_disabled");
  //   $("#QRT").removeAttr("disabled");
  //   $("#assignclose").removeAttr("disabled");
  //   if (rowData.current_status !== "pending") {
  //     $("#QRT").attr("disabled", true);
  //     $("#QRT").addClass("qrt_disabled");
  //     $("#QRT_label").addClass("qrt_disabled");
  //     $("#assignclose").attr("disabled", true);
  //     $("#assignclose").addClass("qrt_disabled");
  //     $("#assignclose_label").addClass("qrt_disabled");
  //   }
  // } else if ($("#" + rowData.alert_id).attr("action") == "false") {
  //   $("#false").prop("checked", true);

  //   $("#QRT").attr("disabled", true);
  //   $("#assignclose").attr("disabled", true);
  //   $("#QRT").addClass("qrt_disabled");
  //   $("#QRT_label").addClass("qrt_disabled");
  //   $("#assignclose").addClass("qrt_disabled");
  //   $("#assignclose_label").addClass("qrt_disabled");
  // } else {
  //   $("#QRT").attr("disabled", true);
  //   $("#QRT").addClass("qrt_disabled");
  //   $("#QRT_label").addClass("qrt_disabled");
  //   $("#assignclose").attr("disabled", true);
  //   $("#assignclose").addClass("qrt_disabled");
  //   $("#assignclose_label").addClass("qrt_disabled");
  // }

  $(e).removeClass("alertN").addClass("alertY");

  if (rowData.read_flag === "N") {
    $.post("/updatereadflag", { alert_id: rowData.alert_id }, (response) => {
      if (typeof response == "string" || response.status == "token invalid") {
        logout();
      }
      $(e).removeClass("alertN").addClass("alertY");
    });
  }

  if (
    (rowData.alert_1 == "Stream Disconnected" ||
      rowData.alert_1 == "Client Inactive") &&
    $("#" + rowData.alert_id).attr("ticket") == "N" &&
    $("#" + rowData.alert_id).attr("close") == "open"
  ) {
    $("#ticketRaiseButton").show();
  }

  if ($("#" + rowData.alert_id).attr("action") == "false") {
    $("#assignqrt").prop("checked", false);
    $("#assignclose").prop("checked", false);
    $("#assignfalse").prop("checked", true);
    $(".assignoptions").show();
    $(".alreadyresolved").hide();
    $(".support_messagediv").hide();
    $("#qrt_details").hide();
  }else if ($("#" + rowData.alert_id).attr("action") == "true"){
    $("#assignqrt").prop("checked", true);
    $("#assignclose").prop("checked", false);
    $("#assignfalse").prop("checked", false);
    $(".assignoptions").show();
    $(".alreadyresolved").hide();
    $(".support_messagediv").hide();
    $("#qrt_details").hide();
  }else{
       $(".assignoptions").show();
    $(".alreadyresolved").hide();
    $(".support_messagediv").hide();
  }
  // } else if ($("#" + rowData.alert_id).attr("qrt") == "assigned") {
  //   $("#qrt_details").show();
  //   if ($("#" + rowData.alert_id).attr("status") == "assigned") {
  //     $("#assignqrt").prop("checked", true);
  //     $("#assignclose").prop("checked", false);
  //     $("#assignfalse").prop("checked", false);
  //     $(".assignoptions").show();
  //     $(".alreadyresolved").hide();
  //     $(".support_messagediv").hide();
  //     setTimeout(() => {
  //       stepanim("1", $("#" + rowData.alert_id).attr("assigned_time"));
  //     }, 1000);
  //     $("#qrt_details").hide();
  //   } else if ($("#" + rowData.alert_id).attr("status") == "accepted") {
  //     $("#assignqrt").prop("checked", true);
  //     $("#assignclose").prop("checked", false);
  //     $("#assignfalse").prop("checked", false);
  //     $(".assignoptions").hide();
  //     $(".alreadyresolved").hide();
  //     $(".support_messagediv").hide();

  //     $("#qrt_email_span").show();
  //     $("#qrt_status_span").show();
  //     $("#qrt_number_span").show();
  //     $(".qrt_message").hide();
  //     $("#qrt_accepted_span").show();
  //     $("#qrt_reached_span").hide();
  //     $("#qrt_resolved_span").hide();
  //     setTimeout(() => {
  //       stepanim(
  //         "2",
  //         $("#" + rowData.alert_id).attr("assigned_time"),
  //         $("#" + rowData.alert_id).attr("accepted_time")
  //       );
  //     }, 1000);
  //   } else if ($("#" + rowData.alert_id).attr("status") == "reached") {
  //     $(".alreadyresolved").hide();
  //     $("#qrt_email_span").show();
  //     $("#qrt_status_span").show();
  //     $("#qrt_number_span").show();
  //     $(".qrt_message").hide();
  //     $("#qrt_accepted_span").show();
  //     $("#qrt_reached_span").show();
  //     $("#qrt_resolved_span").hide();
  //     setTimeout(() => {
  //       stepanim(
  //         "3",
  //         $("#" + rowData.alert_id).attr("assigned_time"),
  //         $("#" + rowData.alert_id).attr("accepted_time"),
  //         $("#" + rowData.alert_id).attr("reached_time")
  //       );
  //     }, 1000);
  //   } else if ($("#" + rowData.alert_id).attr("status") == "escalated") {
  //     if ($("#" + rowData.alert_id).attr("ticket") == "N") {
  //       $("#ticketRaiseButton").show();
  //     } else {
  //       $(".ticketRaised").html(
  //         `<a href="/cctv_ticketdetail?id=${rowData.alert_id}">Ticket </a>Raised For this Alert.`
  //       );
  //       $(".ticketRaised").show();
  //     }
  //     $("#qrt_email_span").show();
  //     $("#qrt_status_span").show();
  //     $("#qrt_number_span").show();
  //     $(".qrt_message").hide();
  //     $("#qrt_accepted_span").show();
  //     $("#qrt_reached_span").show();
  //     setTimeout(() => {
  //       stepanim(
  //         "3",
  //         $("#" + rowData.alert_id).attr("assigned_time"),
  //         $("#" + rowData.alert_id).attr("accepted_time"),
  //         $("#" + rowData.alert_id).attr("reached_time")
  //       );
  //     }, 1000);
  //   } else if ($("#" + rowData.alert_id).attr("status") == "resolved") {
  //     $(".alreadyresolved").show();
  //     $("#qrt_email_span").show();
  //     $("#qrt_status_span").show();
  //     $("#qrt_number_span").show();
  //     if (rowData.qrt_details?.qrt_msg != "") {
  //       $(".qrt_message").show();
  //     }
  //     $("#qrt_accepted_span").show();
  //     $("#qrt_reached_span").show();
  //     if (rowData.qrt_details?.resolved_time.trim() != "") {
  //       $("#qrt_resolved_span").show();
  //     }
  //     setTimeout(() => {
  //       stepanim(
  //         "4",
  //         $("#" + rowData.alert_id).attr("assigned_time"),
  //         $("#" + rowData.alert_id).attr("accepted_time"),
  //         $("#" + rowData.alert_id).attr("reached_time"),
  //         $("#" + rowData.alert_id).attr("resolved_time")
  //       );
  //     }, 1000);
  //   }
  // } else if ($("#" + rowData.alert_id).attr("close") == "closed") {
  //   $("#assignqrt").prop("checked", false);
  //   $("#assignclose").prop("checked", true);
  //   $("#assignfalse").prop("checked", false);
  //   $(".assignoptions").hide();
  //   $(".alreadyresolved").show();
  //   $(".support_messagediv").show();
  // } else {
  //   $(".assignoptions").show();
  //   $(".alreadyresolved").hide();
  //   $(".support_messagediv").hide();
  // }

  // data-toggle="modal" data-target="#alertsModal"
  // addMQTTstatus({
  //   alert_id: "fcbf04e1be3e",
  //   qrt_frontend_status: "accepted",
  //   time: "2021/11/16 10:46:50",
  //   qrt_image: "",
  //   qrt_msg: "",
  //   user_name: "ranjeet@gmail.com",
  //   qrt_name: "ambir",
  // });
  var poi_details_fromapi = $(this).attr("poi_details");
  $("#voi_deatils_text").hide();
  $("#poi_deatils_text").show();
  $("#poi_det_api_text").empty();
  $("#poi_det_api_text").append(poi_details_fromapi);
  var atm_id = rowData.atm_id;
  var alert_id = rowData.alert_id;
  var city = rowData.city;
  var location = rowData.location;
  var alert_priority = rowData.priority;
  // var stand_type=$(this).attr("stand_type");

  var alert_name =
    $("#" + rowData.alert_id).attr("alert_2") !== ""
      ? $("#" + rowData.alert_id).attr("alert_1") +
        " | " +
        $("#" + rowData.alert_id).attr("alert_2")
      : $("#" + rowData.alert_id).attr("alert_1");
  var camName = rowData.cam_name;
  var event_time = timeformatam(
    rowData.date?.slice("-8", "-6"),
    rowData.date?.slice("-6", "-3")
  );
  var event_date = formatDate(rowData.date?.slice("0", "-8"));
  var status = $("#" + rowData.alert_id).attr("status");
  var thumbnail = "http://" + base_url + "/nginx/" + rowData.thumbnail
  var event_url = rowData?.video;
  // var event_url = rowData?.video.replace(".mp4", "") + "_p.mp4";
  // $.get("/ip", function (data) {
  event_url = event_url
    ? "http://"+base_url + "/nginx/" + event_url
    : "img/video/monitoringdisabled.mp4";
  var support_message = $("#" + rowData.alert_id).attr("helpdeskmessage");
  var qrt_image =
    base_url + "/nginx/" + $("#" + rowData.alert_id).attr("qrt_image");
  var qrt_email = $("#" + rowData.alert_id).attr("qrt_name");
  var qrt_status = $("#" + rowData.alert_id).attr("status");
  var qrt_message = $("#" + rowData.alert_id).attr("qrt_message");
  if (
    $("#" + rowData.alert_id).attr("status") !== "assigned" ||
    $("#" + rowData.alert_id).attr("status") !== "pending"
  ) {
    var qrt_accepted =
      formatQrtDate(
        $("#" + rowData.alert_id)
          .attr("accepted_time")
          ?.slice("0", "-8")
      ) +
      " " +
      timeformatam(
        $("#" + rowData.alert_id)
          .attr("accepted_time")
          ?.slice("-8", "-6"),
        $("#" + rowData.alert_id)
          .attr("accepted_time")
          ?.slice("-6", "-3")
      );
    var qrt_resolved =
      formatQrtDate(
        $("#" + rowData.alert_id)
          .attr("resolved_time")
          ?.slice("0", "-8")
      ) +
      " " +
      timeformatam(
        $("#" + rowData.alert_id)
          .attr("resolved_time")
          ?.slice("-8", "-6"),
        $("#" + rowData.alert_id)
          .attr("resolved_time")
          ?.slice("-6", "-3")
      );
    var qrt_reached =
      formatQrtDate(
        $("#" + rowData.alert_id)
          .attr("reached_time")
          ?.slice("0", "-8")
      ) +
      " " +
      timeformatam(
        $("#" + rowData.alert_id)
          .attr("reached_time")
          ?.slice("-8", "-6"),
        $("#" + rowData.alert_id)
          .attr("reached_time")
          ?.slice("-6", "-3")
      );
  }

  // if (alert_priority == "P3") {
  //   $("#assignqrt").hide();
  //   $("#assignqrt_label").hide();
  // }

  if (true) {
    $("#sensor_buttons").remove();
    $(".videojs_mp4").show();
    if (videojs.getPlayers()["my_video_1"]) {
      videojs("my_video_1").dispose();
      $(".videojs_mp4").append(
        '<video loop id="my_video_1" poster="'+ thumbnail +'" muted autoplay class="video-js vjs-default-skin" controls preload="none" style="width:100%;min-height: 60vh;"\n' +
          "               data-setup='{}'>\n" +
          "            <source src=" +
          event_url +
          "  type='video/mp4'>\n" +
          "        </video>"
      );

      videojs("my_video_1").play();

      $(".vjs-seek-to-live-control").remove();
      $(".vjs-picture-in-picture-control").remove();
      $(".vjs-volume-panel").remove();
      $(".vjs-fullscreen-control").css("margin-right", "60px");
      // var myButton = videojs("my_video_1").controlBar.addChild("button");
      // var myButtonDom = myButton.el();
      // myButtonDom.innerHTML = "LIVE";
      // $(myButtonDom).addClass("livestream_button");
      // myButtonDom.onclick = function () {
      //   live_camera();
      // };
    } else {
      $(".videojs_mp4").append(
        '<video loop id="my_video_1" poster="'+ thumbnail +'" autoplay muted class="video-js vjs-default-skin" controls preload="none" style="width:100%;min-height: 60vh;"\n' +
          "               data-setup='{}'>\n" +
          "            <source src=" +
          event_url +
          "  type='video/mp4'>\n" +
          "        </video>"
      );

      videojs("my_video_1").play();
      $(".vjs-seek-to-live-control").remove();
      $(".vjs-picture-in-picture-control").remove();
      $(".vjs-volume-panel").remove();
      $(".vjs-fullscreen-control").css("margin-right", "60px");
      // var myButton = videojs("my_video_1").controlBar.addChild("button");
      // var myButtonDom = myButton.el();
      // myButtonDom.innerHTML = "LIVE";
      // $(myButtonDom).addClass("livestream_button");
      // myButtonDom.onclick = function () {
      //   live_camera();
      // };
    }
  } else {
    $("#sensor_buttons").remove();
    $(".videojs_mp4").hide();
    $(".videojs_mp4").after(
      `<div id="sensor_buttons" style="width:100%;display: flex;justify-content: space-evenly;align-items: center;"></div>`
    );
    $("#sensor_buttons")
      .append(`<button class="sensor_reset_button" onclick="reset_hooter()">
  <span class="shadow"></span>
  <span class="edge"></span>
  <span class="front text"> Reset Hooter
  </span>
</button>`);
    $("#sensor_buttons")
      .append(`<button class="sensor_reset_button"  onclick="reset_sensor()">
  <span class="shadow"></span>
  <span class="edge"></span>
  <span class="front text"> Reset Sensor
  </span>
</button>`);
    // $("#sensor_buttons").append(
    //   `<button onclick="reset_hooter()" class="sensor_reset" style="color: yellow;background: transparent;border: 1px solid yellow;padding: 5px !important;margin: 20px 20PX;border-radius: 3px !important;z-index: 10000;box-shadow: 4px 4px 4px 1px #212936">Reset Hooter</button>`
    // );
    // $("#sensor_buttons").append(
    //   `<button onclick="reset_sensor()" class="sensor_reset" style="color: yellow;background: transparent;border: 1px solid yellow;padding: 5px !important;margin: 20px 20PX;border-radius: 3px !important;z-index: 10000;">Reset Sensor</button>`
    // );
    $("#sensor_buttons").append(
      `<button onclick="live_camera()" class="sensor_livecamera" style="color: red;background: transparent;border: 1px solid red;padding: 5px !important;margin: 20px 20PX;border-radius: 3px !important;font-weight:500;transition:0.2s;">Lobby Live</button>`
    );
    $("#sensor_buttons").append(
      `<button onclick="live_camera()" class="sensor_livecamera" style="color: red;background: transparent;border: 1px solid red;padding: 5px !important;margin: 20px 20PX;border-radius: 3px !important;font-weight:500;transition:0.2s;">Backroom Live</button>`
    );
  }
  // });

  // show modal box
  // $("#alertsModal").modal("show");
  if (isopen) {
    if ($("#alert_id").text().replace("#", "") !== rowData.alert_id) {
      setTimeout(() => {
        $(".helpdesknav").css("transform", "translatex(0%)");
      }, 500);
    } else {
      $(".helpdesknav").css("transform", "translatex(0%)");
    }
    if (
      $("#" + rowData.alert_id).attr("status") == "accepted" ||
      $("#" + rowData.alert_id).attr("status") == "reached" ||
      $("#" + rowData.alert_id).attr("status") == "resolved" ||
      $("#" + rowData.alert_id).attr("status") == "escalated"
    ) {
      createQRTmap(rowData.alert_id);
    }
  } else {
    if (
      $("#" + rowData.alert_id).attr("status") == "accepted" ||
      $("#" + rowData.alert_id).attr("status") == "reached" ||
      $("#" + rowData.alert_id).attr("status") == "resolved" ||
      $("#" + rowData.alert_id).attr("status") == "escalated"
    ) {
      createQRTmap(rowData.alert_id);
    }
    $(".helpdesknav").css("transform", "translatex(0%)");
  }

  // $('#alertsModal').modal({backdrop: 'static', keyboard: false})
  if (rowData.video?.trim() != "") {
    $(".vjs-control-bar").append(
      `<button class="livestream_button" onclick="live_camera()" title="Open Live">LIVE</button>`
    );
    $(".vjs-error-display").append(
      `<button class="livestream_button" onclick="live_camera()" title="Open Live">LIVE</button>`
    );
  }
  // empty all alert info.
  $("#airport_Alerts").empty();
  $("#terminal_Alerts").empty();
  $("#nav_alert_priority").empty();
  // $('#stand_type_Alerts').empty();
  $("#event_name_Alerts").empty();
  $("#cam_name_Alerts").empty();
  $("#event_time_Alerts").empty();
  $("#event_date_Alerts").empty();
  $("#status_Alerts").empty();
  $("#alerts_atm_id").empty();
  $("#alert_id").empty();
  $("#support_message").empty();
  $(".qrt_email").empty();
  $(".qrt_status").empty();
  $(".qrt_message").empty();
  $(".qrt_accepted").empty();
  $(".qrt_reached").empty();
  $(".qrt_resolved").empty();
  $("#qrtcontactnumberscontainer").empty();
  // fill all details for alert info.
  $("#nav_alert_priority").append(alert_priority);
  $("#alerts_atm_id").append("#" + atm_id);
  $("#alert_id").append("#" + alert_id);
  $("#airport_Alerts").append(capitalizeFirstLetter(city));
  $("#terminal_Alerts").append(capitalizeFirstLetter(location));
  // $('#stand_type_Alerts').append(stand_type);
  $("#event_name_Alerts").append(alert_name);
  $("#cam_name_Alerts").append(capitalizeFirstLetter(camName));
  $("#event_time_Alerts").append(event_time);

  $("#event_date_Alerts").append(event_date);
  $("#status_Alerts").append(capitalizeFirstLetter(status));
  $("#support_message").append(support_message);
  $("#rounder_name")
    .empty()
    .append(rowData.rounder_details ? rowData.rounder_details.name : "-");
  $("#rounder_number")
    .empty()
    .append(rowData.rounder_details ? rowData.rounder_details.contact : "-");
  $("#vendor")
    .empty()
    .append(rowData.vendor ? rowData.vendor : "-");
  $("#qrtcontactnumberscontainer").append(
    '<table id="qrtcontactnumberstable" class="table table-striped table-hover"><thead> <tr> <th> Name </th> <th class=" hidden-xs"> Mobile Number</th> </tr> </thead> <tbody style="color:var(--white);" id="qrtcontactnumbersbody" ></tbody></table>'
  );

  // rowData.map((qrt) => {
  if (rowData.qrt_default_name && rowData.qrt_default_number) {
    $("#qrtcontactnumbersbody").append(
      `<tr> <td >${rowData.qrt_default_name}</td> <td class="hidden-xs">${rowData.qrt_default_number}</td></tr>`
    );
  }
  // $("#sessiondatatable").show();
  // });
  $("#qrtcontactnumberstable").DataTable({
          order: [],
    destroy: true,
    sDom: "<'row'<'col-md-6 hidden-xs'l><'col-md-6'f>r>t<'row'<'col-md-6'i><'col-md-6'p>>",
    oLanguage: {
      sLengthMenu: "_MENU_",
      sInfo: "Showing <strong>_START_ to _END_</strong> of _TOTAL_ QRT",
      sEmptyTable: "No QRT found for this ATM!",
    },
    oClasses: {
      sFilter: "pull-right",
      sFilterInput: "form-control input-transparent",
    },
    paging: false,
    ordering: false,
    info: false,
    searching: false,
  });




  $("#voi_deatils_text").hide()
   var numberplateimg = "http://" + base_url + "/nginx/" + rowData.number_plate

   if($("#" + rowData.alert_id).attr("voi_details")){
    $("#voi_det_number_img").attr("src",numberplateimg)
    $("#voi_det_api_text").val($("#" + rowData.alert_id).attr("voi_details"))
        $("#voi_deatils_text").show()
   }else{
    if(rowData.voi_details){
    var string_text = "";
                  for (var key in rowData.voi_details) {
                    if (key != "_id" && key != "voi_id") {
                      string_text +=
                        key +
                        " : " +
                        rowData.voi_details[key] +
                        "\r\n";
                    }
                  }

    $("#voi_det_number_img").attr("src",numberplateimg)
    $("#voi_det_api_text").val(string_text)
        $("#voi_deatils_text").show()
  }
   }


  


  $("#poi_deatils_text").hide()

  if(rowData.poi_details){
    var string_text = "";
                  for (var key in rowData.poi_details) {
                    if (key != "poi_face_path" && key != "poi_id") {
                      string_text +=
                        key +
                        " : " +
                        rowData.poi_details[key] +
                        "\r\n";
                    }
                  }

    $("#poi_det_api_text").val(string_text)
        $("#poi_deatils_text").show()
  }

  if (qrt_status == "resolved") {
    $($(".qrt_video").parent()).show();
    $("#qrt_map_container").removeClass("col-lg-12").addClass("col-lg-8");
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
  }
  $(".qrt_email").append(capitalizeFirstLetter(qrt_email));
  $(".qrt_status").append(capitalizeFirstLetter(qrt_status));

  $(".qrt_number").empty().append(rowData.qrt_number);
  $(".qrt_message").append(qrt_message);
  $(".qrt_accepted").append(qrt_accepted);
  $(".qrt_reached").append(qrt_reached);
  $(".qrt_resolved").append(qrt_resolved);
  // $("#MY_VIDEO_1 source").attr("src", `${event_url}`);
  // var video = document.querySelector("#MY_VIDEO_1");
  // var player = videojs(video, {}, () => {});
  // player.src({
  //   src: event_url,
  //   type: "video/mp4",
  // });

  // changeSource(event_url);
  setTimeout(() => {
    if (map) {
      map.invalidateSize();
    }
  }, 1000);
}
//update url in alert modal box

// function changeSource(url) {
//   var getVideo = document.getElementById("videoAlerts");
//   var getSource = document.getElementById("videoSourceAlerts");
//   getSource.setAttribute("src", url);
//   // getVideo.load();
//   // getVideo.play();
// }

//colse alert box
close_modal = function () {
  // console.log(videojs("my_video_1"));
  // document.getElementById("my_video_1").pause();
};

// $("input[type=radio][name=action]").change(function () {
//   $.post(
//     "/alertaction",
//     {
//       action: $('input[name="action"]:checked').val(),
//       alert_id: alert_data.alert_id,
//     },
//     function (response) {
//       if (response.Failure) {
//         if ($('input[name="action"]:checked').val() == "true") {
//           $("#true").prop("checked", false);
//         } else {
//           $("#false").prop("checked", false);
//         }
//         $("#" + alert_data.verified).prop("checked", true);
//         Messenger().post({
//           message: response.Failure,
//           type: "error",
//           showCloseButton: true,
//         });
//       } else {
//         if (response.status == "failed") {
//           if ($('input[name="action"]:checked').val() == "true") {
//             $("#true").prop("checked", false);
//           } else {
//             $("#false").prop("checked", false);
//           }
//           $("#" + alert_data.verified).prop("checked", true);
//           Messenger().post({
//             message: "Some error occurred, Please try later",
//             type: "error",
//             showCloseButton: true,
//           });
//         } else {
//           $("." + alert_data.alert_id + "_verified span").text(
//             capitalizeFirstLetter($('input[name="action"]:checked').val())
//           );
//           $("." + alert_data.alert_id + "_verified span").attr(
//             "class",
//             $('input[name="action"]:checked').val()
//           );
//           $(`#` + alert_data.alert_id).attr(
//             "action",
//             $('input[name="action"]:checked').val()
//           );
//           if ($('input[name="action"]:checked').val() == "true") {
//             $("#QRT").removeClass("qrt_disabled");

//             $("#assignclose").removeClass("qrt_disabled");
//             $("#assignclose_label").removeClass("qrt_disabled");
//             $("#QRT_label").removeClass("qrt_disabled");
//             $("#QRT").removeAttr("disabled");
//             $("#assignclose").removeAttr("disabled");
//             Messenger().post({
//               message: "True Successfully!",
//               type: "success",
//               showCloseButton: true,
//             });
//           } else {
//             $("#QRT").attr("disabled", true);
//             $("#QRT").addClass("qrt_disabled");
//             $("#QRT_label").addClass("qrt_disabled");
//             $("#assignclose").attr("disabled", true);
//             $("#assignclose").addClass("qrt_disabled");
//             $("#assignclose_label").addClass("qrt_disabled");
//             if ($("#QRT").is(":checked")) {
//               $("#QRT").prop("checked", false);
//               $("#QRT").trigger("change");
//             }
//             Messenger().post({
//               message: "False Successfully!",
//               type: "success",
//               showCloseButton: true,
//             });
//           }
//         }
//       }
//     }
//   );
// });

// $("#QRT").change(function () {
//   var e = this;
//   $.post(
//     "/alertassign",
//     {
//       assign: $(this).is(":checked"),
//       alert_id: alert_data.alert_id,
//       city: alert_data.city,
//     },
//     function (response) {
//       if (response.Failure) {
//         if ($(e).is(":checked")) {
//           $("#QRT").prop("checked", false);
//         } else {
//           $("#QRT").prop("checked", true);
//         }
//         Messenger().post({
//           message: response.Failure,
//           type: "error",
//           showCloseButton: true,
//         });
//       } else {
//         if (response.status == "failed") {
//           if ($(e).is(":checked")) {
//             $("#QRT").prop("checked", false);
//           } else {
//             $("#QRT").prop("checked", true);
//           }
//           Messenger().post({
//             message: "Some error occurred, Please try later",
//             type: "error",
//             showCloseButton: true,
//           });
//         } else {
//           $("#assignclose").prop("checked", false);
//           $("#addclosecomment").hide();
//           if ($("#QRT").is(":checked")) {
//             $("." + alert_data.alert_id + "_qrt span").text("Assigned");
//             $(`#` + alert_data.alert_id).attr("qrt", "assigned");
//             Messenger().post({
//               message: "Asssigned Successfully!",
//               type: "success",
//               showCloseButton: true,
//             });
//           } else {
//             $("." + alert_data.alert_id + "_qrt span").text("Unassigned");
//             $(`#` + alert_data.alert_id).attr("qrt", "unassigned");
//             Messenger().post({
//               message: "Unasssigned Successfully!",
//               type: "success",
//               showCloseButton: true,
//             });
//           }
//         }
//       }
//     }
//   );
// });

// $("#assignclose").change(function () {
//   $("#QRT").prop("checked", false);
//   if ($("#assignclose").is(":checked")) {
//     $("#addclosecomment").show();
//   } else {
//     $("#addclosecomment").hide();
//   }
// });

var qrtflag, falseflag, closeele;

$("#assignqrt").change(function () {
  ele = this;
  falseflag = $("#" + alert_data.alert_id).attr("action") == "false";
  $("#assignclose").prop("checked", false);
  $("#assignfalse").prop("checked", false);
  $("#closecomment").hide();
  $("#addclosecomment").hide();
  $.post(
    "/alertaction",
    {
      action: $(ele).is(":checked") || "unverified",
        alert_data: alert_data
    },
    function (responsedata) {
      var response = responsedata.data
      if (responsedata.Failure) {
        Messenger().post({
          message: responsedata.Failure,
          type: "error",
          showCloseButton: true,
        });
        if ($(ele).is(":checked")) {
          $(ele).prop("checked", false);
          $("#assignfalse").prop("checked", falseflag);
        } else {
          $(ele).prop("checked", true);
        }
      } else if (response.status == "success") {
        if( $(ele).is(":checked") ){
          $(`#` + response.alert_id)?.attr("action", "true");
          console.log(table)
          table
            .cell($("." + response.alert_id + "_verified")[0])
            .data("<span class='true'>True</span>");
          Messenger().post({
          message: "Alert verified as true!",
          type: "success",
          showCloseButton: true,
          hideAfter: 2,
        });
        }else{
          $(`#` + response.alert_id)?.attr("action", "unverified");
          table
            .cell($("." + response.alert_id + "_verified")[0])
            .data("<span class='unverified'>Unverified</span>");
          Messenger().post({
          message: "Alert Unverified!",
          type: "success",
          showCloseButton: true,
          hideAfter: 2,
        });
        }
      }  else {
        Messenger().post({
          message: "Some error occurred, Please try later",
          type: "error",
          showCloseButton: true,
        });
        if (response.alert_id == alert_data.alert_id) {
          if ($(ele).is(":checked")) {
            $(ele).prop("checked", false);
            $("#assignfalse").prop("checked", falseflag);
          } else {
            $(ele).prop("checked", true);
          }
        }
      }
    table.draw(false)
  }
  );
});

$("#assignclose").change(function () {
  closeele = this;
  $("#closecomment").val("");
  $("#closecommentselect").val("");
  qrtflag =
    $("#" + alert_data.alert_id).attr("action") == "true" &&
    $("#" + alert_data.alert_id).attr("qrt") == "assigned";
  falseflag = $("#" + alert_data.alert_id).attr("action") == "false";

  if (alert_data.alert_1 == "One Atm One Person Violation") {
    $("option[value='No action required']").prop("selected", true);
  } else if (alert_data.alert_1 == "Helmet Detected") {
    $("option[value='Checked Live view QRT not required']").prop(
      "selected",
      true
    );
  } else {
    $("option[value='']").prop("selected", true);
  }

  if ($(closeele).is(":checked")) {
    $("#addclosecomment").show();
    $("#assignqrt").prop("checked", false);
    $("#assignfalse").prop("checked", false);
  } else {
    $("#closecomment").hide();
    $("#addclosecomment").hide();

    $("#assignqrt").prop("checked", qrtflag);
    $("#assignfalse").prop("checked", falseflag);
  }
});

function submitclose() {
  // if (
  //   (alert_data.priority == "P1" && $("#closecomment").val().trim() == "") ||
  //   (alert_data.priority == "P2" && $("#closecomment").val().trim() == "")
  // ) {
  //   Messenger().post({
  //     message: "Comment is required !",
  //     type: "error",
  //     showCloseButton: true,
  //   });
  // }
  if (
    $("#closecommentselect").val() == "" ||
    ($("#closecommentselect").val() == "Other" &&
      $("#closecomment").val().trim() == "")
  ) {
    Messenger().post({
      message: "Comment is required!",
      type: "error",
      showCloseButton: true,
    });
  } else {
    $.post(
      "/alertaction",
      {
        action: "true",
        alert_data: alert_data,
      },
      function (response) {
        if (typeof response == "string" || response.status == "token invalid") {
          logout();
        }
        if (response.Failure) {
          if ($(closeele).is(":checked")) {
            $(closeele).prop("checked", false);

            $("#addclosecomment").hide();
          } else {
            $(closeele).prop("checked", true);

            $("#addclosecomment").hide();
          }

          $("#assignqrt").prop("checked", qrtflag);
          $("#assignfalse").prop("checked", falseflag);
        } else if (
          response.status == "success" &&
          response.response == "Alert Closed"
        ) {
          Messenger().post({
            message: response.response,
            type: "success",
            showCloseButton: true,
            hideAfter: 2,
          });
          table
            .cell($("." + response.alert_id + "_verified")[0])
            .data("<span class='true'>True</span>");

          table
            .cell($("." + response.alert_id + "_status")[0])
            .data("Resolved");
          // $("." + response.alert_id + "_verified span").text("True");
          // $("." + response.alert_id + "_verified span").attr("class", "true");
          // $("." + response.alert_id + "_status").text("Resolved");
          $(`#` + response.alert_id).attr("action", "true");

          $(`#` + response.alert_id).attr("qrt", "unassigned");
          $(`#` + response.alert_id).attr("close", "closed");
          $(`#` + response.alert_id).attr("status", "resolved");

          $(`#` + response.alert_id).attr(
            "helpdeskmessage",
            $("#closecommentselect").val() == "Other"
              ? $("#closecomment").val()
              : $("#closecommentselect").val()
          );

          if (response.alert_id == alert_data.alert_id) {
            $("#assignqrt").prop("checked", false);
            $("#assignfalse").prop("checked", false);
            $("#addclosecomment").hide();
            $(".assignoptions").hide();
            $(".alreadyresolved").show();
            $(".support_messagediv").show();
            $("#support_message").empty();
            $("#support_message").append(
              $("#closecommentselect").val() == "Other"
                ? $("#closecomment").val()
                : $("#closecommentselect").val()
            );
            $("#ticketRaiseButton").hide();
          }
          table.draw(false);
        } else {
          Messenger().post({
            message: response.status,
            type: "error",
            showCloseButton: true,
          });

          if (response.alert_id == alert_data.alert_id) {
            if ($(closeele).is(":checked")) {
              $(closeele).prop("checked", false);

              $("#addclosecomment").hide();
            } else {
              $(closeele).prop("checked", true);

              $("#addclosecomment").hide();
            }

            $("#assignqrt").prop("checked", qrtflag);
            $("#assignfalse").prop("checked", falseflag);
          }
        }
      }
    );
  }
}

$("#assignfalse").change(function () {
  ele = this;
  $("#assignqrt").prop("checked", false);
  $("#assignclose").prop("checked", false);
  $("#addclosecomment").hide();
  $("#closecomment").val("");
  $.post(
    "/alertaction",
    {
      action: $(ele).is(":checked") == true ? "false" : "unverified",
      alert_data: alert_data,
    },
    function (responsedata) {
      var response = responsedata.data
      if (responsedata.Failure) {
        if ($(ele).is(":checked")) {
          $(ele).prop("checked", false);
        } else {
          $(ele).prop("checked", true);
        }
        Messenger().post({
          message: responsedata.Failure,
          type: "error",
          showCloseButton: true,
        });
      } else if (response.status == "success") {
        
        
        if( $(ele).is(":checked") ){
          table
            .cell($("." + response.alert_id + "_verified")[0])
            .data("<span class='false'>False</span>");
          $(`#` + response.alert_id).attr("action", "false");
          Messenger().post({
          message: "Alert verified as false!",
          type: "success",
          showCloseButton: true,
          hideAfter: 2,
        });
        }else{
           table
            .cell($("." + response.alert_id + "_verified")[0])
            .data("<span class='unverified'>Unverified</span>");
          $(`#` + response.alert_id).attr("action", "unverified");
          Messenger().post({
          message: "Alert Unverified!",
          type: "success",
          showCloseButton: true,
          hideAfter: 2,
        });
        }
        table.draw(false);
      } else {
        if (response.alert_id == alert_data.alert_id)
          Messenger().post({
            message: "Some error occurred, Please try later",
            type: "error",
            showCloseButton: true,
          });
      }
    }
  );
});

$("#raiseticket").change(function () {
  $.post("/createticket", { id: alert_data.alert_id }, function (data) {
    if (typeof data == "string") {
      logout();
    }
    if (data.status == "success") {
      $("#" + alert_data.alert_id).attr("ticket", "Y");
      $(".assignoptions").hide();
      $("#ticketRaiseButton").hide();
      $(".ticketRaised").html(
        `<a href="/cctv_ticketdetail?id=${alert_data.alert_id}">Ticket </a>Raised For this Alert.`
      );
      $(".ticketRaised").show();
      if (data.response == "Ticket already raised.") {
        Messenger().post({
          message: data.response,
          type: "error",
          showCloseButton: true,
        });
        return;
      }

      var element = document.createElement("a");
      element.setAttribute("href", "/cctv_ticketdetail?id=" + data.ticket_id);
      element.setAttribute("target", "_blank");
      element.click();
    } else {
      Messenger().post({
        message: data.status,
        type: "error",
        showCloseButton: true,
      });
    }
  });
});

$("#switch").change(function () {
  var e = this;
  var status;
  if ($(this).is(":checked")) {
    status = "online";
  } else {
    status = "offline";
  }
  $.post(
    "/activestatus",
    { status, logout_flag: "false" },
    function (response) {
      if (typeof response == "string" || response.status == "token invalid") {
        logout();
      }
      if (response.Failure) {
        $(e).prop("checked", !$(e).is(":checked"));
        Messenger().post({
          message: response.Failure,
          type: "error",
          showCloseButton: true,
        });
      } else {
        if ($(e).is(":checked")) {
          Messenger().post({
            message: "Online Successfully!",
            type: "success",
            showCloseButton: true,
          });
        } else {
          Messenger().post({
            message: "Offline Successfully!",
            type: "error",
            showCloseButton: true,
          });
        }
      }
    }
  );
});

function editalertname() {
  $("#nav_alert_priority").hide();
  $("#event_name_Alerts").hide();
  $("#nameeditbutton").hide();
  $("#alertname1").show();
  $("#alertname2").show();
  $("#submitalertname").show();
  $("#alertname1").empty();
  $("#alertname2").empty();
  $("#alertname2").append(`<option value=''>None</option>`);
  alertnames.map((alert) => {
    $("#alertname1").append(`<option value='${alert}'>${alert}</option>`);
    $("#alertname2").append(`<option value='${alert}'>${alert}</option>`);
  });
  var alertname = $("#event_name_Alerts").text().split("|");
  if (alertname.length > 1) {
    $("#alertname1").val(alertname[0]?.trim());
    $("#alertname2").val(alertname[1]?.trim());
  } else {
    $("#alertname1").val(alertname[0]?.trim());
    $("#alertname2").val("");
  }
}
function changealertname(viewflag) {
  $("#nav_alert_priority").show();
  $("#event_name_Alerts").show();
  $("#nameeditbutton").show();
  $("#alertname1").hide();
  $("#alertname2").hide();
  $("#submitalertname").hide();
  if (viewflag) {
    $("#alertname1").empty();
    $("#alertname2").empty();
    $("#alertname2").append(`<option value=''>None</option>`);
  } else {
    var alertname = $("#event_name_Alerts").text().split("|");
    var alertnameobj = {
      alert_id: $("#alert_id").text().replace("#", ""),
      alert_1: $("#alertname1").val(),
      alert_2: $("#alertname2").val(),
    };
    if (
      $("#alertname1").val() !== alertname[0]?.trim() ||
      $("#alertname2").val() !==
        (alertname[1] == undefined ? "" : alertname[1].trim())
    ) {
      $.post("/changealertname", alertnameobj, function (res) {
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

          $("#" + $("#alert_id").text().replace("#", "")).attr(
            "alert_1",
            $("#alertname1").val()
          );
          $("#" + $("#alert_id").text().replace("#", "")).attr(
            "alert_2",
            $("#alertname2").val()
          );
          if ($("#alertname2").val() == "") {
            $("#event_name_Alerts").text($("#alertname1").val());
            // $(
            //   $(
            //     $("#" + $("#alert_id").text().replace("#", "")).children("td")[0]
            //   ).children("a")[0]
            // ).text($("#alertname1").val());

            table
              .cell($("#" + $("#alert_id").text().replace("#", "") + " td")[0])
              .data(
                "<a onclick='view(this)' class='fw-semi-bold alertY' style='cursor: pointer'>" +
                  $("#alertname1").val() +
                  "</a>"
              );
          } else {
            $("#event_name_Alerts").text(
              $("#alertname1").val() + " | " + $("#alertname2").val()
            );
            // $(
            //   $(
            //     $("#" + $("#alert_id").text().replace("#", "")).children("td")[0]
            //   ).children("a")[0]
            // ).text($("#alertname1").val() + " | " + $("#alertname2").val());
            table
              .cell($("#" + $("#alert_id").text().replace("#", "") + " td")[0])
              .data(
                "<a onclick='view(this)' class='fw-semi-bold alertY' style='cursor: pointer'>" +
                  $("#alertname1").val() +
                  " | " +
                  $("#alertname2").val() +
                  "</a>"
              );
          }
          Messenger().post({
            message: "Alert name changed!",
            type: "success",
            showCloseButton: true,
          });

          table.draw(false);
        
        }
      });
    } else {
      Messenger().post({
        message: "No changes in alert name",
        type: "error",
        showCloseButton: true,
      });
    }
  }
}
// var dat = {
//   "cam_name": "cam111",
//   "state": "Maharashtra",
//   "city": "Pune District",
//   "location": "vimannagar",
//   "pincode": "411014",
//   "alert_id": "4b88a",
//   "alert_1": "Round Robin Test",
//   "alert_2": "",
//   "priority": "P1",
//   "thumbnail": "Maharashtra/Pune_District/vimannagar/cam555/83d76f2e-23af-44db-b9ad-27e714dcd60b/4b88a.jpg",
//   "video": "Maharashtra/Pune_District/vimannagar/cam555/83d76f2e-23af-44db-b9ad-27e714dcd60b/4b88a.mp4",
//   "alert_date": "2021-09-21",
//   "date": "09/21/21 18:09:00",
//   "alert_status": "completed",
//   "assigned_to": "",
//   "video_status": "",
//   "mqtt_notif_sent": "N",
//   "send_notif_flag": "Y",
//   "read_flag": "N",
//   "alert_sync_flag": "Y",
//   "video_sync_flag": "Y",
//   "atm_id": "1234",
//   "verified": "",
//   "qrt_details": "",
//   "qrt_flag": "unassigned",
//   "current_status": "pending",
//   "helpdesk_flag": "1"
// }

// addMQTTresponse({
//   alert_1: "Person Perimeter Breach",
//   alert_2: "",
//   alert_date: "2021-12-29",
//   alert_id: "60f32f0f6549",
//   alert_status: "running",
//   alert_sync_flag: "N",
//   assigned_to: "jafar@gmail.com",
//   atm_id: "pivot1001",
//   cam_name: "lobby",
//   cam_url: "rtsp://admin:admin@123@10.13.10.101:554/Streaming/Channels/302",
//   city: "PUNE",
//   comment: "",
//   current_status: "pending",
//   date: "12/29/21 13:05:35",
//   end_frame: 50071,
//   frame_diff: 0,
//   helpdesk_resolved_status: "open",
//   individual_status: "Accept",
//   location: "VimanNagar",
//   mqtt_notif_sent: "N",
//   nabto_cam_url: "pivotchain.in:32021",
//   pincode: "undefined",
//   priority: "P1",
//   qrt_details: "",
//   qrt_email: "",
//   qrt_flag: "unassigned",
//   qrt_flag_time: "12/29/21 14:51:24",
//   qrt_frontend_status: "pending",
//   read_flag: "N",
//   send_notif_flag: "Y",
//   start_frame: 50071,
//   state: "MH",
//   thumbnail: "MH/PUNE/VimanNagar/lobby/0899f6676ad9/60f32f0f6549.jpg",
//   verified: "unverified",
//   video: "MH/PUNE/VimanNagar/lobby/0899f6676ad9/60f32f0f6549.mp4",
//   video_status: "",
//   video_sync_flag: "N",
// });
countindex = 0;
function addMQTTresponse(data) {
  countindex -= 1;



   if(type == "realtime"){
    if (document.getElementById("count_span_" + data.priority)) {
          var counter = $("#count_span_" + data.priority).html();
          var totalcount = parseInt(counter) + 1;
          $("#count_span_" + data.priority).empty();
          $("#count_span_" + data.priority).append(totalcount);
        } else {
          var id_count = "count_span_" + data.priority;
          $(".count_" + data.priority).append(
            '<span class="label label-success" style="font-size: 10px;font-weight: 400;position: relative;right: -5px;padding: 1px 5px;" id=' +
              id_count +
              ">1</span>"
          );
        }
   }
  
  // var table = $("#datatable-table-" + data.priority).DataTable();
  if (
    type == "realtime" &&
    $("table").hasClass(data?.alert_date?.replaceAll("-", "")) &&
    $("table")[1]?.id == "datatable-table-" + data.priority
  ) {
    var row = $(
      "<tr data='" +
        JSON.stringify(data) +
        "' id='" +
        data.alert_id +
        "'" +
        "alert_1='" +
        data.alert_1 +
        "' alert_2='" +
        data.alert_2 +
        "' close='" +
        data.helpdesk_resolved_status +
        "'" +
        "qrt='" +
        data.qrt_flag +
        "'" +
        "action='" +
        data.verified +
        "'" +
        "status='" +
        data.qrt_frontend_status +
        "'" +
        "ticket='" +
        data.ticket_raised_flag +
        "'" +
        "helpdeskmessage='" +
        data.comment +
        "'" +
        "assigned_time='" +
        data.qrt_flag_time +
        "'" +
        "accepted_time='" +
        data.qrt_details?.accepted_time +
        "'" +
        "reached_time='" +
        data.qrt_details?.reached_time +
        "'" +
        "resolved_time='" +
        data.qrt_details?.resolved_time +
        "'" +
        "qrt_name='" +
        data.qrt_name +
        "'" +
        "qrt_image='" +
        data.qrt_details?.qrt_image +
        "'" +
        "qrt_message='" +
        data.qrt_details?.qrt_msg +
        "'lat_1='" +
        data.qrt_details?.lat_1 +
        "'long_1='" +
        data.qrt_details?.long_1 +
        "'lat_2='" +
        data.qrt_details?.lat_2 +
        "'long_2='" +
        data.qrt_details?.long_2 +
        "'lat_3='" +
        data.qrt_details?.lat_3 +
        "'long_3='" +
        data.qrt_details?.long_3 +
        "' role='row'>"
    );

    var event_name;
    var current_status;
    if (data.alert_2?.trim() == "") {
      event_name = data.alert_1;
    } else {
      event_name = data.alert_1 + " | " + data.alert_2;
    }
    if (data.verified == "false") {
      current_status = "-";
    } else {
      switch (data.qrt_frontend_status) {
        case "pending":
          current_status = "Pending";
          break;
        case "assigned":
          current_status = "Assigned to QRT";
          break;
        case "accepted":
          current_status = "Accepted by QRT";
          break;
        case "reached":
          current_status = "QRT Reached";
          break;
        case "escalated":
          current_status = "QRT Escalated";
          break;
        case "resolved":
          current_status = "Resolved";
          break;
        default:
          current_status = "-";
          break;
      }
    }
    row
      .append(
        "<td class='sorting_1' style='vertical-align: middle !important;'><a onclick='view(this)' class='fw-semi-bold viewalertnav' style='cursor: pointer'>" +
          event_name +
          "</a></td>"
      )
      .append(
        "<td class='hidden-xs'> <span >" + data.alert_id + "</span> </td>"
      )
      .append(
        "<td class='hidden-xs'> <span >" +
          
          data.cam_name +
          "</span> </td>"
      )
      .append(
        "<td class='hidden-xs'> <span >" +
          capitalizeFirstLetter(data.location) +
          "</span> </td>"
      )
      .append(
        "<td class='hidden-xs'><span style='display:none'>" +
          data.date?.slice(data.date?.length - 8, data.date?.length) +
          "</span>" +
          timeformatam(
            data.date?.slice("-8", "-6"),
            data.date?.slice("-6", "-3")
          ) +
          "</td>"
      )

      // .append(
      //   "<td class='hidden-xs " +
      //     data.alert_id +
      //     "_status" +
      //     "'>" +
      //     current_status +
      //     "</td>"
      // )
      .append(
        "<td class='hidden-xs " +
          data.alert_id +
          "_verified'" +
          "><span class='" +
          data.verified +
          "'>" +
          capitalizeFirstLetter(data.verified) +
          "</span></td>"
      )
      .append(
        "<td class='hidden-xs' style='display:none'>" + countindex + "</td>"
      );
    table?.row.add(row).draw(false);

    // $("#" + data.alert_id).css("transition", "background 1.0s ease-in-out");
    // var $row = $("#" + data.alert_id);

    // var backgroundInterval = setInterval(function () {
    //   $row.toggleClass("mqttbackgroundRed");
    // }, 1000);

    // setTimeout(() => {
    //   clearInterval(backgroundInterval);
    //   $row.removeClass("mqttbackgroundRed");
    //   $("#" + data.alert_id).css("transition", "none");
    // }, 5000);
  }
}

// addMQTTresponse({
//   alert_id: "54e943ad83f3",
//   qrt_frontend_status: "resolved",
//   time: "2021/11/16 10:46:50",
//   qrt_image: "",
//   qrt_msg: "test",
//   user_name: "ranjeet@gmail.com",
//   qrt_name: "ambir",
// });

// function addMQTTstatus(data) {
//   if (alert_data) {
//     if (alert_data.alert_id == data.alert_id) {
//       $($(".qrt_video").parent()).hide();
//       $("#qrt_map_container").removeClass("col-lg-8").addClass("col-lg-12");
//       $(".step_li").removeClass("lastcompletedstep");
//       $(".qrt_status").empty();
//       $(`#` + data.alert_id).attr("status", data.qrt_frontend_status);
//       $(".qrt_status").append(data.qrt_frontend_status);

//       $(`#` + data.alert_id).attr("assigned_time", data.time);
//       if (data.qrt_frontend_status == "assigned") {
//         table
//           .cell($("." + data.alert_id + "_verified")[0])
//           .data("<span class='true'>True</span>");

//         table
//           .cell($("." + data.alert_id + "_status")[0])
//           .data("Assigned to QRT");

//         // $("." + data.alert_id + "_verified span").text("True");
//         // $("." + data.alert_id + "_verified span").attr("class", "true");
//         $(`#` + data.alert_id).attr("qrt", "assigned");
//         // $("." + data.alert_id + "_status").text("Assigned to QRT");
//         $("#assignqrt").prop("checked", true);
//         $("#assignclose").prop("checked", false);
//         $("#assignfalse").prop("checked", false);
//         $("#qrt_email_span").hide();
//         $("#qrt_status_span").hide();
//         $("#qrt_number_span").hide();
//         $(".qrt_message").hide();
//         $("#qrt_accepted_span").hide();
//         $("#qrt_reached_span").hide();
//         $("#qrt_resolved_span").hide();
//         stepanim("1", $("#" + data.alert_id).attr("assigned_time"));
//         $("#qrt_details").hide();
//       } else if (data.qrt_frontend_status == "accepted") {
//         // $("." + data.alert_id + "_verified span").text("True");
//         // $("." + data.alert_id + "_verified span").attr("class", "true");
//         $("#qrt_details").show();
//         $("#assignqrt").prop("checked", true);
//         $("#assignclose").prop("checked", false);
//         $("#assignfalse").prop("checked", false);
//         $(".assignoptions").hide();
//         $(".alreadyresolved").hide();
//         $(".support_messagediv").hide();
//         table
//           .cell($("." + data.alert_id + "_status")[0])
//           .data("Accepted by QRT");

//         // $("." + data.alert_id + "_status").text("Accepted by QRT");
//         $(`#` + data.alert_id).attr("accepted_time", data.time);
//         $("#" + data.alert_id).attr("qrt_name", data.qrt_name);
//         $("#" + data.alert_id).attr("lat_1", data.lat);
//         $("#" + data.alert_id).attr("long_1", data.long);
//         $(".qrt_email").empty();
//         $(".qrt_accepted").empty();
//         $(".qrt_email").append(data.qrt_name);
//         $(".qrt_number").empty().append(data.qrt_number);
//         $(".qrt_accepted").append(
//           formatQrtDate(data.time.slice("0", "-8")) +
//             " " +
//             timeformatam(
//               data.time.slice("-8", "-6"),
//               data.time.slice("-6", "-3")
//             )
//         );
//         $("#qrt_email_span").show();
//         $("#qrt_status_span").show();
//         $("#qrt_number_span").show();
//         $(".qrt_message").hide();
//         $("#qrt_accepted_span").show();
//         $("#qrt_reached_span").hide();
//         $("#qrt_resolved_span").hide();
//         setTimeout(() => {
//           createQRTmap(data.alert_id);
//           stepanim(
//             "2",
//             $("#" + data.alert_id).attr("assigned_time"),
//             data.time
//           );
//         }, 500);
//       } else if (data.qrt_frontend_status == "reached") {
//         // $("." + data.alert_id + "_verified span").text("True");
//         // $("." + data.alert_id + "_verified span").attr("class", "true");
//         table.cell($("." + data.alert_id + "_status")[0]).data("QRT Reached");

//         // $("." + data.alert_id + "_status").text("QRT Reached");
//         $(`#` + data.alert_id).attr("reached_time", data.time);
//         $("#" + data.alert_id).attr("lat_2", data.lat);
//         $("#" + data.alert_id).attr("long_2", data.long);
//         $(".qrt_reached").empty();
//         $(".qrt_reached").append(
//           formatQrtDate(data.time?.slice("0", "-8")) +
//             " " +
//             timeformatam(
//               data.time?.slice("-8", "-6"),
//               data.time?.slice("-6", "-3")
//             )
//         );
//         $("#qrt_email_span").show();
//         $("#qrt_status_span").show();
//         $("#qrt_number_span").show();
//         $(".qrt_message").hide();
//         $("#qrt_accepted_span").show();
//         $("#qrt_reached_span").show();
//         $("#qrt_resolved_span").hide();
//         createQRTmap(data.alert_id);
//         setTimeout(() => {
//           stepanim(
//             "3",
//             $("#" + data.alert_id).attr("assigned_time"),
//             $(`#` + data.alert_id).attr("accepted_time"),
//             data.time
//           );
//         }, 500);
//       } else if (data.qrt_frontend_status == "escalated") {
//         table.cell($("." + data.alert_id + "_status")[0]).data("QRT Escalated");
//         // $("." + data.alert_id + "_status").text("QRT Reached");
//         $("#qrt_email_span").show();
//         $("#qrt_status_span").show();
//         $("#qrt_number_span").show();
//         $(".qrt_message").hide();
//         $("#qrt_accepted_span").show();
//         $("#qrt_reached_span").show();
//         $("#qrt_resolved_span").hide();
//         createQRTmap(data.alert_id);
//         setTimeout(() => {
//           stepanim(
//             "3",
//             $("#" + data.alert_id).attr("assigned_time"),
//             $(`#` + data.alert_id).attr("accepted_time"),
//             $(`#` + data.alert_id).attr("reached_time")
//           );
//         }, 500);
//       } else if (data.qrt_frontend_status == "resolved") {
//         // $("." + data.alert_id + "_verified span").text("True");
//         // $("." + data.alert_id + "_verified span").attr("class", "true");
//         table.cell($("." + data.alert_id + "_status")[0]).data("Resolved");
//         // $("." + data.alert_id + "_status").text("Resolved");
//         $(`#` + data.alert_id).attr("resolved_time", data.time);
//         $(`#` + data.alert_id).attr("qrt_image", data.qrt_image);
//         $(`#` + data.alert_id).attr("qrt_message", data.qrt_msg);
//         $("#" + data.alert_id).attr("lat_3", data.lat);
//         $("#" + data.alert_id).attr("long_3", data.long);
//         $(".qrt_message").empty();
//         $(".qrt_resolved").empty();
//         $(".qrt_resolved").append(
//           formatQrtDate(data.time.slice("0", "-8")) +
//             " " +
//             timeformatam(
//               data.time.slice("-8", "-6"),
//               data.time.slice("-6", "-3")
//             )
//         );
//         $(".qrt_message").append(data.qrt_msg);
//         // if (data.time !== "") {
//         //   $(".alreadyresolved").show();
//         // }
//         $("#qrt_email_span").show();
//         $("#qrt_status_span").show();
//         $("#qrt_number_span").show();
//         $(".qrt_message").show();
//         $("#qrt_accepted_span").show();
//         $("#qrt_reached_span").show();
//         $("#qrt_resolved_span").show();
//         createQRTmap(data.alert_id);
//         setTimeout(() => {
//           stepanim(
//             "4",
//             $("#" + data.alert_id).attr("assigned_time"),
//             $(`#` + data.alert_id).attr("accepted_time"),
//             $(`#` + data.alert_id).attr("reached_time"),
//             data.time
//           );
//         }, 500);

//         $($(".qrt_video").parent()).show();
//         $("#qrt_map_container").removeClass("col-lg-12").addClass("col-lg-8");
//         if (data.qrt_image.includes("mp4")) {
//           $(".qrt_image").hide();
//           $(".qrt_video").attr("src", base_url + "/nginx/" + data.qrt_image);
//           $(".qrt_image").attr("onerror", "qrtimageerror(this)");
//           $(".qrt_video").show();
//         } else {
//           $(".qrt_video").hide();
//           $(".qrt_image").show();
//           $(".qrt_image").attr("src", base_url + "/nginx/" + data.qrt_image);
//         }
//         setTimeout(() => {
//           map?.invalidateSize();
//         }, 1000);
//       } else if (data.qrt_frontend_status == "pending") {
//         $("#assignqrt").prop("checked", false);
//         $("#assignclose").prop("checked", false);
//         $("#assignfalse").prop("checked", false);
//         table
//           .cell($("." + data.alert_id + "_verified")[0])
//           .data("<span class='unverified'>Unverified</span>");

//         table.cell($("." + data.alert_id + "_status")[0]).data("Pending");

//         // $("." + data.alert_id + "_verified span").text("Unverified");
//         // $("." + data.alert_id + "_verified span").attr("class", "unverified");
//         $(`#` + data.alert_id).attr("qrt", "unassigned");
//         // $("." + data.alert_id + "_status").text("Pending");
//       }
//     } else {
//       $(`#` + data.alert_id).attr("status", data.qrt_frontend_status);
//       if (data.qrt_frontend_status == "assigned") {
//         table
//           .cell($("." + data.alert_id + "_verified")[0])
//           .data("<span class='true'>True</span>");

//         table
//           .cell($("." + data.alert_id + "_status")[0])
//           .data("Assigned to QRT");

//         // $("." + data.alert_id + "_verified span").text("True");
//         // $("." + data.alert_id + "_verified span").attr("class", "true");
//         $(`#` + data.alert_id).attr("qrt", "assigned");
//         // $("." + data.alert_id + "_status").text("Assigned to QRT");
//         $(`#` + data.alert_id).attr("assigned_time", data.time);
//       } else if (data.qrt_frontend_status == "accepted") {
//         table
//           .cell($("." + data.alert_id + "_status")[0])
//           .data("Accepted by QRT");

//         // $("." + data.alert_id + "_status").text("Accepted by QRT");
//         $(`#` + data.alert_id).attr("accepted_time", data.time);
//         $("#" + data.alert_id).attr("qrt_name", data.qrt_name);
//         $("#" + data.alert_id).attr("lat_1", data.lat);
//         $("#" + data.alert_id).attr("long_1", data.long);
//       } else if (data.qrt_frontend_status == "reached") {
//         table.cell($("." + data.alert_id + "_status")[0]).data("QRT Reached");

//         // $("." + data.alert_id + "_status").text("QRT Reached");
//         $(`#` + data.alert_id).attr("reached_time", data.time);
//         $("#" + data.alert_id).attr("lat_2", data.lat);
//         $("#" + data.alert_id).attr("long_2", data.long);
//       } else if (data.qrt_frontend_status == "resolved") {
//         table.cell($("." + data.alert_id + "_status")[0]).data("Resolved");

//         // $("." + data.alert_id + "_status").text("Resolved");
//         $(`#` + data.alert_id).attr("resolved_time", data.time);
//         $(`#` + data.alert_id).attr("qrt_image", data.qrt_image);
//         $(`#` + data.alert_id).attr("qrt_message", data.qrt_msg);
//         $("#" + data.alert_id).attr("lat_3", data.lat);
//         $("#" + data.alert_id).attr("long_3", data.long);
//       }
//     }
//   } else {
//     $(`#` + data.alert_id).attr("status", data.qrt_frontend_status);
//     if (data.qrt_frontend_status == "assigned") {
//       table
//         .cell($("." + data.alert_id + "_verified")[0])
//         .data("<span class='true'>True</span>");

//       table.cell($("." + data.alert_id + "_status")[0]).data("Assigned to QRT");

//       // $("." + data.alert_id + "_verified span").text("True");
//       // $("." + data.alert_id + "_verified span").attr("class", "true");
//       $(`#` + data.alert_id).attr("qrt", "assigned");
//       // $("." + data.alert_id + "_status").text("Assigned to QRT");
//       $(`#` + data.alert_id).attr("assigned_time", data.time);
//     } else if (data.qrt_frontend_status == "accepted") {
//       table.cell($("." + data.alert_id + "_status")[0]).data("Accepted by QRT");

//       // $("." + data.alert_id + "_status").text("Accepted by QRT");
//       $(`#` + data.alert_id).attr("accepted_time", data.time);
//       $("#" + data.alert_id).attr("qrt_name", data.qrt_name);
//       $("#" + data.alert_id).attr("lat_1", data.lat);
//       $("#" + data.alert_id).attr("long_1", data.long);
//     } else if (data.qrt_frontend_status == "reached") {
//       table.cell($("." + data.alert_id + "_status")[0]).data("QRT Reached");

//       // $("." + data.alert_id + "_status").text("QRT Reached");
//       $(`#` + data.alert_id).attr("reached_time", data.time);
//       $("#" + data.alert_id).attr("lat_2", data.lat);
//       $("#" + data.alert_id).attr("long_2", data.long);
//     } else if (data.qrt_frontend_status == "resolved") {
//       table.cell($("." + data.alert_id + "_status")[0]).data("Resolved");

//       // $("." + data.alert_id + "_status").text("Resolved");
//       $(`#` + data.alert_id).attr("resolved_time", data.time);
//       $(`#` + data.alert_id).attr("qrt_image", data.qrt_image);
//       $(`#` + data.alert_id).attr("qrt_message", data.qrt_msg);
//       $("#" + data.alert_id).attr("lat_3", data.lat);
//       $("#" + data.alert_id).attr("long_3", data.long);
//     }
//   }
//   table.draw(false);
// }

function reset_hooter() {
  alert("Hooter Reset");
}

function reset_sensor() {
  alert("Sensor Reset");
}

function live_camera() {
  // var atm_id = $("#alerts_atm_id").text().replace("#", "");
  var cam_name = $("#cam_name_Alerts").text().toLowerCase();
  // var newstream = window.open(
  //   "/cctv_livestream?atm_id=" + atm_id + "&cam_name=" + cam_name,
  //   "livestream",
  //   "width=600,height=400,top=250, left=960"
  // );
  localStorage.setItem("camName-DXB",cam_name);
  window.location.href = "/cctv_monitoring";
  // if (
  //   !newstream ||
  //   newstream.closed ||
  //   typeof newstream.closed == "undefined"
  // ) {
  //   Messenger().post({
  //     message: "Popup is blocked !!",
  //     type: "error",
  //     showCloseButton: true,
  //   });
  // }
}

function closemodalbtn() {
  $(".helpdesknav").css("transform", "translatex(110%)");
}

$("#closecomment").on("keydown", function (e) {
  if (e.key == "'" || e.key == '"' || e.key == "`") {
    e.preventDefault();
  }
  if (e.key == "Enter") {
    e.preventDefault();
    submitclose();
  }
});

// $(window).unbind();
// $(window).on("keydown", (e) => {
//   if (
//     $(".helpdesknav").css("transform")?.split(",")[4] == 0 &&
//     $(".assignoptions").css("display") !== "none"
//   ) {
//     if (e.ctrlKey && e.key == "q") {
//       if ($("#assignqrt").css("display") !== "none") {
//         if ($("#assignqrt").is(":checked")) {
//           $("#assignqrt").prop("checked", false);
//           $("#assignqrt").trigger("change");
//         } else {
//           $("#assignqrt").prop("checked", true);
//           $("#assignqrt").trigger("change");
//         }
//       }
//     } else if (e.ctrlKey && e.key == "c") {
//       if ($("#assignclose").is(":checked")) {
//         $("#assignclose").prop("checked", false);
//         $("#assignclose").trigger("change");
//       } else {
//         $("#assignclose").prop("checked", true);
//         $("#assignclose").trigger("change");
//       }
//     } else if (e.ctrlKey && e.key === "f") {
//       e.preventDefault();
//       if ($("#assignfalse").is(":checked")) {
//         $("#assignfalse").prop("checked", false);
//         $("#assignfalse").trigger("change");
//       } else {
//         $("#assignfalse").prop("checked", true);
//         $("#assignfalse").trigger("change");
//       }
//     } else if (e.ctrlKey && e.key === "l") {
//       $(".livestream_button").trigger("click");
//     } else if (e.ctrlKey && e.key == "x") {
//       closemodalbtn();
//     } else if (e.key == "ArrowRight") {
//       var nextEle = $($("#alert_id").text()).next();
//       if (!nextEle.length < 1) {
//         view($($(nextEle).children()[0]).children()[0]);
//       }
//     } else if (e.key == "ArrowLeft") {
//       var prevEle = $($("#alert_id").text()).prev();
//       if (!prevEle.length < 1) {
//         view($($(prevEle).children()[0]).children()[0]);
//       }
//     }
//   } else if ($(".helpdesknav").css("transform")?.split(",")[4] == 0) {
//     if (e.ctrlKey && e.key == "x") {
//       closemodalbtn();
//     } else if (e.key == "ArrowRight") {
//       var nextEle = $($("#alert_id").text()).next();
//       if (!nextEle.length < 1) {
//         view($($(nextEle).children()[0]).children()[0]);
//       }
//     } else if (e.key == "ArrowLeft") {
//       var prevEle = $($("#alert_id").text()).prev();
//       if (!prevEle.length < 1) {
//         view($($(prevEle).children()[0]).children()[0]);
//       }
//     }
//   } else if (e.ctrlKey && e.key == "z" && $("#alert_id").text() !== " ") {
//     if (alert_data) {
//       setTimeout(() => {
//         $(".helpdesknav").css("transform", "translatex(0%)");
//       }, 500);
//     }
//   }
// });

function onload_All_Alerts(priorityvalueAlerts, alert_status) {
  storealertdata = alert_status;
  type = "history";
  $("#loading-spinner").hide();
  $(".tab-pane").empty();
  var table_name = "alertsdatatable-table-" + priorityvalueAlerts;
  $("#helpdesk_" + priorityvalueAlerts)
    .empty()
    .append(
      "<table id=" +
        table_name +
        ' class="' +
        dateNow.replaceAll("-", "") +
        ' table table-striped table-hover dataTable no-footer datatableloader" style="width:100%;margin-top:20px;">\n' +
        "                </table>"
    );

  $("#" + table_name).empty();
  $(".page-500").hide();
  table = $("#" + table_name).DataTable({
          order: [],
    destroy: true,

    scrollX: true,
    scrollCollapse: true,
    order: [],
    sDom: "<'row searchrowdisplay'<'col-md-6 hidden-xs'l><'col-md-6'f>r>t<'row'<'col-md-6'i><'col-md-6'p>>",
    oLanguage: {
      sLengthMenu: "_MENU_",
      sInfo: "Showing <strong>_START_ to _END_</strong> of _TOTAL_ Alerts",
      sProcessing: ``,
      sEmptyTable: "No Alerts Found !!",
      sInfoEmpty: "Showing <strong>0 to _END_</strong> of _TOTAL_ Alerts",
      sInfoFiltered: "( Filterd from _MAX_ Alerts )",
      sZeroRecords: "No matching Alerts found !!",
    },
    oClasses: {
      sFilter: "pull-right",
      sFilterInput: "form-control input-transparent",
    },
    columnDefs: [
      { width: "15%", targets: [2, 3, 4, 5] },
      { width: "20%", targets: [0, 1] },
    ],
    pageLength: 50,
    initComplete: function () {
      $(this.api().table().container())
        .find("input")
        .parent()
        .wrap("<form>")
        .parent()
        .attr("autocomplete", "off");
    },
    processing: true,
    serverSide: true,
    paging: true,
    ajax: {
      type: "POST",
      url: "/getallalerts",
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      data: function (data) {
        data.priority = priorityvalueAlerts;
        data.status = alert_status;
        data.date = dateNow;

        return JSON.stringify(data);
      },
      complete: function (response) {
        var head = document.getElementsByTagName("head")[0];
        var link = document.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = "js/video-js/video-js.css";
        link.media = "all";
        head.appendChild(link);

        if (ajxreq) {
          ajxreq.abort();
        }

        response = response.responseJSON;

        if (response.Failure) {
          if (response.Failure == "Server side error, Please try again later") {
            $(".datatableloader").removeClass("datatableloader").hide();
            $(".page-500").show();
          }
          Messenger().post({
            message: response.Failure,
            type: "error",
            showCloseButton: true,
          });
          return [];
        }
        if (response.status == "success") {
          alertnames = response.alert_names;
          active_status = response.active_status;
          if (active_status == "online") {
            $("#switch").prop("checked", true);
          }

          $(".datatableloader")
            .removeClass("datatableloader")
            .css("margin-top", "0")
            .show();

          $("#closecommentselect").empty();
          $("#closecommentselect").append(
            "<option value=''>Select Comment</option>"
          );
          for (var i = 0; i < response.comments?.length; i++) {
            $("#closecommentselect").append(
              `<option value="${response.comments[i]}">${response.comments[i]}</option>`
            );
          }

          $("#closecommentselect")
            .off("change")
            .on("change", function () {
              if ($(this).val() == "Other") {
                $("#closecomment").show();
              } else {
                $("#closecomment").hide();
              }
            });

          if (response.priority_count?.P1 == 0) {
            $("#count_span_P1").remove();
          } else {
            var color = "label-success";
            if (
              $("#count_span_P1").hasClass("label-danger") &&
              !$(".count_P1").parent().hasClass("active")
            ) {
              color = "label-danger";
            }
            $("#count_span_P1").remove();

            $(".count_P1").append(
              '<span class="label ' +
                color +
                '" style="font-size: 10px;font-weight: 400;position: relative;right: -5px;padding: 1px 5px;" id="count_span_P1">' +
                response.priority_count?.P1 +
                "</span>"
            );
          }

          if (response.priority_count?.P2 == 0) {
            $("#count_span_P2").remove();
          } else {
            var color = "label-success";
            if (
              $("#count_span_P2").hasClass("label-danger") &&
              !$(".count_P2").parent().hasClass("active")
            ) {
              color = "label-danger";
            }
            $("#count_span_P2").remove();
            $(".count_P2").append(
              '<span class="label ' +
                color +
                '" style="font-size: 10px;font-weight: 400;position: relative;right: -5px;padding: 1px 5px;" id="count_span_P2">' +
                response.priority_count?.P2 +
                "</span>"
            );
          }
          if (response.priority_count?.P3 == 0) {
            $("#count_span_P3").remove();
          } else {
            var color = "label-success";
            if (
              $("#count_span_P3").hasClass("label-danger") &&
              !$(".count_P2").parent().hasClass("active")
            ) {
              color = "label-danger";
            }
            $("#count_span_P3").remove();
            $(".count_P3").append(
              '<span class="label ' +
                color +
                '" style="font-size: 10px;font-weight: 400;position: relative;right: -5px;padding: 1px 5px;" id="count_span_P3">' +
                response.priority_count?.P3 +
                "</span>"
            );
          }
          return response.data;
        } else {
          Messenger().post({
            message: response.status,
            type: "error",
            showCloseButton: true,
          });
          return [];
        }
      },
      error: function (response) {
        console.log(response);
      },
    },
    createdRow: function (row, data, dataIndex) {
      $(row)
        .attr("data", JSON.stringify(data))
        .attr("id", data.alert_id)
        .attr("ticket", data.ticket_raised_flag)
        .attr("alert_1", data.alert_1)
        .attr("alert_2", data.alert_2)
        .attr("close", data.helpdesk_resolved_status)
        .attr("qrt", data.qrt_flag)
        .attr("action", data.verified)
        .attr("status", data.qrt_frontend_status)
        .attr("helpdeskmessage", data.comment)
        .attr("assigned_time", data.qrt_flag_time)
        .attr("accepted_time", data.qrt_details?.accepted_time)
        .attr("reached_time", data.qrt_details?.reached_time)
        .attr("resolved_time", data.qrt_details?.resolved_time)
        .attr("qrt_name", data.qrt_name)
        .attr("qrt_image", data.qrt_details?.qrt_image)
        .attr("qrt_message", data.qrt_details?.qrt_msg)
        .attr("lat_1", data.qrt_details?.lat_1)
        .attr("long_1", data.qrt_details?.long_1)
        .attr("lat_2", data.qrt_details?.lat_2)
        .attr("long_2", data.qrt_details?.long_2)
        .attr("lat_3", data.qrt_details?.lat_3)
        .attr("long_3", data.qrt_details?.long_3);
    },

    columns: [
      {
        title: "Alert Name",
        data: "alert_1",
        render: function (data, type, row) {
          var event_name;
          if (row.alert_2?.trim() == "") {
            event_name = row.alert_1;
          } else {
            event_name = row.alert_1 + " | " + row.alert_2;
          }
          return `<a onclick='view(this)' class='fw-semi-bold' style='cursor: pointer'>
              ${event_name}</a>`;
        },
      },
      { title: "Alert Id", data: "alert_id" },
      { title: "Camera Name", data: "cam_name" },
      {
        title: "Alert Location",
        data: "location",
        render: function (data, type, row) {
          return capitalizeFirstLetter(data);
        },
      },
      {
        title: "Time",
        data: "date",
        render: function (data, type, row) {
          return `<span style='display:none'>${data?.slice(
            data.length - 8,
            data.length
          )}</span>
          ${timeformatam(data?.slice("-8", "-6"), data?.slice("-6", "-3"))}`;
        },
      },
      {
        title: "Verified",
        data: "verified",
        className: "hidden-xs",
        render: function (data, type, row) {
          $($("#" + row.alert_id).children()[5]).addClass(
            `${row.alert_id}_verified`
          );
          return `<span class='${data}'>
          ${capitalizeFirstLetter(data)} 
          </span>`;
        },
      }
      // {
      //   title: "Status",
      //   data: "qrt_frontend_status",

      //   render: function (data, type, row) {
      //     $($("#" + row.alert_id).children()[5]).addClass(
      //       `${row.alert_id}_status`
      //     );
      //     if (row.verified == "false") {
      //       return "-";
      //     }
      //     switch (data) {
      //       case "pending":
      //         return "Pending";
      //       case "assigned":
      //         return "Assigned to QRT";
      //       case "accepted":
      //         return "Accepted by QRT";
      //       case "reached":
      //         return "QRT Reached";
      //       case "escalated":
      //         return "QRT Escalated";
      //       case "resolved":
      //         return "Resolved";
      //       default:
      //         return "-";
      //     }
      //   },
      // },
      // {
      //   title: "User",
      //   data: "assigned_to",
      //   render: function (data, type, row) {
      //     return data.trim() == "" ? "-" : data;
      //   },
      // },
      // {
      //   title: "Verified",
      //   data: "verified",
      //   className: "hidden-xs",
      //   render: function (data, type, row) {
      //     $($("#" + row.alert_id).children()[6]).addClass(
      //       `${row.alert_id}_verified`
      //     );
      //     return `<span class='${data}'>
      //     ${capitalizeFirstLetter(data)} 
      //     </span>`;
      //   },
      // },
    ],
    columnDefs: [
      {
        targets: [0, 1, 2, 3, 4, 5],
        orderable: false,
      },
    ],
  });
}

function getAlertsByQuery(e) {
  $("#count_span_P1").remove();
  $("#count_span_P2").remove();
  $("#count_span_P3").remove();
  $(".page-500").hide();
  if ($(e).attr("query") == "realtime") {
    type = "realtime";
    onload_Alerts(priorityvalueAlerts, "pending");
    $(".findalerts").hide();
  } else {
    dateNow =
      d.getFullYear() +
      "-" +
      (("" + month).length < 2 ? "0" : "") +
      month +
      "-" +
      (("" + day).length < 2 ? "0" : "") +
      day;

    $("#dateDesk").val(dateNow);

    type = "history";
    $(".findalerts").show();

    onload_All_Alerts(priorityvalueAlerts, "pending");
  }
}
