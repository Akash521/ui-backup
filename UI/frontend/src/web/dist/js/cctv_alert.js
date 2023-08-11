$(".active-li").removeClass("active-li");
$("." + window.location.pathname.replace("/", "")).addClass("active-li");
var file = {};

var alert_dict = {};
var recentlyadded = [];


$.get("/getcamalertname",function(response){
  if (response.Failure) {
        Messenger().post({
          message: response.Failure,
          type: "error",
          showCloseButton: true,
        });
        return;
      }

      if (response.status == "success") {
        $("#addalert_alert_1").empty()
        $("#addalert_alert_2").empty().append(`<option value="">None</option>`)


        response.alert_names.map(function(an){
          $("#addalert_alert_1").append(`<option value="${an}">${an}</option>`)
          $("#addalert_alert_2").append(`<option value="${an}">${an}</option>`)
        })


         $("#addalert_camname").empty();

      $("#addalert_camname").select2({
        
        placeholder: "",
        language: {
          noResults: function () {
                return `
            <p>Camera Not Found</p>`;
          },
        },
        escapeMarkup: function (markup) {
          return markup;
        },
      });

      $("#addalert_camname").prepend('<option value=""></option>');

      for (
        i = 0;
        i < response.cam_names.length;
        i++
      ) {
        $("#addalert_camname").append(
          '<option value="' +
            response.cam_names[i] +
            '" >' +
            response.cam_names[i] +
            " </option>"
        );
      }

      $("#addalert_camname").on("change",function(e){
      })

      // $('#addalert_camname').append('<option value="addArea"><button  style="width: 100% text-align: left; padding: 5px 7px;" type="button" class="btn btn-primary" onclick="openNav(this);"> Add New Area</button></option>')

      $("#select2-addalert_camname-container").click(function (e) {
        $(".select2-search__field").attr("placeholder", "Enter Location");
        // $('.select2-results__option select2-results__option--highlighted').addcss({'margin':'4px','border-radius'})
        // margin: 4px;
        // border-radius: 3px;
      });
      }
})

$.get("/ip", function (data) {
  base_ip = data;



});

function renderRecentlyAdded() {
  $("#reacentlyaddedheading").show();
  $("#recentlyadded").empty();
  recentlyadded.map(function (e) {
    $("#recentlyadded").append(
      `<li style="padding:2px 15px;display:flex;align-items:center"><i class="fa fa-circle" aria-hidden="true" style="margin-right:10px;font-size:5px;"></i>${e}</li>`
    );
  });
}

$(document).ready(function () {
  $("#addalert_date").datetimepicker({
    // format: "DD-MM-YYYY",
    format: "DD/MM/YY HH:mm:ss",
    defaultDate: new Date(),
    // maxDate: new Date(),

    keyBinds: {
      escape: null,
      up: null,
      down: null,
      right: null,
      left: null,
    },
  });
  renderTagsInput();
  
 
});

function changealerttab(e) {
  $("#addalert_date")
    .datetimepicker("destroy")
    .datetimepicker({
      // format: "DD-MM-YYYY",
      format: "DD/MM/YY HH:mm:ss",
      defaultDate: new Date(),
      maxDate: new Date(),

      keyBinds: {
        escape: null,
        up: null,
        down: null,
        right: null,
        left: null,
      },
    });
  $(".tab-pane").hide();
  $($($(e).children("a")).attr("href")).show();
  resetform();
  renderTagsInput()
}

function renderTagsInput() {
  $("#deletealertids_tagsinput").remove()
  $("#deletealertids").remove()
  $("#tagsinputcontainer").empty().append(`<input
                      id="deletealertids"
                      data-role="tagsinput"
                      class="form-control input-transparent"
                      type="text"
                    />`);
  $("#deletealertids").tagsInput();
  $("#deletealertids_tagsinput").css("width", "100%");
}

function deletealerts() {
  alertlist = [];
  if ($("#deletealertids").val()?.trim() !== "") {
    alertlist = $("#deletealertids").val().split(",");
  }

  if (alertlist.length > 0) {
    $("#deleteloading-spinner").show();
    $.ajax({
      type: "POST",
      url: "/deletealerts",
      data: { alert_ids: alertlist },
      success: function (data) {
        if (typeof data == "string") {
          logout();
        }
        $("#deleteloading-spinner").hide();
        if (data.Failure) {
          Messenger().post({
            message: data.Failure,
            type: "error",
            showCloseButton: true,
          });
          return;
        }
          renderTagsInput();
          Messenger().post({
            message: "Alerts deleted successfully",
            type: "success",
            showCloseButton: true,
          });
        
      },
      error: function (data) {
        console.log(data);
      },
    });
  } else {
    Messenger().post({
      message: "Please add alerts to delete",
      type: "error",
      showCloseButton: true,
    });
  }
}

function findalertbyid() {
  $("#searchloading-spinner").show();

  alert_id = $("#searchalert_id").val();
  if (alert_id.trim() !== "") {
    $.get(`/getalertbyid?id=${alert_id}`, function (data) {
      if (typeof data == "string") {
        logout();
      }
      $("#searchloading-spinner").hide();
      if (data.Failure) {
        Messenger().post({
          message: data.Failure,
          type: "error",
          showCloseButton: true,
        });
      }
      if (data.status == "success") {
        priority = data.priority;
        alert_dict["alert_id"] = alert_id;
        $("#searchalert").hide();
        $("#editalertsection")
          .empty()
          .append(
            `<div class="col-sm-6" id="alert_thumbnail">

          </div>
          <div class="col-sm-3">
                  <div class="form-group tempsing-formsmtp">
                    <label for="displayalert_id">Alert ID</label>
                    <input
                      type="text"
                      class="form-control"
                      id="alert_id"
                      value="${alert_id}"
                      
                      disabled
                    />
                  </div>
                </div>
                <div class="col-sm-3">
                <div class="form-group tempsing-formsmtp" style="visibility:hidden;">
                    <label for="displayalert_id">Alert ID</label>
                    <input
                      type="text"
                      class="form-control"
                      id="alert_id"
                      value="${alert_id}"
                      
                      disabled
                    />
                  </div>
                </div>
                `
          )
          .append(renderfields(data.alert_data))
          .append(
            `<div class="col-sm-12" style="display:flex;justify-content:end;align-items:center;">
                     <div style="margin-right: 10px;display: none;" id="updateloading-spinner">
                <img src="img/edlo3.gif" width="28px" />
              </div>
                    <button class="btn btn-danger" onclick="resetform()">Reset</button>
                    <button class="btn btn-primary" style="margin-left:10px;" onclick="savealertchange()">Save Changes</button>
                </div>`
          )
          .show();
        data.alert_data.forEach(function (e) {
          if (e.key == "video") {
            $("#alert_thumbnail").append(
              `<video loop id="my_video_1" muted autoplay class="vjs-default-skin" controls preload="none" style="width:100%;max-height:500px;" data-setup='{}' src='${
                e.value
                  ? `${base_ip}/nginx/${e.value}`
                  : "img/video/monitoringdisabled.mp4"
              }' type='video/mp4'>
            </video>`
            );
          }
          if (e.type == "date") {
            $(`#${e.key}`).datetimepicker({
              format: "DD/MM/YY HH:mm:ss",
              keyBinds: {
                escape: null,
                up: null,
                down: null,
                right: null,
                left: null,
              },
            });
            $(`#${e.key}`).on("blur", function () {
              updatealertdict(e.key, $(this).val(), "undefined");
            });
          } else if (e.type == "list") {
            e.value.forEach(function (nesE) {
              if (nesE.type == "date") {
                $(`#${nesE.key}`).datetimepicker({
                  format: "DD/MM/YY HH:mm:ss",
                  keyBinds: {
                    escape: null,
                    up: null,
                    down: null,
                    right: null,
                    left: null,
                  },
                });
                $(`#${nesE.key}`).on("blur", function () {
                  updatealertdict(nesE.key, $(this).val(), e.key);
                });
              }
            });
          }
        });
      } else {
        Messenger().post({
          message: data.response,
          type: "error",
          showCloseButton: true,
        });
      }
    });
  } else {
    Messenger().post({
      message: "Please enter alert id",
      type: "error",
      showCloseButton: true,
    });
  }
}

function renderfields(data, isNestedList) {
  var html = "";
  data.forEach(function (obj) {
    if (obj.type !== "list") {
      if (isNestedList) {
        alert_dict[isNestedList][obj.key] = obj.value;
      } else {
        alert_dict[obj.key] = obj.value;
      }
    } else {
      alert_dict[obj.key] = {};
    }
    if (obj.key == "video" || obj.key == "thumbnail") {
    } else {
      if (obj.type == "input") {
        html += `
                <div class="col-sm-3">
                  <div class="form-group tempsing-formsmtp">
                    <label for=${obj.key}>${capitalizeFirstLetter(
          obj.key
            .replace("_", " ")
            .replace("qrt", "QRT")
            .replace("msg", "Message")
        )}</label>
                    <input
                      onchange="updatealertdict('${
                        obj.key
                      }', this.value,'${isNestedList}')"
                      type="text"
                      class="form-control"
                      value="${obj.value}"
                      id="${obj.key}"
                    />
                  </div>
                </div>`;
      } else if (obj.type == "disabled") {
        html += `
                <div class="col-sm-3">
                  <div class="form-group tempsing-formsmtp">
                    <label for=${obj.key}>${capitalizeFirstLetter(
          obj.key.replace("_", " ").replace("qrt", "QRT")
        )}</label>
                    <input
                      id="${obj.key}"
                      type="text"
                      class="form-control"
                      value="${obj.value}"
                      
                      disabled
                    />
                  </div>
                </div>`;
      } else if (obj.type == "select") {
        html += `
                <div class="col-sm-3">
                  <div class="form-group tempsing-formsmtp">
                    <label for=${obj.key}>${capitalizeFirstLetter(
          obj.key.replace("_", " ").replace("qrt", "QRT")
        )}</label>
                    <select class="form-control" id=${
                      obj.key
                    } onchange="updatealertdict('${
          obj.key
        }', this.value,'${isNestedList}')">
                      ${
                        obj.options.includes(obj.value) && obj.key != "alert_2"
                          ? ``
                          : "<option value=''>None</option>"
                      }
                      ${obj.options
                        .map(function (e) {
                          if (e == obj.value) {
                            return `<option selected>${e}</option>`;
                          }
                          return `<option>${e}</option>`;
                        })
                        .join("")}
                    </select>
                  </div>
                </div>`;
      } else if (obj.type == "date") {
        html += `
                <div class="col-sm-3">
                  <div class="form-group tempsing-formsmtp">
                    <label for=${obj.key}>${capitalizeFirstLetter(
          obj.key.replace("_", " ").replace("qrt", "QRT")
        )}</label>
                   <input
                      id="${obj.key}"
                      type="text"
                      class="form-control datetimepicker"
                      value="${obj.value}"
                    />
                  </div>
                </div>`;
      } else if (obj.type == "list") {
        html += `
                  <div class="col-sm-12" style="display:flex;align-items:center;">
                      <h4 style="margin-right:10px;min-width:100px;">${capitalizeFirstLetter(
                        obj.key.replace("_", " ").replace("qrt", "QRT")
                      )}</h4>
                      <hr style="width:100%;">
                    </div>
                    ${renderfields(obj.value, obj.key)}
                  <hr style="width:100%;margin:20px 0;">`;
      }
    }
  });
  return html;
}

function updatealertdict(key, value, isNestedList) {
  if (key == "helpdesk_message") {
    alert_dict.comment = value;
    return;
  }
  if (key == "comment") {
    if (value == "Other") {
      $($("#comment").parents(".col-sm-3"))
        .after(`<div class="col-sm-3" id="helpdeskmessage">
                  <div class="form-group tempsing-formsmtp">
                    <label for="customcomment">Add Custom Comment</label>
                    <input class="form-control" id="customcomment" onchange="updatealertdict('helpdesk_message', this.value,'undefined')"/>
                  </div>
                </div>`);
    } else {
      $("#helpdeskmessage").remove();
    }
  }

  if (isNestedList != "undefined") {
    alert_dict[isNestedList][key] = value;
  } else {
    alert_dict[key] = value;
  }

  if (key == "alert_1") {
    $("#priority").val(priority[value]);
    alert_dict["priority"] = priority[value];
  }
}

function resetform() {
  alert_dict = {};
  file = {}
  $("#addalert_alert_2").val("")
        $("#addalert_camname").val("")
  $("#searchalert_id").val("");
  $("#searchalert").show();
  $("#editalertsection").hide();
}

function savealertchange() {
  $("#updateloading-spinner").show();
  $.post("/editalertbyid", alert_dict, function (data) {
    if (typeof data == "string") {
      logout();
    }
    $("#updateloading-spinner").hide();
    if (data.status == "success") {
      Messenger().post({
        message: "Alert Updated Successfully",
        type: "success",
        showCloseButton: true,
      });
      resetform();
    } else {
      Messenger().post({
        message: data.status,
        type: "error",
        showCloseButton: true,
      });
    }
  });
}

function capitalizeFirstLetter(string) {
  if (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  } else {
    return string;
  }
}

function insertalert() {
  


    
    if($("#addalert_camname").val() == ""){
      Messenger().post({
        message: "Please add camera name",
        type:"error",
        showCloseButton: true
      })
      return
    }else if(!file.name){
      Messenger().post({
        message: "Please upload video file",
        type:"error",
        showCloseButton: true
      })
      return
    } else{
      var duration
      var video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = function() {
        window.URL.revokeObjectURL(video.src);
        duration = video.duration;
        if(duration > 15){
          Messenger().post({
          message: "Video file duration should be less than 15 seconds",
          type:"error",
          showCloseButton: true
        })
        }else{
              var formdata = new FormData();
    formdata.append("file", file);
    formdata.append("alert_1", $("#addalert_alert_1").val());
    formdata.append("alert_2", $("#addalert_alert_2").val());
    formdata.append("date", $("#addalert_date").val());
    formdata.append("cam_name",  $("#addalert_camname").val());

    var settings = {
      async: true,
      crossDomain: true,
      url: "/addalert",
      method: "POST",
      headers: {
        "cache-control": "no-cache",
        "postman-token": "481a7215-5690-b31e-574d-9ba905f11104",
      },
      processData: false,
      contentType: false,
      mimeType: "multipart/form-data",
      data: formdata,
    };
    $("#insertloading-spinner").show();

    $.ajax(settings).done(function (res) {
      $("#insertloading-spinner").hide();

      res = JSON.parse(res);
      if (res.Failure) {
        Messenger().post({
          message: res.Failure,
          type: "error",
          showCloseButton: true,
        });
        return;
      }
      res = res.data
      if (res.status == "success") {
        $("#addalert_alert_2").val("")
        $("#addalert_camname").val("")
        file = {};
        showFile();
        Messenger().post({
          message: `Alert Inserted Successfully !!`,
          type: "success",
          showCloseButton: true,
        });
        if (recentlyadded.length > 4) {
            recentlyadded.shift();
            recentlyadded.push(data.created_alert_id);
          } else {
            recentlyadded.push(data.created_alert_id);
          }
          renderRecentlyAdded();
          copyToClipboard(data.created_alert_id);
      } else {
        Messenger().post({
          message: res.status,
          type: "error",
          showCloseButton: true,
        });
      }
    });
          
        }
      }

      video.src = URL.createObjectURL(file);
    
    }


}

function copyToClipboard(text) {
  if (window.clipboardData && window.clipboardData.setData) {
    return clipboardData.setData("Text", text);
  } else if (
    document.queryCommandSupported &&
    document.queryCommandSupported("copy")
  ) {
    var textarea = document.createElement("textarea");
    textarea.textContent = text;
    textarea.style.position = "fixed";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      return document.execCommand("copy");
    } catch (ex) {
      console.warn("Copy to clipboard failed.", ex);
      return false;
    } finally {
      document.body.removeChild(textarea);
    }
  }
}

var validExtensions = [
  "video/mp4"
];

var dropArea = document.querySelector(".drag-area"),
  dragText = dropArea.querySelector("header"),
  input = dropArea.querySelector("#addatmfileuploadinput");

$("#uploadfilebutton").on("click", function (e) {
  e.preventDefault();
  $("#addatmfileuploadinput").trigger("click");
});

$("#addatmfileuploadinput").on("change", function () {
  if (validExtensions.includes(this.files[0].type)) {
    file = this.files[0];
  } else {
    dropArea.classList.remove("active");
    dragText.textContent = "Drag & Drop to Upload Video File";
    Messenger().post({
      message: "Please add valid Video File",
      type: "error",
      showCloseButton: true,
    });
  }
  dropArea.classList.add("active");
  showFile();
});

dropArea.addEventListener("dragover", (event) => {
  event.preventDefault();
  dropArea.classList.add("active");
  dragText.textContent = "Release to Upload File";
});

dropArea.addEventListener("dragleave", () => {
  dropArea.classList.remove("active");
  dragText.textContent = "Drag & Drop to Upload Video File";
});

dropArea.addEventListener("drop", (event) => {
  event.preventDefault();
  if (validExtensions.includes(event.dataTransfer.files[0].type)) {
    file = event.dataTransfer.files[0];
  } else {
    dropArea.classList.remove("active");
    dragText.textContent = "Drag & Drop to Upload Video File";
    Messenger().post({
      message: "Please add valid Video File",
      type: "error",
      showCloseButton: true,
    });
  }
  showFile();
});

function showFile() {
  var fileType = file.type;
  $("#selectedfilename").empty()

  if (validExtensions.includes(fileType)) {
    $("#selectedfilename").text(`Selected File: ${file.name}`).show();
    // dragText.textContent = file.name;
  } else {
    dropArea.classList.remove("active");
    dragText.textContent = "Drag & Drop to Upload Video File";
    Messenger().post({
      message: "Please add valid Video File",
      type: "error",
      showCloseButton: true,
    });
  }
}



$("#allcsvuploadstatus").empty();

  $("#allcsvuploadstatus").append(
    '<table style="width:100%;" id="allcsvuploadstatusTable" class="table table-striped table-hover datatableloader"><thead> <tr> <th>ID</th><th class=" hidden-xs">Start time</th> <th>Status</th>  </tr> </thead> <tbody id="allcsvuploadstatusBody" ></tbody></table>'
  );

// $.get("/getaddedalertstatus", function (res) {
//   // res = {status:"success",response:[
//   //   {id:"ywgeude",start_time:"2113",status:"offline"}
//   // ]}
//   if (typeof res == "string") {
//     logout();
//   }

//   if(res.Failure){
//     Messenger().post({
//       message: res.Failure,
//       type: "error",
//       showCloseButton: true,
//     })
//     return
//   }
  
//     if (res.status == "success") {

//       res.response.forEach(function (csvalertfile) {
//         $("#allcsvuploadstatusBody").append(`
// <tr role='row' class='odd'>
//   <td><a class="fw-semi-bold" title='${csvalertfile?.not_added_atm_list?.join(", ")}' href="#">${csvalertfile.download_id}</a></td>
//   <td>${csvalertfile.start_time}</td>
//   <td><span class="ticket_${csvalertfile.status.toLowerCase()}">${csvalertfile.status}</span></td>
//   </tr>
// `);
//       });

//       var unsortableColumns = [];
//       $("#allcsvuploadstatusTable")
//         .find("thead th")
//         .each(function () {
//           if ($(this).hasClass("no-sort")) {
//             unsortableColumns.push({ bSortable: false });
//           } else {
//             unsortableColumns.push(null);
//           }
//         });

//       table = $("#allcsvuploadstatusTable").DataTable({
//         destroy: true,
//         searching:false,
//         scrollX: true,
//         scrollCollapse: true,
//         order: [],
//         sDom: "<'row'<'col-md-6 hidden-xs'l><'col-md-6'f>r>t<'row'<'col-md-6'i><'col-md-6'p>>",
//         oLanguage: {
//           sLengthMenu: "_MENU_",
//           sInfo:
//             "Showing <strong>_START_ to _END_</strong> of _TOTAL_ uploads",
//           sInfoEmpty:
//             "Showing <strong>0 to _END_</strong> of _TOTAL_ uploads",
//           sEmptyTable: "No data Found !!",
//           sInfoFiltered: "( Filterd from _MAX_ uploads )",
//           sZeroRecords: "No matching data found !!",
//         },
//         oClasses: {
//           sFilter: "pull-right",
//           sFilterInput: "form-control input-transparent",
//         },
//         // aoColumns: unsortableColumns,
//         initComplete: function () {
//           $(this.api().table().container())
//             .find("input")
//             .parent()
//             .wrap("<form>")
//             .parent()
//             .attr("autocomplete", "off");
//         },
//       });

//       $(".datatableloader").removeClass("datatableloader").show();
//     } else {
//       Messenger().post({
//         message: res.status,
//         type: "error",
//         showCloseButton: true,
//       });
//     }
  
// });
