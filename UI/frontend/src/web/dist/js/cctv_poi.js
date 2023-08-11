var count = 0;

// $("#btnAdd").bind("click", function () {

function add_feilds() {
  var div = $("<tr />");
  div.html(GetDynamicTextBox(""));
  $("#TextBoxContainer").append(div);
  // });
  $("body").on("click", ".remove", function () {
    $(this).closest("tr").remove();
  });
}
function GetDynamicTextBox(value) {
  // count+=1;

  // console.log(count);
  return (
    '<td><input name = "DynamicTextBox" type="text" value = "' +
    value +
    '" class="form-control DynamicTextBoxId" /></td>' +
    '<td><input name = "DynamicTextBox" type="text" value = "' +
    value +
    '" class="form-control DynamicTextBoxKey" /></td>' +
    '<td><button type="button" class="btn btn-danger remove" style="    width: 86%;"><span>Remove</span></i></button></td>'
  );
}

// 8793617004

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function person_track_details() {
  if ($("#uploadBtnTrackPerson")[0].files[0] == undefined) {
    Messenger().post({
      message: "Please choose image to continue.",
      type: "error",
      showCloseButton: true,
    });
  } else {
    if (
      $(":input").hasClass("DynamicTextBoxId") &&
      $(":input").hasClass("DynamicTextBoxKey")
    ) {
      var nonemptyId = $(".DynamicTextBoxId").filter(
        (_, el) => !!el.value.trim()
      );
      var nonemptyKey = $(".DynamicTextBoxKey").filter(
        (_, el) => !!el.value.trim()
      );

      if (nonemptyId.length < $(".DynamicTextBoxId").length) {
        Messenger().post({
          message:
            "Please fill person details or remove form field to continue.",
          type: "error",
          showCloseButton: true,
        });
      } else {
        if (nonemptyKey.length < $(".DynamicTextBoxKey").length) {
          Messenger().post({
            message:
              "Please fill person details or remove form field to continue.",
            type: "error",
            showCloseButton: true,
          });
        } else {
          $("#poi_track_loading_spin").show();
          var form = new FormData();
          form.append("file", $("#uploadBtnTrackPerson")[0].files[0]);
          $("#TextBoxContainer > tr  ").each(function (index, tr) {
            var key_data = $(tr).find(".DynamicTextBoxId").val();
            var val_data = $(tr).find(".DynamicTextBoxKey").val();
            form.append(key_data.toLowerCase().replaceAll(" ","_"), capitalizeFirstLetter(val_data));
          });
          var settings = {
            async: true,
            crossDomain: true,
            url: "/addpoi",
            method: "POST",
            headers: {
              "cache-control": "no-cache",
              "postman-token": "481a7215-5690-b31e-574d-9ba905f11104",
            },
            processData: false,
            contentType: false,
            mimeType: "multipart/form-data",
            data: form,
          };

          $.ajax(settings)
            .done(function (response) {
              $("#poi_track_loading_spin").hide();
              response = JSON.parse(response);
              if (response.Failure) {
                Messenger().post({
                  message: response.Failure,
                  type: "error",
                  showCloseButton: true,
                });
              }

              if (response.data.status == "success") {
                $("#modal_add_poi").modal("hide");
                Messenger().post({
                  message: response.data.result,
                  type: "success",
                  showCloseButton: true,
                });
                get_all_track_poi_images();
              } else {
                $("#poi_track_loading_spin").hide();
                Messenger().post({
                  message: response.data.error,
                  type: "error",
                  showCloseButton: true,
                });
              }
            })
            .fail(function (error) {
              // $('.verify-url-load-save').hide();
              $("#poi_track_loading_spin").hide();
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
    } else {
      $("#poi_track_loading_spin").show();
      var form = new FormData();
      form.append("file", $("#uploadBtnTrackPerson")[0].files[0]);

      var settings = {
        async: true,
        crossDomain: true,
        url: "/addpoi",
        method: "POST",
        headers: {
          "cache-control": "no-cache",
          "postman-token": "481a7215-5690-b31e-574d-9ba905f11104",
        },
        processData: false,
        contentType: false,
        mimeType: "multipart/form-data",
        data: form,
      };

      $.ajax(settings)
        .done(function (response) {
          response = JSON.parse(response);
          if (reponse.Failure) {
            Messenger().post({
              message: response.Failure,
              type: "error",
              showCloseButton: true,
            });
          }
          if (response.data.status == "success") {
            $("#poi_track_loading_spin").hide();
            $("#modal_add_poi").modal("hide");
            Messenger().post({
              message: response.data.result,
              type: "success",
              showCloseButton: true,
            });
            get_all_track_poi_images();
          }
        })
        .fail(function (error) {
          // $('.verify-url-load-save').hide();
          $("#poi_track_loading_spin").hide();
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
}

// document.getElementById("uploadBtn").onchange = function () {
//     document.getElementById("uploadFile").value = this.value.substring(12);
// };

$("#uploadBtnAdd_poi").change(function (e) {
  var fname = $("#uploadBtnAdd_poi").val().split("\\").pop().split("/").pop();
  console.log(fname);
  $("#uploadFile").val(fname);
});
document.getElementById("uploadBtnTrackPerson").onchange = function () {
  document.getElementById("uploadFileTrack_person").value =
    this.value.substring(12);
};

function get_all_track_poi_images() {
  var settings = {
    async: true,
    crossDomain: true,
    url: "/poitracks",
    method: "GET",
    headers: {
      "cache-control": "no-cache",
      "postman-token": "77fc3b37-9540-08c1-7ae0-3cbfc863dcac",
    },
  };
  $.ajax(settings)
    .done(function (responsedata) {
      if (responsedata.Failure) {
        Messenger().post({
          message: responsedata.Failure,
          type: "error",
          showCloseButton: true,
        });
        return
      }



      var response = responsedata.data
      $("#tble_poi_track").empty();

      if (response.length > 0) {
        $("#empty_response_poi_track").hide();
        $("#get_all_track_photos").empty();

        $("#tble_poi_track").append(
          '<table id="poi_table_track_person" class="table table-striped table-hover" style="font-size:12px border: 1px solid #3c4858; "> <thead style="border: 1px solid #3c4858;"> <tr style="border: 1px solid #3c4858;"> <th style="border: 1px solid #3c4858;">Id</th> <th style="border: 1px solid #3c4858;">Person Image </th> <th style="border: 1px solid #3c4858;">Person Details</th>  <th style="border: 1px solid #3c4858;">Remove</th></tr> </thead> <tbody id="alltrackperson"  style="border: 1px solid #3c4858;"></tbody> </table>'
        );

        var count = 0;
        for (poi_track = 0; poi_track < response.length; poi_track++) {
          // console.log( Object.keys();

          var string_text = "";
          for (var key in response[poi_track]) {
            if (key != "_id" && key != "poi_face_path" && key != "poi_id") {
              string_text += key.replaceAll("_"," ") + " : " + response[poi_track][key] + "<br>";
            }
          }

          // console.log(string_text.pop());
          console.log(string_text);
          // string_text = string_text.substring(0, string_text.lastIndexOf(" "));

          count += 1;

          var image_path_api =
            "http://" +
            base_domainip +
            "/nginx/" +
            response[poi_track].poi_face_path;

          if (Object.keys(response[poi_track]).length == 2) {
            console.log(Object.keys(response[poi_track]).length);
            $("#alltrackperson").append(
              '<tr stye="border: 1px solid #3c4858;"> <td class="hidden-xs" style="vertical-align: inherit; border: 1px solid #3c4858;">' +
                count +
                '</td> <td style="vertical-align: inherit; width:30%; border: 1px solid #3c4858; " ><span class="fw-semi-bold getUserDetails"  ><img src="' +
                image_path_api +
                '" style="width: 70%;" alt="" class="thumbnail newthumb image1"></span></td> <td class="hidden-xs" style="vertical-align: inherit;border: 1px solid #3c4858;"> <span class="">No information added.</span> </td> <td style="vertical-align: inherit; border: 1px solid #3c4858;"><button type="button" poi_id="' +
                response[poi_track].poi_id +
                 '" poi_validdate="' +
                response[poi_track].valid_upto +
                 '" poi_name="' +
                response[poi_track].name +
                '"  class="btn"  style="background-color: rgb(33 41 54) !important; border: 1px solid rgb(45 55 67);margin: 5px; padding: 5px 10px !important;" onclick="update_track_poi(this);"><span><i class="fa fa-pencil"></i></span></i></button><button type="button" poi_id="' +
                response[poi_track].poi_id +
               
                '"  class="btn"  style="background-color: rgb(33 41 54) !important; border: 1px solid rgb(45 55 67);margin: 5px; padding: 5px 10px !important;" onclick="remove_track_poi(this);"><span><i class="fa fa-trash"></i></span></i></button>  </tr>'
            );
          } else {
            $("#alltrackperson").append(
              '<tr stye="border: 1px solid #3c4858;"> <td class="hidden-xs" style="vertical-align: inherit; border: 1px solid #3c4858;">' +
                count +
                '</td> <td style="vertical-align: inherit; width:30%; border: 1px solid #3c4858; " ><span class="fw-semi-bold getUserDetails"  ><img src="' +
                image_path_api +
                '" style="width: 70%;" alt="" class="thumbnail newthumb image1"></span></td> <td class="hidden-xs" style="vertical-align: inherit;border: 1px solid #3c4858;"> <span style="text-transform: capitalize;" class="">' +
                string_text +
                '</span> </td> <td style="vertical-align: inherit; border: 1px solid #3c4858;"><button type="button" poi_id="' +
                response[poi_track].poi_id +
                 '" poi_validdate="' +
                response[poi_track].valid_upto +
                '" poi_name="' +
                response[poi_track].name +
                '"  class="btn"  style="background-color: rgb(33 41 54) !important; border: 1px solid rgb(45 55 67);margin: 5px; padding: 5px 10px !important;" onclick="update_track_poi(this);"><span><i class="fa fa-pencil"></i></span></button><button type="button" poi_id="' +
                response[poi_track].poi_id +
                
                '"  class="btn"  style="background-color: rgb(33 41 54) !important; border: 1px solid rgb(45 55 67);margin: 5px; padding: 5px 10px !important;" onclick="remove_track_poi(this);"><span><i class="fa fa-trash"></i></span></i></button>  </tr>'
            );
          }

          // $('#get_all_track_photos').append('<li class="col-sm-3" style="padding-left: 0px;padding-right: 0px; margin-bottom: 0px;">\n' +
          //     '<button type="button" voi_id="" class="btn btn-danger "  style="background-color: #13100fd6!important;border-color: #030303;position: absolute;z-index: 999;right: 1px;top: 5px;padding: 7px 12px;" onclick="remove_track_voi(this);"><i class="glyphicon glyphicon-remove-sign"></i></button>  \n'+
          //     '                <div class="tooltip1">\n' +
          //     '                <span class="tooltiptext">'+string_text+'</span>\n' +
          //     '            </div>\n' +
          //     '            </li>')
        }

        var unsortableColumns = [];
        $("#poi_table_track_person")
          .find("thead th")
          .each(function () {
            if ($(this).hasClass("no-sort")) {
              unsortableColumns.push({ bSortable: false });
            } else {
              unsortableColumns.push(null);
            }
          });

        $("#poi_table_track_person").dataTable({
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

        $("#poi_table_track_person_wrapper > .dropdown-menu ").css({
          "min-width": "100%",
        });
        $("#poi_table_track_person_filter > form").css({ padding: "0px" });
        // $('#poi_results_coul').css({"height": "auto"});
        $("#poi_results_coul").css({ border: "0px" });
      } else {
        $("#empty_response_poi_track").show();
        $("#poi_results_coul").css({ border: "1px solid #2d3743;" });
      }
    })
    .fail(function (error) {
      // $('.verify-url-load-save').hide();
      // $('#poi_track_loading_spin').hide();
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

function get_poi_images() {
  // var vehicleJSON="{color:checkedValType
  // "type:[], " +
  // "vehicle_number:}"

  if ($("#uploadBtnAdd_poi")[0].files[0] == undefined) {
    Messenger().post({
      message: "Please choose any person image to search.",
      type: "error",
      showCloseButton: true,
    });
  } else {
    $("#empty_response_poi").hide();
    $("#poi_loading_spin").show();
    var form = new FormData();
    form.append("file", $("#uploadBtnAdd_poi")[0].files[0]);
    var settings = {
      async: true,
      crossDomain: true,
      url: "/searchpoi",
      method: "POST",
      headers: {
        "cache-control": "no-cache",
        "postman-token": "9f99bf3b-bd1b-e782-977d-456b2865b52a",
      },
      processData: false,
      contentType: false,
      mimeType: "multipart/form-data",
      data: form,
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

        if (response.length > 0) {
          $("#poi_loading_spin").hide();
          $(".poi_response_img").css("border", "0px");
          $("#get_poi_images_api").empty();

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

            console.log(complete_string_api_data);

            $("#get_poi_images_api").append(
              '<header class="cm-name">\n' +
                '                                                <div class="cm-nm background" style="display: flex;margin-bottom: 20px;"><i class="fa fa-desktop" aria-hidden="true" style="font-size: 13px;color:#747c86;margin-top: 2px;    margin-right: 3px;"></i>&nbsp;<p style="margin-top: -2px;">' +
                complete_string_api_data +
                "</p></div>\n" +
                "                                            </header> <ul id=" +
                cctv_name_api +
                "ID" +
                ' class="row thumbnails thumbrw" style="margin-left: 0px; margin-right: 0px;margin-bottom: 21px; "></ul>'
            );
            $(".bodyload").show();

            for (
              cctv_images = 0;
              cctv_images < response[cctv_name].all_images.length;
              cctv_images++
            ) {
              var image_path_api =
                "http://" +
                base_domainip +
                "/nginx/" +
                response[cctv_name].all_images[cctv_images].image_url;

              $("#" + cctv_name_api + "ID").append(
                '<li class="col-sm-3" style="padding-left: 0px;padding-right: 0px; margin-bottom: 0px;">\n' +
                  '                    <div class="item animated wow fadeIn">\n' +
                  '                    <img src="' +
                  image_path_api +
                  '" style="height: 250px; width: 100%; margin-bottom:0px;" alt="" class="thumbnail newthumb">\n' +
                  '                    <div class="overlay title-overlay">\n' +
                  '                    <span class="text-overlay">\n' +
                  '                    <div class="overdiv">\n' +
                  "                <div><span> Date : </span>" +
                  response[cctv_name].all_images[cctv_images].date +
                  "</div>\n" +
                  "                </div>\n" +
                  "                </span>\n" +
                  "                </div>\n" +
                  "                </div>\n" +
                  "                </li>"
              );
            }
          }
        } else {
          $("#poi_loading_spin").hide();
          $("#empty_response_poi").show();
        }
      })
      .fail(function (error) {
        // $('.verify-url-load-save').hide();
        $("#poi_loading_spin").hide();
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

function remove_track_poi(e) {
  $("#poi_id_number").empty();
  $("#poi_id_number").append($(e).attr("poi_id"));
  $("#deletePOI").modal("show");
}

function update_track_poi(e) {
  $("#validuptoupdate").datetimepicker({
    // format: "DD-MM-YYYY",
      format: "YYYY-MM-DD",
      minDate: new Date(),
      // debug: true,
      keyBinds: {
        escape: null,
        up: null,
        down: null,
        right: null,
        left: null,
      },
  })

  var prevDate = $(e).attr("poi_validdate")

  if(prevDate !== "undefined"){

    $("#validuptoupdate").val(prevDate)
  }else{
    $("#validuptoupdate").val("")
  }

  

   $("#updatepoiid").empty().append($(e).attr("poi_id"));
   $("#updatepoiname").empty().append($(e).attr("poi_name"))
  $("#updatePOI").modal("show");
}

function emptyTrakedPerson() {
  $("#poi_loading_spin_remove_track").show();

  var JSON_POI_data = {
    poi_id: $("#poi_id_number").html(),
  };

  var settings = {
    async: true,
    crossDomain: true,
    url: "/deletepoi",
    method: "POST",
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
      "postman-token": "87a36651-d404-11cb-52aa-92ef47957228",
    },
    processData: false,
    data: JSON.stringify(JSON_POI_data),
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
      if (response.data.status == "success") {
        $("#poi_loading_spin_remove_track").hide();
        $("#deletePOI").modal("hide");

        Messenger().post({
          message: "Delete Successfully",
          type: "success",
          showCloseButton: true,
        });
        get_all_track_poi_images();
      } else {
        $("#poi_loading_spin_remove_track").hide();

        Messenger().post({
          message: "Some error encountered please try again",
          type: "error",
          showCloseButton: true,
        });
      }
    })
    .fail(function (error) {
      // $('.verify-url-load-save').hide();
      $("#poi_loading_spin_remove_track").hide();
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

function open_person_track_modal() {
  var today = new Date()
  var last18year = new Date()
  last18year.setFullYear(today.getFullYear() - 18)

  console.log( last18year.toLocaleDateString('en-CA'))

  $("#poi_track_loading_spin").hide();
  $("#uploadFileTrack_person").val("");
  $("#uploadBtnTrackPerson").val("");
  $("#TextBoxContainer").empty();
      $("#TextBoxContainer").append(`<tr><td><input disabled name="DynamicTextBox" type="text" value="Name" class="form-control DynamicTextBoxId"></td><td><input name="DynamicTextBox" type="text" value="N/A" class="form-control DynamicTextBoxKey"></td></tr>
      <tr><td><input name="DynamicTextBox" type="text" value="DOB" class="form-control DynamicTextBoxId"></td><td><input name="DynamicTextBox" type="text" placeholder="YYYY-MM-DD" value="" style="position: relative;" class="form-control DynamicTextBoxKey DynamicTextBoxKeyDatePicker"></td><td><button type="button" class="btn btn-danger remove" style="    width: 86%;"><span>Remove</span></button></td></tr>
      <tr><td><input name="DynamicTextBox" type="text" value="Valid upto" class="form-control DynamicTextBoxId"></td><td><input name="DynamicTextBox" type="text" value="" placeholder="YYYY-MM-DD"  style="position: relative;" class="form-control DynamicTextBoxKey DynamicTextBoxKeyValidDatePicker"></td><td><button type="button" class="btn btn-danger remove" style="    width: 86%;"><span>Remove</span></button></td></tr>`)

      
  $(".DynamicTextBoxKeyDatePicker").datetimepicker({
    // format: "DD-MM-YYYY",
      format: "YYYY-MM-DD",
      maxDate: new Date(),
      // debug: true,
      keyBinds: {
        escape: null,
        up: null,
        down: null,
        right: null,
        left: null,
      },
  })

  $(".DynamicTextBoxKeyDatePicker").val("")


  $(".DynamicTextBoxKeyValidDatePicker").datetimepicker({
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
  })

  $(".DynamicTextBoxKeyValidDatePicker").val("")

  $("body").on("click", ".remove", function () {
    $(this).closest("tr").remove();
  });


  $("#modal_add_poi").modal("show");
}









function updateTrakedPerson() {
  $("#poi_loading_spin_updtae_track").show();

  var JSON_POI_data = {
    poi_id: $("#updatepoiid").text(),
    name: $("#updatepoiname").text(),
    valid_upto: $("#validuptoupdate").val()
  };

  var settings = {
    async: true,
    crossDomain: true,
    url: "/updatepoi",
    method: "POST",
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
      "postman-token": "87a36651-d404-11cb-52aa-92ef47957228",
    },
    processData: false,
    data: JSON.stringify(JSON_POI_data),
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
      if (response.data.status == "success") {
        $("#poi_loading_spin_updtae_track").hide();
        $("#updatePOI").modal("hide");

        Messenger().post({
          message: "Updated Successfully",
          type: "success",
          showCloseButton: true,
        });
        get_all_track_poi_images();
      } else {
        $("#poi_loading_spin_updtae_track").hide();

        Messenger().post({
          message: "Some error encountered please try again",
          type: "error",
          showCloseButton: true,
        });
      }
    })
    .fail(function (error) {
      // $('.verify-url-load-save').hide();
      $("#poi_loading_spin_remove_track").hide();
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