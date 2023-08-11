//get users profile data
$(".navbar-dark a").removeClass("active-li");
// getUserprofileDXB = function () {
//   var settings = {
//     async: true,
//     crossDomain: true,
//     url:
//       "http://" +
//       base_domainip +
//       "/event-app/get_user_details/saurabh/saurabh/" +
//       localStorage.getItem("useruniqueIdDXB"),
//     method: "GET",
//     headers: {
//       "cache-control": "no-cache",
//     },
//   };
// $.ajax(settings).done(function (response) {
//   console.log(response);

//   if (response.user_detail.length > 0) {
//     localStorage.setItem("userprofileDetailsDXB", JSON.stringify(response));
//     $("#profileNameDXB").append(response.user_detail[0].username);
//     $("#profileEmailDXB").append(response.user_detail[0].email);
//     $("#profiilePhoneDXB").append(response.user_detail[0].contact);
//   }
// });
// };

// change user password
// changeUserProfilePassword = function () {

//     var userdata =JSON.parse(localStorage.getItem('userprofileDetailsDXB'));

//     console.log(userdata)
//     if($('#currentPassword').val() == userdata.user_detail[0].password){
//         $('#currentPassword').val();
//         if($('#newPassword').val() == $('#confPassword').val()){

//             var datalocalStorage =JSON.parse(localStorage.getItem('userprofileDetailsDXB'));
//             datalocalStorage.user_detail[0].password =$('#newPassword').val();

//             var objJSOND=datalocalStorage.user_detail[0];
//             console.log(objJSOND)
//             delete objJSOND._id;

//             var settings = {
//                 "async": true,
//                 "crossDomain": true,
//                 "url": "http://"+base_domainip+"/event-app/modify_user/saurabh/saurabh",
//                 "method": "POST",
//                 "headers": {
//                     "content-type": "application/json",
//                     "cache-control": "no-cache",
//                 },
//                 "processData": false,
//                 "data":JSON.stringify(objJSOND)
//             }

//             $.ajax(settings).done(function (response) {
//                 if(response.status =="success"){
//                     Messenger().post({
//                         message: 'Password change successfully',
//                         type: 'success',
//                         showCloseButton: true
//                     });
//                 }

//             });

//         }

//     }else {
//         Messenger().post({
//             message: 'Current password is not match',
//             type: 'error',
//             showCloseButton: true
//         });
//     }

// };

$.get("/userprofiledata", function (data, status) {
  $("#profileEmailDXB").append(data.email);
});
const ChangeProfilePassword = () => {
  const PassData = {
    email: $("#profileEmailDXB").text(),
    current: $("#currentPassword").val(),
    new: $("#newPassword").val(),
    confirm: $("#confPassword").val(),
  };
  $.post("/changepassword", PassData, function (data) {
    if (data.Failure) {
      Messenger().post({
        message: data.Failure,
        type: "error",
        showCloseButton: true,
      });
    } else if (data.data.status !== "success") {
      Messenger().post({
        message: data.data.status,
        type: "error",
        showCloseButton: true,
      });
    } else {
      Messenger().post({
        message: "Password Changed",
        type: "success",
        showCloseButton: true,
      });
      $("#currentPassword").val("");
      $("#newPassword").val("");
      $("#confPassword").val("");
    }
  });
};
