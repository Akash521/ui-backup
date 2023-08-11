function formatDate(date) {
  var dlist = date ? date.split("/") : []
return ["20"+dlist[2], dlist[1], dlist[0]].join("/")
}

getScripts(
  ["js/vms/daterangepicker.js", "js/vms/bootstrap-datetimepicker.js"],
  function () {
    $("#picker").dateTimePicker({
      maxDate: new Date(),
      minDate: moment(formatDate(localStorage.getItem("playback_start_date"))),
      
    });

    $("#demo").daterangepicker({
      showISOWeekNumbers: true,
      timePicker: false,
      autoUpdateInput: true,
      locale: {
        // @ h:mm A
        cancelLabel: "Clear",
        format: "DD/MM/YYYY",
        separator: " - ",
        applyLabel: "Apply",
        cancelLabel: "Cancel",
        fromLabel: "From",
        toLabel: "To",
        customRangeLabel: "Custom",
        weekLabel: "W",
        daysOfWeek: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
        monthNames: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
        firstDay: 1,
      },
      linkedCalendars: true,
      showCustomRangeLabel: false,
      startDate: new Date(new Date().setDate(new Date().getDate() - 2)),
      endDate: 1,
      opens: "center",
      maxDate: moment(),
      minDate: moment(formatDate(localStorage.getItem("playback_start_date"))),
    });

    // $('#demo').data('daterangepicker').setStartDate('19/2021/05');
  }
);
$("#demo").on("apply.daterangepicker", function (ev, picker) {
  $(".downloadLoadDates").show();

  var startDate = picker.startDate;
  var endDate = picker.endDate;
  // alert("New date range selected: '" + startDate.format('YYYY-MM-DD') + "' to '" + endDate.format('YYYY-MM-DD') + "'");

  var jsonGetDownloadDates = {
    from_time: startDate.format("DD/MM/YYYY"),
    to_time: endDate.format("DD/MM/YYYY"),
  };
  var settings = {
    async: true,
    crossDomain: true,
    url: "/get_download_array",
    method: "POST",
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
      "postman-token": "425769cf-0897-6c5e-e2ff-23a1d4fb3f13",
    },
    processData: false,
    data: JSON.stringify(jsonGetDownloadDates),
  };

  $.ajax(settings)
    .done(function (response) {
      if (response.Failure) {
        Messenger().post({
          message: response.Failure,
          type: "error",
          showCloseButton: true,
        });
        return;
      }
      response = response.data;
      if(response.status == "success"){
        $(".downloadLoadDates").hide();
      $("#select_Time").show();
      $("#downloadDates").empty();
      $("#downloadDates").show();

      if (response.data.length > 0) {
        for (dateID = 0; dateID < response.data.length; dateID++) {
          $("#downloadDates").append(
            '<span class="form-control input-transparent col-md-1 dateButton" style="background-color: #212936;width: 14%;top: 3px;margin-left: 6px; cursor:pointer; margin-bottom: 6px; " val=' +
              response.data[dateID] +
              ' onclick="getTimeDownloads(this);">' +
              response.data[dateID] +
              "</span>"
          );
        }
      } else {
      }
      }else{
        Messenger().post({
          message: response.message ? response.message : response.status,
          type: "error",
          showCloseButton: true,
        });
      }
    })
    .fail(function (error) {
      // $('.verify-url-load-save').hide();
      // $('#poi_loading_spin').hide();
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
    });
});
$(".timePickerDownloadFrom").datetimepicker({
  format: "HH:mm",
  showClose: true,
  // use24hours: true
});
$(".timePickerDownloadTo").datetimepicker({
  format: "HH:mm",
  showClose: true,
  // use24hours: true
});
function getTimeDownloads(date) {
  $(".dateButton").css("height", "30px");
  $(".dateButton").removeClass("active");
  $(date).addClass("active");
  $(date).css("height", "47px");
  $(".displayFromTime").hide();
  $(".displayToTime").hide();
  $(".displayTimeBtn").hide();
  $(".displayQuality").hide();
  $("#downloadTime").hide();

  $("#downloadTime").show();
  $(".downloadLoadInside").show();
  setTimeout(() => {
    $(".downloadLoadInside").hide();
    $(".displayFromTime").show();
    $(".displayToTime").show();
    $(".displayTimeBtn").show();
    $(".displayQuality").show();
    $(".timePickerDownloadFrom").val("00:00");
    $(".timePickerDownloadTo").val("23:59");
  }, 1000);

  // $('#downloadTime').empty();

  // for(getDownloadTime=0;getDownloadTime<DatesJSON.length;getDownloadTime++){
  //     if($(date).attr('val') == DatesJSON[getDownloadTime].date ){
  //         for(getIndivadualTime=0;getIndivadualTime<DatesJSON[getDownloadTime].timeDuration.length;getIndivadualTime++){
  //             $('#downloadTime').append('<button class="form-control input-transparent col-md-1" style="background-color: ##293846;width: 14%;top: 7px;margin-left: 19px; margin-bottom: 19px;" val='+DatesJSON[getDownloadTime].timeDuration[getIndivadualTime]+' >'+DatesJSON[getDownloadTime].timeDuration[getIndivadualTime]+'</button>')
  //
  //         }
  //     }
  //
  // }
  // #downloadDates > span.form-control.input-transparent.col-md-1.dateButton.active

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
      "            color: #fff;\n" +
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
}
var quality_value;
$("input").click(function () {
  // var input_class = $(this).attr('class');

  $(".check_Quality").prop("checked", false);

  $(this).prop("checked", true);
  quality_value = $(this).val();
});
function composeVideo() {
  var comsposeStart =
    $(
      "#downloadDates > span.form-control.input-transparent.col-md-1.dateButton.active"
    ).text() +
    " " +
    $(".timePickerDownloadFrom").val() +
    ":00";
  var comsposeEnd =
    $(
      "#downloadDates > span.form-control.input-transparent.col-md-1.dateButton.active"
    ).text() +
    " " +
    $(".timePickerDownloadTo").val() +
    ":00";

  if (
    $("#checkboxhigh").is(":checked") ||
    $("#checkboxmedium").is(":checked") ||
    $("#checkboxlow").is(":checked")
  ) {
    var JSONCompose = {
      from_time: comsposeStart,
      to_time: comsposeEnd,
      cam_name: localStorage.getItem("camName-DXB"),
      video_quality: quality_value,
    };
    $(".composeVideoLoad").show();
    var settings = {
      async: true,
      crossDomain: true,
      url: "/download_video",
      method: "POST",
      headers: {
        "content-type": "application/json",
        "cache-control": "no-cache",
        "postman-token": "d2448717-5795-695b-e026-7208f9c20849",
      },
      processData: false,
      data: JSON.stringify(JSONCompose),
    };
    $.ajax(settings)
      .done(function (response) {
        $(".composeVideoLoad").hide();
        if (response.Failure) {
          Messenger().post({
            message: response.Failure,
            type: "error",
            showCloseButton: true,
          });
          return;
        }
        response = response.data;
        // console.log(response.status);
        if(response.status == "success"){

          Messenger().post({
            message: response.message ? response.message : response.status,
            type: "success",
            showCloseButton: true,
          });
          $(".timePickerDownloadFrom").val("00:00");
          $(".timePickerDownloadTo").val("23:59");
  
          $("#myTabLeft a[href=#profile-left]").tab("show");
          downloadTableStatus();
        }else{
          Messenger().post({
            message: response.message ? response.message : response.status,
            type: "error",
            showCloseButton: true,
          });
        }
      })
      .fail(function (error) {
        // $('.verify-url-load-save').hide();
        // $('#poi_loading_spin').hide();
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
      });
  } else {
    Messenger().post({
      message: "Please choose video quality to continue.",
      type: "error",
      showCloseButton: true,
    });
  }
}
function OpenDownlaodPlayback(e) {
  downloadTableStatus();
  e.href = "#open-modal";
}

function OpenSnapshotPlayback(e) {
  var videoObj = videojs("my_video_playback");

  if (!videoObj.paused()) {
    Messenger().post({
      message: "Please pause playback video to continue",
      type: "error",
      showCloseButton: true,
    });
  } else {
    // console.log("Video is paused");
    imageCropper.init();
    e.href = "#open-modal-snap";
  }
}
function downloadTableStatus() {
  $("#download_tble ").empty();
  var settings = {
    async: true,
    crossDomain: true,
    url: `/get_camerawise_download_collection?cam=${localStorage.getItem(
      "camName-DXB"
    )}`,
    method: "GET",
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
      "postman-token": "f39d183e-6052-d1b3-b91a-148f1474ee5d",
    },
  };

  $.ajax(settings)
    .done(function (response) {
      if (response.Failure && $("#open-modal").css("visibility") == "visible") {
        Messenger().post({
          message: response.Failure,
          type: "error",
          showCloseButton: true,
        });
        return;
      }
      console.log(response);

      var dataInJson = response;

      if(response.status == "success"){
        $("#download_tble").append(
          '<table id="DownloadColletionTable" class="table table-striped table-hover"> <thead> <tr> <th>Video ID</th> <th class=" hidden-xs">From Time</th> <th class="hidden-xs">To Time</th>  <th class="hidden-xs">Video Status</th> <th class="hidden-xs">Actions</th> </tr> </thead> <tbody id="DownloadColletionTbody" ></tbody> </table>'
        );
  
        if (response.data[0].download_collection.length > 0) {
          for (i = 0; i < response.data[0].download_collection.length; i++) {
            var url =
              "http://" +
              base_domainip +
              "/nginx/" +
              response.data[0].download_collection[i].evideo_name;
            var download_Url = url;
  
            if (response.data[0].download_collection[i].dvideo_status == "Composing") {
              $("#DownloadColletionTbody").append(
                '<tr ><td><span class="fw-semi-bold "   style="cursor: pointer">' +
                  response.data[0].download_collection[i].avideo_id +
                  '</span></td> <td class="hidden-xs"> <span class="">' +
                  response.data[0].download_collection[i].bfrom_time +
                  '</span> </td> <td class="hidden-xs"><span >' +
                  response.data[0].download_collection[i].cto_time +
                  '</span></td>  <td class="hidden-xs">' +
                  '<span class="'+ response.data[0].download_collection[i].avideo_id +'_status" style="background: #ffff00;color: #000;padding: 3px 10px;text-transform: capitalize;border-radius: 3px;">' +
                  "In Progress" +
                  '</span></td> <td class="hidden-xs"><div class="meter"><span class="meter_' +
             response.data[0].download_collection[i].avideo_id +
              '" style="width: 100%"></span></div></span></td> </tr>'
              );
            } else {
              $("#DownloadColletionTbody").append(
                '<tr ><td><span class="fw-semi-bold "   style="cursor: pointer">' +
                  response.data[0].download_collection[i].avideo_id +
                  '</span></td> <td class="hidden-xs"> <span class="">' +
                  response.data[0].download_collection[i].bfrom_time +
                  '</span> </td> <td class="hidden-xs"><span >' +
                  response.data[0].download_collection[i].cto_time +
                  '</span></td>  <td class="hidden-xs"><span style="background: #008000;color: #fff;padding: 3px 10px;text-transform: capitalize;border-radius: 3px;">' +
                  "Completed" +
                  '</span></td> <td class="hidden-xs">'+
                  '<button title="Download Video" onclick="downloadvideo(`'+ download_Url +'`)" class="downloadbtn"><span class="text">Download</span><span class="icon"><i class="fa fa-download" aria-hidden="true"></i></span></button>'
                  +"</td> </tr>"
              );
            }
          }
        }
        var unsortableColumns = [];
        $("#DownloadColletionTable")
          .find("thead th")
          .each(function () {
            if ($(this).hasClass("no-sort")) {
              unsortableColumns.push({ bSortable: false });
            } else {
              unsortableColumns.push(null);
            }
          });
        $("#DownloadColletionTable").dataTable({
          order: [],
          destroy: true,
          sDom: "<'row'<'col-md-6 hidden-xs'l><'col-md-6'f>r>t<'row'<'col-md-6'i><'col-md-6'p>>",
          oLanguage: {
            sLengthMenu: "_MENU_",
            sInfo: "Showing <strong>_START_ to _END_</strong> of _TOTAL_ downloads",
            sEmptyTable: "No downloads Found !!",
            sInfoEmpty: "Showing <strong>0 to _END_</strong> of _TOTAL_ downloads",
            sInfoFiltered: "( Filterd from _MAX_ downloads )",
            sZeroRecords: "No matching downloads found !!",
          },
          oClasses: {
            sFilter: "pull-right",
            sFilterInput: "form-control input-transparent",
          },
          aoColumns: unsortableColumns,
          order: [],
          initComplete: function () {
            $(this.api().table().container())
              .find("input")
              .parent()
              .wrap("<form>")
              .parent()
              .attr("autocomplete", "off");
          },
        });
        $("#datatable-table_length > label > select").css({
          "background-color": "rgba(51, 51, 51, 0.425)",
          border: "none",
        });
      }else{
        if($("#open-modal").css("visibility") == "visible"){
          Messenger().post({
            message: response.message ? response.message : response.status,
            type:"error",
            showCloseButton:true
          })
        }
      }
    })
    .fail(function (error) {
      // $('.verify-url-load-save').hide();
      // $('#poi_loading_spin').hide();
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
    });
}
function getScripts(scripts, callback) {
  var progress = 0;
  scripts.forEach(function (script) {
    $.getScript(script, function () {
      if (++progress == scripts.length) callback();
    });
  });
}




function downloadvideo(url) {
  const Link = document.createElement("a");
  Link.href = url;
  Link.download = url.split("/").pop();
  Link.click();
}



function updateDownloadStatusMQTT(data){
  // console.log(data);
  $(`<span style="background: #008000;color: #fff;padding: 3px 10px;text-transform: capitalize;border-radius: 3px;">Completed</span>`).insertAfter(`.${data.video_id}_status`);
$(`.${data.video_id}_status`).remove()
$(`<button title="Download Video" onclick="downloadvideo('http://${base_domainip}/nginx/${data.video_name}')" class="downloadbtn"><span class="text">Download</span><span class="icon"><i class="fa fa-download" aria-hidden="true"></i></span></button>`).insertAfter($($(`.meter_${data.video_id}`).parents("div.meter")[0]));
$($(`.meter_${data.video_id}`).parents("div.meter")[0]).remove()
}