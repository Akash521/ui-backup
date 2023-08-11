var default_params = {}



openmodalSMTP = function () {
  

  $("#modal-smtp").load("/cctv_configuration #modifySMTPDXB", function () {
    // $.get("/status", function(data){
      if(userloginstatus == "administrator"){

    // $("#myTab li.active").hide()
    $($("#myTab li")[0]).hide()
     $($("#myTab li")[2]).hide()
      $($("#myTab li")[1]).children("a").trigger("click")
    //  $($("#myTab li")[1]).hide()
    // $("#myTab li:not(.active) > a").trigger("click")
  }
// })
    $(".mailSMTPload").hide();
    $("#modifySMTPDXB").modal();
    console.log("Here for priority");
    getPriorityL();
    // modifySMTP();
    getServiceDefaultParams()
    modifyLicense();
    // modifyMessage();
    getScripts(
      [
        "/lib/messenger/build/js/messenger.js",
        "js/ui-notifications.js",
        "js/modal-logic/model-logic.js",
      ],
      function () {}
    );
  });
};

var getPriorityL = function () {
  var settings = {
    async: true,
    crossDomain: true,
    url: "/getpriority",
    method: "GET",
    headers: {
      "cache-control": "no-cache",
      "postman-token": "85be1df8-66d5-be63-261b-d1be2e5d7333",
    },
  };


  

  $.ajax(settings).done(function (response) {
    var testJson = response;


    // for (const [key, value] of Object.entries(testJson.priority_list)) {
     

      
    //   // console.log(testJson.priority_list[getPriorty].alert_name);
    //   // console.log(testJson.priority_list[getPriorty].priority);

    //   var priroty_name = key;

    //   var name_dict = priroty_name.split(/(?=[A-Z])/).join("_");
    //   var name_lowercase = name_dict.toLowerCase() + "P";
    //   var remove_spaces_name = name_lowercase.replace(/\s+/g, "");
    //   var remove_slash = remove_spaces_name.replace("/", "");
    //   // console.log(remove_slash)

    //   $("#allPriority").append(
    //     ' <div class="col-lg-4" style="padding:10px;">\n' +
    //       '                                                    <div class="input-group">\n' +
    //       '                                                        <input id="phone" class="form-control input-transparent  mask"\n' +
    //       '                                                               name="phone" maxlength="28" value="' +
    //       key +
    //       '" style="height: 26px; ">\n' +
    //       '                                                        <span class="input-group-btn" style="font-size: larger !important" >\n' +
    //       "                                                            <select  name='" +
    //       key +
    //       "' id=" +
    //       remove_slash +
    //       ' class="input-transparent  mask prioritySelectiontest" style="height:26px;background-color: rgba(51, 51, 51, 0.425);border:none;font-size: 13px;" data-style="btn-default" data-width="auto" onchange="javascript:alertMe(this)">\n' +
    //       "                                                            </select>\n" +
    //       "                                                        </span>\n" +
    //       "                                                    </div>\n" +
    //       "                                                </div>\n"
    //   );

    //   for (
    //     getPriortyVal = 0;
    //     getPriortyVal < testJson.priorities.length;
    //     getPriortyVal++
    //   ) {
    //     // console.log(testJson.priority_list[getPriorty].alert_name)
    //     // console.log(testJson.priorities[getPriortyVal])

    //     var daySelect = document.getElementById(remove_slash);
    //     var myOption = document.createElement("option");
    //     myOption.text = testJson.priorities[getPriortyVal];
    //     myOption.value = testJson.priorities[getPriortyVal];
    //     daySelect.add(myOption);

    //     // remove_slash.value = testJson.priorities[getPriortyVal];
    //     // opt.innerHTML = i;
    //     // select.appendChild(opt);
    //     // $("#"+remove_slash).append("<option testval='"+testJson.priority_list[getPriorty].alert_name+"' value='"+testJson.priorities[getPriortyVal]+">"+testJson.priorities[getPriortyVal]+"</option>");
    //   }

    //   $("#" + remove_slash)
    //     .val(value)
    //     .attr("selected", true);

    //   // var theValue = testJson.priority_list[getPriorty].priority;
    //   // console.log(theValue)

    //   // $("#"+remove_slash).val(theValue)
    //   // $('option[value=' + theValue + ']')
    //   //     .attr('selected',true);

    //   // '                                                           <select  name="'+testJson.priority_list[getPriorty].alert_name+'" class=" input-transparent  mask prioritySelection" style="height:26px;background-color: rgba(51, 51, 51, 0.425);border:none;font-size: 13px;" data-style="btn-default" data-width="auto">\n' +
    //   // '                                                                <option testval="'+testJson.priority_list[getPriorty].alert_name+'" value="P1">P1</option>\n' +
    //   // '                                                                <option testval="'+testJson.priority_list[getPriorty].alert_name+'"  value="P2">P2</option>\n' +
    //   // '                                                                <option testval="'+testJson.priority_list[getPriorty].alert_name+'" value="P3">P3</option>\n' +
    //   // '                                                                <option testval="'+testJson.priority_list[getPriorty].alert_name+'" value="P4">P4</option>\n' +

    //   // var res = response.priorities;
    //   // $("#"+remove_slash).html("");
    //   // // $("#priority").append("<option value=''>-Select Priority-</option>");
    //   //
    //   // $.each(res.priorities, function (key, val) {
    //   //     console.log(val);
    //   //     // $("#"+remove_slash).append("<option value='" + val + "'>" + val + "</option>");
    //   //
    //   //
    //   // });

    //   // $('#allPriority').append('<div class="col-lg-3" style="padding:10px;">\n' +
    //   //     '                                                    <div class="input-group">\n' +
    //   //     '                                                        <input id="phone" class="form-control input-transparent  mask" required="required" type="text" name="phone" maxlength="28" value="'+testJson.priority_list[getPriorty].alert_name+'" style="height: 26px;">\n' +
    //   //     '                                                        <span class="input-group-btn">\n' +
    //   //     '                                                            <div class="select"><select id="selectbox1" class="input-transparent mask s-hidden" data-style="btn-default" data-width="auto">\n' +
    //   //     '                                                                <option>P1</option>\n' +
    //   //     '                                                                <option>P2</option>\n' +
    //   //     '                                                                <option>P3</option>\n' +
    //   //     '                                                            </select><div class="styledSelect">'+testJson.priority_list[getPriorty].priority+'</div><ul class="options" style="display: none;"><li rel="P1">P1</li><li rel="P2">P2</li><li rel="P3">P3</li></ul></div>\n' +
    //   //     '                                                        </span>\n' +
    //   //     '                                                    </div>\n' +
    //   //     '                                                </div>');

    //   // for(getPriortyList=0;getPriortyList<testJson.priority_list.length;getPriortyList++){

    //   // $("select[name="+testJson.priority_list[getPriortyList].alert_name+"]:eq(0)").

    //   // $('#'+remove_slash).first().val(testJson.priority_list[getPriortyList].priority);

    //   // for(showAll=0;showAll<testJson.priorities.length;showAll++){
    //   //     console.log($('#'+testJson.priority_list[getPriortyList].alert_name).append("<option>"+testJson.priorities[showAll]+"</option>"));
    //   // }
    //   // console.log(testJson.priority_list[getPriortyList].alert_name);

    //   // }
   
    // }




    for (
      getPriorty = 0;
      getPriorty < testJson.priority_list.length;
      getPriorty++
    ) {

      
      // console.log(testJson.priority_list[getPriorty].alert_name);
      // console.log(testJson.priority_list[getPriorty].priority);

      var priroty_name = testJson.priority_list[getPriorty].alert_name;

      var name_dict = priroty_name.split(/(?=[A-Z])/).join("_");
      var name_lowercase = name_dict.toLowerCase() + "P";
      var remove_spaces_name = name_lowercase.replace(/\s+/g, "");
      var remove_slash = remove_spaces_name.replace("/", "");
      // console.log(remove_slash)

      $("#allPriority").append(
        ' <div class="col-lg-4" style="padding:10px;">\n' +
          '                                                    <div class="input-group">\n' +
          '                                                        <input  class="form-control input-transparent  mask"\n' +
          '                                                               name="phone" maxlength="28" value="' +
          testJson.priority_list[getPriorty].alert_name +
          '" style="height: 26px; ">\n' +
          '                                                        <span class="input-group-btn" style="font-size: larger !important" >\n' +
          "                                                            <select  name='" +
          testJson.priority_list[getPriorty].alert_name +
          "' id=" +
          remove_slash +
          ' class="input-transparent  mask prioritySelectiontest" style="height:26px;background-color: rgba(51, 51, 51, 0.425);border:none;font-size: 13px;" data-style="btn-default" data-width="auto" onchange="javascript:alertMe(this)">\n' +
          "                                                            </select>\n" +
          "                                                        </span>\n" +
          "                                                    </div>\n" +
          "                                                </div>\n"
      );

      for (
        getPriortyVal = 0;
        getPriortyVal < testJson.priorities.length;
        getPriortyVal++
      ) {
        // console.log(testJson.priority_list[getPriorty].alert_name)
        // console.log(testJson.priorities[getPriortyVal])

        var daySelect = document.getElementById(remove_slash);
        var myOption = document.createElement("option");
        myOption.text = testJson.priorities[getPriortyVal];
        myOption.value = testJson.priorities[getPriortyVal];
        daySelect.add(myOption);

        // remove_slash.value = testJson.priorities[getPriortyVal];
        // opt.innerHTML = i;
        // select.appendChild(opt);
        // $("#"+remove_slash).append("<option testval='"+testJson.priority_list[getPriorty].alert_name+"' value='"+testJson.priorities[getPriortyVal]+">"+testJson.priorities[getPriortyVal]+"</option>");
      }

      $("#" + remove_slash)
        .val(testJson.priority_list[getPriorty].priority)
        .attr("selected", true);

      // var theValue = testJson.priority_list[getPriorty].priority;
      // console.log(theValue)

      // $("#"+remove_slash).val(theValue)
      // $('option[value=' + theValue + ']')
      //     .attr('selected',true);

      // '                                                           <select  name="'+testJson.priority_list[getPriorty].alert_name+'" class=" input-transparent  mask prioritySelection" style="height:26px;background-color: rgba(51, 51, 51, 0.425);border:none;font-size: 13px;" data-style="btn-default" data-width="auto">\n' +
      // '                                                                <option testval="'+testJson.priority_list[getPriorty].alert_name+'" value="P1">P1</option>\n' +
      // '                                                                <option testval="'+testJson.priority_list[getPriorty].alert_name+'"  value="P2">P2</option>\n' +
      // '                                                                <option testval="'+testJson.priority_list[getPriorty].alert_name+'" value="P3">P3</option>\n' +
      // '                                                                <option testval="'+testJson.priority_list[getPriorty].alert_name+'" value="P4">P4</option>\n' +

      // var res = response.priorities;
      // $("#"+remove_slash).html("");
      // // $("#priority").append("<option value=''>-Select Priority-</option>");
      //
      // $.each(res.priorities, function (key, val) {
      //     console.log(val);
      //     // $("#"+remove_slash).append("<option value='" + val + "'>" + val + "</option>");
      //
      //
      // });

      // $('#allPriority').append('<div class="col-lg-3" style="padding:10px;">\n' +
      //     '                                                    <div class="input-group">\n' +
      //     '                                                        <input id="phone" class="form-control input-transparent  mask" required="required" type="text" name="phone" maxlength="28" value="'+testJson.priority_list[getPriorty].alert_name+'" style="height: 26px;">\n' +
      //     '                                                        <span class="input-group-btn">\n' +
      //     '                                                            <div class="select"><select id="selectbox1" class="input-transparent mask s-hidden" data-style="btn-default" data-width="auto">\n' +
      //     '                                                                <option>P1</option>\n' +
      //     '                                                                <option>P2</option>\n' +
      //     '                                                                <option>P3</option>\n' +
      //     '                                                            </select><div class="styledSelect">'+testJson.priority_list[getPriorty].priority+'</div><ul class="options" style="display: none;"><li rel="P1">P1</li><li rel="P2">P2</li><li rel="P3">P3</li></ul></div>\n' +
      //     '                                                        </span>\n' +
      //     '                                                    </div>\n' +
      //     '                                                </div>');

      // for(getPriortyList=0;getPriortyList<testJson.priority_list.length;getPriortyList++){

      // $("select[name="+testJson.priority_list[getPriortyList].alert_name+"]:eq(0)").

      // $('#'+remove_slash).first().val(testJson.priority_list[getPriortyList].priority);

      // for(showAll=0;showAll<testJson.priorities.length;showAll++){
      //     console.log($('#'+testJson.priority_list[getPriortyList].alert_name).append("<option>"+testJson.priorities[showAll]+"</option>"));
      // }
      // console.log(testJson.priority_list[getPriortyList].alert_name);

      // }
    }

    //
  });

  // $(".prioritySelectiontest").change(function () {
  //     var end = this.value;
  //
  //     console.log(this.testval)
  //
  //     var alertName = $('.prioritySelection').attr('name')
  //     Messenger().post({
  //         message: 'Priority change successfully',
  //         type: 'success',
  //         showCloseButton: true
  //     });
  // });
};

//change password field to text field to see smtp password
changeTypeSMTP = function () {
  if ($("#passwordSMTPDXB").attr("type") == "password") {
    $("#passwordSMTPDXB").attr("type", "text");
  } else {
    $("#passwordSMTPDXB").attr("type", "password");
  }
};

// $(".prioritySelection").on('change',function(){
//     console.log("here")
//     console.log($(".prioritySelection").val());
// });

$(".prioritySelection").on("keyup", function () {
  // $('.prioritySelection').html($(this).val());
  console.log($(this).val());
});

// $(".prioritySelection").change(function () {
//     var end = this.value;
//     console.log(end);
// });

//get current SMTP details
modifySMTP = function () {
  // var fileref = document.createElement("link");
  // fileref.rel = "stylesheet";
  // fileref.type = "text/css";
  // fileref.href = "/js/dropdownbox/dropdown.css";
  // document.getElementsByTagName("head")[0].appendChild(fileref)
  // getScripts(["/js/dropdownbox/dropdown.js"], function () {
  //     sidebarlist();
  // });
  $("#serverSMTPDXB").val("");
  $("#portSMTPDXB").val("");
  $("#emailSMTPDXB").val("");
  $("#passwordSMTPDXB").val("");
  $("#passwordSMTPDXB").attr("type", "password");
  $("#modifySMTPDXB").modal("show");

  var settings = {
    async: true,
    crossDomain: true,
    url: "/getsmtp",
    method: "GET",
    headers: {
      "cache-control": "no-cache",
      "postman-token": "61095204-3cc6-131a-0ac1-721195054aee",
    },
  };

  $.ajax(settings)
    .done(function (response) {
      console.log(response.smtp.length);
      if (response.smtp.length > 0) {
        $("#serverSMTPDXB").val(response.smtp[0].smtp_server);
        $("#portSMTPDXB").val(response.smtp[0].smtp_port);
        $("#emailSMTPDXB").val(response.smtp[0].smtp_email_id);
        $("#passwordSMTPDXB").val(response.smtp[0].smtp_passwd);
      } else {
      }
    })
    .fail(function (error) {
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
};

modifyLicense = function () {
  $("#lisenceFiled").val("");
  // $('#modifySMTPDXB').modal('show');

  var settings = {
    async: true,
    crossDomain: true,
    url: "/getlicense",
    method: "GET",
    headers: {
      "cache-control": "no-cache",
      "postman-token": "61095204-3cc6-131a-0ac1-721195054aee",
    },
  };

  $.ajax(settings)
    .done(function (response) {
       if (response.Failure) {
        Messenger().post({
          message: response.Failure,
          type: "error",
          showCloseButton: true,
        });
        return
      }


     if (response.data.length > 0) {
        $("#lisenceFiled").val(response.data[0].license_key);
      } else {
      }
    })
    .fail(function (error) {
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
};

modifyMessage = function () {
  $("#lisenceFiled").val("");
  // $('#modifySMTPDXB').modal('show');

  var settings = {
    async: true,
    crossDomain: true,
    url: "/gettwilio",
    method: "GET",
    headers: {
      "cache-control": "no-cache",
      "postman-token": "61095204-3cc6-131a-0ac1-721195054aee",
    },
  };

  $.ajax(settings)
    .done(function (response) {
      if (response.twilio.length > 0) {
        $("#sender_contact").val(response.twilio[0].from_phone_no);
        $("#twillio_sid").val(response.twilio[0].twilio_sid);
        $("#twillo_auth").val(response.twilio[0].twilio_auth_id);
      } else {
      }
    })
    .fail(function (error) {
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
};

configuremessage = function () {
  if ($("#sender_contact").val() == "") {
    Messenger().post({
      message: "Please add sender contact",
      type: "error",
      showCloseButton: true,
    });
  } else if ($("#twillio_sid").val() == "") {
    Messenger().post({
      message: "Please add twilio SID",
      type: "error",
      showCloseButton: true,
    });
  } else if ($("#twillo_auth").val() == "") {
    Messenger().post({
      message: "Please add twilio authention code",
      type: "error",
      showCloseButton: true,
    });
  } else {
    $(".mailSMTPload").show();

    var messageJSON = {
      from_phone_no: $("#sender_contact").val(),
      twilio_sid: $("#twillio_sid").val(),
      twilio_auth_id: $("#twillo_auth").val(),
    };

    var settings = {
      async: true,
      crossDomain: true,
      url: "/addtwilio",
      method: "POST",
      headers: {
        "content-type": "application/json",
        "cache-control": "no-cache",
        "postman-token": "8afca705-1d1f-9634-8a61-4b3b2392f064",
      },
      processData: false,
      data: JSON.stringify(messageJSON),
    };

    $.ajax(settings)
      .done(function (response) {
        if (response.data.status == "success") {
          $(".mailSMTPload").hide();
          // $('#modifySMTPDXB').modal('hide');
          // $('.modal-backdrop').remove();
          Messenger().post({
            message: "Message configuration changed successfully",
            type: "success",
            showCloseButton: true,
          });
        } else {
        }
      })
      .fail(function (error) {
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
};

configureLicense = function () {
  if ($("#lisenceFiled").val() == "") {
    Messenger().post({
      message: "Please add license key",
      type: "error",
      showCloseButton: true,
    });
  }else if($("#lisenceFiled").val().includes(" ")){
    Messenger().post({
      message: "Please remove spaces from license key",
      type: "error",
      showCloseButton: true,
    });
  } else {
    var licenseJSON = {
      license_key: $("#lisenceFiled").val(),
    };

    var settings = {
      async: true,
      crossDomain: true,
      url: "addlicense",
      method: "POST",
      headers: {
        "content-type": "application/json",
        "cache-control": "no-cache",
        "postman-token": "8afca705-1d1f-9634-8a61-4b3b2392f064",
      },
      processData: false,
      data: JSON.stringify(licenseJSON),
    };

    $.ajax(settings)
      .done(function (response) {
        if (response.data?.status == "success") {
          $(".mailSMTPload").hide();
          // $('#modifySMTPDXB').modal('hide');
          // $('.modal-backdrop').remove();
          Messenger().post({
            message: "License configuration changed successfully",
            type: "success",
            showCloseButton: true,
          });
        } else {
          Messenger().post({
            message: response.Failure,
            type: "error",
            showCloseButton: true,
          });
        }
      })
      .fail(function (error) {
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
};

configureSMTP = function () {
  if ($("#emailSMTPDXB").val() == "") {
    Messenger().post({
      message: "Add SMTP email",
      type: "error",
      showCloseButton: true,
    });
  } else if ($("#passwordSMTPDXB").val() == "") {
    Messenger().post({
      message: "Add SMTP password",
      type: "error",
      showCloseButton: true,
    });
  } else if ($("#serverSMTPDXB").val() == "") {
    Messenger().post({
      message: "Add SMTP server",
      type: "error",
      showCloseButton: true,
    });
  } else if ($("#portSMTPDXB").val() == "") {
    Messenger().post({
      message: "Add SMTP port",
      type: "error",
      showCloseButton: true,
    });
  } else {
    var re = /\S+@\S+\.\S+/;
    if (re.test($("#emailSMTPDXB").val()) == false) {
      Messenger().post({
        message: "Please add valid SMTP email.",
        type: "error",
        showCloseButton: true,
      });
    } else {
      $(".mailSMTPload").show();
      var smtpJSON = {
        smtp_server: $("#serverSMTPDXB").val(),
        smtp_port: $("#portSMTPDXB").val(),
        smtp_email_id: $("#emailSMTPDXB").val(),
        smtp_passwd: $("#passwordSMTPDXB").val(),
      };

      var settings = {
        async: true,
        crossDomain: true,
        url: "/addsmtp",
        method: "POST",
        headers: {
          "content-type": "application/json",
          "cache-control": "no-cache",
          "postman-token": "8afca705-1d1f-9634-8a61-4b3b2392f064",
        },
        processData: false,
        data: JSON.stringify(smtpJSON),
      };

      $.ajax(settings)
        .done(function (response) {
          if (response.data.status == "success") {
            $(".mailSMTPload").hide();
            // $('#modifySMTPDXB').modal('hide');
            // $('.modal-backdrop').remove();
            Messenger().post({
              message: "Mail configuration changed successfully",
              type: "success",
              showCloseButton: true,
            });
          } else {
          }
        })
        .fail(function (error) {
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
};

function getScripts(scripts, callback) {
  var progress = 0;
  scripts.forEach(function (script) {
    $.getScript(script, function () {
      if (++progress == scripts.length) callback();
    });
  });
}

function allowNumbersOnly(e) {
  var code = e.which ? e.which : e.keyCode;
  if (code > 31 && (code < 48 || code > 57)) {
    e.preventDefault();
  }
}




function getServiceDefaultParams(){
  
  $("#lisenceFiled").val("");
  // $('#modifySMTPDXB').modal('show');

  var settings = {
    async: true,
    crossDomain: true,
    url: "/showdefaultcounters",
    method: "GET",
    headers: {
      "cache-control": "no-cache",
      "postman-token": "61095204-3cc6-131a-0ac1-721195054aee",
    },
  };

  $.ajax(settings)
    .done(function (response) {
       if (response.Failure) {
        Messenger().post({
          message: response.Failure,
          type: "error",
          showCloseButton: true,
        });
        return
      }


      default_params = response.default_params


     
     for (const [key, value] of Object.entries(response.default_params)) {
      $("#defaultparacontainer").append(`
          <div class="col-lg-4">
                                <div class="form-group tempsing-formsmtp">
                                  <label style="color: #d2d2d2;text-transform: capitalize;" for="${key}"
                                    >${key.replaceAll("default","").replaceAll("_"," ")} ${key.includes("duration")? " (in seconds)" :""}</label
                                  >
                                  <input
                                    type="text"
                                    style="
                                      border-radius: 2px;
                                      background-color: rgb(
                                        54 66 78 / 55%
                                      ) !important;
                                      border: 0px;
                                      color: #fff;
                                    "
                                    value=${value}
                                    class="form-control"
                                    id="${key}"
                                  />
                                </div>
                              </div>`)

}


     
    })
    .fail(function (error) {
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


function configureDefaultParams (){
  for (const [key, value] of Object.entries(default_params)) {
    default_params[key] = $("#"+key).val()
}

  $.post("/updatedefaultcounters", {default_params},function(response){
    if (response.Failure) {
        Messenger().post({
          message: response.Failure,
          type: "error",
          showCloseButton: true,
        });
        return
      }

      Messenger().post({
          message:"Default parameters updated!",
          type: "success",
          showCloseButton: true,
        });
  } )

}