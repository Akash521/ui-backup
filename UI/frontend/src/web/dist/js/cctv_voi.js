var selectedVOI;
function onPageLoadVOI() {

  document.getElementById("uploadBtnTrackPerson").onchange = function () {
  document.getElementById("uploadFileTrack_person").value =
    this.value.substring(12);
};


$.get("/getvehiclestates",function(data){
  if(data.Failure){
     Messenger().post({
          message: data.Failure,
          type: "error",
          showCloseButton: true,
        });
  }else{
    $("#vehiclesinsidecount").text(data.vehicles_inside);
      $("#vehiclestotalcount").text(data.total_vehicles);
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
  }
})

$("#track_vehicle_date").datetimepicker({
  // format: "DD-MM-YYYY",
  format: "YYYY-MM-DD",
  defaultDate: new Date(),
  minDate: new Date(),
  debug: true,
  keyBinds: {
    escape: null,
    up: null,
    down: null,
    right: null,
    left: null,
  },
});

$("#update_track_vehicle_date").datetimepicker({
  // format: "DD-MM-YYYY",
  format: "YYYY-MM-DD",
  defaultDate: new Date(),
  minDate: new Date(),
  // debug: true,
  keyBinds: {
    escape: null,
    up: null,
    down: null,
    right: null,
    left: null,
  },
});

  var settings = {
    async: true,
    crossDomain: true,
    url: "/vehiclecolors",
    method: "GET",
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
      "postman-token": "8c0bd304-8f6c-7ccc-7061-dbc83a6bb0e3",
    },
    processData: false,
  };

  $.ajax(settings)
    .done(function (response) {
      if (response.Failure) {
        Messenger().post({
          message: response.Failure,
          type: "error",
          showCloseButton: true,
        });
      }
      console.log(response);

      localStorage.removeItem("all_colors");
      localStorage.setItem("all_colors", JSON.stringify(response.colors));

      localStorage.removeItem("all_types");
      localStorage.setItem("all_types", JSON.stringify(response.types));

      for (colorIndex = 0; colorIndex < response.colors.length; colorIndex++) {
        $("#items").append(
          ' <li class="check_li"><input class="checkColor checkbox_input ' +
            response.colors[colorIndex].replace(/\s/g, "_") +
            '" type="checkbox" value="' +
            response.colors[colorIndex] +
            '" />' +
            response.colors[colorIndex] +
            " </li>"
        );
      }

      for (typesIndex = 0; typesIndex < response.types.length; typesIndex++) {
        $("#items3").append(
          ' <li class="check_li"><input class="checkType checkbox_input ' +
            response.types[typesIndex].replace(/\s/g, "_") +
            '" type="checkbox" value="' +
            response.types[typesIndex] +
            '" />' +
            response.types[typesIndex] +
            " </li>"
        );
      }

      var checkList = document.getElementById("list2");
      var items = document.getElementById("items");
      var checkList3 = document.getElementById("list3");
      var items3 = document.getElementById("items3");
      checkList.getElementsByClassName("anchor")[0].onclick = function (evt) {
        if (items.classList.contains("visible")) {
          items.classList.remove("visible");
          items.style.display = "none";
          items3.classList.remove("visible");
          items3.style.display = "none";
        } else {
          items.classList.add("visible");
          items.style.display = "block";
          items3.classList.remove("visible");
          items3.style.display = "none";
        }
      };

      items.onblur = function (evt) {
        items.classList.remove("visible");
      };

      // $(document).click(function (e) {
      //
      //     e.stopPropagation();
      // });

      // $("body").click(function(){
      //     $("#items").css("display","none");
      // });
      //
      // $("#items").click(function(event) {
      //     event.stopPropagation();
      // });

      checkList3.getElementsByClassName("anct")[0].onclick = function (evt) {
        if (items3.classList.contains("visible")) {
          items3.classList.remove("visible");
          items3.style.display = "none";
          items.classList.remove("visible");
          items.style.display = "none";
        } else {
          items3.classList.add("visible");
          items3.style.display = "block";
          items.classList.remove("visible");
          items.style.display = "none";
        }
      };

      items3.onblur = function (evt) {
        items3.classList.remove("visible");
      };

      // get_vehicle_images();
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

function make_datatable_tracked_vehicle() {
  $("#tble_cc").empty();
  // $('#voi_loading_spin_table_view').show();

  var settings = {
    async: true,
    crossDomain: true,
    url: "/voitracks",
    method: "GET",
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
      "postman-token": "7e195b87-a5a0-b114-29ed-511e72d43f1c",
    },
    processData: false,
  };

  $.ajax(settings)
    .done(function (responsedata) {
      if (responsedata.Failure) {
        Messenger().post({
          message: responsedata.Failure,
          type: "error",
          showCloseButton: true,
        });
      }
      var response = responsedata.data
      console.log(response);
      $("#voi_loading_spin_table_view").hide();
      $("#tble_cc").show();

      $("#tble_cc").append(
        '<table id="voi_table" class="table table-striped table-hover" style="font-size:12px "> <thead> <tr> <th>Id</th> <th>Vehicle No.</th> <th>Vehicle Type </th> <th>Vehicle Color</th>  <th>Actions</th></tr> </thead> <tbody id="alltrackveh" ></tbody> </table>'
      );

      count = 0;
      for (tracked_veh = 0; tracked_veh < response.length; tracked_veh++) {
        count += 1;

        $("#alltrackveh").append(
          '<tr > <td class="hidden-xs">' +
            count +
            '</td> <td><span class="fw-semi-bold getUserDetails"  >' +
            response[tracked_veh].vehicle_number +
            '</span></td> <td class="hidden-xs"> <span class="">' +
            response[tracked_veh].type +
            '</span> </td> <td class="hidden-xs"><span >' +
            response[tracked_veh].color +
            '</span></td> <td class="hidden-xs"><span style="width: 31px;margin:0 10px;" title="Reset Password" class="btn btn-transparent btn-sm  pull-left resetpassword" id="resetpassword" onclick="updatevoidetails(this)" unid=' +
                response[tracked_veh]?.voi_id +
                "  data=" +
                JSON.stringify(response[tracked_veh]) +
                '> <i class="fa fa-pencil" aria-hidden="true"></i></span><span voi_id="' +
            response[tracked_veh].voi_id +
            '" onclick="remove_track_voi(this);" style="width: 31px;" class="btn btn-transparent btn-sm pull-left" id="back-btn"> <i class="fa fa-trash"></i> </span></td> </tr>'
        );
      }

      var unsortableColumns = [];
      $("#voi_table")
        .find("thead th")
        .each(function () {
          if ($(this).hasClass("no-sort")) {
            unsortableColumns.push({ bSortable: false });
          } else {
            unsortableColumns.push(null);
          }
        });

      $("#voi_table").dataTable({
          order: [],
        sDom: "<'row'<'col-md-6 hidden-xs'l><'col-md-6'f>r>t<'row'<'col-md-6'i><'col-md-6'p>>",
        oLanguage: {
          sLengthMenu: "_MENU_",
          sInfo: "Showing <strong>_START_ to _END_</strong> of _TOTAL_ entries",
        },
        oClasses: {
          sFilter: "pull-right",
          sFilterInput: "form-control input-transparent",
        },
        aoColumns: unsortableColumns,
        initComplete: function () {
          $(this.api().table().container())
            .find("input")
            .parent()
            .wrap("<form>")
            .parent()
            .attr("autocomplete", "off");
        },
      });

      $("#voi_table_wrapper > .dropdown-menu ").css({ "min-width": "100%" });
      $("#voi_table_filter > form").css({ padding: "0px" });
    })
    .fail(function (error) {
      // $('.verify-url-load-save').hide();
      $("#voi_loading_spin_table_view").hide();
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

// $('voi_table_length > label > select').css({"background-color": "rgba(51, 51, 51, 0.425)","border": "none"});

function addVoi() {
  $("#voi_track_loading_spin").hide();
  $("#track_vehicle_num").val("");
  
  $("#uploadFileTrack_person").val("");
  $("#uploadBtnTrackPerson").val("");
  // $('#addEmailDXB').val('');
  // $('#addPasswordDXB').val('');
  // $('#addDesignationDXB').val('');
  // $('#addContactDXB').val('');
  console.log("here");
  $("#addVOIDetails").modal("show");

  $("#track_vehicle_num").val("");

  var jsonDatacolor = [];
  var jsonDatatype = [];
  // var fruits = 'Apple,Orange,Banana,Strawberry'.split(',');

  var all_colors_api = JSON.parse(localStorage.getItem("all_colors"));
  var all_types_api = JSON.parse(localStorage.getItem("all_types"));
  for (var i = 0; i < all_colors_api.length; i++)
    jsonDatacolor.push({ id: i, name: all_colors_api[i] });
  for (var j = 0; j < all_types_api.length; j++)
    jsonDatatype.push({ id: j, name: all_types_api[j] });
  // for(var i=0;i<fruits.length;i++) jsonData.push({id:i,name:fruits[i]});

  // console.log(jsonData)
  var ms1 = $("#ms1").tagSuggest({
    width: "100%",
    data: jsonDatacolor,
    sortOrder: "name",
    maxDropHeight: 200,
    name: "ms1",
  });

  var ms1 = $("#ms2").tagSuggest({
    width: "100%",
    data: jsonDatatype,
    sortOrder: "name",
    maxDropHeight: 200,
    name: "ms2",
  });
}

function get_vehicle_images() {
  // items.classList.remove('visible');
  // items.style.display = "none";
  // items3.classList.remove('visible');
  // items3.style.display = "none";

  $("#items").removeClass("visible");
  $("#items").hide();
  $("#items3").removeClass("visible");
  $("#items3").hide();

  $("#tagcir").empty();

  var checkedValColor = $(".checkColor:checkbox:checked")
    .map(function () {
      return this.value;
    })
    .get();

  var checkedValType = $(".checkType:checkbox:checked")
    .map(function () {
      return this.value;
    })
    .get();

  console.log(checkedValColor);
  for (icolor = 0; icolor < checkedValColor.length; icolor++) {
    var color_name_voi = checkedValColor[icolor].replace(/\s/g, "_");

    $("#tagcir").append(
      '<span class="tagval" id="' +
        color_name_voi +
        '">' +
        checkedValColor[icolor] +
        ' <i class="fa fa-close" onclick="delete_filter(this);"></i></span>    '
    );
  }

  for (itype = 0; itype < checkedValType.length; itype++) {
    var color_type_voi = checkedValType[itype].replace(/\s/g, "_");

    $("#tagcir").append(
      '<span class="tagval" id="' +
        color_type_voi +
        '">' +
        checkedValType[itype] +
        ' <i class="fa fa-close" onclick="delete_filter(this);"></i></span>'
    );
  }

  var vehicleJSON = {
    color: checkedValColor,
    type: checkedValType,
    vehicle_number: $("#searchVehicle").val(),
    length: 7,
    cam_name: "",
    start : 0
  };

  // var vehicleJSON="{color:checkedValType
  // "type:[], " +
  // "vehicle_number:}"

  if (
    $("#searchVehicle").val() == "" &&
    checkedValColor.length == 0 &&
    checkedValType.length == 0
  ) {
    $("#get_vehicle_images").empty();
    $("#empty_response_voi").show();
    $(".voi_response_img").css("border", "1px solid #2d3743");
    // $('#voi_loading_spin').hide();
    Messenger().post({
      message:
        "Please type vehicle number or select any vehicle color or select any vehicle type to search vehicle ",
      type: "error",
      showCloseButton: true,
    });
  } else {
    $("#get_vehicle_images").empty();
    $("#empty_response_voi").hide();
    $("#voi_loading_spin").show();

    appendVOISearchResponse(vehicleJSON)
  }
}

function delete_filter(e) {
  $("#" + e.parentNode.id).remove();
  $("." + e.parentNode.id).each(function () {
    $(this).prop("checked", false);
  });

  get_vehicle_images();
}

function add_voi_track() {
  var str_api_color = "";
  var str_api_arr_color;

  var str_api_type = "";
  var str_api_arr_type;

  $("#tag-sel-ctn-0 > .tag-sel-item").each(function () {
    str_api_color += $(this).text() + " ";
    str_api_arr_color = str_api_color.split(" ");
    str_api_arr_color.splice(-1, 1);
  });

  $("#tag-sel-ctn-1 > .tag-sel-item").each(function () {
    str_api_type += $(this).text() + " ";
    str_api_arr_type = str_api_type.split(" ");
    str_api_arr_type.splice(-1, 1);
  });

  console.log(str_api_arr_color);
  console.log(str_api_arr_type);

  var add_voi_trackJSON = {
    color: str_api_arr_color,
    type: str_api_arr_type,
    vehicle_number: $("#track_vehicle_num").val(),
  };

  var form = new FormData();
  if($("#uploadBtnTrackPerson")[0].files[0]){

    form.append("file", $("#uploadBtnTrackPerson")[0].files[0]);
  }
  form.append("color", str_api_arr_color);
  form.append("type", str_api_arr_type);
  form.append("vehicle_number",  $("#track_vehicle_num").val());
  form.append("date",  $("#track_vehicle_date").val());



  if ($("#track_vehicle_num").val() == "") {
    Messenger().post({
      message: "Please type vehicle number.",
      type: "error",
      showCloseButton: true,
    });
  } else if (str_api_arr_color == undefined) {
    Messenger().post({
      message: "Please select any color or more.",
      type: "error",
      showCloseButton: true,
    });
  } else if (str_api_arr_type == undefined) {
    Messenger().post({
      message: "Please select any vehicle type or more.",
      type: "error",
      showCloseButton: true,
    });
  } else {
    $("#voi_track_loading_spin").show();
    $(".subload").show();

    var settings = {
      async: true,
      crossDomain: true,
      url: "/addvoi",
      method: "POST",
      headers: {
        "cache-control": "no-cache",
        "postman-token": "6385786d-da0f-000a-14be-e7fffc267869",
      },
      processData: false,
      contentType: false,
      mimeType: "multipart/form-data",
      data: form,
    };

    $.ajax(settings)
      .done(function (responsedata) {
        console.log(response);
        var response = JSON.parse(responsedata)
        if (response.Failure) {
          Messenger().post({
            message: response.Failure,
            type: "error",
            showCloseButton: true,
          });
        $("#voi_track_loading_spin").hide();
        $(".subload").hide();

          return;
        }
        $("#voi_track_loading_spin").hide();
        $("#addVOIDetails").modal("hide");
        $(".subload").hide();

        make_datatable_tracked_vehicle();
      })
      .fail(function (error) {
        // $('.verify-url-load-save').hide();
        $("#voi_track_loading_spin").hide();
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
}

$("html").click(function (e) {
  console.log(e.target);
  if (
    !$(e.target).hasClass("anchor") &&
    !$(e.target).hasClass("checkbox_input") &&
    !$(e.target).hasClass("check_li")
  ) {
    console.log("click html");
    $("#items").removeClass("visible");
    $("#items").hide();
    $("#items3").removeClass("visible");
    $("#items3").hide();
  } else {
  }
});

function remove_track_voi(val) {
  $("#tble_cc").hide();

  $("#voi_loading_spin_table_view").show();
  // $('#voi_id_number').empty();
  // $('#voi_id_number').append();
  // $('#deleteVOI').modal('show');
  var Json_voi_track = {
    voi_id: $(val).attr("voi_id"),
  };

  var settings = {
    async: true,
    crossDomain: true,
    url: "/deletevoi",
    method: "POST",
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
      "postman-token": "1be47ac6-b7f7-fcf5-ed23-e3a5c7e6c7b4",
    },
    processData: false,
    data: JSON.stringify(Json_voi_track),
  };

  $.ajax(settings)
    .done(function (response) {
      // console.log(tresponse);
      if (response.Failure) {
        Messenger().post({
          message: response.Failure,
          type: "error",
          showCloseButton: true,
        });
      }
      if (response.data.status == "success") {
        Messenger().post({
          message: "Delete Successfully",
          type: "success",
          showCloseButton: true,
        });
        make_datatable_tracked_vehicle();
      } else {
        $("#voi_loading_spin_table_view").hide();
        Messenger().post({
          message: "Some error encountered please try again",
          type: "error",
          showCloseButton: true,
        });
      }
    })
    .fail(function (error) {
      // $('.verify-url-load-save').hide();
      $("#voi_loading_spin_table_view").hide();
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

// document.onreadystatechange = function () {
//     var state = document.readyState
//     if (state == 'interactive') {
//         document.getElementById('table_cc').style.visibility="visible";
//     } else if (state == 'complete') {
//         setTimeout(function(){
//             document.getElementById('interactive');
//             document.getElementById('load').style.visibility="hidden";
//             // document.getElementById('table_cc').style.visibility="visible";
//         },1000);
//     }
// }


function updatevoidetails(e){
  $("#editVOIDetails").modal("show")
  var data = JSON.parse($(e).attr("data"))
  selectedVOI = data
  $("#update_track_vehicle_num").val(data.vehicle_number)
  $("#update_track_vehicle_date").val(data.date)
}



function update_voi_track(){
    $(".updatevoiloader").show();

 var data = {
  voi_id: selectedVOI.voi_id,
  new_date: $("#update_track_vehicle_date").val()
 }





 var settings = {
      async: true,
      crossDomain: true,
      url: "/editvoi",
      method: "POST",
      headers: {
        "cache-control": "no-cache",
        "postman-token": "6385786d-da0f-000a-14be-e7fffc267869",
      },
      data: data,
    };

    $.ajax(settings)
      .done(function (response) {
        console.log(response)
        $(".updatevoiloader").hide();
        if (response.Failure) {
          Messenger().post({
            message: response.Failure,
            type: "error",
            showCloseButton: true,
          });
          return;
        }

        Messenger().post({
            message: "VOI details updated successfully!",
            type: "success",
            showCloseButton: true,
          });
        
        $("#editVOIDetails").modal("hide");

        make_datatable_tracked_vehicle();
      })




}





function appendVOISearchResponse(payload){
  var payloaddata = {...payload}
  // delete payloaddata.start
  // delete payloaddata.length
  // delete payloaddata.cam_name
   var settings = {
      async: true,
      crossDomain: true,
      url: "/searchvehicle",
      method: "POST",
      headers: {
        "content-type": "application/json",
        "cache-control": "no-cache",
        "postman-token": "f02c4f66-9a24-75c7-3770-76cd1e745ca6",
      },
      processData: false,
      data: JSON.stringify(payloaddata),
    };

    $.ajax(settings)
      .done(function (responseData) {
        if (responseData.Failure) {
          Messenger().post({
            message: responseData.Failure,
            type: "error",
            showCloseButton: true,
          });
        }
        var response = responseData.data.data
        if (response.length > 0) {
          $(".voi_response_img").css("border", "0px");
          $("#voi_loading_spin").hide();
          for (cctv_name = 0; cctv_name < response.length; cctv_name++) {
            var cctv_name_api = response[cctv_name].cam_name;
            var cctv_city_api = response[cctv_name].city;
            var cctv_location = response[cctv_name].location;
            var cctv_state = response[cctv_name].state;

            var complete_string_api_data =
              cctv_name_api +
              ", " +
              cctv_location +
              ", " +
              cctv_city_api +
              ", " +
              cctv_state;
              var start = Number(payload.start) + Number(payload.length)

            console.log(complete_string_api_data);

            if(payload.start == 0 && cctv_name_api !== payload.cam_name){
              $("#get_vehicle_images").append(
              '<header class="cm-name">\n' +
                '                                                <div class="cm-nm background" style="display: flex;margin-bottom: 20px;"><i class="fa fa-desktop" aria-hidden="true" style="font-size: 13px;color:#747c86;margin-top: 2px;    margin-right: 3px;"></i>&nbsp;<p style="margin-top: -2px;">' +
                complete_string_api_data +
                "</p></div>\n" +
                "                                            </header> <ul id=" +
                cctv_name_api +
                "ID" +
                ' start='+  start +' class="row thumbnails thumbrw" style="margin-left: 0px; margin-right: 0px;margin-bottom: 21px; "></ul>'
            );
            renderImages(response[cctv_name], cctv_name_api, payload)

            }else{
            renderImages(response[cctv_name], cctv_name_api, payload)

            }
            $(".bodyload").show();

          }
        } else {
          $("#empty_response_voi").show();
          $("#voi_loading_spin").hide();
        }
      })
      .fail(function (error) {
        // $('.verify-url-load-save').hide();
        $("#voi_loading_spin").hide();
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



function renderImages(data, cctv_name_api, payload){
              var start = Number(payload.start) + Number(payload.length)
  for (
              cctv_images = 0;
              // cctv_images < data.all_images.length;
              cctv_images <data.all_images.length;
              cctv_images++
            ) {
              console.log(data.all_images[cctv_images])
              var image_path_api =
                "http://" +
                base_domainip +
                "/nginx/" +
                data.all_images[cctv_images].image_url;

              $("#" + cctv_name_api + "ID").append(
                '<li class="col-sm-3" style="padding-left: 0px;padding-right: 0px; margin-bottom: 0px;">\n' +
                  '                    <div class="item animated wow fadeIn">\n' +
                  '                    <img loading="lazy" src="' +
                  image_path_api +
                  '" style="height: 250px; width: 100%; margin-bottom:0px;" alt="" class="thumbnail newthumb">\n' +
                  '                    <div class="overlay title-overlay">\n' +
                  '                    <span class="text-overlay">\n' +
                  '                    <div class="overdiv">\n' +
                  "                    <div><span>Vehicle Number :</span> " +
                  data.all_images[cctv_images].vehicle_number +
                  " </div>\n" +
                  '                <div class="row">\n' +
                  '                    <div class="col-md-6">\n' +
                  "                    <span>Color : </span>" +
                  data.all_images[cctv_images].vehicle_color +
                  "\n" +
                  "                </div>\n" +
                  '                <div class="col-md-6" style="padding-left: 0px;margin-left: -20px;">\n' +
                  "                    <span>Type :</span> " +
                  data.all_images[cctv_images].vehicle_type +
                  "\n" +
                  "                </div>\n" +
                  "                </div>\n" +
                  "                <div><span>Date : </span>" +
                  data.all_images[cctv_images].date +
                  "</div>\n" +
                  "                </div>\n" +
                  "                </span>\n" +
                  "                </div>\n" +
                  "                </div>\n" +
                  "                </li>"
              );
            }

            $(`#loadmorediv${cctv_name_api}`).remove()



            if(data.count > start){
              $("#" + cctv_name_api + "ID").append(
                `<li id="loadmorediv${cctv_name_api}" class="col-sm-3" style="padding-left: 0px;padding-right: 0px; margin-bottom: 0px;"><div class="item animated wow fadeIn">
                  <div onclick="loadMoreResults('${cctv_name_api}')" style="cursor:pointer;    cursor: pointer;
    height: 240px;
    width: calc(100% - 10px);margin:10px;background: transparent;border: 1px solid;display: flex;align-items: center;justify-content: center;flex-direction: column;" alt="" class="thumbnail newthumb">
 <i class="fa fa-plus-square-o" aria-hidden="true" style="
    font-size: 32px;
"></i><h2>View More</h2>                   
                </div>
                </li>`
              );
            }

            
}


function loadMoreResults(name){
   var checkedValColor = $(".checkColor:checkbox:checked")
    .map(function () {
      return this.value;
    })
    .get();

  var checkedValType = $(".checkType:checkbox:checked")
    .map(function () {
      return this.value;
    })
    .get();

  var vehicleJSON = {
    color: checkedValColor,
    type: checkedValType,
    vehicle_number: $("#searchVehicle").val(),
    start: Number($("#" + name + "ID").attr("start")),
    length: 8,
    cam_name: name
  }
  $("#" + name + "ID").attr("start", Number(vehicleJSON.start) + Number(vehicleJSON.length))
   appendVOISearchResponse(vehicleJSON)
}