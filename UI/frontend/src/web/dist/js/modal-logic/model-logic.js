function alertMe(theSelect) {
  var setPriortiyJson = {
    new_priority: [
      {
        alert_name: theSelect.name,
        priority: theSelect.value,
      },
    ],
    //
  };
  console.log(setPriortiyJson);
  //
  var settings = {
    async: true,
    crossDomain: true,
    url: "/setpriority",
    method: "POST",
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
      "postman-token": "9711da92-0f3c-82c1-9cee-a093f27c38eb",
    },
    processData: false,
    data: JSON.stringify(setPriortiyJson),
  };
  $.ajax(settings).done(function (response) {
    if (response.data.status == "success") {
      Messenger().post({
        message: theSelect.name + " priority change successfully",
        type: "success",
        showCloseButton: true,
      });
    } else {
      Messenger().post({
        message: "Some error encountered please try again",
        type: "error",
        showCloseButton: true,
      });
    }
  });
}
