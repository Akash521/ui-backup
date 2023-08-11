//show all users not admin
$("#adduser_loader").hide();


  if(userloginstatus !== "super_administrator"){
    $("#addStatusDXB option[value=super_administrator]").remove()
  }



getusers = function () {
  let table;
  $("#loading-spinner").show();
  $("#tble_cc").empty();
  var settings = {
    async: true,
    crossDomain: true,
    url: "/getusers",
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
  $("#loading-spinner").hide();

  $("#tble_cc").empty();
      $("#tble_cc").append(
        '<table id="user-datatable-table" class="table table-striped table-hover"> <thead> <tr> <th>Name</th> <th class=" hidden-xs"> Employee Id</th> <th class=" hidden-xs"> Email</th> <th class="hidden-xs">Status</th> <th class="hidden-xs">Account Name</th>  <th class=" hidden-xs"> Action</th> </tr> </thead> <tbody id="allusers" ></tbody> </table>'
      );

    if (response.Failure) {
      Messenger().post({
        message: response.Failure,
        type: "error",
        showCloseButton: true,
      });
    } else {
      $("#card_users_login").empty();
      $("#card_users_on").empty();
      $("#card_users_off").empty();
      $("#card_users_total").empty();
      $("#card_pending_p1").empty();
      $("#card_pending_p2").empty();
      $("#card_pending_p3").empty();
      $("#card_pending_total").empty();
      $("#card_resolved_p1").empty();
      $("#card_resolved_p2").empty();
      $("#card_resolved_p3").empty();
      $("#card_resolved_total").empty();
      $("#card_total_p1").empty();
      $("#card_total_p2").empty();
      $("#card_total_p3").empty();
      $("#card_total").empty();

      // $("#card_users_login").text(response.total.total_loggedin_users);
      // $("#card_users_on").text(response.total.total_online_users);
      // $("#card_users_off").text(response.total.total_offline_users);
      // $("#card_users_total").text(response.total.total_users);
      // $("#card_pending_p1").text(response.total.p1_total_assigned);
      // $("#card_pending_p2").text(response.total.p2_total_assigned);
      // $("#card_pending_p3").text(response.total.p3_total_assigned);
      // $("#card_pending_total").text(response.total.total_assigned);
      // $("#card_resolved_p1").text(response.total.p1_total_resolved);
      // $("#card_resolved_p2").text(response.total.p2_total_resolved);
      // $("#card_resolved_p3").text(response.total.p3_total_resolved);
      // $("#card_resolved_total").text(response.total.total_resolved);
      // $("#card_total_p1").text(response.total.p1_total);
      // $("#card_total_p2").text(response.total.p2_total);
      // $("#card_total_p3").text(response.total.p3_total);
      // $("#card_total").text(response.total.total);
      // $(".card_counter_number").each(function () {
      //   $(this)
      //       .prop("Counter", 0)
      //       .animate(
      //           {
      //             Counter: $(this).text(),
      //           },
      //           {
      //             duration: 3000,
      //             easing: "swing",
      //             step: function (now) {
      //               $(this).text(Math.ceil(now));
      //             },
      //           }
      //       );
      // });

      $("#loading-spinner").hide();

      
      if (response.users.length > 0) {
        var count = 0;
        for (i = 0; i < response.users.length; i++) {
          count += 1;
          if (response.users[i].status == "Admin") {
          } else {
            var status;
            switch (response.users[i].staff_status) {
              case "super_administrator":
                status = "Super Administrator";
                break;
              case "administrator":
                status = "Administrator";
                break;
              case "support":
                status = "Support";
                break;
              case "security":
                status = "Security";
                break;
              case "helpdesk":
                status = "Helpdesk";
                break;
              default:
                status = "Invalid";
            }
            // console.log(response.users[i]);
            $("#allusers").append(
              "<tr id=" +
                response.users[i].employee_id +
                ">" +
                '<td style=" vertical-align:middle;"><a class="fw-semi-bold getUserDetails">' +
                response.users[i].name +
                '</a></td><td class="hidden-xs"> <span class="">' +
                response.users[i].employee_id +
                '</span> </td> <td class="hidden-xs"> <span class="">' +
                response.users[i].username +
                '</span> </td> <td class="hidden-xs"><span >' +
                status +
                '</span></td>  <td class="hidden-xs"><span >' +
                response.users[i].account_name
                  .replace("_", " ")
                  .charAt(0)
                  .toUpperCase() +
                response.users[i].account_name.replace("_", " ").slice(1) +
                "</span></td>" +
                '<td class="hidden-xs"><span style="width: 31px;" title="Delete User" class="btn btn-transparent btn-sm  pull-left deleteUsersDXB" id="deleteuser" onclick="deleteuser(this)" unid=' +
                response.users[i].employee_id +
                "  username=" +
                response.users[i].username +
                '  > <i class="fa fa-trash"></i> </span></td> </tr>'
            );
          }
          // $("#allcamsDXB").append('<tr><td>'+count+'</td><td><a class="fw-semi-bold getFlightDetails" get_camDXB='+response.cam_list[i].cam_name+'  style="cursor: pointer">' + response.cam_list[i].airport_name + "--" + response.cam_list[i].terminal + "--" + response.cam_list[i].cam_name + '</a></td> <td class="hidden-xs"> <span class="">' + response.cam_list[i].stand_type + '</span> </td> <td class="hidden-xs"><span >' + response.cam_list[i].aircraft_stand + '</span></td> <td class="hidden-xs">' + response.cam_list[i].cam_add_time + '</td></tr>');
        }
      }

     
    }
     var unsortableColumns = [];
      $("#user-datatable-table")
        .find("thead th")
        .each(function () {
          if ($(this).hasClass("no-sort")) {
            unsortableColumns.push({ bSortable: false });
          } else {
            unsortableColumns.push(null);
          }
        });
      $("#user-datatable-table").dataTable({
          order: [],
        destroy: true,
        // order: [[6, "desc"]],
        sDom: "<'row'<'col-md-6 hidden-xs'l><'col-md-6'f>r>t<'row'<'col-md-6'i><'col-md-6'p>>",

        oLanguage: {
          sLengthMenu: "_MENU_",
          sInfo: "Showing <strong>_START_ to _END_</strong> of _TOTAL_ users",
          sEmptyTable: "No Users Found !!",
          sInfoEmpty: "Showing <strong>0 to _END_</strong> of _TOTAL_ User",
          sInfoFiltered: "( Filterd from _MAX_ Users )",
          sZeroRecords: "No matching Users found !!",
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
        // sPaginationType: "bootstrap",
        // scrollX: true,
      });

      $("#datatable-table_length > label > select").css({
        "background-color": "rgba(51, 51, 51, 0.425)",
        border: "none",
      });
  });
};

//add user
addUser = function () {
  $("#addUsernameDXB").val("");
  $("#addnameDXB").val("");
  $("#addEmailDXB").val("");
  $("#addPasswordDXB").val("");
  $("#addStatusDXB").val("");
  $("#addDesignationDXB").val("");
  $("#addContactDXB").val("");
  $("#addempidDXB").val("");
  $("#addUserDXB").modal("show");
};

//Delete camera function
deleteCamDXB = function () {
  $("#deleteCamDXB").modal("show");
  $("#camDxblocal").empty();
  $("#camDxblocal").append(localStorage.getItem("camName-DXB"));
};

//change password field to text field to see smtp password
changeTypeSMTP = function () {
  if ($("#passwordSMTPDXB").attr("type") == "password") {
    $("#passwordSMTPDXB").attr("type", "text");
  } else {
    $("#passwordSMTPDXB").attr("type", "password");
  }
};

//get current SMTP details
modifySMTP = function () {
  $("#serverSMTPDXB").val("");
  $("#portSMTPDXB").val("");
  $("#emailSMTPDXB").val("");
  $("#passwordSMTPDXB").val("");
  $("#passwordSMTPDXB").attr("type", "password");
  $("#modifySMTPDXB").modal("show");

  // var settings = {
  //   async: true,
  //   crossDomain: true,
  //   url:
  //     "http://" +
  //     base_domainip +
  //     "/event-app/get_smtp/saurabh/saurabh",
  //   method: "GET",
  //   headers: {
  //     "cache-control": "no-cache",
  //     "postman-token": "61095204-3cc6-131a-0ac1-721195054aee",
  //   },
  // };

  // $.ajax(settings).done(function (response) {
  //   if (response.smtp.length > 0) {
  //     $("#serverSMTPDXB").val(response.smtp[0].smtp_server);
  //     $("#portSMTPDXB").val(response.smtp[0].smtp_port);
  //     $("#emailSMTPDXB").val(response.smtp[0].smtp_email_id);
  //     $("#passwordSMTPDXB").val(response.smtp[0].smtp_passwd);
  //   } else {
  //   }
  // });
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
      var smtpJSON = {
        smtp_server: $("#serverSMTPDXB").val(),
        smtp_port: $("#portSMTPDXB").val(),
        smtp_email_id: $("#emailSMTPDXB").val(),
        smtp_passwd: $("#passwordSMTPDXB").val(),
      };

      // var settings = {
      //   async: true,
      //   crossDomain: true,
      //   url:
      //     "http://" +
      //     base_domainip +
      //     "/event-app/add_smtp/saurabh/saurabh",
      //   method: "POST",
      //   headers: {
      //     "content-type": "application/json",
      //     "cache-control": "no-cache",
      //     "postman-token": "8afca705-1d1f-9634-8a61-4b3b2392f064",
      //   },
      //   processData: false,
      //   data: JSON.stringify(smtpJSON),
      // };

      // $.ajax(settings).done(function (response) {
      //   if (response.status == "success") {
      //     $("#modifySMTPDXB").modal("hide");
      //   } else {
      //   }
      // });
    }
  }
};

//add or change SMTP Details

$("#addEmailDXB,#addPasswordDXB,#addContactDXB,#addempidDXB").keydown((e) => {
  if (e.key == " " || e.key == '"' || e.key == "'" || e.key == "`") {
    return false;
  }
});

$("#addStatusDXB").change(function () {
  if ($("#addStatusDXB").val() == "support") {
    $("#div_employee_id").show();
  } else {
    $("#div_employee_id").hide();
  }
});
addDetailsDXB = function () {
  if ($("#addUsernameDXB").val()?.trim() == "") {
    Messenger().post({
      message: "Add username",
      type: "error",
      showCloseButton: true,
    });
  } else if ($("#addnameDXB").val()?.trim() == "") {
    Messenger().post({
      message: "Add Name",
      type: "error",
      showCloseButton: true,
    });
  } else if ($("#addEmailDXB").val()?.trim() == "") {
    Messenger().post({
      message: "Add Email",
      type: "error",
      showCloseButton: true,
    });
  } else if ($("#addPasswordDXB").val()?.trim() == "") {
    Messenger().post({
      message: "Add Password",
      type: "error",
      showCloseButton: true,
    });
  } else if ($("#addPasswordDXB").val()?.trim().length < 6) {
    Messenger().post({
      message: "Password is too small",
      type: "error",
      showCloseButton: true,
    });
  } else if ($("#addStatusDXB").val()?.trim() == "") {
    Messenger().post({
      message: "Add Status",
      type: "error",
      showCloseButton: true,
    });
  } else if ($("#addDesignationDXB").val()?.trim() == "") {
    Messenger().post({
      message: "Add designation",
      type: "error",
      showCloseButton: true,
    });
  } else if ($("#addContactDXB").val()?.trim() == "") {
    Messenger().post({
      message: "Add Contact Number",
      type: "error",
      showCloseButton: true,
    });
  } else if (
    $("#addempidDXB").val()?.trim() == "" &&
    $("#addStatusDXB").val() == "support"
  ) {
    Messenger().post({
      message: "Add Employee ID",
      type: "error",
      showCloseButton: true,
    });
  } else if ($("#addContactDXB").val()?.trim().length !== 10) {
    Messenger().post({
      message: "Please add valid contact number",
      type: "error",
      showCloseButton: true,
    });
  } else {
    var re = /\S+@\S+\.\S+/;
    if (re.test($("#addEmailDXB").val()) == false) {
      Messenger().post({
        message: "Please add valid email.",
        type: "error",
        showCloseButton: true,
      });
    } else {
      var jsonadd = {
        // employee_id: $("#addempidDXB").val(),
        password: $("#addPasswordDXB").val(),
        name: titleCase($("#addUsernameDXB").val()),
        email: $("#addEmailDXB").val(),
        status: $("#addStatusDXB").val(),
        // designation: $("#addDesignationDXB").val(),
        contact: $("#addContactDXB").val(),
      };

      // var ad;
      // if ($("#addStatusDXB").val() == "support") {
      //   ad =
      //     "&name=" +
      //     $("#addnameDXB").val() +
      //     "&password=" +
      //     $("#addPasswordDXB").val() +
      //     "&email=" +
      //     $("#addEmailDXB").val() +
      //     "&status=" +
      //     $("#addStatusDXB").val() +
      //     "&contact=" +
      //     $("#addContactDXB").val() +
      //     "&employee_id=" +
      //     $("#addempidDXB").val();
      // } else {
      //   ad =
      //     "&name=" +
      //     $("#addnameDXB").val() +
      //     "&password=" +
      //     $("#addPasswordDXB").val() +
      //     "&email=" +
      //     $("#addEmailDXB").val() +
      //     "&status=" +
      //     $("#addStatusDXB").val() +
      //     "&contact=" +
      //     $("#addContactDXB").val() +
      //     "&employee_id=''";
      // }

      $("#adduser_loader").show();
      $.ajax({
        type: "POST",
        url: "/adduser",
        data: jsonadd,
        dataType: "json",
        success: function (response) {
          $("#adduser_loader").hide();
          if (response.Failure) {
            Messenger().post({
              message: response.Failure,
              type: "error",
              showCloseButton: true,
            });
          } else {
            if (response.status == "user exists") {
              Messenger().post({
                message: "User Already Exist!",
                type: "error",
                showCloseButton: true,
              });
            } else {
              $("#addUserDXB").modal("hide");
              Messenger().post({
                message: "User Added Successfully!",
                type: "success",
                showCloseButton: true,
              });

              getusers();
            }
          }
        },
        error: function () {},
      });
    }
  }
};

//you can delete any user with delete icon with row
// $(document).on("click", ".deleteUsersDXB", function () {
// var username = $(this).attr("username");

// var jsonUserDXB = {
//   username: username,
// };
// var settings = {
//   async: true,
//   crossDomain: true,
//   url: "/deleteuser",
//   method: "POST",
//   headers: {
//     "content-type": "application/json",
//     "cache-control": "no-cache",
//   },
//   processData: false,
//   data: JSON.stringify(jsonUserDXB),
// };

// var therow = this;

// $.ajax(settings).done(function (response) {
//   if (response.data.status == "success") {
//     var tablename = $(therow).closest("table").DataTable();
//     tablename.row($(therow).parents("tr")).remove().draw(false);
//     Messenger().post({
//       message: "Deleted user successfully",
//       type: "success",
//       showCloseButton: true,
//     });
//   } else {
//     Messenger().post({
//       message: "Sorry please try again.",
//       type: "error",
//       showCloseButton: true,
//     });
//   }
// });
// });
function deleteuser(row) {
  var username = $(row).attr("username");
  $("#deleteusername").empty();
  $("#deleteusername").text(username);
  $("#confirm").modal("show");
  var jsonUserDXB = {
    username: username,
  };
  var settings = {
    async: true,
    crossDomain: true,
    url: "/deleteuser",
    method: "POST",
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
    },
    processData: false,
    data: JSON.stringify(jsonUserDXB),
  };
  var therow = row;
  $.ajax(settings).done(function (response) {
    if (response.Failure) {
      Messenger().post({
        message: response.Failure,
        type: "error",
        showCloseButton: true,
      });
    } else {
      if (response.data.status == "success") {
        var tablename = $(therow).closest("table").DataTable();
        tablename.row($(therow).parents("tr")).remove().draw(false);
        Messenger().post({
          message: "User Deleted Successfully!",
          type: "success",
          showCloseButton: true,
        });
      } else {
        Messenger().post({
          message: "Sorry please try again.",
          type: "error",
          showCloseButton: true,
        });
      }
    }
  });

  $("#cancel").on("click", function (e) {
    e.preventDefault();
    $("#confirm").modal.model("hide");
  });
}

function useralerts(
  assigned_P1,
  resolved_P1,
  total_P1,
  assigned_P2,
  resolved_P2,
  total_P2,
  assigned_P3,
  resolved_P3,
  total_P3,
  total_count,
  assigned_total,
  resolved_total,
  user_status,
  user_name
) {
  if (user_status == "support") {
    $("#useralertscount").modal("show");
    $("#useralertscountdatatable").empty();
    $("#useralertsmodaltitle").empty();
    $("#useralertsmodaltitle").append(user_name);
    $("#useralertscountdatatable").append(
      '<table id="user-alerts-datatable-table" class="table table-striped table-hover"> <thead> <tr> <th> </th> <th class=" hidden-xs"> Pending</th> <th class="hidden-xs">Resolved</th> <th class="hidden-xs">Total</th> </tr> </thead> <tbody style="color:var(--white);" id="useralerts" ></tbody> </table>'
    );
    $("#useralerts").append(
      '<tr><td style=" vertical-align:middle;font-weight: 600;">P1</td><td class="hidden-xs"> <span class="">' +
        assigned_P1 +
        '</span> </td> <td class="hidden-xs"><span >' +
        resolved_P1 +
        '</span></td>  <td class="hidden-xs"><span >' +
        total_P1 +
        "</span></td></tr>" +
        '<tr><td style=" vertical-align:middle;font-weight: 600;">P2</td><td class="hidden-xs"> <span class="">' +
        assigned_P2 +
        '</span> </td> <td class="hidden-xs"><span >' +
        resolved_P2 +
        '</span></td>  <td class="hidden-xs"><span >' +
        total_P2 +
        "</span></td></tr>" +
        '<tr><td style=" vertical-align:middle;font-weight: 600;">P3</td><td class="hidden-xs"> <span class="">' +
        assigned_P3 +
        '</span> </td> <td class="hidden-xs"><span >' +
        resolved_P3 +
        '</span></td>  <td class="hidden-xs"><span >' +
        total_P3 +
        "</span></td></tr>" +
        '<tr><td style=" vertical-align:middle;font-weight: 600;">All</td><td class="hidden-xs"> <span class="">' +
        assigned_total +
        '</span> </td> <td class="hidden-xs"><span >' +
        resolved_total +
        '</span></td>  <td class="hidden-xs"><span >' +
        total_count +
        "</span></td></tr>"
    );
    $("#user-alerts-datatable-table").dataTable({
          order: [],
      destroy: true,
      sDom: "<'row'<'col-md-6 hidden-xs'l><'col-md-6'f>r>t<'row'<'col-md-6'i><'col-md-6'p>>",
      oLanguage: {
        sLengthMenu: "_MENU_",
        sInfo: "Showing <strong>_START_ to _END_</strong> of _TOTAL_ users",
        sEmptyTable: "No Alerts Found !!",
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
  } else {
  }
}




function titleCase(str) {
   var splitStr = str.toLowerCase().split(' ');
   for (var i = 0; i < splitStr.length; i++) {
       // You do not need to check if i is larger than splitStr length, as your for does that for you
       // Assign it back to the array
       splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
   }
   // Directly return the joined string
   return splitStr.join(' '); 
}