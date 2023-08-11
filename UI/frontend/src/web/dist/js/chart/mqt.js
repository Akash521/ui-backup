// mqtt connection to get live updates events and alerts

// var connected_flag=0
// var mqtt;
// var reconnectTimeout = 2000;
// var host=base_domainip;
// var port=9001;

// var connected_flag;
// var mqtt;
// var reconnectTimeout;
// var host;
// var port;
// var uid;

// function onConnectionLost() {
//   console.log("connection lost");
//   setTimeout(MQTTconnect, reconnectTimeout);
// }
// function onFailure(message) {
//   console.log("Failed");

//   setTimeout(MQTTconnect, reconnectTimeout);
// }
// function onMessageArrived(r_message) {
//   out_msg = "Message received " + r_message.payloadString + "<br>";
//   out_msg = out_msg + "Message received Topic " + r_message.destinationName;
//   var a = r_message.payloadString;
//   var str1 = a.replace(/\'/g, '"');

//   var test2 = JSON.parse(str1);

//   console.log(test2);
//   localStorage.setItem("mqttobject", JSON.stringify(test2));
//   if (localStorage.getItem("mqttobject") == null) {
//   } else {
//     var test = JSON.parse(localStorage.getItem("mqttobject"));
//     // console.log(test)
//     // if( localStorage.getItem('camName-DXB') == test.cam_name ){

//     if(test.mqtt_flag == "0"&& window.location.pathname !== "/cctv_poilive" && window.location.pathname !== "/cctv_voilive"){
//       cameraAddition(test)
//     } else if(test.mqtt_flag == "1" && window.location.pathname !== "/cctv_poilive" && window.location.pathname !== "/cctv_voilive"){
//       cameraDeletion(test)
//     } else if (test.mqtt_flag == "2") {
//       if (window.location.pathname == "/cctv_pendingalerts") {
//         addMQTTresponse(test);
//       } else {
//         var event_name;
//         if (test.alert_2 == "") {
//           event_name = test.alert_1;
//         } else {
//           event_name = test.alert_1 + " | " + test.alert_2;
//         }
//         if(localStorage.getItem("camName-DXB") == test.cam_name){
//           if (event_name == "Stream Disconnected") {
//           $("#alertsDXBA").remove();
//           var imgThumb =
//             "http://" +
//             base_domainip +
//             "/nginx/" +
//             test.thumbnail;
//           // $('#camAlertsDXB').prepend('<li  class="getAlertData" style="margin: 0 -9px;" flight_id="'+test.flight_id+'" airport="'+test.airport+'"  terminal="'+test.terminal+'"  stand_type="'+test.stand_type+'" camName="'+test.cam_name+'"  camera_id="'+test.cam_name+'"  event_name="'+test.alert_name+'" event_url="'+test.alert_url+'" event_time="'+test.alert_time+'" status="'+test.alert_status+'"> <img src='+imgThumb+' alt="" class="pull-left img-circle"/> <div class="news-item-info"> <div class="name"><a href="#">'+test.alert_name+'</a></div> <div class="position">'+'Filght Id: '+test.flight_id+'</div> <div class="time" style="font-size: 11px;">Time: '+test.alert_time+'</div> </div> </li>');

//           var cityName = test.city + ", " + test.state;
//           $("#camAlerts" + test.priority).prepend(
//             '<li  class="" style="margin: 0 -9px;" flight_id="' +
//             test.alert_id +
//             '" airport="' +
//             cityName +
//             '"  terminal="' +
//             test.location +
//             '"  stand_type="' +
//             test.area +
//             '" camName="' +
//             test.cam_name +
//             '"  camera_id="' +
//             test.cam_name +
//             '"  event_name="' +
//             event_name +
//             '" event_url="' +
//             test.video +
//             '" event_time="' +
//             test.date +
//             '" status="' +
//             test.alert_status +
//             '"> <img src="img/camDis.jpg" alt="" class="pull-left img-circle"/> <div class="news-item-info"> <div class="name"><a href="#">' +
//             event_name +
//             '</a></div> <div class="position">' +
//             "Alert Id: " +
//             test.alert_id +
//             '</div> <div class="time" style="font-size: 11px;">Time: ' +
//             test.date +
//             "</div> </div> </li>"
//           );
//           if (document.getElementById("countId" + test.priority)) {
//             var counter = $("#countId" + test.priority).html();
//             var totalcount = parseInt(counter) + 1;
//             $("#countId" + test.priority).empty();
//             $("#countId" + test.priority).append(totalcount);
//           } else {
//             var id_count = "countId" + test.priority;
//             $(".count" + test.priority).append(
//               '<span class="label label-success" style="font-size: 10px;font-weight: 400;position: relative;right: -5px;padding: 1px 5px;" id=' +
//               id_count +
//               ">1</span>"
//             );
//           }

//           $(".panel-footer").remove();
//           $("#camAlertsP1").paginathing({
//             perPage: 8,
//             limitPagination: $(".getAlertData").length > 40 ? 5 : "",
//             containerClass: "panel-footer",
//             pageNumbers: true,
//           });
//         } else {
//           if (test.hasOwnProperty("poi_details")) {
//             if(window.location.pathname == "/cctv_poilive"){
//             appendMQTTAuth(test)
//           }
//             var string_text = "";
//             for (var key in test.poi_details) {
//               if (key != "_id" && key != "poi_face_path" && key != "poi_id") {
//                 string_text += key + " : " + test.poi_details[key] + "&#13;&#10;";
//               }
//             }

//             $("#alertsDXBA").remove();
//             var imgThumb =
//               "http://" +
//               base_domainip +
//               "/nginx/" +
//               test.thumbnail;
//             if (
//               $("#camAlerts" + test.priority).children().length == 8 ||
//               $("#camAlerts" + test.priority).children().length > 8
//             ) {
//               var cityName = test.city + ", " + test.state;
//               $("#camAlerts" + test.priority).prepend(
//                 '<li  class="getAlertData" style="margin: 0 -9px; " flight_id="' +
//                 test.alert_id +
//                 '" airport="' +
//                 cityName +
//                 '"  terminal="' +
//                 test.location +
//                 '"  stand_type="' +
//                 test.area +
//                 '" camName="' +
//                 test.cam_name +
//                 '"  camera_id="' +
//                 test.cam_name +
//                 '"  event_name="' +
//                 event_name +
//                 '" event_url="' +
//                 test.video +
//                 '" thumbnail_url="' +
//                 test.thumbnail +
//                 '" event_time="' +
//                 test.date +
//                 '" status="' +
//                 test.alert_status +
//                 '"  poi_or_voi="poi_details" poi_details="' +
//                 string_text +
//                 '" > <img src=' +
//                 imgThumb +
//                 ' alt="" class="pull-left img-circle"/> <div class="news-item-info"> <div class="name"><a href="#">' +
//                 event_name +
//                 '</a></div> <div class="position">' +
//                 "Alert Id: " +
//                 test.alert_id +
//                 '</div> <div class="time" style="font-size: 11px;">Time: ' +
//                 test.date +
//                 "</div> </div> </li>"
//               );
//               if (document.getElementById("countId" + test.priority)) {
//                 var counter = $("#countId" + test.priority).html();
//                 var totalcount = parseInt(counter) + 1;
//                 $("#countId" + test.priority).empty();
//                 $("#countId" + test.priority).append(totalcount);
//               } else {
//                 var id_count = "countId" + test.priority;
//                 $(".count" + test.priority).append(
//                   '<span class="label label-success" style="font-size: 10px;font-weight: 400;position: relative;right: -5px;padding: 1px 5px;" id=' +
//                   id_count +
//                   ">1</span>"
//                 );
//               }

//               $(".panel-footer").remove();
//               $("#camAlertsP1").paginathing({
//                 perPage: 8,
//                 limitPagination: $(".getAlertData").length > 40 ? 5 : "",
//                 containerClass: "panel-footer",
//                 pageNumbers: true,
//               });
//             } else {
//               var cityName = test.city + ", " + test.state;
//               $("#camAlerts" + test.priority).prepend(
//                 '<li  class="getAlertData" style="margin: 0 -9px;" flight_id="' +
//                 test.alert_id +
//                 '" airport="' +
//                 cityName +
//                 '"  terminal="' +
//                 test.location +
//                 '"  stand_type="' +
//                 test.area +
//                 '" camName="' +
//                 test.cam_name +
//                 '"  camera_id="' +
//                 test.cam_name +
//                 '"  event_name="' +
//                 event_name +
//                 '" event_url="' +
//                 test.video +
//                 '" thumbnail_url="' +
//                 test.thumbnail +
//                 '" event_time="' +
//                 test.date +
//                 '" status="' +
//                 test.alert_status +
//                 '" poi_or_voi="poi_details" poi_details="' +
//                 string_text +
//                 '"> <img src=' +
//                 imgThumb +
//                 ' alt="" class="pull-left img-circle"/> <div class="news-item-info"> <div class="name"><a href="#">' +
//                 event_name +
//                 '</a></div> <div class="position">' +
//                 "Alert Id: " +
//                 test.alert_id +
//                 '</div> <div class="time" style="font-size: 11px;">Time: ' +
//                 test.date +
//                 "</div> </div> </li>"
//               );
//               if (document.getElementById("countId" + test.priority)) {
//                 var counter = $("#countId" + test.priority).html();
//                 var totalcount = parseInt(counter) + 1;
//                 $("#countId" + test.priority).empty();
//                 $("#countId" + test.priority).append(totalcount);
//               } else {
//                 var id_count = "countId" + test.priority;
//                 $(".count" + test.priority).append(
//                   '<span class="label label-success" style="font-size: 10px;font-weight: 400;position: relative;right: -5px;padding: 1px 5px;" id=' +
//                   id_count +
//                   ">1</span>"
//                 );
//               }
//             }
//           } else if (test.hasOwnProperty("voi_details")) {
//             if(window.location.pathname == "/cctv_voilive"){
//             newVehicleMQTTAlert(test)
//           }
//             var string_text = "";
//             for (var key in test.voi_details) {
//               if (key != "_id") {
//                 string_text += key + " : " + test.voi_details[key] + "&#13;&#10;";
//               }
//             }
//             $("#alertsDXBA").remove();
//             var imgThumb =
//               "http://" +
//               base_domainip +
//               "/nginx/" +
//               test.thumbnail;
//             if (
//               $("#camAlerts" + test.priority).children().length == 8 ||
//               $("#camAlerts" + test.priority).children().length > 8
//             ) {
//               var cityName = test.city + ", " + test.state;
//               $("#camAlerts" + test.priority).prepend(
//                 '<li  class="getAlertData" style="margin: 0 -9px; " flight_id="' +
//                 test.alert_id +
//                 '" airport="' +
//                 cityName +
//                 '"  terminal="' +
//                 test.location +
//                 '"  stand_type="' +
//                 test.area +
//                 '" camName="' +
//                 test.cam_name +
//                 '"  camera_id="' +
//                 test.cam_name +
//                 '"  event_name="' +
//                 event_name +
//                 '" event_url="' +
//                 test.video +
//                 '" thumbnail_url="' +
//                 test.thumbnail +
//                 '" event_time="' +
//                 test.date +
//                 '" status="' +
//                 test.alert_status +
//                 '" poi_or_voi="voi_details" voi_details="' +
//                 string_text +
//                 '"> <img src=' +
//                 imgThumb +
//                 ' alt="" class="pull-left img-circle"/> <div class="news-item-info"> <div class="name"><a href="#">' +
//                 event_name +
//                 '</a></div> <div class="position">' +
//                 "Alert Id: " +
//                 test.alert_id +
//                 '</div> <div class="time" style="font-size: 11px;">Time: ' +
//                 test.date +
//                 "</div> </div> </li>"
//               );
//               if (document.getElementById("countId" + test.priority)) {
//                 var counter = $("#countId" + test.priority).html();
//                 var totalcount = parseInt(counter) + 1;
//                 $("#countId" + test.priority).empty();
//                 $("#countId" + test.priority).append(totalcount);
//               } else {
//                 var id_count = "countId" + test.priority;
//                 $(".count" + test.priority).append(
//                   '<span class="label label-success" style="font-size: 10px;font-weight: 400;position: relative;right: -5px;padding: 1px 5px;" id=' +
//                   id_count +
//                   ">1</span>"
//                 );
//               }

//               $(".panel-footer").remove();
//               $("#camAlertsP1").paginathing({
//                 perPage: 8,
//                 limitPagination: $(".getAlertData").length > 40 ? 5 : "",
//                 containerClass: "panel-footer",
//                 pageNumbers: true,
//               });
//             } else {
//               var cityName = test.city + ", " + test.state;
//               $("#camAlerts" + test.priority).prepend(
//                 '<li  class="getAlertData" style="margin: 0 -9px;" flight_id="' +
//                 test.alert_id +
//                 '" airport="' +
//                 cityName +
//                 '"  terminal="' +
//                 test.location +
//                 '"  stand_type="' +
//                 test.area +
//                 '" camName="' +
//                 test.cam_name +
//                 '"  camera_id="' +
//                 test.cam_name +
//                 '"  event_name="' +
//                 event_name +
//                 '" event_url="' +
//                 test.video +
//                 '" thumbnail_url="' +
//                 test.thumbnail +
//                 '" event_time="' +
//                 test.date +
//                 '" status="' +
//                 test.alert_status +
//                 '" poi_or_voi="voi_details" voi_details="' +
//                 string_text +
//                 '"> <img src=' +
//                 imgThumb +
//                 ' alt="" class="pull-left img-circle"/> <div class="news-item-info"> <div class="name"><a href="#">' +
//                 event_name +
//                 '</a></div> <div class="position">' +
//                 "Alert Id: " +
//                 test.alert_id +
//                 '</div> <div class="time" style="font-size: 11px;">Time: ' +
//                 test.date +
//                 "</div> </div> </li>"
//               );
//               if (document.getElementById("countId" + test.priority)) {
//                 var counter = $("#countId" + test.priority).html();
//                 var totalcount = parseInt(counter) + 1;
//                 $("#countId" + test.priority).empty();
//                 $("#countId" + test.priority).append(totalcount);
//               } else {
//                 var id_count = "countId" + test.priority;
//                 $(".count" + test.priority).append(
//                   '<span class="label label-success" style="font-size: 10px;font-weight: 400;position: relative;right: -5px;padding: 1px 5px;" id=' +
//                   id_count +
//                   ">1</span>"
//                 );
//               }
//             }
//           } else {
//             if ($(".su.active").text().includes(test.priority)) {
//               $("#alertsDXBA").remove();
//             }
//             var imgThumb =
//               "http://" +
//               base_domainip +
//               "/nginx/" +
//               test.thumbnail;
//             if (
//               $("#camAlerts" + test.priority).children().length == 8 ||
//               $("#camAlerts" + test.priority).children().length > 8
//             ) {
//               var cityName = test.city + ", " + test.state;
//               $("#camAlerts" + test.priority).prepend(
//                 '<li  class="getAlertData" style="margin: 0 -9px; " flight_id="' +
//                 test.alert_id +
//                 '" airport="' +
//                 cityName +
//                 '"  terminal="' +
//                 test.location +
//                 '"  stand_type="' +
//                 test.area +
//                 '" camName="' +
//                 test.cam_name +
//                 '"  camera_id="' +
//                 test.cam_name +
//                 '"  event_name="' +
//                 event_name +
//                 '" event_url="' +
//                 test.video +
//                 '" thumbnail_url="' +
//                 test.thumbnail +
//                 '" event_time="' +
//                 test.date +
//                 '" status="' +
//                 test.alert_status +
//                 '"> <img src=' +
//                 imgThumb +
//                 ' alt="" class="pull-left img-circle"/> <div class="news-item-info"> <div class="name"><a href="#">' +
//                 event_name +
//                 '</a></div> <div class="position">' +
//                 "Alert Id: " +
//                 test.alert_id +
//                 '</div> <div class="time" style="font-size: 11px;">Time: ' +
//                 test.date +
//                 "</div> </div> </li>"
//               );
//               if (document.getElementById("countId" + test.priority)) {
//                 var counter = $("#countId" + test.priority).html();
//                 var totalcount = parseInt(counter) + 1;
//                 $("#countId" + test.priority).empty();
//                 $("#countId" + test.priority).append(totalcount);
//               } else {
//                 var id_count = "countId" + test.priority;
//                 $(".count" + test.priority).append(
//                   '<span class="label label-success" style="font-size: 10px;font-weight: 400;position: relative;right: -5px;padding: 1px 5px;" id=' +
//                   id_count +
//                   ">1</span>"
//                 );
//               }

//               if ($(".su.active").text().includes(test.priority)) {
//                 $(".panel-footer").remove();
//               }
//               $("#camAlerts" + test.priority).paginathing({
//                 perPage: 8,
//                 limitPagination: $(".getAlertData").length > 40 ? 5 : "",
//                 containerClass: "panel-footer",
//                 pageNumbers: true,
//               });
//             } else {
//               var cityName = test.city + ", " + test.state;
//               $("#camAlerts" + test.priority).prepend(
//                 '<li  class="getAlertData" style="margin: 0 -9px;" flight_id="' +
//                 test.alert_id +
//                 '" airport="' +
//                 cityName +
//                 '"  terminal="' +
//                 test.location +
//                 '"  stand_type="' +
//                 test.area +
//                 '" camName="' +
//                 test.cam_name +
//                 '"  camera_id="' +
//                 test.cam_name +
//                 '"  event_name="' +
//                 event_name +
//                 '" event_url="' +
//                 test.video +
//                 '" thumbnail_url="' +
//                 test.thumbnail +
//                 '" event_time="' +
//                 test.date +
//                 '" status="' +
//                 test.alert_status +
//                 '"> <img src=' +
//                 imgThumb +
//                 ' alt="" class="pull-left img-circle"/> <div class="news-item-info"> <div class="name"><a href="#">' +
//                 event_name +
//                 '</a></div> <div class="position">' +
//                 "Alert Id: " +
//                 test.alert_id +
//                 '</div> <div class="time" style="font-size: 11px;">Time: ' +
//                 test.date +
//                 "</div> </div> </li>"
//               );
//               if (document.getElementById("countId" + test.priority)) {
//                 var counter = $("#countId" + test.priority).html();
//                 var totalcount = parseInt(counter) + 1;
//                 $("#countId" + test.priority).empty();
//                 $("#countId" + test.priority).append(totalcount);
//               } else {
//                 var id_count = "countId" + test.priority;
//                 $(".count" + test.priority).append(
//                   '<span class="label label-success" style="font-size: 10px;font-weight: 400;position: relative;right: -5px;padding: 1px 5px;" id=' +
//                   id_count +
//                   ">1</span>"
//                 );
//               }
//             }
//           }
//         }
        
//       }
//     } 
//     }else if (test.mqtt_flag == "3") {
//         $("#app-alert").show();
//         $("#person_count").empty();
//         $("#person_count").append(test.person_count);
//       }else if(test.mqtt_flag == "4"){
//       updateDownloadStatusMQTT(test)
//     }  else {
//         // var uidEvents = (new Date().getTime()).toString(36)
//         //
//         // // $('#loadingEvent').remove();
//         // var uniqueArr=['Truck operation'];
//         // if(uniqueArr.includes(test.event_name)){
//         //
//         //
//         // }
//         // else {
//         //
//         //
//         // }

//         // if(test.event_name == "PBB"){
//         //     test.event_name ="PBS"
//         // }

//         // var uidEvents = (new Date().getTime()).toString(36)
//         // $('#liveEventsDXB').prepend('<li id='+uidEvents+' class="messenger-message-slot messenger-shown messenger-first messenger-last">\n' +
//         //     '        <div class="messenger-message message alert info message-info alert-info messenger-will-hide-after">\n' +
//         //     '<button type="button" class="messenger-close" data-dismiss="alert">×</button>\n'+
//         //     '            <div class="messenger-message-inner">'+test.event_name+'</div>\n' +
//         //     '            <div class="">\n' +
//         //     '                <a>Time: </a> <span>'+test.event_start_time+'</span>\n' +
//         //     '            </div>\n' +
//         //     '        </div>\n' +
//         //     '    </li>')
//         // SetTimeoutEvents(uidEvents);

//         var loalData = JSON.parse(
//           localStorage.getItem($("li.active").attr("id"))
//         );

//         if (loalData == null) {
//           loalData = [];
//           loalData.push(test);
//           // localStorage.setItem($('li.active').attr('id'),JSON.stringify(loalData));
//         } else {
//           // loalData.push(test);
//           for (i = 0; i < loalData.length; i++) {
//             if (
//               test.event_name == loalData[i].event_name &&
//               loalData[i].event_start_time != "" &&
//               loalData[i].event_end_time == ""
//             ) {
//               console.log(loalData);
//               loalData.splice(loalData.indexOf(loalData[i]), 1);
//               loalData.push(test);
//             } else {
//               loalData.push(test);
//               break;
//             }
//           }
//         }

//         localStorage.setItem($("li.active").attr("id"), JSON.stringify(loalData));
//       }
//   }
// }
// function onConnected(recon, url) {
//   console.log(" in onConnected " + reconn);
// }
// function onConnect() {
//   // Once a connection has been made, make a subscription and send a message.

//   connected_flag = 1;
//   //document.getElementById("status").innerHTML = "Connected";
//   console.log("on Connect " + connected_flag);
//   //document.getElementById("messages").innerHTML ="";
//   if (connected_flag == 0) {
//     out_msg = "<b>Not Connected so can't subscribe</b>";
//     console.log(out_msg);
//     //document.getElementById("messages").innerHTML = out_msg;
//     return false;
//   }
//   var stopic = localStorage.getItem("userStatus")
//   console.log("Subscribing to topic =" + stopic);
//   mqtt.subscribe(stopic);
// }
// function disconnect() {
//   console.log("client is disconnecting..");
//   mqtt.disconnect();
// }

// function MQTTconnect() {
//   if (mqtt && mqtt.isConnected()) {
//     mqtt.disconnect();
//   } else {
//     // $.get("/ip", function (ip) {
//       connected_flag = 0;
//       reconnectTimeout = 2000;
//       host = base_domainip.split(":")[0];
//       port = 9001;

//       uid = new Date().getTime().toString(36);
//       mqtt = new Paho.MQTT.Client(host, port, uid);

//       var options = {
//         timeout: 3,
//         onSuccess: onConnect,
//         onFailure: onFailure,
//       };
//       mqtt.onConnectionLost = onConnectionLost;
//       mqtt.onMessageArrived = onMessageArrived;
//       mqtt.onConnected = onConnected;

//       mqtt.connect(options);
//       return false;
//     // });
//   }
// }





















// RABBIT MQTTT CODE STARTED
























var client
var reconnectTimeout = 2000;
var stopic
var debug = true
var profile


  stopic = userloginstatus




function MQTTconnect(isError) {
      host = base_domainip.split(":")[0];
      port = 31007;

      if(client){
        if(isError){
          client.disconnect()
        }else{
          return false
        }
        
      }

        
        var ws = new WebSocket(`ws://${host}:${port}/ws`);
        client = Stomp.over(ws);
        client.debug = onDebug;
        client.connect("admin", "Pivo8Chain@123", onConnect, onError);
      
}




  function onConnect() {
    if(profile){
      console.log(`Connected, Subscribing to ${stopic}`)
        var id = client.subscribe(`/exchange/${stopic}/${profile.email}`, function (d) {
          try{
            handleRabbitMQTT(JSON.parse(d.body.replace(/\'/g, '"')))
          }catch(e){
            console.log(e)
          }
        },  {
          "x-queue-name": profile.email+"-" + Math.floor(Math.random() * 99999),
          exclusive: false
        });
    }else{
      $.get("/userprofiledata", function(data){
          profile = data
          onConnect()
        })
    }
    

      }



       function onError(e) {
        if(debug){
          console.log("trying to connect again", e);
        }
        //  if(typeof e == "string"){
          console.log(" 🛑" , e, "trying to connect again");
          setTimeout(function(){MQTTconnect(true)}, reconnectTimeout);
        // }
      }


      function onDebug(m) {
        if(debug){
          console.log("STOMP DEBUG", m);
        }
      }




      function handleRabbitMQTT(test){
        console.log(test)
    if(test.mqtt_flag == "0"&& window.location.pathname !== "/cctv_poilive" && window.location.pathname !== "/cctv_voilive"){
      cameraAddition(test)
    } else if(test.mqtt_flag == "1" && window.location.pathname !== "/cctv_poilive" && window.location.pathname !== "/cctv_voilive"){
      cameraDeletion(test)
    } else if (test.mqtt_flag == "2") {
      if (window.location.pathname == "/cctv_pendingalerts") {
        addMQTTresponse(test);
      }else if(window.location.pathname == "/cctv_poilive"){
            appendMQTTAuth(test)
      }else if(window.location.pathname == "/cctv_voilive"){
            newVehicleMQTTAlert(test)
      }else {
        var event_name;
        if (test.alert_2 == "") {
          event_name = test.alert_1;
        } else {
          event_name = test.alert_1 + " | " + test.alert_2;
        }
        if(localStorage.getItem("camName-DXB") == test.cam_name){
          if (event_name == "Stream Disconnected") {
          $("#alertsDXBA").remove();
          var imgThumb =
            "http://" +
            base_domainip +
            "/nginx/" +
            test.thumbnail;
          // $('#camAlertsDXB').prepend('<li  class="getAlertData" style="margin: 0 -9px;" flight_id="'+test.flight_id+'" airport="'+test.airport+'"  terminal="'+test.terminal+'"  stand_type="'+test.stand_type+'" camName="'+test.cam_name+'"  camera_id="'+test.cam_name+'"  event_name="'+test.alert_name+'" event_url="'+test.alert_url+'" event_time="'+test.alert_time+'" status="'+test.alert_status+'"> <img src='+imgThumb+' alt="" class="pull-left img-circle"/> <div class="news-item-info"> <div class="name"><a href="#">'+test.alert_name+'</a></div> <div class="position">'+'Filght Id: '+test.flight_id+'</div> <div class="time" style="font-size: 11px;">Time: '+test.alert_time+'</div> </div> </li>');

          var cityName = test.city + ", " + test.state;
          $("#camAlerts" + test.priority).prepend(
            '<li  class="" style="margin: 0 -9px;" flight_id="' +
            test.alert_id +
            '" airport="' +
            cityName +
            '"  terminal="' +
            test.location +
            '"  stand_type="' +
            test.area +
            '" camName="' +
            test.cam_name +
            '"  camera_id="' +
            test.cam_name +
            '"  event_name="' +
            event_name +
            '" event_url="' +
            test.video +
            '" event_time="' +
            test.date +
            '" status="' +
            test.alert_status +
            '"> <img src="img/camDis.jpg" alt="" class="pull-left img-circle" onerror="imageerror(this)"/> <div class="news-item-info"> <div class="name"><a href="#">' +
            event_name +
            '</a></div> <div class="position">' +
            "Alert Id: " +
            test.alert_id +
            '</div> <div class="time" style="font-size: 11px;">Time: ' +
            test.date +
            "</div> </div> </li>"
          );
          if (document.getElementById("countId" + test.priority)) {
            var counter = $("#countId" + test.priority).html();
            var totalcount = parseInt(counter) + 1;
            $("#countId" + test.priority).empty();
            $("#countId" + test.priority).append(totalcount);
          } else {
            var id_count = "countId" + test.priority;
            $(".count" + test.priority).append(
              '<span class="label label-success" style="font-size: 10px;font-weight: 400;position: relative;right: -5px;padding: 1px 5px;" id=' +
              id_count +
              ">1</span>"
            );
          }

          $("#feed" + test.priority  +" .panel-footer").remove();
          $("#camAlertsP1").paginathing({
            perPage: 8,
            limitPagination: $(".getAlertData").length > 40 ? 5 : "",
            containerClass: "panel-footer",
            pageNumbers: true,
          });
        } else {
          if (test.hasOwnProperty("poi_details")) {
            
            var string_text = "";
            for (var key in test.poi_details) {
              if (key != "_id" && key != "poi_face_path" && key != "poi_id") {
                string_text += key + " : " + test.poi_details[key] + "&#13;&#10;";
              }
            }

            $("#alertsDXBA").remove();
            var imgThumb =
              "http://" +
              base_domainip +
              "/nginx/" +
              test.thumbnail;
            if (
              $("#camAlerts" + test.priority).children().length == 8 ||
              $("#camAlerts" + test.priority).children().length > 8
            ) {
              var cityName = test.city + ", " + test.state;
              $("#camAlerts" + test.priority).prepend(
                '<li  class="getAlertData" style="margin: 0 -9px; " flight_id="' +
                test.alert_id +
                '" airport="' +
                cityName +
                '"  terminal="' +
                test.location +
                '"  stand_type="' +
                test.area +
                '" camName="' +
                test.cam_name +
                '"  camera_id="' +
                test.cam_name +
                '"  event_name="' +
                event_name +
                '" event_url="' +
                test.video +
                '" thumbnail_url="' +
                test.thumbnail +
                '" event_time="' +
                test.date +
                '" status="' +
                test.alert_status +
                '"  poi_or_voi="poi_details" poi_details="' +
                string_text +
                '" > <img onerror="imageerror(this)" src=' +
                imgThumb +
                ' alt="" class="pull-left img-circle"/> <div class="news-item-info"> <div class="name"><a href="#">' +
                event_name +
                '</a></div> <div class="position">' +
                "Alert Id: " +
                test.alert_id +
                '</div> <div class="time" style="font-size: 11px;">Time: ' +
                test.date +
                "</div> </div> </li>"
              );
              if (document.getElementById("countId" + test.priority)) {
                var counter = $("#countId" + test.priority).html();
                var totalcount = parseInt(counter) + 1;
                $("#countId" + test.priority).empty();
                $("#countId" + test.priority).append(totalcount);
              } else {
                var id_count = "countId" + test.priority;
                $(".count" + test.priority).append(
                  '<span class="label label-success" style="font-size: 10px;font-weight: 400;position: relative;right: -5px;padding: 1px 5px;" id=' +
                  id_count +
                  ">1</span>"
                );
              }

              $("#feed" + test.priority  +" .panel-footer").remove();
              $("#camAlertsP1").paginathing({
                perPage: 8,
                limitPagination: $(".getAlertData").length > 40 ? 5 : "",
                containerClass: "panel-footer",
                pageNumbers: true,
              });
            } else {
              var cityName = test.city + ", " + test.state;
              $("#camAlerts" + test.priority).prepend(
                '<li  class="getAlertData" style="margin: 0 -9px;" flight_id="' +
                test.alert_id +
                '" airport="' +
                cityName +
                '"  terminal="' +
                test.location +
                '"  stand_type="' +
                test.area +
                '" camName="' +
                test.cam_name +
                '"  camera_id="' +
                test.cam_name +
                '"  event_name="' +
                event_name +
                '" event_url="' +
                test.video +
                '" thumbnail_url="' +
                test.thumbnail +
                '" event_time="' +
                test.date +
                '" status="' +
                test.alert_status +
                '" poi_or_voi="poi_details" poi_details="' +
                string_text +
                '"> <img onerror="imageerror(this)" src=' +
                imgThumb +
                ' alt="" class="pull-left img-circle"/> <div class="news-item-info"> <div class="name"><a href="#">' +
                event_name +
                '</a></div> <div class="position">' +
                "Alert Id: " +
                test.alert_id +
                '</div> <div class="time" style="font-size: 11px;">Time: ' +
                test.date +
                "</div> </div> </li>"
              );
              if (document.getElementById("countId" + test.priority)) {
                var counter = $("#countId" + test.priority).html();
                var totalcount = parseInt(counter) + 1;
                $("#countId" + test.priority).empty();
                $("#countId" + test.priority).append(totalcount);
              } else {
                var id_count = "countId" + test.priority;
                $(".count" + test.priority).append(
                  '<span class="label label-success" style="font-size: 10px;font-weight: 400;position: relative;right: -5px;padding: 1px 5px;" id=' +
                  id_count +
                  ">1</span>"
                );
              }
            }
          } else if (test.hasOwnProperty("voi_details")) {
            
            var string_text = "";
            for (var key in test.voi_details) {
              if (key != "_id") {
                string_text += key + " : " + test.voi_details[key] + "&#13;&#10;";
              }
            }
            $("#alertsDXBA").remove();
            var imgThumb =
              "http://" +
              base_domainip +
              "/nginx/" +
              test.thumbnail;
            if (
              $("#camAlerts" + test.priority).children().length == 8 ||
              $("#camAlerts" + test.priority).children().length > 8
            ) {
              var cityName = test.city + ", " + test.state;
              $("#camAlerts" + test.priority).prepend(
                '<li  class="getAlertData" style="margin: 0 -9px; " flight_id="' +
                test.alert_id +
                '" airport="' +
                cityName +
                '"  terminal="' +
                test.location +
                '"  stand_type="' +
                test.area +
                '" camName="' +
                test.cam_name +
                '"  camera_id="' +
                test.cam_name +
                '"  event_name="' +
                event_name +
                '" event_url="' +
                test.video +
                '" thumbnail_url="' +
                test.thumbnail +
                '" event_time="' +
                test.date +
                '" status="' +
                test.alert_status +
                '" poi_or_voi="voi_details" voi_details="' +
                string_text +
                '"> <img onerror="imageerror(this)" src=' +
                imgThumb +
                ' alt="" class="pull-left img-circle"/> <div class="news-item-info"> <div class="name"><a href="#">' +
                event_name +
                '</a></div> <div class="position">' +
                "Alert Id: " +
                test.alert_id +
                '</div> <div class="time" style="font-size: 11px;">Time: ' +
                test.date +
                "</div> </div> </li>"
              );
              if (document.getElementById("countId" + test.priority)) {
                var counter = $("#countId" + test.priority).html();
                var totalcount = parseInt(counter) + 1;
                $("#countId" + test.priority).empty();
                $("#countId" + test.priority).append(totalcount);
              } else {
                var id_count = "countId" + test.priority;
                $(".count" + test.priority).append(
                  '<span class="label label-success" style="font-size: 10px;font-weight: 400;position: relative;right: -5px;padding: 1px 5px;" id=' +
                  id_count +
                  ">1</span>"
                );
              }

              $("#feed" + test.priority  +" .panel-footer").remove();
              $("#camAlertsP1").paginathing({
                perPage: 8,
                limitPagination: $(".getAlertData").length > 40 ? 5 : "",
                containerClass: "panel-footer",
                pageNumbers: true,
              });
            } else {
              var cityName = test.city + ", " + test.state;
              $("#camAlerts" + test.priority).prepend(
                '<li  class="getAlertData" style="margin: 0 -9px;" flight_id="' +
                test.alert_id +
                '" airport="' +
                cityName +
                '"  terminal="' +
                test.location +
                '"  stand_type="' +
                test.area +
                '" camName="' +
                test.cam_name +
                '"  camera_id="' +
                test.cam_name +
                '"  event_name="' +
                event_name +
                '" event_url="' +
                test.video +
                '" thumbnail_url="' +
                test.thumbnail +
                '" event_time="' +
                test.date +
                '" status="' +
                test.alert_status +
                '" poi_or_voi="voi_details" voi_details="' +
                string_text +
                '"> <img onerror="imageerror(this)" src=' +
                imgThumb +
                ' alt="" class="pull-left img-circle"/> <div class="news-item-info"> <div class="name"><a href="#">' +
                event_name +
                '</a></div> <div class="position">' +
                "Alert Id: " +
                test.alert_id +
                '</div> <div class="time" style="font-size: 11px;">Time: ' +
                test.date +
                "</div> </div> </li>"
              );
              if (document.getElementById("countId" + test.priority)) {
                var counter = $("#countId" + test.priority).html();
                var totalcount = parseInt(counter) + 1;
                $("#countId" + test.priority).empty();
                $("#countId" + test.priority).append(totalcount);
              } else {
                var id_count = "countId" + test.priority;
                $(".count" + test.priority).append(
                  '<span class="label label-success" style="font-size: 10px;font-weight: 400;position: relative;right: -5px;padding: 1px 5px;" id=' +
                  id_count +
                  ">1</span>"
                );
              }
            }
          } else {
            if ($(".su.active").text().includes(test.priority)) {
              $("#alertsDXBA").remove();
            }
            var imgThumb =
              "http://" +
              base_domainip +
              "/nginx/" +
              test.thumbnail;
            if (
              $("#camAlerts" + test.priority).children().length == 8 ||
              $("#camAlerts" + test.priority).children().length > 8
            ) {
              var cityName = test.city + ", " + test.state;
              $("#camAlerts" + test.priority).prepend(
                '<li  class="getAlertData" style="margin: 0 -9px; " flight_id="' +
                test.alert_id +
                '" airport="' +
                cityName +
                '"  terminal="' +
                test.location +
                '"  stand_type="' +
                test.area +
                '" camName="' +
                test.cam_name +
                '"  camera_id="' +
                test.cam_name +
                '"  event_name="' +
                event_name +
                '" event_url="' +
                test.video +
                '" thumbnail_url="' +
                test.thumbnail +
                '" event_time="' +
                test.date +
                '" status="' +
                test.alert_status +
                '"> <img onerror="imageerror(this)" src=' +
                imgThumb +
                ' alt="" class="pull-left img-circle"/> <div class="news-item-info"> <div class="name"><a href="#">' +
                event_name +
                '</a></div> <div class="position">' +
                "Alert Id: " +
                test.alert_id +
                '</div> <div class="time" style="font-size: 11px;">Time: ' +
                test.date +
                "</div> </div> </li>"
              );
              if (document.getElementById("countId" + test.priority)) {
                var counter = $("#countId" + test.priority).html();
                var totalcount = parseInt(counter) + 1;
                $("#countId" + test.priority).empty();
                $("#countId" + test.priority).append(totalcount);
              } else {
                var id_count = "countId" + test.priority;
                $(".count" + test.priority).append(
                  '<span class="label label-success" style="font-size: 10px;font-weight: 400;position: relative;right: -5px;padding: 1px 5px;" id=' +
                  id_count +
                  ">1</span>"
                );
              }

              // if ($(".su.active").text().includes(test.priority)) {
                $("#feed" + test.priority  +" .panel-footer").remove();
              // }
              $("#camAlerts" + test.priority).paginathing({
                perPage: 8,
                limitPagination: $(".getAlertData").length > 40 ? 5 : "",
                containerClass: "panel-footer",
                pageNumbers: true,
              });
            } else {
              var cityName = test.city + ", " + test.state;
              $("#camAlerts" + test.priority).prepend(
                '<li  class="getAlertData" style="margin: 0 -9px;" flight_id="' +
                test.alert_id +
                '" airport="' +
                cityName +
                '"  terminal="' +
                test.location +
                '"  stand_type="' +
                test.area +
                '" camName="' +
                test.cam_name +
                '"  camera_id="' +
                test.cam_name +
                '"  event_name="' +
                event_name +
                '" event_url="' +
                test.video +
                '" thumbnail_url="' +
                test.thumbnail +
                '" event_time="' +
                test.date +
                '" status="' +
                test.alert_status +
                '"> <img onerror="imageerror(this)" src=' +
                imgThumb +
                ' alt="" class="pull-left img-circle"/> <div class="news-item-info"> <div class="name"><a href="#">' +
                event_name +
                '</a></div> <div class="position">' +
                "Alert Id: " +
                test.alert_id +
                '</div> <div class="time" style="font-size: 11px;">Time: ' +
                test.date +
                "</div> </div> </li>"
              );
              if (document.getElementById("countId" + test.priority)) {
                var counter = $("#countId" + test.priority).html();
                var totalcount = parseInt(counter) + 1;
                $("#countId" + test.priority).empty();
                $("#countId" + test.priority).append(totalcount);
              } else {
                var id_count = "countId" + test.priority;
                $(".count" + test.priority).append(
                  '<span class="label label-success" style="font-size: 10px;font-weight: 400;position: relative;right: -5px;padding: 1px 5px;" id=' +
                  id_count +
                  ">1</span>"
                );
              }
            }
          }
        }
        
      }
    } 
    }else if (test.mqtt_flag == "3") {
        $("#app-alert").show();
        $("#person_count").empty();
        $("#person_count").append(test.person_count);
      }else if(test.mqtt_flag == "4"){
      updateDownloadStatusMQTT(test)
    }  else {
        // var uidEvents = (new Date().getTime()).toString(36)
        //
        // // $('#loadingEvent').remove();
        // var uniqueArr=['Truck operation'];
        // if(uniqueArr.includes(test.event_name)){
        //
        //
        // }
        // else {
        //
        //
        // }

        // if(test.event_name == "PBB"){
        //     test.event_name ="PBS"
        // }

        // var uidEvents = (new Date().getTime()).toString(36)
        // $('#liveEventsDXB').prepend('<li id='+uidEvents+' class="messenger-message-slot messenger-shown messenger-first messenger-last">\n' +
        //     '        <div class="messenger-message message alert info message-info alert-info messenger-will-hide-after">\n' +
        //     '<button type="button" class="messenger-close" data-dismiss="alert">×</button>\n'+
        //     '            <div class="messenger-message-inner">'+test.event_name+'</div>\n' +
        //     '            <div class="">\n' +
        //     '                <a>Time: </a> <span>'+test.event_start_time+'</span>\n' +
        //     '            </div>\n' +
        //     '        </div>\n' +
        //     '    </li>')
        // SetTimeoutEvents(uidEvents);

        var loalData = JSON.parse(
          localStorage.getItem($("li.active").attr("id"))
        );

        if (loalData == null) {
          loalData = [];
          loalData.push(test);
          // localStorage.setItem($('li.active').attr('id'),JSON.stringify(loalData));
        } else {
          // loalData.push(test);
          for (i = 0; i < loalData.length; i++) {
            if (
              test.event_name == loalData[i].event_name &&
              loalData[i].event_start_time != "" &&
              loalData[i].event_end_time == ""
            ) {
              console.log(loalData);
              loalData.splice(loalData.indexOf(loalData[i]), 1);
              loalData.push(test);
            } else {
              loalData.push(test);
              break;
            }
          }
        }

        localStorage.setItem($("li.active").attr("id"), JSON.stringify(loalData));
      }
  
      }