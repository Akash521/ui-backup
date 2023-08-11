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
  preventarea = 0,
  domain;

$.get("/ip", function (res) {
  domain = res;
});

$(".select2").each(function () {
  $(this).select2($(this).data());
});
$(".datepickerinp").datetimepicker({
  format: "YYYY-MM-DD HH:mm:ss",
  // maxDate: new Date(),
  // defaultDate: null,
  // format: "YYYY-MM-DD",
});

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
    console.log("state change initial");
    getAnalytics("initial");
  } else {
    console.log("state change manual");
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
    console.log("city change manual" + preventcity);
    getAnalytics();
  } else {
    preventcity = 0;
  }
});
$("#area").on("change", function () {
  if (preventarea != 1) {
    console.log("area change manual" + preventarea);
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
  console.log("duration change manual");
  getAnalytics();
});

$("#durationPreview").on("change", function () {
  var days = $(this).val();
  var today = new Date(),
    d = new Date();
  d.setDate(d.getDate() - days);
  $("#todatepreview").val(formatDate(today));
  $("#fromdatepreview").val(formatDate(d));
  console.log("duration change manual");
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
    console.log($("#todate").val());
    // localStorage.setItem('fromdateanalytics',formatDate(fromdate))
  } else {
    localStorage.setItem("todateanalytics", $("#todate").val());
    getAnalytics();
  }
});

$("#fromdatepreview").blur(function () {
  if (
    $("#fromdatepreview").val() ==
    localStorage.getItem("fromdateanalyticspreview")
  ) {
    console.log($("#fromdatepreview").val());
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
    console.log($("#todatepreview").val());
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
      var res = data;
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
      var res = data;
      $("#priority").html("");
      $("#priority").append("<option value=''>-Select Priority-</option>");

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
    url: "/getplantlist?state=" + state + "&city=" + city,
    type: "GET",

    success: function (data) {
      var res = data;
      $("#area").html("");
      $("#area").append("<option value=''>-Select Location-</option>");

      $.each(res.plant_list, function (key, val) {
        $("#area").append("<option value='" + val + "'>" + val + "</option>");
      });
      $("#area").trigger("change");
    },
  });
}
function getAnalytics(phase) {
  // $(".loader").show();

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
  $(".table_data_chart").addClass("large");
  $(".loader-wrap-spin").show();

  $("#previewscreen").hide();
  $("#mainscreen").show();
  var state = $("#state").val(),
    city = $("#city").val(),
    area = $("#area").val(),
    from = $("#fromdate").val(),
    to = $("#todate").val(),
    firstcolumn;
  if (state == "") {
    firstcolumn = "State";
  } else if (city == "") {
    firstcolumn = "City";
  } else if (area == "") {
    firstcolumn = "Location";
  } else {
    firstcolumn = "Area";
  }

  $("#state").prop("disabled", true);
  $("#city").prop("disabled", true);
  $("#area").prop("disabled", true);

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
      if (data.Success) {
        var res = data.data;
        var html = "";

        $(".table_data_chart").removeClass("large");
        $.each(res.table_data, function (key, value) {
          html = "<tr>";
          html += "<td>" + value.name + "</td>";
          if (key == 0) {
            $("#homelandtable_head").append("<th>" + firstcolumn + "</th>");
            $.each(value.values, function (keychild, valuechild) {
              $("#homelandtable_head").append(
                "<th>" + Object.keys(valuechild)[0] + "</th>"
              );
              console.log(Object.keys(valuechild)[0]);
              html += "<td>" + valuechild[Object.keys(valuechild)[0]] + "</td>";
            });
            $("#homelandtable_head").append("<th>Preview</th>");
          } else {
            $.each(value.values, function (keychild, valuechild) {
              html += "<td>" + valuechild[Object.keys(valuechild)[0]] + "</td>";
            });
          }
          html +=
            "<td><button type='button' onclick='openpreview(\"" +
            value.name +
            "\")' class='btn btn-primary'>Preview</button></td>";
          html += "</tr>";
          $("#homelandtable_body").append(html);
        });

        if (html != "") {
          // $("#datatable-table").dataTable({
          order: [],
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
          $("#datatable-table").dataTable({
          order: [],
            sDom: "<'row'<'col-md-6 hidden-xs'l><'col-md-6'f>r>t<'row'<'col-md-6'i><'col-md-6'p>>",

            oLanguage: {
              sLengthMenu: "_MENU_",
              sInfo:
                "Showing <strong>_START_ to _END_</strong> of _TOTAL_ entries",
            },
            oClasses: {
              sFilter: "pull-right",
              sFilterInput: "form-control input-transparent",
            },
            scrollY: "300px",
            scrollX: true,
            scrollCollapse: true,
            autoWidth: false,
            paging: false,
            fixedColumns: {
              leftColumns: 1,
              rightColumns: 1,
            },
            responsive: true,
            // "aoColumns": unsortableColumns,
            sPaginationType: "bootstrap",
            scrollX: true,
          });

          $("#state").prop("disabled", false);
          $("#city").prop("disabled", false);
          $("#area").prop("disabled", false);
        } else {
          $("#datatable-table")
            .empty()
            .append(
              "<h4 style='text-align:center;font-weight:700;'>No Data Available.</h4>"
            );
        }
        $("div.dataTables_length select").addClass(
          "form-control input-transparent"
        );
        //making pie chart
        testData = res.pie_data;
        console.log(testData);
        var color = [],
          i = 0;

        $.each(testData, function (key, value) {
          color[Object.keys(value)[0]] = COLOR_VALUES[i];
          i++;
        });
        console.log(color);
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
          if (fromdate && todate) {
            localStorage.setItem("fromdateanalytics", formatDate(fromdate));
            localStorage.setItem("todateanalytics", formatDate(todate));
            // console.log(formatDate(fromdate))
            // console.log(formatDate(todate))
            $("#fromdate").val(formatDate(fromdate));
            $("#todate").val(formatDate(todate));
          } else {
            localStorage.setItem(
              "fromdateanalytics",
              formatDate(new Date().setDate(new Date().getDate() - 30))
            );
            localStorage.setItem(
              "todateanalytics",
              formatDate(formatDate(new Date()))
            );
            // console.log(formatDate(fromdate))
            // console.log(formatDate(todate))
            $("#fromdate").val(
              formatDate(new Date().setDate(new Date().getDate() - 30))
            );
            $("#todate").val(formatDate(new Date()));
          }
          // $("#fromdate").val("2022-08-17 12:34:11");
          // $("#todate").val("2022-09-16 12:34:11");
        }
        console.log(lineData);
        createPieChart();
        createlinechart();
        // $(".loader").hide();
        $(".loader-wrap-spin").hide();
      } else {
        Messenger().post({
          message: data.Failure,
          type: "error",
          showCloseButton: true,
        });
      }
    },
    error: function (error) {
      $(".loader-wrap-spin").hide();
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
      .margin({ top: 10, bottom: 25, left: 30, right: 0 })
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
      .margin({ top: 10, bottom: 25, left: 30, right: 0 })
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

  $("#loading-spinnerFlight").hide();

  // var response= {
  //     cam_flight_count_dict:[]
  // }
  $("#tble_cc").append(
    '<table id="datatable-table-alert" class="table table-striped table-hover" style="width:100%;"> <thead> <tr> ' +
      '<th style="width:5%; text-align:left;">Id </th>' +
      '<th class="no-sort hidden-xs" style="width:10%;text-align:left;">Area Name </th>' +
      '<th class="no-sort hidden-xs" style="width:10%;text-align:left;">Camera Name </th>' +
      '<th style="width:20%; text-align:left;">Alert Name</th> ' +
      '<th style="width:10%; text-align:left;">Priority</th>  ' +
      '<th class="hidden-xs" style="width:15%; text-align:left;">Time </th> ' +
      '<th class="hidden-xs" style="width:30%; text-align:left;">Evidence Clip</th>' +
      '</tr> </thead> <tbody id="allcamsDXB" ></tbody> </table>'
  );
  if (data.length > 0) {
    console.log("here");
    var count = 0;

    for (i = 0; i < data.length; i++) {
      var event_name;
      if (data[i].alert_2 == "") {
        event_name = data[i].alert_1;
      } else {
        event_name = data[i].alert_1 + " & " + data[i].alert_1;
      }

      var cityName = data[i].city + ", " + data[i].state;

      count += 1;

      var evidence_clip = "http://" + domain + "/nginx/" + data[i].video;

      $("#allcamsDXB").append(
        '<tr><td style="width:5%; text-align:center;">' +
          count +
          "</td> " +
          '<td class="hidden-xs" style="width:10%;text-align:center;"> <span class="">' +
          data[i].location +
          "</span> </td> " +
          '<td class="hidden-xs" style="width:10%;text-align:center;"> <span class="">' +
          data[i].cam_name +
          "</span> </td> " +
          '<td style="width:20%;text-align:center;"><a class="fw-semi-bold "    style="cursor: pointer">' +
          data[i].alert_1 +
          "</a></td> " +
          '<td class="hidden-xs" style="width:10%; text-align:center;"> <span class="">' +
          data[i].priority +
          "</span> </td> " +
          ' <td class="hidden-xs" style="width:15%; text-align:center;"><span >' +
          data[i].date +
          "</span></td>  " +
          '<td style="width:30%; text-align:center;"> <span flight_id="' +
          data[i].alert_id +
          '" airport="' +
          cityName +
          '"  terminal="' +
          data[i].location +
          '"  stand_type="' +
          data[i].priority +
          '"  camName="' +
          data[i].cam_name +
          '"  camera_id="' +
          data[i].cam_name +
          '"  event_name="' +
          event_name +
          '"  event_url="' +
          data[i].video +
          '" event_time="' +
          data[i].date +
          '" status="' +
          data[i].alert_status +
          '" class="getCamAlertsDXB" style="text-decoration:underline; cursor: pointer; color:#8ec5fd;"> ' +
          evidence_clip +
          "</span> </td></tr>"
      );
    }
  } else {
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

  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");
  var resampledImage;

  canvas.width = 820; // target width
  canvas.height = 100; // target height

  var image = new Image();
  // document.getElementById("original").appendChild(image);

  image.onload = function (e) {
    ctx.drawImage(
      image,
      0,
      0,
      image.width,
      image.height,
      0,
      0,
      canvas.width,
      canvas.height
    );
    // create a new base64 encoding

    // console.log()
    localStorage.setItem("base64Img", canvas.toDataURL());
    resampledImage = canvas.toDataURL();
    // document.getElementById("resampled").appendChild(resampledImage);
  };

  image.src = "img/pdf/img_headerPDF.png";

  var JsonDataPDFExport = JSON.parse(localStorage.getItem("JsonForPdfData"));
  var getCurrentDate = new Date().toLocaleString();

  var textmessageC = "";
  var fromDatePdf = $("#fromdatepreview").val();
  var toDatePdf = $("#todatepreview").val();
  var Total_Camera = localStorage.getItem("totalcountsCam");
  var Total_Alerts = data.length;

  if (JsonDataPDFExport.area != "") {
    textmessageC +=
      "\n\n\n\n    Location Name: " +
      JsonDataPDFExport.location +
      "    City Name: " +
      JsonDataPDFExport.city +
      "    State Name: " +
      JsonDataPDFExport.state +
      "    From : " +
      fromDatePdf +
      "    To: " +
      toDatePdf +
      "\n\nTotal No. of cameras: " +
      Total_Camera +
      "    Total No. of alerts: " +
      Total_Alerts +
      "\n\n";
  } else {
    if (JsonDataPDFExport.location != "") {
      textmessageC +=
        "\n\n\n\n    Location Name: " +
        JsonDataPDFExport.location +
        "    City Name: " +
        JsonDataPDFExport.city +
        "    State Name: " +
        JsonDataPDFExport.state +
        "    From : " +
        fromDatePdf +
        "    To: " +
        toDatePdf +
        "\n\nTotal No. of cameras: " +
        Total_Camera +
        "    Total No. of alerts: " +
        Total_Alerts +
        "\n\n";
    } else {
      // textmessageC += "\n\n Camera Name: "+JsonDataPDFExport.area+"Camera State: "+JsonDataPDFExport.state+"    Date:"

      if (JsonDataPDFExport.city != "") {
        textmessageC +=
          "\n\n\n\n    City Name: " +
          JsonDataPDFExport.city +
          "    State Name: " +
          JsonDataPDFExport.state +
          "    From: " +
          fromDatePdf +
          "    To: " +
          toDatePdf +
          "    Total No. of cameras: " +
          Total_Camera +
          "    Total No. of alerts: " +
          Total_Alerts +
          "\n\n";
      } else {
        if (JsonDataPDFExport.state != "") {
          textmessageC +=
            "\n\n\n\n    State Name: " +
            JsonDataPDFExport.state +
            "    From: " +
            fromDatePdf +
            "    To: " +
            toDatePdf +
            "    Total No. of cameras: " +
            Total_Camera +
            "    Total No. of alerts: " +
            Total_Alerts +
            "\n\n";
        } else {
        }
      }
    }
  }

  // console.log(resampledImage);
  $("#datatable-table-alert").dataTable({
          order: [],
    // "sDom": "<'row'<'col-md-6 hidden-xs'l><'col-md-6'f>r>t<'row'<'col-md-6'i><'col-md-6'p>>",
    sDom: "Bfrtip",
    buttons: [
      {
        extend: "pdfHtml5",
        text: "Export Data In PDF",
        alignment: "center",
        title: " +++ ",
        messageTop: textmessageC,
        download: "open",
        // orientation: 'landscape',
        // pageSize: 'A0',
        // customize: function (doc) {
        //   doc.defaultStyle.fontSize = 20; //2, 3, 4,etc
        //   doc.styles.tableHeader.fontSize = 20; //2, 3, 4, etc
        //   doc.content[2].table.widths = [ '10%',  '40%', '20%', '15%',
        //     '15%'];
        // }
        orientation: "landscape",
        customize: function (doc) {
          var colCount = new Array();
          $("#datatable-table-alert")
            .find("tbody tr:first-child td")
            .each(function () {
              if ($(this).attr("colspan")) {
                for (var i = 1; i <= $(this).attr("colspan"); $i++) {
                  colCount.push("*");
                }
              } else {
                colCount.push("*");
              }
            });
          // doc.content[2].defaultStyle.fontSize=20;
          doc.content["hello"];
          doc.content[2].margin = [0, 0, 0, 0];
          doc.content[2].table.widths = [
            "5%",
            "10%",
            "10%",
            "20%",
            "10%",
            "15%",
            "30%",
          ];
          // doc.content[2].table.widths = colCount;
          // configPDF()
          doc.content.splice(1, 0, {
            margin: [0, 0, 0, 0],
            alignment: "center",
            image: localStorage.getItem("base64Img"),
          });
        },
        // customize: function (doc) {
        //   doc.defaultStyle.fontSize = 8; //2, 3, 4,etc
        //   doc.styles.tableHeader.fontSize = 10; //2, 3, 4, etc
        //   doc.content[1].table.widths = [ '2%',  '14%', '14%', '14%',
        //     '14%'];
        // }
      },
      {
        extend: "csv",
        text: "Export Data In CSV",
        filename: function () {
          return "RavenPivotchainSolution";
        },
        className: "btn-space",
        exportOptions: {
          orthogonal: null,
        },
      },
    ],
    // "columnDefs": [
    //   {"className": "dt-center", "targets": "_all"}
    // ],
    oLanguage: {
      sLengthMenu: "_MENU_",
      sInfo: "Showing <strong>_START_ to _END_</strong> of _TOTAL_ entries",
    },
    oClasses: {
      sFilter: "pull-right",
      sFilterInput: "form-control input-transparent",
    },
    // "aoColumns": unsortableColumns
    sPaginationType: "bootstrap",
    scrollX: true,
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
  //   $("#preview-table").dataTable({
          order: [],
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
  $(".table_data_chart-preview").addClass("large");
  $(".loader-wrap-spin-preview").show();
  $("#preview-chart-pie").html("<svg></svg>");
  $("#preview-chart-line").html("<svg></svg>");
  $("#preview-chart-footer").html("");
  if ($.fn.DataTable.isDataTable("#preview-table")) {
    $("#preview-table").DataTable().destroy();
  }
  var breadcrumspan = "";
  console.log(data);

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
      area +
      ' &nbsp<i class="fa fa-angle-right fa-lg"></i>';
  } else {
    area = data;
    breadcrumspan =
      state +
      ' &nbsp<i class="fa fa-angle-right fa-lg"></i> &nbsp' +
      city +
      ' &nbsp<i class="fa fa-angle-right fa-lg"></i> &nbsp' +
      area +
      ' &nbsp<i class="fa fa-angle-right fa-lg"></i>' +
      area;
  }
  console.log(location);
  $("#breadcrumspan").html(breadcrumspan);
  $("#selectedpreview").val(data);

  var JsonForPdf = {
    state: state,
    city: city,
    location: location,
    from_alert_date: from,
    to_alert_date: to,
    area: area,
    priority: priority,
  };
  localStorage.setItem("JsonForPdfData", JSON.stringify(JsonForPdf));
  $.ajax({
    url: "/getanalyticsdatapreview",
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
      area: area,
      priority: priority,
    }),

    success: function (data) {
      if (data.Success) {
        $(".loader-wrap-spin-preview").hide();
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
        console.log(color);
        console.log(res);
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
          $("#fromdatepreview").val(formatDate(previewfromdate));
          $("#todatepreview").val(formatDate(previewtodate));
        }
        createPreviewLinechart(previewLineData);
        localStorage.setItem("totalcountsCam", res.cam_count);
        createPreviewTable(res.table_data);
        $(".loader").hide();
      } else {
        Messenger().post({
          message: data.Failure,
          type: "error",
          showCloseButton: true,
        });
      }
    },
  });
  $("#previewscreen").show();
  $("#mainscreen").hide();
}
function openhomeland() {
  $("#previewscreen").hide();
  $("#mainscreen").show();
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
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear(),
    hours = d.getHours(),
    minutes = d.getMinutes(),
    seconds = d.getSeconds();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;
  return `${[year, month, day].join("-")} ${[hours, minutes, seconds].join(
    ":"
  )}`;
}

getStates();
getPriority();

//click any alert to play alert
$(document).on("click", ".getCamAlertsDXB", function () {
  // data-toggle="modal" data-target="#alertsModal"
  var flight_id = $(this).attr("flight_id");
  var airport = $(this).attr("airport");
  var terminal = $(this).attr("terminal");
  var stand_type = $(this).attr("stand_type");
  var event_name = $(this).attr("event_name");
  var camName = $(this).attr("camName");
  var event_time = $(this).attr("event_time");
  var status = $(this).attr("status");
  var event_url = $(this).attr("event_url");
  event_url  = event_url == "" ? "img/video/monitoringdisabled.mp4" : "http://" + domain + "/nginx/" + event_url;

  console.log(event_url);

  // show modal box
  $("#alertsModalCammLogs").modal("show");
  // $('#alertsModal').modal({backdrop: 'static', keyboard: false})

  // empty all alert info.
  $("#airport_Alerts").empty();
  $("#terminal_Alerts").empty();
  $("#stand_type_Alerts").empty();
  $("#event_name_Alerts").empty();
  $("#cam_name_Alerts").empty();
  $("#event_time_Alerts").empty();
  $("#status_Alerts").empty();

  // fill all details for alert info.
  $("#airport_Alerts").append(airport);
  $("#terminal_Alerts").append(terminal);
  $("#stand_type_Alerts").append(stand_type);
  $("#event_name_Alerts").append(event_name);
  $("#cam_name_Alerts").append(camName);
  $("#event_time_Alerts").append(event_time);
  $("#status_Alerts").append(status);

  changeSource(event_url);
});

//update alert video url
function changeSource(url) {
  var getVideo = document.getElementById("videoAlerts");
  var getSource = document.getElementById("videoSourceAlerts");
  getSource.setAttribute("src", `http://${url}`);
  getVideo.load();
  getVideo.play();
}

//close modal box
close_modal = function () {
  document.getElementById("videoAlerts").pause();
  stand_type_Alerts;
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
