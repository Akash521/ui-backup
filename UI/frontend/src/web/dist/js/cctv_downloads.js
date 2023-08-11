var today = new Date()
var onemonthprev = new Date(new Date().setDate(new Date().getDate() - 30));

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

$("#poifromdate").datetimepicker({
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

$("#voifromdate").datetimepicker({
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

$("#allfromdate").datetimepicker({
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

$("#poitodate").datetimepicker({
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
  minDate: onemonthprev,
  defaultDate: null,
  // debug: true,
});
$("#voitodate").datetimepicker({
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
  minDate: onemonthprev,
  defaultDate: null,
  // debug: true,
});

$("#alltodate").datetimepicker({
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
  minDate: onemonthprev,
  defaultDate: null,
  // debug: true,
});


$("#poifromdate").val(formatDateTime(onemonthprev));
$("#voifromdate").val(formatDateTime(onemonthprev));
$("#allfromdate").val(formatDateTime(onemonthprev));



$("#poifromdate").blur(function () {
  $("#poitodate").datetimepicker("destroy");
  $("#poitodate").datetimepicker({
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
    minDate: new Date($("#poifromdate").val()),
    defaultDate: null,
  });
})

$("#voifromdate").blur(function () {
  $("#voitodate").datetimepicker("destroy");
  $("#voitodate").datetimepicker({
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
    minDate: new Date($("#voifromdate").val()),
    defaultDate: null,
  });
})


$("#allfromdate").blur(function () {
  $("#alltodate").datetimepicker("destroy");
  $("#alltodate").datetimepicker({
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
    minDate: new Date($("#allfromdate").val()),
    defaultDate: null,
  });
})


function downloadVOICSV(){

    var data = {
        from_date: $("#voifromdate").val(),
        to_date: $("#voitodate").val(),
        type: "VOI"

    }

    $.post("/getpoivoicsv", data, function(response){
        console.log(response)
        if(response.Failure) {
                Messenger().post({
                  message: response.Failure,
                  type: "error",
                  showCloseButton: true,
                });
                return;
              }

              downloadCSV("http://"+ base_domainip + "/nginx/"+ response.data.file_path)
    })


    
}


function downloadPOICSV(){
     var data = {
        from_date: $("#poifromdate").val(),
        to_date: $("#poitodate").val(),
        type: "POI"
    }
    $.post("/getpoivoicsv", data, function(response){
        console.log(response)
        if(response.Failure) {
                Messenger().post({
                  message: response.Failure,
                  type: "error",
                  showCloseButton: true,
                });
                return;
              }

              downloadCSV("http://"+ base_domainip + "/nginx/"+ response.data.file_path)
    })
}



function downloadCSV(link){
     var a = document.createElement("a");
                a.href = link;
                a.download = "RavenAlerts.csv";
                a.click();
}



function downloadALLCSV(){
  var data = {
        from_alert_date: $("#allfromdate").val(),
        to_alert_date: $("#alltodate").val(),
        area: "",
        cam_name: "",
        city: "",
        location: "",
        priority: "",
        state: "",
    }

    $.post("/downloadAlertCSV", data, function(response){
        console.log(response)
        if(response.Failure) {
                Messenger().post({
                  message: response.Failure,
                  type: "error",
                  showCloseButton: true,
                });
                return;
              }

              downloadCSV("http://"+response.data.file_path)
    })
}