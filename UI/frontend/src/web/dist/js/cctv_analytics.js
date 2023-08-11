var testData,
  lineData,
  previewLineData,
  previewLineChart,
  pieSelect = d3.select("#sources-chart-pie"),
  pieFooter = d3.select("#data-chart-footer"),
  fromdate,
  todate,
  previewfromdate,
  previewtodate,
  initalized = 0,
  preventcity = 0,
  preventarea = 0, userStatus;
var base_url;
$.get("/ip", function (ip) {
  base_url = ip;
});

  userStatus = userloginstatus

function capitalizeFirstLetter(string) {
  if (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  } else {
    return string;
  }
}
function nothumbnail(e) {
  e.src = "img/nothumbnail.png";
  e.title = "No Thumbnail";
}
$(".footer").show();
$(".select2").each(function () {
  $(this).select2($(this).data());
});
var today = new Date($.now());
var onemonthprev = new Date(new Date().setDate(new Date().getDate() - 30));

$(".datepickerinp").on("dp.change", function () {
  if ($("a[data-action='togglePicker'] span").hasClass("glyphicon-time")) {
    $($("a[data-action='togglePicker']")[0]).trigger("click");
  }
});

$("#fromdate").datetimepicker({
  format: "YYYY-MM-DD HH:mm:ss",
  toolbarPlacement: "bottom",
  showClose: true,
  keyBinds: {
    escape: null,
    up: null,
    down: null,
    right: null,
    left: null,
  },
  maxDate: today,
  defaultDate: null,
  // debug: true,
});

$("#fromdate").val(formatDateTime(onemonthprev));

$("#todate").datetimepicker({
  format: "YYYY-MM-DD HH:mm:ss",
  toolbarPlacement: "bottom",
  showClose: true,
  keyBinds: {
    escape: null,
    up: null,
    down: null,
    right: null,
    left: null,
  },
  maxDate: today,
  minDate: new Date($("#fromdate").val()),
  defaultDate: null,
});
$("#fromdatepreview").datetimepicker({
  format: "YYYY-MM-DD HH:mm:ss",
  toolbarPlacement: "bottom",
  showClose: true,
  keyBinds: {
    escape: null,
    up: null,
    down: null,
    right: null,
    left: null,
  },
  // format: "YYYY-MM-DD",
  maxDate: today,
  defaultDate: null,
});
$("#todatepreview").datetimepicker({
  format: "YYYY-MM-DD HH:mm:ss",
  toolbarPlacement: "bottom",
  showClose: true,
  keyBinds: {
    escape: null,
    up: null,
    down: null,
    right: null,
    left: null,
  },
  maxDate: today,
  minDate: new Date($("#fromdatepreview").val()),
  defaultDate: null,
});
function anaqrtimageerror(e) {
  $(e).hide();
  $("#qrt_map_container").removeClass("col-lg-8").addClass("col-lg-12");
}

function timeformatam(hh, mm) {
  var hour = Number(hh);
  var suffix = hour >= 12 ? "PM" : "AM";
  var hours = ((hour + 11) % 12) + 1 + mm + " " + suffix;
  return hours;
}
function formatDatetable(date) {
  var datearray = date.split("/");
  var newdate = datearray[1] + "/" + datearray[0] + "/20" + datearray[2];
  return newdate;
  // return date;
}
function formatQrtDate(date) {
  if (date) {
    var datearray = date.split("/");
    var newdate =
      datearray[0] + "/" + datearray[1] + "/20" + datearray[2].trim();
    return newdate;
  }
  return "";
}
function datesorting(date) {
  var datearray = date.split("/");
  return datearray[2].trim() + datearray[0] + datearray[1];
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
        formatDatetable(assign.slice("0", "-8")) +
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
        formatDatetable(assign.slice("0", "-8")) +
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
          formatQrtDate(accept.slice("0", "-8")) +
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
        formatDatetable(assign.slice("0", "-8")) +
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
          formatQrtDate(accept.slice("0", "-8")) +
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
          formatQrtDate(reach.slice("0", "-8")) +
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
        formatDatetable(assign.slice("0", "-8")) +
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
          formatQrtDate(accept.slice("0", "-8")) +
          " " +
          timeformatam(accept.slice("-8", "-6"), accept.slice("-6", "-3"))
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
          formatQrtDate(reach.slice("0", "-8")) +
          " " +
          timeformatam(reach.slice("-8", "-6"), reach.slice("-6", "-3"))
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
          formatQrtDate(resolve.slice("0", "-8")) +
          " " +
          timeformatam(resolve.slice("-8", "-6"), resolve.slice("-6", "-3"))
      );
    }, 1500);
  }
  $('[data-toggle="tooltip"]').tooltip({ html: "false" });
}
$("#state").on("change", function () {
  var selectedstate = $(this).val();
  if (selectedstate != "") {
    resetcities();
    getCities(selectedstate);
    resetareas();
    preventcity = 1;
    preventarea = 1;
    // getAnalytics();
  } else {
    resetcities();
    resetareas();
    preventcity = 1;
    preventarea = 1;
    // getAnalytics();
  }
  if (initalized == 0) {
    // console.log("state change initial");
    getAnalytics("initial");
  } else {
    // console.log("state change manual");
    setTimeout(function () {
      getAnalytics();
    }, 100);
  }
  initalized = 1;
});
$("#city").on("change", function () {
  var selectedcity = $(this).val();
  var selectedstate = $("#state").val();
  if (selectedcity != "") {
    resetareas();
    preventarea = 1;
    getAreas(selectedstate, selectedcity);
    // getAnalytics();
  } else {
    resetareas();
    // getAnalytics();
  }
  if (preventcity != 1) {
    // console.log("city change manual" + preventcity);
    getAnalytics();
  } else {
    preventcity = 0;
  }
});
$("#area").on("change", function () {
  if (preventarea != 1) {
    // console.log("area change manual" + preventarea);
    getAnalytics();
  } else {
    preventarea = 0;
  }
});
$("#duration").on("change", function () {
  var days = $(this).val();
  var today = new Date(),
    d = new Date();
  d.setDate(d.getDate() - days);
  $("#todate").val(formatDate(today));
  $("#fromdate").val(formatDate(d));
  // console.log(d);

  getAnalytics();
});

$("#durationPreview").on("change", function () {
  var days = $(this).val();
  var today = new Date(),
    d = new Date();
  d.setDate(d.getDate() - days);
  $("#todatepreview").val(formatDate(today));
  $("#fromdatepreview").val(formatDate(d));
  // console.log("duration change manual");
  // getAnalytics();
  filterpreview();
});

$("#priority").on("change", function () {
  $("#priority").val($(this).val());
  openpreview($("#selectedpreview").val());
  // filterpreview();
  //
});

$("#fromdate").blur(function () {
  $("#todate").datetimepicker("destroy");
  $("#todate").datetimepicker({
    format: "YYYY-MM-DD HH:mm:ss",
    toolbarPlacement: "bottom",
    showClose: true,
    keyBinds: {
      escape: null,
      up: null,
      down: null,
      right: null,
      left: null,
    },
    maxDate: new Date($.now()),
    minDate: new Date($("#fromdate").val()),
    defaultDate: null,
  });
  if ($("#fromdate").val() == localStorage.getItem("fromdateanalytics")) {
    // console.log($("#fromdate").val())
  } else {
    localStorage.setItem("fromdateanalytics", $("#fromdate").val());
    getAnalytics();
  }
});
$("#todate").blur(function () {
  $("#fromdate").val();
  $("#todate").val();

  if ($("#todate").val() == localStorage.getItem("todateanalytics")) {
    // console.log($("#todate").val());
    // localStorage.setItem('fromdateanalytics',formatDate(fromdate))
  } else {
    localStorage.setItem("todateanalytics", $("#todate").val());
    getAnalytics();
  }
});

$("#fromdatepreview").blur(function () {
  $("#todatepreview").datetimepicker("destroy");
  $("#todatepreview").datetimepicker({
    format: "YYYY-MM-DD HH:mm:ss",
    toolbarPlacement: "bottom",
    showClose: true,
    keyBinds: {
      escape: null,
      up: null,
      down: null,
      right: null,
      left: null,
    },
    maxDate: new Date($.now()),
    minDate: new Date($("#fromdatepreview").val()),
    defaultDate: null,
  });
  if (
    $("#fromdatepreview").val() ==
    localStorage.getItem("fromdateanalyticspreview")
  ) {
    // console.log($("#fromdatepreview").val());
    // localStorage.setItem('fromdateanalytics',formatDate(fromdate))
  } else {
    localStorage.setItem(
      "fromdateanalyticspreview",
      $("#fromdatepreview").val()
    );
    filterpreview();
  }
});
$("#todatepreview").blur(function () {
  if (
    $("#todatepreview").val() == localStorage.getItem("todateanalyticspreview")
  ) {
    // console.log($("#todatepreview").val());
    // localStorage.setItem('fromdateanalytics',formatDate(fromdate))
  } else {
    localStorage.setItem("todateanalyticspreview", $("#todatepreview").val());
    filterpreview();
  }
  // filterpreview();
});

function resetcities() {
  $("#city").html('<option value="">-Select State First-</option>');
}
function resetareas() {
  $("#area").html('<option value="">-Select City First-</option>');
}
function getStates() {
  $.ajax({
    url: "/getstatelist",
    type: "GET",

    success: function (data) {
      if (typeof data == "string") {
        logout();
      }
      $("#state").empty();
      var res = data;
      $("#state").append('<option value="">-Select State-</option>');
      $.each(res.state_list, function (key, val) {
        $("#state").append("<option value='" + val + "'>" + val + "</option>");
      });
      $("#state").trigger("change");
    },
  });
}

function getPriority() {
  $.ajax({
    url: "/getprioritylist",
    type: "GET",
    success: function (data) {
      if (typeof data == "string") {
        logout();
      }
      var res = data;
      $("#priority").html("");
      $("#priority").append("<option value=''>All</option>");

      $.each(res.priority_list, function (key, val) {
        $("#priority").append(
          "<option value='" + val + "'>" + val + "</option>"
        );
      });
      // $("#priority").trigger("change");
    },
  });
}

function getCities(state) {
  $.ajax({
    url: "/getcitylist?state=" + state,
    type: "GET",
    success: function (data) {
      if (typeof data == "string") {
        logout();
      }
      var res = data;
      $("#city").html("");
      $("#city").append("<option value=''>-Select City-</option>");

      $.each(res.city_list, function (key, val) {
        $("#city").append("<option value='" + val + "'>" + val + "</option>");
      });
      $("#city").trigger("change");
    },
  });
}

function getAreas(state, city) {
  $.ajax({
    url: "/getlocationlist?state=" + state + "&city=" + city,
    type: "GET",

    success: function (data) {
      if (typeof data == "string") {
        logout();
      }
      var res = data;
      $("#area").html("");
      $("#area").append("<option value=''>-Select Location-</option>");

      $.each(res.location_list, function (key, val) {
        $("#area").append("<option value='" + val + "'>" + val + "</option>");
      });
      $("#area").trigger("change");
    },
  });
}
function getAnalytics(phase) {
  $("#state").prop("disabled", true);

  $("#city").prop("disabled", true);
  $("#area").prop("disabled", true);
  $("#duration").prop("disabled", true);
  $("#fromdate").prop("disabled", true);
  $("#todate").prop("disabled", true);
  // $(".loader").show();
  $("#datatable-table").addClass("datatableloader").show();
  if ($.fn.DataTable.isDataTable("#datatable-table")) {
    $("#datatable-table").DataTable().destroy();
    $("#homelandtable_head").empty();
    $("#homelandtable_body").empty();
    $("#homelandtable_head").html("");
    $("#homelandtable_body").html("");
    $("#sources-chart-pie").html("<svg></svg>");
    $("#data-chart-footer").html("");
    $("#sources-chart-line").html("<svg></svg>");
  }
  // $(".table_data_chart").addClass("large");

  // $("#analytics_card").hide();
  $(".loader-wrap-spin").show();
  $(".nv-noData").hide();

  $("#nodatatable").remove();
  $("#previewscreen").hide();
  $("#mainscreen").show();
  var state = $("#state").val(),
    city = $("#city").val(),
    area = $("#area").val(),
    from = $("#fromdate").val(),
    to = $("#todate").val(),
    firstcolumn,
    footer;
  if (state == "") {
    firstcolumn = "State";
    footer = "States";
  } else if (city == "") {
    firstcolumn = "City";
    footer = "Cities";
  } else if (area == "") {
    firstcolumn = "Location";
    footer = "Locations";
  } else {
    firstcolumn = "Camera Name";
    footer = "Camera's";
  }

  // $("#state").prop("disabled", true);
  // $("#city").prop("disabled", true);
  // $("#area").prop("disabled", true);
  $(".page-500").hide();

  $.ajax({
    url: "/getanalyticsdata",
    type: "POST",
    async: true,
    crossDomain: true,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
    },
    processData: false,
    data: JSON.stringify({
      state: state,
      city: city,
      location: area,
      from_alert_date: from,
      to_alert_date: to,
    }),
    success: function (data) {
      $("#state").prop("disabled", false);

      $("#city").prop("disabled", false);
      $("#area").prop("disabled", false);
      $("#duration").prop("disabled", false);
      $("#fromdate").prop("disabled", false);
      $("#todate").prop("disabled", false);
      if (typeof data == "string") {
        logout();
      }

      if (data.Failure) {
        if (data.Failure == "Server side error, Please try again later") {
          $(".datatableloader").removeClass("datatableloader").hide();
          $(".page-500").show();
        }

        Messenger().post({
          message: data.Failure,
          type: "error",
          showCloseButton: true,
        });
      } else {
        var res = data.data;
        var html = "";
        $("#analytics_card").show();
        $("#alert_card_count").text(res.alert_count);
        $("#atm_card_count").text(res.cam_count);
        // $("#state_card_count").text(res.state_count);
        $("#city_card_count").text(res.location_count);
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
        // $(".table_data_chart").removeClass("large");
        if (res.table_data.length > 0) {
          $.each(res.table_data, function (key, value) {
            var isEmpty = true;
            html = "<tr style='height:48px !important'>";
            html += "<td>" + value.name + "</td>";
            if (key == 0) {
              $("#homelandtable_head").empty();
              // $("#homelandtable_head").css("background", "#212936");
              $("#homelandtable_head").append("<th>" + firstcolumn + "</th>");
              $.each(value.values, function (keychild, valuechild) {
                if (valuechild[Object.keys(valuechild)[0]] != 0) {
                  isEmpty = false;
                }
                $("#homelandtable_head").append(
                  "<th>" + Object.keys(valuechild)[0] + "</th>"
                );
                // console.log(Object.keys(valuechild)[0]);
                html +=
                  "<td>" + valuechild[Object.keys(valuechild)[0]] + "</td>";
              });
              $("#homelandtable_head").append("<th>Preview</th>");
            } else {
              $.each(value.values, function (keychild, valuechild) {
                if (valuechild[Object.keys(valuechild)[0]] != 0) {
                  isEmpty = false;
                }
                html +=
                  "<td>" + valuechild[Object.keys(valuechild)[0]] + "</td>";
              });
            }
            if (isEmpty) {
              html +=
                "<td><button title='Open Preview' type='button' onclick='openpreview(\"" +
                value.name +
                "\")' class='btn btn-primary' disabled>Preview</button></td>";
            } else {
              html +=
                "<td><button title='Open Preview' type='button' onclick='openpreview(\"" +
                value.name +
                "\")' class='btn btn-primary'>Preview</button></td>";
            }
            html += "</tr>";
            $("#homelandtable_body").append(html);
          });
        } else {
          $("#alert_card_count").text("0");
          $("#atm_card_count").text("0");
          $("#state_card_count").text("0");
          $("#city_card_count").text("0");
          $("#nodatatable").remove();
          $("#datatable-table").before(`
        <h4 id="nodatatable" style="
    text-align: center;
    font-weight: bold;
    margin-top: 5rem;
">No Data Available.</h4>`);
        }

        $(".datatableloader").removeClass("datatableloader")

        if (html != "") {
          // $("#datatable-table").DataTable({
          //   sDom:
          //     "<'row'<'col-md-6 hidden-xs'l><'col-md-6'f>r>t<'row'<'col-md-6'i><'col-md-6'p>>",
          //   oLanguage: {
          //     sLengthMenu: "_MENU_",
          //     sInfo:
          //       "Showing <strong>_START_ to _END_</strong> of _TOTAL_ entries",
          //   },
          //   oClasses: {
          //     sFilter: "pull-right",
          //     sFilterInput: "form-control input-transparent ml-sm",
          //   },
          //   sPaginationType: "bootstrap",
          //   scrollX: true,
          // });
          $("#datatable-table").removeClass("datatableloader").show();
          $("#datatable-table").DataTable().destroy();
          var anadatatable = $("#datatable-table").dataTable({
            destroy: true,
            order: [],
            sDom: "<'row'<'col-md-6 hidden-xs'l><'col-md-6'f>r>t<'row'<'col-md-6'i><'col-md-6'p>>",
            search: {
              regex: true,
              smart: false,
            },
            oLanguage: {
              sLengthMenu: "_MENU_",
              sInfo: `Showing <strong>_START_ to _END_</strong> of _TOTAL_ ${footer}`,
              sEmptyTable: "No Data Found !!",
              sInfoEmpty: `Showing <strong>0 to _END_</strong> of _TOTAL_ ${footer}`,
              sInfoFiltered: `( Filterd from _MAX_ ${footer} )`,
              sZeroRecords: `No matching ${footer} found !!`,
            },
            oClasses: {
              sFilter: "pull-right",
              sFilterInput: "form-control input-transparent",
            },
            // scrollY: "300px",
            scrollX: true,
            scrollCollapse: true,
            autoWidth: false,
            pageLength: 5,
            lengthMenu: [5, 10, 20, 50],
            // paging: false,
            // fixedColumns: {
            //   leftColumns: 1,
            //   rightColumns: 1,
            // },
            responsive: true,
            // "aoColumns": unsortableColumns,
            sPaginationType: "bootstrap",
          });
          new $.fn.dataTable.FixedColumns(anadatatable, {
            leftColumns: 1,
            rightColumns: 1,
          });
        }
        $("div.dataTables_length select").addClass(
          "form-control input-transparent"
        );
        //making pie chart
        testData = res.pie_data;
        // console.log(testData);
        var color = [],
          i = 0;

        $.each(testData, function (key, value) {
          color[Object.keys(value)[0]] = COLOR_VALUES[i];
          i++;
        });
        // console.log(color);
        lineData = [];
        if (
          Array.isArray(res.date_data) &&
          res.date_data.length &&
          phase === "initial"
        ) {
          fromdate = new Date(Object.keys(res.date_data[0].values[0])[0]);
          todate = new Date(Object.keys(res.date_data[0].values[0])[0]);
        }
        $.each(res.date_data, function (key, value) {
          var dat = {};
          dat.key = value.name;
          dat.values = value.values;
          dat.color = color[value.name];
          lineData.push(dat);
          if (phase === "initial") {
            $.each(value.values, function (subbkey, subbvalue) {
              var d1 = new Date(Object.keys(subbvalue)[0]);
              if (dates.compare(fromdate, d1) > 0) {
                fromdate = d1;
              }
              if (dates.compare(d1, todate) > 0) {
                todate = d1;
              }
            });
          }
        });
        if (phase === "initial") {
          localStorage.setItem("fromdateanalytics", formatDate(fromdate));
          localStorage.setItem("todateanalytics", formatDate(todate));

          // $("#fromdate").val(formatDate(fromdate));
          // $("#todate").val(formatDate(todate));
        }
        // console.log(lineData);
        createPieChart();
        createlinechart();
        // $(".loader").hide();
        $(".loader-wrap-spin").hide();
        $(".nv-noData").show();
      }
    },
    error: function (error) {
      $(".loader-wrap-spin").hide();
      $(".nv-noData").show();
      if (error.status == 500) {
        Messenger().post({
          message: "Server side error, Please try again later",
          type: "error",
          showCloseButton: true,
        });
      } else if (error.status == 404) {
        Messenger().post({
          message: "Not Found, Please try again later",
          type: "error",
          showCloseButton: true,
        });
      } else {
        Messenger().post({
          message: "Some error occurred, Please try later",
          type: "error",
          showCloseButton: true,
        });
      }
    },
  });
}

function createPieChart() {
  $("#data-chart-footer").html("");
  nv.addGraph(function () {
    /*
     * we need to display total amount of visits for some period
     * calculating it
     * pie chart uses y-property by default, so setting sum there.
     */

    for (var i = 0; i < testData.length; i++) {
      testData[i].y = testData[i][Object.keys(testData[i])[0]];
    }

    var chart = nv.models
      .pieChartTotal()
      .x(function (d) {
        return Object.keys(d)[0];
      })
      .margin({ top: 0, right: 20, bottom: 20, left: 20 })
      .values(function (d) {
        return d;
      })
      .valueFormat(d3.format(".0f"))
      .color(COLOR_VALUES)
      .showLabels(false)
      .showLegend(false)
      .tooltipContent(function (key, y, e, graph) {
        return "<h4>" + key + "</h4>" + "<p>" + y + "</p>";
      })
      .total(function (count) {
        // return "<div class='visits'>" + count + "<br/> Events </div>";
      })
      .donut(false);
    chart.pie.margin({ top: 25, bottom: -20 });

    var sum = d3.sum(testData, function (d) {
      return d.y;
    });
    $(".controls").remove();
    pieFooter
      .append("div")
      .classed("controls", true)
      .selectAll("div")
      .data(testData)
      .enter()
      .append("div")
      .classed("control", true)
      .style("border-left", function (d, i) {
        return "3px solid " + COLOR_VALUES[i];
      })
      .html(function (d) {
        return "<div class='key'>" + Object.keys(d)[0] + "</div>";
      })
      .on("click", function (d) {
        pieChartUpdate.apply(this, [d]);
        setTimeout(function () {
          lineChart.update();
        }, 100);
      });

    d3.select("#sources-chart-pie svg")
      .datum([testData])
      .transition(500)
      .call(chart);

    pieChart = chart;

    return chart;
  });
}

function pieChartUpdate(d) {
  d.disabled = !d.disabled;

  $.each(lineData, function (key, value) {
    if (value.key == Object.keys(d)[0]) {
      if (lineData[key].disabled) {
        lineData[key].disabled = false;
      } else {
        lineData[key].disabled = true;
      }
    }
  });

  d3.select(this).classed("disabled", d.disabled);
  if (
    !pieChart.pie
      .values()(testData)
      .filter(function (d) {
        return !d.disabled;
      }).length
  ) {
    pieChart.pie
      .values()(testData)
      .map(function (d) {
        d.disabled = false;
        return d;
      });
    pieChart.pie
      .values()(lineData)
      .map(function (d) {
        d.disabled = false;
        return d;
      });
    pieFooter.selectAll(".control").classed("disabled", false);
  }
  d3.select("#sources-chart-pie svg").transition().call(pieChart);
}
function previewPieChartUpdate(d, data) {
  d.disabled = !d.disabled;
  $.each(previewLineData, function (key, value) {
    if (value.key == Object.keys(d)[0]) {
      if (previewLineData[key].disabled) {
        previewLineData[key].disabled = false;
      } else {
        previewLineData[key].disabled = true;
      }
    }
  });
  d3.select(this).classed("disabled", d.disabled);
  if (
    !pieChart.pie
      .values()(data)
      .filter(function (d) {
        return !d.disabled;
      }).length
  ) {
    pieChart.pie
      .values()(data)
      .map(function (d) {
        d.disabled = false;
        return d;
      });
    pieChart.pie
      .values()(previewLineData)
      .map(function (d) {
        d.disabled = false;
        return d;
      });
    d3.select("#preview-chart-footer")
      .selectAll(".control")
      .classed("disabled", false);
  }
  d3.select("#preview-chart-pie svg").transition().call(pieChart);
}
function createlinechart() {
  nv.addGraph(function () {
    var chart = nv.models
      .lineChart()
      .x(function (d) {
        return new Date(Object.keys(d)[0]);
      })
      .y(function (d) {
        return d[Object.keys(d)[0]];
      })
      .margin({ top: 10, bottom: 25, left: 40, right: 30 })
      .showLegend(false);

    chart.yAxis.tickFormat(d3.format(",.f"));

    chart.xAxis.tickFormat(function (d) {
      return d3.time.format("%b %d")(new Date(d));
    });

    d3.select("#sources-chart-line svg")
      //.datum(sinAndCos())
      .datum(lineData)
      .transition()
      .duration(500)
      .call(chart);

    lineChart = chart;

    return chart;
  });
}
function createPreviewLinechart(data) {
  nv.addGraph(function () {
    var chart = nv.models
      .lineChart()
      .x(function (d) {
        return new Date(Object.keys(d)[0]);
      })
      .y(function (d) {
        return d[Object.keys(d)[0]];
      })
      .margin({ top: 10, bottom: 25, left: 40, right: 30 })
      .showLegend(false);

    chart.yAxis.tickFormat(d3.format(",.f"));

    chart.xAxis.tickFormat(function (d) {
      return d3.time.format("%b %d")(new Date(d));
    });

    d3.select("#preview-chart-line svg")
      //.datum(sinAndCos())
      .datum(data)
      .transition()
      .duration(500)
      .call(chart);

    PjaxApp.onResize(chart.update);
    previewLineChart = chart;

    return chart;
  });
}
function createPreviewPieChart(data) {
  $("#preview-chart-footer").html("");
  nv.addGraph(function () {
    for (var i = 0; i < data.length; i++) {
      data[i].y = data[i][Object.keys(data[i])[0]];
    }

    var chart = nv.models
      .pieChartTotal()
      .x(function (d) {
        return Object.keys(d)[0];
      })
      .margin({ top: 0, right: 20, bottom: 20, left: 20 })
      .values(function (d) {
        return d;
      })
      .valueFormat(d3.format(".0f"))
      .color(COLOR_VALUES)
      .showLabels(false)
      .showLegend(false)
      .tooltipContent(function (key, y, e, graph) {
        return "<h4>" + key + "</h4>" + "<p>" + y + "</p>";
      })
      .total(function (count) {
        // return "<div class='visits'>" + count + "<br/> Events </div>";
      })
      .donut(false);
    chart.pie.margin({ top: 30, bottom: -20 });

    var sum = d3.sum(data, function (d) {
      return d.y;
    });
    d3.select("#preview-chart-footer")
      .append("div")
      .classed("controls", true)
      .selectAll("div")
      .data(data)
      .enter()
      .append("div")
      .classed("control", true)
      .style("border-left", function (d, i) {
        return "3px solid " + COLOR_VALUES[i];
      })
      .html(function (d) {
        return "<div class='key'>" + Object.keys(d)[0] + "</div>";
      })
      .on("click", function (d) {
        previewPieChartUpdate.apply(this, [d, data]);
        setTimeout(function () {
          previewLineChart.update();
        }, 100);
      });

    d3.select("#preview-chart-pie svg")
      .datum([data])
      .transition(500)
      .call(chart);

    pieChart = chart;

    return chart;
  });
}
function createPreviewTable(data) {
  // console.log(response);

  // $("#loading-spinnerFlight").hide();

  // var response= {
  //     cam_flight_count_dict:[]
  // }
  $("#tble_cc").empty();
  $("#tble_cc").append(
    '<table id="datatable-table-alert" class="table table-striped table-hover" style="width:100%;">' +
      //   "< thead > <tr> " +
      //   "<th style='background: var(--main-bg-color);''>Alert Name</th> " +
      //   "<th>Alert ID</th>" +
      //   "<th>Atm ID</th>" +
      //   '<th class="no-sort hidden-xs">Area Name </th>' +
      //   '<th class="no-sort hidden-xs">Camera Name </th>' +
      //   "<th>Priority</th>  " +
      //   '<th class="hidden-xs" >Date </th> ' +
      //   '<th class="hidden-xs" >Time </th> ' +
      //   '<th class="hidden-xs">Evidence Clip</th>' +
      //   '<th class="hidden-xs">Resolved Details</th>' +
      // '</tr> </thead> <tbody id="allcamsDXB" ></tbody>' +
      " </table>"
  );

  // if (data.length > 0) {
  //   console.log("here");
  //   var count = 0;
  //   console.log(data[1]);
  //   $("#allcamsDXB").empty();
  //   for (i = 0; i < data.length; i++) {
  //     var alert_name;
  //     if (data[i].alert_2 == "") {
  //       alert_name = data[i].alert_1;
  //     } else {
  //       alert_name = data[i].alert_1 + " & " + data[i].alert_1;
  //     }

  //     var cityName = data[i].city + ", " + data[i].state;
  //     var thumbnail = base_url + "/nginx/" + data[i].thumbnail;
  //     count += 1;

  //     var evidence_clip = base_url + "/nginx/" + data[i].video;
  //     // data[i].video.replace(".mp4", "") +
  //     // "_p.mp4";

  //     $("#allcamsDXB").append(
  //       `<tr><td style="vertical-align: middle !important;"><a data='${JSON.stringify(
  //         data[i]
  //       )}'class="fw-semi-bold" title="Alert Name" onclick="showAlertDetails(this)" style="cursor: pointer">` +
  //         data[i].alert_1 +
  //         '</a></td><td class="hidden-xs" <span title="Alert Id" class="">' +
  //         data[i].alert_id +
  //         '</span> </td><td class="hidden-xs" <span title="ATM Id" class="">' +
  //         data[i].atm_id +
  //         '</span> </td><td class="hidden-xs" <span title="ATM Location" class="">' +
  //         capitalizeFirstLetter(data[i].location) +
  //         "</span> </td> " +
  //         '<td class="hidden-xs" <span title="Camera Name" class="">' +
  //         capitalizeFirstLetter(data[i].cam_name) +
  //         '</span> </td><td class="hidden-xs"> <span title="Alert Priority" class="">' +
  //         data[i].priority +
  //         "</span> </td> " +
  //         ' <td class="hidden-xs" ><span title="Alert Date">' +
  //         data[i].date.slice("0", "-8") +
  //         '</span></td> <td class="hidden-xs" ><span title="Alert Time">' +
  //         timeformatam(
  //           data[i].date.slice("-8", "-6"),
  //           data[i].date.slice("-6", "-3")
  //         ) +
  //         "</span></td>  " +
  //         '<td > <span class="getCamAlertsDXB" style="text-decoration:underline; cursor: pointer; color:var(--link-color);"> ' +
  //         `${
  //           evidence_clip.substring(evidence_clip.length - 7) == "/nginx/"
  //             ? "-"
  //             : evidence_clip
  //         } ` +
  //         "</span> </td><td > <span> " +
  //         `${
  //           data[i].helpdesk_resolved_status == "closed"
  //             ? "Support Message: " + data[i].comment
  //             : `QRT Name: ${data[i].qrt_name}, QRT Email: ${
  //                 data[i].qrt_email
  //               }, Accepted At: ${
  //                 data[i].qrt_details?.accepted_time
  //               }, Reached At: ${
  //                 data[i].qrt_details?.reached_time
  //               }, Resolved At: ${
  //                 data[i].qrt_details?.resolved_time
  //               }, Message: ${data[i].qrt_details?.qrt_msg}, Image: ${
  //                 data[i].qrt_details?.qrt_image.trim() == ""
  //                   ? "-"
  //                   : `${base_url}/nginx/${data[i].qrt_details?.qrt_image}`
  //               }
  //             `
  //         }` +
  //         "</span> </td></tr>"
  //     );
  //   }
  // } else {
  // }

  // var unsortableColumns = [];
  // $("#datatable-table")
  //   .find("thead th")
  //   .each(function () {
  //     if ($(this).hasClass("no-sort")) {
  //       unsortableColumns.push({ bSortable: false });
  //     } else {
  //       unsortableColumns.push(null);
  //     }
  //   });

  // var canvas = document.createElement("canvas");
  // var ctx = canvas.getContext("2d");
  // var resampledImage;

  // canvas.width = 820; // target width
  // canvas.height = 100; // target height

  // var image = new Image();
  // // document.getElementById("original").appendChild(image);

  // image.onload = function (e) {
  //   ctx.drawImage(
  //     image,
  //     0,
  //     0,
  //     image.width,
  //     image.height,
  //     0,
  //     0,
  //     canvas.width,
  //     canvas.height
  //   );
  //   // create a new base64 encoding

  //   // console.log()
  //   localStorage.setItem("base64Img", canvas.toDataURL());
  //   resampledImage = canvas.toDataURL();
  //   // document.getElementById("resampled").appendChild(resampledImage);
  // };

  // image.src = "img/pdf/img_headerPDF.png";

  // var JsonDataPDFExport = JSON.parse(localStorage.getItem("JsonForPdfData"));
  // var getCurrentDate = new Date().toLocaleString();

  // var textmessageC = "";
  // var fromDatePdf = $("#fromdatepreview").val();
  // var toDatePdf = $("#todatepreview").val();
  // var Total_Camera = localStorage.getItem("totalcountsCam");
  // var Total_Alerts = data.length;

  // if (JsonDataPDFExport.area != "") {
  //   textmessageC +=
  //     "\n\n\n\n    Location Name: " +
  //     JsonDataPDFExport.location +
  //     "    City Name: " +
  //     JsonDataPDFExport.city +
  //     "    State Name: " +
  //     JsonDataPDFExport.state +
  //     "    From : " +
  //     fromDatePdf +
  //     "    To: " +
  //     toDatePdf +
  //     "\n\nTotal No. of cameras: " +
  //     Total_Camera +
  //     "    Total No. of alerts: " +
  //     Total_Alerts +
  //     "\n\n";
  // } else {
  //   if (JsonDataPDFExport.location != "") {
  //     textmessageC +=
  //       "\n\n\n\n    Location Name: " +
  //       JsonDataPDFExport.location +
  //       "    City Name: " +
  //       JsonDataPDFExport.city +
  //       "    State Name: " +
  //       JsonDataPDFExport.state +
  //       "    From : " +
  //       fromDatePdf +
  //       "    To: " +
  //       toDatePdf +
  //       "\n\nTotal No. of cameras: " +
  //       Total_Camera +
  //       "    Total No. of alerts: " +
  //       Total_Alerts +
  //       "\n\n";
  //   } else {
  //     // textmessageC += "\n\n Camera Name: "+JsonDataPDFExport.area+"Camera State: "+JsonDataPDFExport.state+"    Date:"

  //     if (JsonDataPDFExport.city != "") {
  //       textmessageC +=
  //         "\n\n\n\n    City Name: " +
  //         JsonDataPDFExport.city +
  //         "    State Name: " +
  //         JsonDataPDFExport.state +
  //         "    From: " +
  //         fromDatePdf +
  //         "    To: " +
  //         toDatePdf +
  //         "    Total No. of cameras: " +
  //         Total_Camera +
  //         "    Total No. of alerts: " +
  //         Total_Alerts +
  //         "\n\n";
  //     } else {
  //       if (JsonDataPDFExport.state != "") {
  //         textmessageC +=
  //           "\n\n\n\n    State Name: " +
  //           JsonDataPDFExport.state +
  //           "    From: " +
  //           fromDatePdf +
  //           "    To: " +
  //           toDatePdf +
  //           "    Total No. of cameras: " +
  //           Total_Camera +
  //           "    Total No. of alerts: " +
  //           Total_Alerts +
  //           "\n\n";
  //       } else {
  //       }
  //     }
  //   }
  // }

  // console.log(resampledImage);

  var analaertsdattable = $("#datatable-table-alert").dataTable({
    destroy: true,
    order: [],
    // "sDom": "<'row'<'col-md-6 hidden-xs'l><'col-md-6'f>r>t<'row'<'col-md-6'i><'col-md-6'p>>",
    sDom: "Bfrtip",
    search: {
      regex: true,
      smart: false,
    },
    // fixedColumns: {
    //   leftColumns: 2,
    //   rightColumns: 1,
    // },
    buttons: [
      {
        className: "downloadanalyticscsv",
        text: "Export Data In CSV",
        action: function (e, dt, node, config) {
          data = JSON.parse(localStorage.getItem("JsonForPdfData"));
          $(".downloadanalyticscsv").attr("disabled", true);
          $(".downloadanalyticscsv").css("cursor", "wait");
          $.post(
            "/downloadAlertCSV",
            { ...data, area: data.location },
            function (data) {
              if (typeof data == "string") {
                logout();
              }
              $(".downloadanalyticscsv").removeAttr("disabled");
              $(".downloadanalyticscsv").css("cursor", "pointer");
              if (data.Failure) {
                Messenger().post({
                  message: data.Failure,
                  type: "error",
                  showCloseButton: true,
                });
                return;
              }
              data = data.data
              if (data.status == "success") {
                var a = document.createElement("a");
                a.href = "http://" + data.file_path;
                a.download = "RavenAlerts.csv";
                a.click();
              } else {
                Messenger().post({
                  message: data.status,
                  type: "error",
                  showCloseButton: true,
                });
              }
            }
          );
        },
      },
    ],
    // buttons: [
    //   {
    //     extend: "pdfHtml5",
    //     exportOptions: { columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] },
    //     text: "Export Data In PDF",
    //     alignment: "center",
    //     title: " ",
    //     messageTop: textmessageC,
    //     download: "open",
    //     // orientation: 'landscape',
    //     pageSize: "A3",
    //     // customize: function (doc) {
    //     //   doc.defaultStyle.fontSize = 20; //2, 3, 4,etc
    //     //   doc.styles.tableHeader.fontSize = 20; //2, 3, 4, etc
    //     //   doc.content[2].table.widths = [ '10%',  '40%', '20%', '15%',
    //     //     '15%'];
    //     // }
    //     orientation: "landscape",
    //     customize: function (doc) {
    //       var rowCount = doc.content[2].table.body.length;
    //       var colCount = new Array();
    //       $("#datatable-table-alert")
    //         .find("tbody tr:first-child td")
    //         .each(function () {
    //           if ($(this).attr("colspan")) {
    //             for (var i = 1; i <= $(this).attr("colspan"); $i++) {
    //               colCount.push("*");
    //             }
    //           } else {
    //             colCount.push("*");
    //           }
    //         });
    //       // doc.content[2].defaultStyle.fontSize=20;
    //       // doc.content["hello"];
    //       // doc.content[2].margin = [0, 0, 0, 0];
    //       // doc.content[2].table.widths = [
    //       //   "20%",
    //       //   "10%",
    //       //   "10%",
    //       //   "6%",
    //       //   "10%",
    //       //   "6%",
    //       //   "8%",
    //       //   "6%",
    //       //   "24%",
    //       // ];
    //       // doc.content[2].table.widths = colCount;
    //       // configPDF()
    //       doc.content.splice(1, 0, {
    //         margin: [0, 0, 0, 0],
    //         alignment: "center",
    //         image: localStorage.getItem("base64Img"),
    //       });
    //     },
    //     // customize: function (doc) {
    //     //   doc.defaultStyle.fontSize = 8; //2, 3, 4,etc
    //     //   doc.styles.tableHeader.fontSize = 10; //2, 3, 4, etc
    //     //   doc.content[1].table.widths = [ '2%',  '14%', '14%', '14%',
    //     //     '14%'];
    //     // }
    //   },
    //   {
    //     extend: "csv",
    //     text: "Export Data In CSV",
    //     filename: function () {
    //       return "RavenPivotchainSolution";
    //     },
    //     className: "btn-space",
    //     exportOptions: {
    //       // orthogonal: null,
    //       columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    //     },
    //   },
    // ],
    // columnDefs: [
    //   // { targets: 6, type: "date-euro" },
    //   // { targets: 6, type: "date-extract" },
    //   // { visible: false, targets: [8, 9] },
    // ],
    // "columnDefs": [
    //   {"className": "dt-center", "targets": "_all"}
    // ],
    oLanguage: {
      sLengthMenu: "_MENU_",
      sInfo: "Showing <strong>_START_ to _END_</strong> of _TOTAL_ Alerts",
      sEmptyTable: "No Data Found !!",
      sProcessing: ``,
      sInfoEmpty: "Showing <strong>0 to _END_</strong> of _TOTAL_ Alerts",
      sInfoFiltered: "( Filterd from _MAX_ Alerts )",
      sZeroRecords: "No matching Alerts found !!",
    },
    oClasses: {
      sFilter: "pull-right",
      sFilterInput: "form-control input-transparent",
    },
    // "aoColumns": unsortableColumns
    sPaginationType: "bootstrap",
    scrollX: true,

    processing: true,
    serverSide: true,
    paging: true,
    ajax: {
      type: "POST",
      url: "/getanalyticsdatapreview",
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      data: function (data) {
        return JSON.stringify({
          ...data,
          // priority: "P1",
          // date: "2022-06-27",
          // status: "pending",
          ...JsonForPdf,
        });
      },
      complete: function (data) {
        $(".previewtableloader").hide();
        return data.data;
      },
      error: function (response) {
        console.log(response);
      },
    },

    columns: [
      {
        title: "Alert Name",
        data: "alert_1",
        render: function (data, type, row) {
          return `<a data='${JSON.stringify(
            row
          )} 'class="fw-semi-bold" title="Alert Name" onclick="showAlertDetails(this)" style="cursor: pointer">
          ${row.alert_1}</a>`;
        },
      },
      { title: "Alert Id", data: "alert_id" },
      {
        title: " Camera Name",
        data: "cam_name",
        render: function (data, type, row) {
          return data;
        },
      },
      {
        title: "Area Name",
        data: "location",
        render: function (data, type, row) {
          return capitalizeFirstLetter(data);
        },
      },
      {
        title: "Camera Name",
        data: "cam_name",
        render: function (data, type, row) {
          return `${capitalizeFirstLetter(data)}`;
        },
      },
      {
        title: "Priority",
        data: "priority",
      },
      {
        title: "Date",
        data: "date",
        render: function (data, type, row) {
          return data.slice("0", "-8");
        },
      },
      {
        title: "Time",
        data: "date",
        render: function (data, type, row) {
          return timeformatam(data.slice("-8", "-6"), data.slice("-6", "-3"));
        },
      },
    ],
    columnDefs: [
      {
        targets: [0, 1, 2, 3, 4, 5, 6, 7],
        orderable: false,
      },
    ],
  });





  if(userStatus == "support"){
    $(".downloadanalyticscsv").remove()
  }

  new $.fn.dataTable.FixedColumns(analaertsdattable, {
    leftColumns: 1,
  });
  // $('#datatable-table-alert_length > label > select').css({"background-color": "rgba(51, 51, 51, 0.425)","border": "none"});
  $("#datatable-table-alert_length > label > select").css({
    "background-color": "rgba(51, 51, 51, 0.425)",
    border: "none",
  });
  $("#datatable-table-alert_wrapper > div.dt-buttons").css({
    display: "inline-block",
    "max-width": "100%",
    "margin-bottom": "5px",
    "font-weight": "bold",
    float: "right",
  });
  // $('#datatable-table_wrapper > div.dt-buttons > button.dt-button.buttons-copy.buttons-html5').css({"border": "none", "color": "#f8f8f8", "background": "5px 5px no-repeat rgba(51, 51, 51, 0.425)", "padding": "4px", "border-radius": "2px"})
  $(
    "#datatable-table-alert_wrapper > div.dt-buttons > button.dt-button.buttons-pdf.buttons-html5"
  ).css({
    border: "none",
    color: "#f8f8f8",
    background: "5px 5px no-repeat rgba(51, 51, 51, 0.425)",
    padding: "4px",
    "border-radius": "2px",
  });
  $(
    "#datatable-table-alert_wrapper > div.dt-buttons > button.dt-button.buttons-csv.buttons-html5.btn-space"
  ).css({
    border: "none",
    color: "#f8f8f8",
    background: "5px 5px no-repeat rgba(51, 51, 51, 0.425)",
    padding: "4px",
    "border-radius": "2px",
  });
  // $('#datatable-table_wrapper > div.dt-buttons').css({""})
  $("#datatable-table-alert_filter").removeClass("pull-right");
  $("#datatable-table-alert_filter").css({ float: "left !important" });

  //   var html = "";
  //
  //   $.each(data, function (key, value) {
  //     html = "<tr>";
  //     if (key == 0) {
  //       //   if ($.fn.DataTable.isDataTable("#datatable-table")) {
  //       //     $('#datatable-table').DataTable().clear().destroy();
  //       //   }
  //
  //       $.each(value, function (keychild, valuechild) {
  //         $("#previewtable_head").append(
  //           "<th>" + keychild.toUpperCase() + "</th>"
  //         );
  //         html += "<td>" + valuechild + "</td>";
  //       });
  //     } else {
  //       $.each(value, function (keychild, valuechild) {
  //         html += "<td>" + valuechild + "</td>";
  //       });
  //     }
  //
  //     html += "</tr>";
  //     $("#previewtable_body").append(html);
  //   });
  //   if(html!=""){
  //   $("#preview-table").DataTable({
  //     sDom:
  //       "<'row'<'col-md-6 hidden-xs'l><'col-md-6'f>r>t<'row'<'col-md-6'i><'col-md-6'p>>",
  //     oLanguage: {
  //       sLengthMenu: "_MENU_",
  //       sInfo: "Showing <strong>_START_ to _END_</strong> of _TOTAL_ entries",
  //     },
  //     oClasses: {
  //       sFilter: "pull-right",
  //       sFilterInput: "form-control input-transparent ml-sm",
  //
  //     },
  //     sPaginationType: "bootstrap",
  //     scrollX: true
  //   });
  // }
  // $("div.dataTables_length select").addClass("form-control input-transparent");
  //making pie chart
}

// function configPDF(){
//
//   pdf.setFont( new CoreFont(FontFamily.HELVETICA), 11 );
//   if ( message != "" )
//   {
//     pdf.writeText(11, message+"\n");
//   }
//
// }

function openpreview(data) {
  // $(".loader").show();

  $("#tble_cc").empty();
  // $(".table_data_chart-preview").addClass("large");
  $(".loader-wrap-spin-preview").show();
  $(".previewtableloader").show();
  $(".nv-noData").hide();
  $("#preview-chart-pie").html("<svg></svg>");
  $("#preview-chart-line").html("<svg></svg>");
  $("#preview-chart-footer").html("");
  if ($.fn.DataTable.isDataTable("#preview-table")) {
    $("#preview-table").DataTable().destroy();
  }
  var breadcrumspan = "";
  // console.log(data);

  $("#previewtable_head").html("");
  $("#previewtable_body").html("");
  var state = $("#state").val(),
    city = $("#city").val(),
    location = $("#area").val(),
    from = $("#fromdate").val(),
    to = $("#todate").val(),
    area = "",
    priority = $("#priority").val();
  if (state == "") {
    state = data;
    breadcrumspan = state + ' &nbsp<i class="fa fa-angle-right fa-lg"></i>';
  } else if (city == "") {
    city = data;
    breadcrumspan =
      state +
      ' &nbsp<i class="fa fa-angle-right fa-lg"></i> &nbsp' +
      city +
      ' &nbsp<i class="fa fa-angle-right fa-lg"></i>';
  } else if (location == "") {
    location = data;
    breadcrumspan =
      state +
      ' &nbsp<i class="fa fa-angle-right fa-lg"></i> &nbsp' +
      city +
      ' &nbsp<i class="fa fa-angle-right fa-lg"></i> &nbsp' +
      location +
      ' &nbsp<i class="fa fa-angle-right fa-lg"></i>';
  } else {
    area = data;
    breadcrumspan =
      state +
      ' &nbsp<i class="fa fa-angle-right fa-lg"></i> &nbsp' +
      city +
      ' &nbsp<i class="fa fa-angle-right fa-lg"></i> &nbsp' +
      location +
      ' &nbsp<i class="fa fa-angle-right fa-lg"></i>&nbsp' +
      area;
  }
  // console.log(location);
  $("#breadcrumspan").html(breadcrumspan);
  $("#selectedpreview").val(data);

  JsonForPdf = {
    state: state,
    city: city,
    location: location,
    from_alert_date: from,
    to_alert_date: to,
    cam_name: area,
    priority: priority,
  };
  createPreviewTable();
  localStorage.setItem("JsonForPdfData", JSON.stringify(JsonForPdf));
  $.ajax({
    url: "/getanalyticspreviewcharts",
    type: "POST",
    crossDomain: true,
    async: true,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
    },
    processData: false,
    data: JSON.stringify({
      state: state,
      city: city,
      location: location,
      from_alert_date: from,
      to_alert_date: to,
      cam_name: area,
      priority: priority,
    }),

    success: function (data) {
      if (typeof data == "string") {
        logout();
      }
      if (data.Failure) {
        Messenger().post({
          message: data.Failure,
          type: "error",
          showCloseButton: true,
        });
      } else {
        $(".loader-wrap-spin-preview").hide();
        $(".nv-noData").hide();
        $(".table_data_chart-preview").removeClass("large");
        var res = data.data;

        createPreviewPieChart(res.pie_data);
        previewLineData = [];
        var color = [],
          i = 0;
        $.each(res.pie_data, function (key, value) {
          color[Object.keys(value)[0]] = COLOR_VALUES[i];
          i++;
        });
        if (Array.isArray(res.date_data) && res.date_data.length) {
          previewfromdate = new Date(
            Object.keys(res.date_data[0].values[0])[0]
          );
          previewtodate = new Date(Object.keys(res.date_data[0].values[0])[0]);
        }
        // console.log(color);
        // console.log(res);
        $.each(res.date_data, function (key, value) {
          var dat = {};
          dat.key = value.name;
          dat.values = value.values;
          dat.color = color[value.name];
          previewLineData.push(dat);
          $.each(value.values, function (subbkey, subbvalue) {
            var d1 = new Date(Object.keys(subbvalue)[0]);
            if (dates.compare(previewfromdate, d1) > 0) {
              previewfromdate = d1;
            }
            if (dates.compare(d1, previewtodate) > 0) {
              previewtodate = d1;
            }
          });
        });
        if (Array.isArray(res.date_data) && res.date_data.length) {
          localStorage.setItem(
            "todateanalyticspreview",
            formatDate(previewtodate)
          );
          localStorage.setItem(
            "fromdateanalyticspreview",
            formatDate(previewfromdate)
          );
          $("#fromdatepreview").val($("#fromdate").val());
          // $("#todatepreview").val(formatDate(previewtodate));
        }
        createPreviewLinechart(previewLineData);
        localStorage.setItem("totalcountsCam", res.cam_count);
        // createPreviewTable(res.table_data);
        $(".loader").hide();
      }
    },
  });
  $("#previewscreen").show();
  $("#mainscreen").hide();
}
function openhomeland() {
  $("#previewscreen").hide();
  $("#mainscreen").show();
  setTimeout(()=>{
  window.dispatchEvent(new Event('resize'));

  },200)
}
/* Bootstrap style pagination control */
$.extend($.fn.dataTableExt.oPagination, {
  bootstrap: {
    fnInit: function (oSettings, nPaging, fnDraw) {
      var oLang = oSettings.oLanguage.oPaginate;
      var fnClickHandler = function (e) {
        e.preventDefault();
        if (oSettings.oApi._fnPageChange(oSettings, e.data.action)) {
          fnDraw(oSettings);
        }
      };

      $(nPaging).append(
        '<ul class="pagination no-margin">' +
          '<li class="prev disabled"><a href="#">' +
          oLang.sPrevious +
          "</a></li>" +
          '<li class="next disabled"><a href="#">' +
          oLang.sNext +
          "</a></li>" +
          "</ul>"
      );
      var els = $("a", nPaging);
      $(els[0]).bind("click.DT", { action: "previous" }, fnClickHandler);
      $(els[1]).bind("click.DT", { action: "next" }, fnClickHandler);
    },

    fnUpdate: function (oSettings, fnDraw) {
      var iListLength = 5;
      var oPaging = oSettings.oInstance.fnPagingInfo();
      var an = oSettings.aanFeatures.p;
      var i,
        ien,
        j,
        sClass,
        iStart,
        iEnd,
        iHalf = Math.floor(iListLength / 2);

      if (oPaging.iTotalPages < iListLength) {
        iStart = 1;
        iEnd = oPaging.iTotalPages;
      } else if (oPaging.iPage <= iHalf) {
        iStart = 1;
        iEnd = iListLength;
      } else if (oPaging.iPage >= oPaging.iTotalPages - iHalf) {
        iStart = oPaging.iTotalPages - iListLength + 1;
        iEnd = oPaging.iTotalPages;
      } else {
        iStart = oPaging.iPage - iHalf + 1;
        iEnd = iStart + iListLength - 1;
      }

      for (i = 0, ien = an.length; i < ien; i++) {
        // Remove the middle elements
        $("li:gt(0)", an[i]).filter(":not(:last)").remove();

        // Add the new list items and their event handlers
        for (j = iStart; j <= iEnd; j++) {
          sClass = j == oPaging.iPage + 1 ? 'class="active"' : "";
          $("<li " + sClass + '><a href="#">' + j + "</a></li>")
            .insertBefore($("li:last", an[i])[0])
            .bind("click", function (e) {
              e.preventDefault();
              oSettings._iDisplayStart =
                (parseInt($("a", this).text(), 10) - 1) * oPaging.iLength;
              fnDraw(oSettings);
            });
        }

        // Add / remove disabled classes from the static elements
        if (oPaging.iPage === 0) {
          $("li:first", an[i]).addClass("disabled");
        } else {
          $("li:first", an[i]).removeClass("disabled");
        }

        if (
          oPaging.iPage === oPaging.iTotalPages - 1 ||
          oPaging.iTotalPages === 0
        ) {
          $("li:last", an[i]).addClass("disabled");
        } else {
          $("li:last", an[i]).removeClass("disabled");
        }
      }
    },
  },
});
$.fn.dataTableExt.oApi.fnPagingInfo = function (oSettings) {
  return {
    iStart: oSettings._iDisplayStart,
    iEnd: oSettings.fnDisplayEnd(),
    iLength: oSettings._iDisplayLength,
    iTotal: oSettings.fnRecordsTotal(),
    iFilteredTotal: oSettings.fnRecordsDisplay(),
    iPage:
      oSettings._iDisplayLength === -1
        ? 0
        : Math.ceil(oSettings._iDisplayStart / oSettings._iDisplayLength),
    iTotalPages:
      oSettings._iDisplayLength === -1
        ? 0
        : Math.ceil(oSettings.fnRecordsDisplay() / oSettings._iDisplayLength),
  };
};
function filterpreview() {
  $("#fromdate").val($("#fromdatepreview").val());
  $("#todate").val($("#todatepreview").val());
  openpreview($("#selectedpreview").val());
}
// getStates();
// getAnalytics();

//  Source: http://stackoverflow.com/questions/497790
var dates = {
  convert: function (d) {
    // Converts the date in d to a date-object. The input can be:
    //   a date object: returned without modification
    //  an array      : Interpreted as [year,month,day]. NOTE: month is 0-11.
    //   a number     : Interpreted as number of milliseconds
    //                  since 1 Jan 1970 (a timestamp)
    //   a string     : Any format supported by the javascript engine, like
    //                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.
    //  an object     : Interpreted as an object with year, month and date
    //                  attributes.  **NOTE** month is 0-11.
    return d.constructor === Date
      ? d
      : d.constructor === Array
      ? new Date(d[0], d[1], d[2])
      : d.constructor === Number
      ? new Date(d)
      : d.constructor === String
      ? new Date(d)
      : typeof d === "object"
      ? new Date(d.year, d.month, d.date)
      : NaN;
  },
  compare: function (a, b) {
    // Compare two dates (could be of any type supported by the convert
    // function above) and returns:
    //  -1 : if a < b
    //   0 : if a = b
    //   1 : if a > b
    // NaN : if a or b is an illegal date
    // NOTE: The code inside isFinite does an assignment (=).
    return isFinite((a = this.convert(a).valueOf())) &&
      isFinite((b = this.convert(b).valueOf()))
      ? (a > b) - (a < b)
      : NaN;
  },
  inRange: function (d, start, end) {
    // Checks if date in d is between dates in start and end.
    // Returns a boolean or NaN:
    //    true  : if d is between start and end (inclusive)
    //    false : if d is before start or after end
    //    NaN   : if one or more of the dates is illegal.
    // NOTE: The code inside isFinite does an assignment (=).
    return isFinite((d = this.convert(d).valueOf())) &&
      isFinite((start = this.convert(start).valueOf())) &&
      isFinite((end = this.convert(end).valueOf()))
      ? start <= d && d <= end
      : NaN;
  },
};
function formatDate(date) {
  // var d = new Date(date),
  //   month = "" + (d.getMonth() + 1),
  //   day = "" + d.getDate(),
  //   year = d.getFullYear();
  // if (month.length < 2) month = "0" + month;
  // if (day.length < 2) day = "0" + day;
  // return [year, month, day].join("-");

  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();
  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  var hour = d.getHours() + ":";
  var minute =
    d.getMinutes().toString().length < 2
      ? "0" + d.getMinutes()
      : d.getMinutes();
  var second = ":" + d.getSeconds();
  var time = hour + minute + second;
  return [year, month, day].join("-") + " " + time;
}

function formatDateTime(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();
  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  var hour = d.getHours() + ":";
  var minute =
    d.getMinutes().toString().length < 2
      ? "0" + d.getMinutes()
      : d.getMinutes();
  var second = ":" + d.getSeconds();
  var time = hour + minute + second;
  return [year, month, day].join("-") + " " + time;
}

getStates();
getPriority();

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

      var map = L.map("qrt_map", {
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
          Number(rowData?.qrt_details?.lat_1),
          Number(rowData?.qrt_details?.long_1),
        ],
        {
          icon: blueIcon,
        }
      ).addTo(map);
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
        ).addTo(map);
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
          ).addTo(map);
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
        }).addTo(map);

        $($(".qrt_mappath").parents("svg"))
          .css("height", "auto")
          .css("width", "auto");
        map.fitBounds(polyline.getBounds());
      }
    }
  }, 500);
}
//click any alert to play alert
function showAlertDetails(e) {
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
  $("#voi_deatils_text").hide()

  var numberplateimg = "http://" + base_url + "/nginx/" + rowData.number_plate
  var alert_name =
    rowData.alert_2 !== ""
      ? rowData.alert_1 + " | " + rowData.alert_2
      : rowData.alert_1;
  var alert_id = rowData.alert_id;
  var alert_date = rowData.date.slice("0", "-8");
  var alert_time = timeformatam(
    rowData.date.slice("-8", "-6"),
    rowData.date.slice("-6", "-3")
  );
  var status =
    rowData.alert_status;
  var atm_id = rowData.atm_id;
  var camName = rowData.cam_name;
  var city = rowData.city;
  var location = rowData.location;
  var support_message = rowData.comment;
  var video_url = rowData.video;
  video_url = video_url
    ? "http://" + base_url + "/nginx/" + video_url
    : "img/video/monitoringdisabled.mp4";

  var thumbnail = "http://" + base_url + "/nginx/" + rowData.thumbnail
//   var qrt_image = base_url + "/nginx/" + rowData.qrt_details.qrt_image;
//   var qrt_name = rowData.qrt_name;
//   var qrt_status = rowData.qrt_frontend_status;
//   var qrt_message = rowData.qrt_details.qrt_msg;
//   var qrt_accepted = rowData.qrt_details.accepted_time;
//   var qrt_resolved = rowData.qrt_details.resolved_time;
//   var qrt_reached = rowData.qrt_details.reached_time;

//   if (rowData.helpdesk_resolved_status == "closed") {
//     $(".alreadyresolved").show();
//     $(".support_messagediv").show();
//   } else if (rowData.qrt_flag == "assigned") {
//     $("#qrt_details").show();
//     createQRTmap(rowData);
//     $("#qrt_map_container").removeClass("col-lg-8").addClass("col-lg-12");
//     if (rowData.qrt_details.accepted_time == " ") {
//       $(".alreadyresolved").hide();
//       $(".support_messagediv").hide();
//       $("#qrt_details").hide();
//       setTimeout(() => {
//         stepanim("1", rowData.qrt_flag_time);
//       }, 1000);
//     } else if (rowData.current_status == "accepted") {
//       $(".alreadyresolved").hide();
//       $(".support_messagediv").hide();
//       $("#qrt_name_span").show();
//       $("#qrt_status_span").show();
//       $(".qrt_message").hide();
//       $("#qrt_accepted_span").show();
//       $("#qrt_reached_span").hide();
//       $("#qrt_resolved_span").hide();
//       setTimeout(() => {
//         stepanim("2", rowData.qrt_flag_time, rowData.qrt_details.accepted_time);
//       }, 1000);
//     } else if (
//       rowData.current_status == "reached" ||
//       rowData.current_status == "escalated"
//     ) {
//       $(".alreadyresolved").hide();
//       $("#qrt_name_span").show();
//       $("#qrt_status_span").show();
//       $(".qrt_message").hide();
//       $("#qrt_accepted_span").show();
//       $("#qrt_reached_span").show();
//       $("#qrt_resolved_span").hide();
//       setTimeout(() => {
//         stepanim(
//           "3",
//           rowData.qrt_flag_time,
//           rowData.qrt_details.accepted_time,
//           rowData.qrt_details.reached_time
//         );
//       }, 1000);
//     } else if (rowData.current_status == "resolved") {
//       $(".alreadyresolved").show();
//       $("#qrt_name_span").show();
//       $("#qrt_status_span").show();
//       $(".qrt_message").show();
//       $("#qrt_accepted_span").show();
//       $("#qrt_reached_span").show();
//       $("#qrt_resolved_span").show();
//       $("#qrt_map_container").removeClass("col-lg-12").addClass("col-lg-8");
//       $($(".qrt_video").parent()).show();
//       if (!qrt_image.includes("mp4")) {
//         $(".qrt_image").attr("src", qrt_image);
//         $(".qrt_image").attr("onerror", "qrtimageerror(this)");
//         $(".qrt_image").show();
//         $(".qrt_video").hide();
//       } else {
//         $(".qrt_image").hide();
//         $(".qrt_video").attr("src", qrt_image);
//         $(".qrt_video").show();
//       }
//       setTimeout(() => {
//         stepanim(
//           "4",
//           rowData.qrt_flag_time,
//           rowData.qrt_details.accepted_time,
//           rowData.qrt_details.reached_time,
//           rowData.qrt_details.resolved_time
//         );
//       }, 1000);
//     }
//   }

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

//   $("#support_message").append(support_message);
//   $(".qrt_name").append(capitalizeFirstLetter(qrt_name));
//   $(".qrt_status").append(capitalizeFirstLetter(qrt_status));
//   $(".qrt_message").append(qrt_message);
//   $(".qrt_accepted").append(
//     formatQrtDate(qrt_accepted.slice("0", "-8")) +
//       " " +
//       timeformatam(
//         qrt_accepted.slice("-8", "-6"),
//         qrt_accepted.slice("-6", "-3")
//       )
//   );
//   $(".qrt_reached").append(
//     formatQrtDate(qrt_reached.slice("0", "-8")) +
//       " " +
//       timeformatam(qrt_reached.slice("-8", "-6"), qrt_reached.slice("-6", "-3"))
//   );
//   $(".qrt_resolved").append(
//     formatQrtDate(qrt_resolved.slice("0", "-8")) +
//       " " +
//       timeformatam(
//         qrt_resolved.slice("-8", "-6"),
//         qrt_resolved.slice("-6", "-3")
//       )
//   );


  changeSource(video_url, thumbnail);
  $("#showAlertDetailsModal").modal("show");
//   setTimeout(() => {
//     $("#qrt_map").css("height", $(".qrt_image").height() + "px");
//   }, 150);
}


//close modal box
close_modal = function () {
  document.getElementById("videoAlerts").pause();
};

$(".col_div")
  .parent()
  .each(function () {
    var height = 0,
      column = $(this).find(".col_div");
    column.each(function () {
      if ($(this).height() > height) height = $(this).height();
    });
    column.height(height);
  });

async function downloadScreenPDF() {
  await html2canvas(document.body).then((canvas) => {
    var w = document.body.offsetWidth;
    var h = document.body.offsetHeight;
    var img = canvas.toDataURL("image/jpeg", 1);
    var doc = new jspdf.jsPDF("L", "px", [w, h]);
    doc.addImage(img, "JPEG", 0, 0, w, h);
    doc.save("sample-file.pdf");
  });
}
