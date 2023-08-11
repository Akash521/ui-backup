const players = [];
$("#bttw").click(function () {
  $(".btton_active_class").removeClass("active");
  $(this).addClass("active");
  $(".1frame").css("display", "none");
  $(".2frame").css("display", "block");
  $(".3frame").css("display", "none");
  $(".8frame").css("display", "none");
  get_all_VMScams4();
});
$("#bttr").click(function () {
  $(".btton_active_class").removeClass("active");
  $(this).addClass("active");
  $(".1frame").css("display", "none");
  $(".2frame").css("display", "none");
  $(".3frame").css("display", "block");
  $(".8frame").css("display", "none");
  get_all_VMScams9();
});

$("#bttw_8").click(function () {
  $(".btton_active_class").removeClass("active");
  $(this).addClass("active");
  $(".1frame").css("display", "none");
  $(".2frame").css("display", "none");
  $(".3frame").css("display", "none");
  $(".8frame").css("display", "block");
  get_all_VMScams8();
});

function get_all_VMScams9() {
  $("#9layout").empty();
  $("#4layout").empty();
  $("#3by3sectionHLS").empty();
  $(".9layout").remove();
  $(".4layoutBy8").remove();
  $(".multipleLoadingGif").show();

  var head = document.getElementsByTagName("head")[0];
  var link = document.createElement("link");
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href = "js/video-js/video-js.css";
  link.media = "all";
  head.appendChild(link);


  var settings = {
    async: true,
    crossDomain: true,
    url: "/get_cams?stream="+$('#stream_s').val(),
    method: "GET",
    headers: {
      "cache-control": "no-cache",
      "postman-token": "943c60a5-40a4-dfe6-6b1a-e06aa47a89b5",
    },
  };

  $.ajax(settings)
    .done(function (response) {
      console.log(response)
      if (response.Failure) {
        Messenger().post({
          message: response.Failure,
          type: "error",
          showCloseButton: true,
        });
        return;
      }
      $(".multipleLoadingGif").hide();
      if (localStorage.getItem("selected_Area") == null) {
        $("#area_name_vmsMultipleStream").empty();
        $("#area_name_vmsMultipleStream").append(response.cams[0].area_name);
        localStorage.setItem("selected_Area", response.cams[0].area_name);
        NinebyNineLayout(localStorage.getItem("selected_Area"), response);
      } else {
        $("#area_name_vmsMultipleStream").empty();
        $("#area_name_vmsMultipleStream").append(
          localStorage.getItem("selected_Area")
        );
        NinebyNineLayout(localStorage.getItem("selected_Area"), response);
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


function NinebyNineLayout(current_Area, response) {
  var lengthOfLiveCards = 0;
  
  if(players.length>0){
    console.log(players)
    for (k=0;k<players.length;k++){
      // players[].source.destroy()
      players[k]
      destroyPlayer(players[k])
      
    }
    // const jsmpegWebSockets = jsmpeg.websocketConnections;
    // jsmpegWebSockets.forEach(ws => ws.close());
  }
  


  // if(response.cams.length >0){

  // for(i=0;i<cams.length;i++){
  for (j = 0; j < response.cams.length; j++) {
    console.log(current_Area)
    console.log(response)
    if (current_Area == response.cams[j].area_name) {
      // count_vm=0
      for (camList = 0; camList < 12; camList++) {
        if (response.cams[j].camera_list.length < 9) {
          lengthOfLiveCards = 9 - response.cams[j].camera_list.length;
        } else {
          lengthOfLiveCards = 0;
        }

        console.log(response.cams[j].camera_list[camList]?.cam_name);
        // $(li_ul_li_DXB).append('<i class="fa fa-play" style= "float: right; position: absolute;top:4px;right: -10%;font-size: 11px; cursor:pointer" title="Playback" name="'+ side_bar_dict[i].location[j].name+'" onclick="Layoutfunction(this);"></i>')

        
        $("#9layout").append(
          '<div class="col-md-4 laynine" style="padding-left: 0px;padding-right: 0px; margin-top: 4px; border:1px solid #ffffff42;width: 32.7%;margin-right: 4px; cursor:pointer;"  ondrop="camdrop(event,' +
            camList +
            ',`laynine`)" ondragover="allowcamDrop(event)">\n' +
            '              <div class="row">\n' +
            '                <div class="col-md-7 camico">\n' +
            '                  <i class="fa fa-circle" style="font-size:8px;"></i><span class="camnm" style="position: relative;left: 3px;">' +
            response.cams[j].camera_list[camList].cam_name +
            "</span>\n" +
            "                </div>\n" +
            '                <div class="col-md-5  checkbox-primary" style="float:right;">\n' +
            '<i class="fa fa-play" style= "float: right; position: relative;top:4px; cursor:pointer" title="Playback" name="Playback" cam_name_l="'+response.cams[j].camera_list[camList].cam_name+'" onclick="Layoutfunction2(this);"> </i>'+

            // '<input type="checkbox" checkbox_slected_val='+response.cams[j].camera_list[camList].cam_name+' onclick="GetNameDeleteCamera(this)" style="float:right;">\n'+
            "                </div>\n" +
            "              </div>\n" +
            '              <div class="vdo" cam_name_layout=' +
            response.cams[j].camera_list[camList].cam_name +
            ' onclick="openLiveStream(this)">\n' +
            '                <div class="vidc2" id="vidID9' +
            camList +
            '">\n' +
            "                </div>\n" +
            "              </div>\n" +
            "            </div>"
        );

        var timestamp = new Date().getMilliseconds();

        $("#vidID9" + camList).append(
          '<canvas id="my_video_19' +
            camList +
            '" class="video-js vjs-default-skin" style="width:100%;height:215px"\n' +
            "              >\n" +
            "        </canvas>"
        );
        var canvas1 = document.getElementById("my_video_19" + camList);
        
        
        player1 = new JSMpeg.Player(
          "ws://" +
            base_domainip.split(":")[0] +
            ":" +
            response.cams[j].camera_list[camList].cam_output_url?.split(":")[2],
          { canvas: canvas1 }
          
        );
        players.push(player1);
      }
    } else {
      if(localStorage.getItem("selected_Area") == null) {
        localStorage.setItem("selected_Area", response.cams[0].area_name);
        $("#area_name_vmsMultipleStream").empty();
        $("#area_name_vmsMultipleStream").append(
          localStorage.getItem("selected_Area")
        );
        NinebyNineLayout(localStorage.getItem("selected_Area"), response);
      
      }else{
        $("#area_name_vmsMultipleStream").empty();
        $("#area_name_vmsMultipleStream").append(
          localStorage.getItem("selected_Area")
        );
        console.log(response)
        // NinebyNineLayout(localStorage.getItem("selected_Area"), response);
        

      }
      
    }
  }

  for (noCam = 0; noCam < lengthOfLiveCards; noCam++) {
    $("#9layout").append(
      '<div class="col-md-4 laynine" style="padding-left: 0px;padding-right: 0px; margin-top: 4px; border:1px solid #ffffff42; width: 32.7%;margin-right: 4px; " ondrop="camdrop(event,`nolivecamera`,`laynine`)" ondragover="allowcamDrop(event)">\n' +
        '              <div class="row" >\n' +
        '                <div class="col-md-7 camico">\n' +
        '                  <i class="fa fa-circle" style="font-size:8px; visibility:hidden; "></i><span class="camnm">No Feed</span>\n' +
        "                </div>\n" +
        '                <div class="col-md-5" style="float:right;">\n' +
        '<i class="fa fa-play" style= "float: right; position: relative;top:4px; cursor:pointer" title="Playback" name="Playback" cam_name_l="'+response.cams[j].camera_list[camList].cam_name+'" onclick="Layoutfunction2(this);"> </i>'+

        "                </div>\n" +
        "              </div>\n" +
        '              <div class="vdo">\n' +
        '                <div class="vidc2" id="vidID9">\n' +
        '<div style="width:100%;height:215px; position: relative;">' +
        '<div style="text-align: center; position: ; position: absolute; left: 41%; top: 41%;"> No Live Feed</div> </div>\n' +
        "                </div>\n" +
        "              </div>\n" +
        "            </div>"
    );
  }

  // for(k=0;k<9;k++){
  //     try {
  //
  //     }
  //     catch(err) {
  //         continue;
  //     }
  //
  //
  //
  //
  // }
}


function destroyPlayer(player) {
  if (player) {
    player.destroy();
    const canvasElement = player.canvas;
    if (canvasElement) {
      const parentElement = canvasElement.parentNode;
      if (parentElement) {
        parentElement.removeChild(canvasElement);
      }
    }
    // If you have added any event listeners, remove them here.
    // For example:
    // player.off('some_event', eventHandlerFunction);
  }
  const playerIndex = players.indexOf(player);
  if (playerIndex !== -1) {
    players.splice(playerIndex, 1);
  }
}

function camdrop(event, camList, className) {
  event.preventDefault();

  var name = event.dataTransfer.getData("text");

  console.log(name);

  var data = JSON.parse(
    localStorage.getItem("getcam")
  )[0].location[0].camera.filter((cam) => cam?.cam_name == name)[0];
  if (data) {
    if (camList === "nolivecamera") {
      camList = Math.ceil(Math.random() * (9999999999999 - 1) + 1);
    }

    if ($(event.target).hasClass(className)) {
      ele = event.target;
    } else {
      ele = $(event.target).parents("." + className);
    }

    ele
      .empty()
      .append(
        '              <div class="row" style="padding-bottom: 10px; background: #2A3547; width: 100% !important; margin-left: 0px; padding: 5px 0px; margin: 0px !important;">\n' +
          '                <div class="col-md-7 camico">\n' +
          '                  <i class="fa fa-circle" style="font-size:8px;"></i><span class="camnm" style="position: relative;left: 3px;">' +
          data?.cam_name +
          "</span>\n" +
          "                </div>\n" +
          '                <div class="col-md-5" style="float:right;">\n' +
          '<i class="fa fa-play" style= "float: right; position: relative;top:4px; cursor:pointer" title="Playback" name="Playback" cam_name_l="'+data?.cam_name+'" onclick="Layoutfunction2(this);"> </i>'+
          "                </div>\n" +
          "              </div>\n" +
          '              <div class="vdo" cam_name_layout=' +
          data?.cam_name +
          ' onclick="openLiveStream(this)">\n' +
          '                <div class="vidc2" id="vidID9' +
          camList +
          '">\n' +
          "                </div>\n" +
          "              </div>\n"
      );

    var timestamp = new Date().getMilliseconds();
    var height = 0;

    if (className == "laynine") {
      height = 215;
    } else if (className == "layfour") {
      height = 350;
    } else if (className == `ipadnilay`) {
      if (ele.hasClass("9layout")) {
        height = 615;
      } else {
        height = 187;
      }
    } else if (className == `widget`) {
      height = 187;
    }

    $("#vidID9" + camList)
      .empty()
      .append(
        '<canvas id="my_video_12' +
          camList +
          '" class="video-js vjs-default-skin" style="width:100%;height:' +
          height +
          'px"\n' +
          "              >\n" +
          "        </canvas>"
      );
    var canvas1 = document.getElementById("my_video_12" + camList);
    var player1 = new JSMpeg.Player(
      "ws://" +
        base_domainip.split(":")[0] +
        ":" +
        data?.cam_output_url?.split(":")[2],
      { canvas: canvas1 }
    );
  }
}

function allowcamDrop(event) {
  event.preventDefault();
}

function twoByTwoLayout(current_Area, response) {
  var lengthOfLiveCards = 0;

  if(players.length>0){
    console.log(players)
    for (k=0;k<players.length;k++){
      // players[].source.destroy()
      players[k]
      destroyPlayer(players[k])
      
    }
    // const jsmpegWebSockets = jsmpeg.websocketConnections;
    // jsmpegWebSockets.forEach(ws => ws.close());
  }
  // if(response.cams.length >0){

  // for(i=0;i<cams.length;i++){
  for (j = 0; j < response.cams.length; j++) {
    if (current_Area == response.cams[j].area_name) {
      for (camList = 0; camList < 4; camList++) {
        if (response.cams[j].camera_list.length < 9) {
          lengthOfLiveCards = 4 - response.cams[j].camera_list.length;
        } else {
          lengthOfLiveCards = 0;
        }

        console.log(response.cams[j].camera_list[camList].cam_name);

        $("#4layout").append(
          '<div class="col-md-6 layfour" style="padding-left: 0px;padding-right: 0px; margin-top: 4px; border:1px solid #ffffff42;margin-right: 4px;width: 49%;cursor:pointer;" ondrop="camdrop(event,' +
            camList +
            ',`layfour`)" ondragover="allowcamDrop(event)">\n' +
            '              <div class="row">\n' +
            '                <div class="col-md-7 camico">\n' +
            '                  <i class="fa fa-circle" style="font-size:8px;"></i><span class="camnm" style="position: relative;left: 3px;">' +
            response.cams[j].camera_list[camList].cam_name +
            "</span>\n" +
            "                </div>\n" +
            '                <div class="col-md-5" style="float:right;">\n' +
            '<i class="fa fa-play" style= "float: right; position: relative;top:4px; cursor:pointer" title="Playback" name="Playback" cam_name_l="'+response.cams[j].camera_list[camList].cam_name+'" onclick="Layoutfunction2(this);"> </i>'+
            "                </div>\n" +
            "              </div>\n" +
            '              <div class="vdo" cam_name_layout=' +
            response.cams[j].camera_list[camList].cam_name +
            ' onclick="openLiveStream(this)">\n' +
            '                <div class="vidc2" id="vidID9' +
            camList +
            '">\n' +
            "                </div>\n" +
            "              </div>\n" +
            "            </div>"
        );

        var timestamp = new Date().getMilliseconds();

        $("#vidID9" + camList).append(
          '<canvas id="my_video_12' +
            camList +
            '" class="video-js vjs-default-skin" style="width:100%;height:350px"\n' +
            "              >\n" +
            "        </canvas>"
        );
        var canvas1 = document.getElementById("my_video_12" + camList);
        var player1 = new JSMpeg.Player(
          "ws://" +
            base_domainip.split(":")[0] +
            ":" +
            response.cams[j].camera_list[camList].cam_output_url?.split(":")[2],
          { canvas: canvas1 }
        );
      }
    }
  }

  for (noCam = 0; noCam < lengthOfLiveCards; noCam++) {
    $("#4layout").append(
      '<div class="col-md-6 layfour" style="padding-left: 0px;padding-right: 0px; margin-top: 4px; border:1px solid #ffffff42;margin-right: 4px; width: 49%;" ondrop="camdrop(event,`nolivecamera`,`layfour`)" ondragover="allowcamDrop(event) >\n' +
        '              <div class="row" >\n' +
        '                <div class="col-md-7 camico">\n' +
        '                  <i class="fa fa-circle" style="font-size:8px; visibility:hidden; "></i><span class="camnm">No Feed</span>\n' +
        "                </div>\n" +
        '                <div class="col-md-5" style="float:right;">\n' +
        "                </div>\n" +
        "              </div>\n" +
        '              <div class="vdo">\n' +
        '                <div class="vidc2" id="vidID9">\n' +
        '<div style="width:100%;height:350px; position: relative;">' +
        '<div style="text-align: center; position: ; position: absolute; left: 41%; top: 41%;"> No Live Feed</div> </div>\n' +
        "                </div>\n" +
        "              </div>\n" +
        "            </div>"
    );
  }

  // for(k=0;k<9;k++){
  //     try {
  //
  //     }
  //     catch(err) {
  //         continue;
  //     }
  //
  //
  //
  //
  // }
}

function get_all_VMScams4() {
  $("#4layout").empty();
  $("#9layout").empty();
  $("#3by3sectionHLS").empty();
  $(".9layout").remove();
  $(".4layoutBy8").remove();
  $(".multipleLoadingGif").show();
  var head = document.getElementsByTagName("head")[0];
  var link = document.createElement("link");
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href = "js/video-js/video-js.css";
  link.media = "all";
  head.appendChild(link);

  var settings = {
    async: true,
    crossDomain: true,
    url: "/get_cams",
    method: "GET",
    headers: {
      "cache-control": "no-cache",
      "postman-token": "943c60a5-40a4-dfe6-6b1a-e06aa47a89b5",
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
        return;
      }
      $(".multipleLoadingGif").hide();
      if (localStorage.getItem("selected_Area") == null) {
        $("#area_name_vmsMultipleStream").empty();
        $("#area_name_vmsMultipleStream").append(response.cams[0].area_name);
        localStorage.setItem("selected_Area", response.cams[0].area_name);
        twoByTwoLayout(localStorage.getItem("selected_Area"), response);
      } else {
        $("#area_name_vmsMultipleStream").empty();
        $("#area_name_vmsMultipleStream").append(
          localStorage.getItem("selected_Area")
        );
        twoByTwoLayout(localStorage.getItem("selected_Area"), response);
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

function get_all_VMScams8() {
  $("#4layout").empty();
  $("#9layout").empty();
  $("#3by3sectionHLS").empty();
  $(".9layout").remove();
  $(".4layoutBy8").remove();
  $(".multipleLoadingGif").show();
  var head = document.getElementsByTagName("head")[0];
  var link = document.createElement("link");
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href = "js/video-js/video-js.css";
  link.media = "all";
  head.appendChild(link);

  var settings = {
    async: true,
    crossDomain: true,
    url: "/get_cams",
    method: "GET",
    headers: {
      "cache-control": "no-cache",
      "postman-token": "943c60a5-40a4-dfe6-6b1a-e06aa47a89b5",
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
        return;
      }
      $(".multipleLoadingGif").hide();
      if (localStorage.getItem("selected_Area") == null) {
        $("#area_name_vmsMultipleStream").empty();
        $("#area_name_vmsMultipleStream").append(response.cams[0].area_name);
        localStorage.setItem("selected_Area", response.cams[0].area_name);
        eightLayout(localStorage.getItem("selected_Area"), response);
      } else {
        $("#area_name_vmsMultipleStream").empty();
        $("#area_name_vmsMultipleStream").append(
          localStorage.getItem("selected_Area")
        );
        eightLayout(localStorage.getItem("selected_Area"), response);
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

function eightLayout(current_Area, response) {
  var lengthOfLiveCards = 0;
  var heightVideoElement;

  if(players.length>0){
    console.log(players)
    for (k=0;k<players.length;k++){
      // players[].source.destroy()
      players[k]
      destroyPlayer(players[k])
      
    }
    // const jsmpegWebSockets = jsmpeg.websocketConnections;
    // jsmpegWebSockets.forEach(ws => ws.close());
  }
  // if(response.cams.length >0){

  // for(i=0;i<cams.length;i++){
  for (j = 0; j < response.cams.length; j++) {
    if (current_Area == response.cams[j].area_name) {
      count_cam = 0;
      for (
        camList = 0;
        camList < response.cams[j].camera_list.length;
        camList++
      ) {
        if (response.cams[j].camera_list.length < 9) {
          lengthOfLiveCards = 8 - response.cams[j].camera_list.length;
        } else {
          lengthOfLiveCards = 0;
        }

        console.log(lengthOfLiveCards);
        count_cam += 1;

        if (count_cam == 1) {
          heightVideoElement = "615";
          $("#8layout").prepend(
            '<div class="col-md-9 9layout ipadnilay" style="padding-left: 0px;padding-right: 0px; border:1px solid #ffffff42;cursor:pointer;width: 74.5%;" " ondrop="camdrop(event,' +
              camList +
              ',`ipadnilay`)" ondragover="allowcamDrop(event)">\n' +
              '                    <div class="row" style="padding-bottom: 10px; background: #2A3547; width: 100% !important; margin-left: 0px; padding: 5px 0px; margin: 0px !important;">\n' +
              '                      <div class="col-md-7 camico">\n' +
              '                        <i class="fa fa-circle" style="font-size:8px;margin-left: 0px;"></i><span class="camnm" style="position: relative;left: 3px;">' +
              response.cams[j].camera_list[camList].cam_name +
              "</span>\n" +
              "                      </div>\n" +
              '                      <div class="col-md-5" style="float:right;">\n' +
              '<i class="fa fa-play" style= "float: right; position: relative;top:4px; cursor:pointer" title="Playback" name="Playback" cam_name_l="'+response.cams[j].camera_list[camList].cam_name+'" onclick="Layoutfunction2(this);"> </i>'+
              "                      </div>\n" +
              "                    </div>\n" +
              '                    <div class="vdo" cam_name_layout=' +
              response.cams[j].camera_list[camList].cam_name +
              ' onclick="openLiveStream(this)">\n' +
              '                      <div class="vidc2" id="vidID9' +
              camList +
              '">\n' +
              "                      </div>\n" +
              "                    </div>\n" +
              "                  </div>"
          );
        } else if (count_cam == 2) {
          $("#3by3sectionHLS").show();
          heightVideoElement = "187";
          $("#3by3sectionHLS").append(
            '<section class="widget tiny" style="height: 212px;margin-bottom: 3px; padding: 0px 0px;border: 1px solid #ffffff42;" ondrop="camdrop(event,' +
              camList +
              ',`widget`)" ondragover="allowcamDrop(event)">\n' +
              '                      <div class="row" style="padding-bottom: 10px; background: #2A3547; width: 100% !important; margin-left: 0px; padding: 5px 0px; margin: 0px !important;">\n' +
              '                        <div class="col-md-7 camico">\n' +
              '                          <i class="fa fa-circle" style="font-size:8px;margin-left: 0px;"></i><span class="camnm" style="position: relative;left: 3px;">' +
              response.cams[j].camera_list[camList].cam_name +
              "</span>\n" +
              "                        </div>\n" +
              '                        <div class="col-md-5" style="float:right;">\n' +
              '<i class="fa fa-play" style= "float: right; position: relative;top:4px; cursor:pointer" title="Playback" name="Playback" cam_name_l="'+response.cams[j].camera_list[camList].cam_name+'" onclick="Layoutfunction2(this);"> </i>'+
              "                        </div>\n" +
              "                      </div>\n" +
              '                      <div class="vdo" cam_name_layout=' +
              response.cams[j].camera_list[camList].cam_name +
              ' onclick="openLiveStream(this)">\n' +
              '                        <div class="vidc2" id="vidID9' +
              camList +
              '">\n' +
              "                      </div>\n" +
              "                    </section>"
          );
        } else if (count_cam == 3) {
          heightVideoElement = "187";
          $("#3by3sectionHLS").append(
            '<section class="widget tiny" style="height: 211px;margin-bottom: 3px; padding: 0px 0px;border: 1px solid #ffffff42;" ondrop="camdrop(event,' +
              camList +
              ',`widget`)" ondragover="allowcamDrop(event)">\n' +
              '                      <div class="row" style="padding-bottom: 10px; background: #2A3547; width: 100% !important; margin-left: 0px; padding: 5px 0px; margin: 0px !important;">\n' +
              '                        <div class="col-md-7 camico">\n' +
              '                          <i class="fa fa-circle" style="font-size:8px;margin-left: 0px;"></i><span class="camnm" style="position: relative;left: 3px;">' +
              response.cams[j].camera_list[camList].cam_name +
              "</span>\n" +
              "                        </div>\n" +
              '                        <div class="col-md-5" style="float:right;">\n' +
              '<i class="fa fa-play" style= "float: right; position: relative;top:4px; cursor:pointer" title="Playback" name="Playback" cam_name_l="'+response.cams[j].camera_list[camList].cam_name+'" onclick="Layoutfunction2(this);"> </i>'+
              "                        </div>\n" +
              "                      </div>\n" +
              '                      <div class="vdo" cam_name_layout=' +
              response.cams[j].camera_list[camList].cam_name +
              ' onclick="openLiveStream(this)">\n' +
              '                        <div class="vidc2" id="vidID9' +
              camList +
              '">\n' +
              "\n" +
              "                      </div>\n" +
              "                    </section>"
          );
        } else if (count_cam == 4) {
          heightVideoElement = "187";
          $("#3by3sectionHLS").append(
            '<section class="widget tiny" style="height: 211px;margin-bottom: 3px; padding: 0px 0px;border: 1px solid #ffffff42;" ondrop="camdrop(event,' +
              camList +
              ',`widget`)" ondragover="allowcamDrop(event)">\n' +
              '                      <div class="row" style="padding-bottom: 10px; background: #2A3547; width: 100% !important; margin-left: 0px; padding: 5px 0px; margin: 0px !important;">\n' +
              '                        <div class="col-md-7 camico">\n' +
              '                          <i class="fa fa-circle" style="font-size:8px;margin-left: 0px;"></i><span class="camnm" style="position: relative;left: 3px;">' +
              response.cams[j].camera_list[camList].cam_name +
              "</span>\n" +
              "                        </div>\n" +
              '                        <div class="col-md-5" style="float:right;">\n' +
              '<i class="fa fa-play" style= "float: right; position: relative;top:4px; cursor:pointer" title="Playback" name="Playback" cam_name_l="'+response.cams[j].camera_list[camList].cam_name+'" onclick="Layoutfunction2(this);"> </i>'+
              "                        </div>\n" +
              "                      </div>\n" +
              '                      <div class="vdo" cam_name_layout=' +
              response.cams[j].camera_list[camList].cam_name +
              ' onclick="openLiveStream(this)">\n' +
              '                        <div class="vidc2" id="vidID9' +
              camList +
              '">\n' +
              "\n" +
              "                      </div>\n" +
              "                    </section>"
          );
        } else if (count_cam == 5) {
          heightVideoElement = "187";
          // $('#3by3sectionHLS').append('<section class="widget tiny" style="height: 211px;margin-bottom: 3px; padding: 0px 0px;border: 1px solid #ffffff42;" cam_name_layout='+response.cams[j].camera_list[camList].cam_name+' onclick="openLiveStream(this)">\n' +
          //     '                      <div class="row" style="padding-bottom: 10px; background: #2A3547; width: 100% !important; margin-left: 0px; padding: 5px 0px; margin: 0px !important;">\n' +
          //     '                        <div class="col-md-7 camico">\n' +
          //     '                          <i class="fa fa-circle" style="font-size:8px;margin-left: 0px;"></i><span class="camnm" style="position: relative;left: 3px;">'+response.cams[j].camera_list[camList].cam_name+'</span>\n' +
          //     '                        </div>\n' +
          //     '                        <div class="col-md-5" style="float:right;">\n' +
          //     '                        </div>\n' +
          //     '                      </div>\n' +
          //     '                      <div class="vdo">\n' +
          //     '                        <div class="vidc2" id="vidID9'+camList+'">\n' +
          //     '\n' +
          //     '                      </div>\n' +
          //     '                    </section>');

          $("#8layout").append(
            '<div class="col-md-3 4layoutBy8 ipadnilay" style="padding-left: 0px;padding-right: 0px; margin-top: 0px; border:1px solid #ffffff42;margin-right: 3px;cursor:pointer;width: 24.7%;"   ondrop="camdrop(event,' +
              camList +
              ',`ipadnilay`)" ondragover="allowcamDrop(event)" > <div class="row" style="padding-bottom: 10px; background: #2A3547; width: 100% !important; margin-left: 0px; padding: 5px 0px; margin: 0px !important;">\n' +
              '            <div class="col-md-7 camico">\n' +
              '            <i class="fa fa-circle" style="font-size:8px;margin-left: 0px;"></i><span class="camnm" style="position: relative;left: 3px;">' +
              response.cams[j].camera_list[camList].cam_name +
              "</span>\n" +
              "        </div>\n" +
              '        <div class="col-md-5" style="float:right;">\n' +
              '<i class="fa fa-play" style= "float: right; position: relative;top:4px; cursor:pointer" title="Playback" name="Playback" cam_name_l="'+response.cams[j].camera_list[camList].cam_name+'" onclick="Layoutfunction2(this);"> </i>'+
              "            </div>\n" +
              "            </div>\n" +
              '            <div class="vdo" cam_name_layout=' +
              response.cams[j].camera_list[camList].cam_name +
              ' onclick="openLiveStream(this)">\n' +
              '            <div class="vidc2" id="vidID9' +
              camList +
              '">\n' +
              "        </div>\n" +
              "        </div>\n" +
              "        </div>"
          );
        } else if (count_cam == 6) {
          heightVideoElement = "187";
          // $('#3by3sectionHLS').append('<section class="widget tiny" style="height: 211px;margin-bottom: 3px; padding: 0px 0px;border: 1px solid #ffffff42;" cam_name_layout='+response.cams[j].camera_list[camList].cam_name+' onclick="openLiveStream(this)">\n' +
          //     '                      <div class="row" style="padding-bottom: 10px; background: #2A3547; width: 100% !important; margin-left: 0px; padding: 5px 0px; margin: 0px !important;">\n' +
          //     '                        <div class="col-md-7 camico">\n' +
          //     '                          <i class="fa fa-circle" style="font-size:8px;margin-left: 0px;"></i><span class="camnm" style="position: relative;left: 3px;">'+response.cams[j].camera_list[camList].cam_name+'</span>\n' +
          //     '                        </div>\n' +
          //     '                        <div class="col-md-5" style="float:right;">\n' +
          //     '                        </div>\n' +
          //     '                      </div>\n' +
          //     '                      <div class="vdo">\n' +
          //     '                        <div class="vidc2" id="vidID9'+camList+'">\n' +
          //     '\n' +
          //     '                      </div>\n' +
          //     '                    </section>');

          $("#8layout").append(
            '<div class="col-md-3 4layoutBy8 ipadnilay" style="padding-left: 0px;padding-right: 0px; margin-top: 0px; border:1px solid #ffffff42;margin-right: 3px;cursor:pointer;width: 24.7%;" ondrop="camdrop(event,' +
              camList +
              ',`ipadnilay`)" ondragover="allowcamDrop(event)"> <div class="row" style="padding-bottom: 10px; background: #2A3547; width: 100% !important; margin-left: 0px; padding: 5px 0px; margin: 0px !important;">\n' +
              '            <div class="col-md-7 camico">\n' +
              '            <i class="fa fa-circle" style="font-size:8px;margin-left: 0px;"></i><span class="camnm" style="position: relative;left: 3px;">' +
              response.cams[j].camera_list[camList].cam_name +
              "</span>\n" +
              "        </div>\n" +
              '        <div class="col-md-5" style="float:right;">\n' +
              '<i class="fa fa-play" style= "float: right; position: relative;top:4px; cursor:pointer" title="Playback" name="Playback" cam_name_l="'+response.cams[j].camera_list[camList].cam_name+'" onclick="Layoutfunction2(this);"> </i>'+
              "            </div>\n" +
              "            </div>\n" +
              '            <div class="vdo" cam_name_layout=' +
              response.cams[j].camera_list[camList].cam_name +
              ' onclick="openLiveStream(this)">\n' +
              '            <div class="vidc2" id="vidID9' +
              camList +
              '">\n' +
              "        </div>\n" +
              "        </div>\n" +
              "        </div>"
          );
        } else if (count_cam == 7) {
          heightVideoElement = "187";
          // $('#3by3sectionHLS').append('<section class="widget tiny" style="height: 211px;margin-bottom: 3px; padding: 0px 0px;border: 1px solid #ffffff42;" cam_name_layout='+response.cams[j].camera_list[camList].cam_name+' onclick="openLiveStream(this)">\n' +
          //     '                      <div class="row" style="padding-bottom: 10px; background: #2A3547; width: 100% !important; margin-left: 0px; padding: 5px 0px; margin: 0px !important;">\n' +
          //     '                        <div class="col-md-7 camico">\n' +
          //     '                          <i class="fa fa-circle" style="font-size:8px;margin-left: 0px;"></i><span class="camnm" style="position: relative;left: 3px;">'+response.cams[j].camera_list[camList].cam_name+'</span>\n' +
          //     '                        </div>\n' +
          //     '                        <div class="col-md-5" style="float:right;">\n' +
          //     '                        </div>\n' +
          //     '                      </div>\n' +
          //     '                      <div class="vdo">\n' +
          //     '                        <div class="vidc2" id="vidID9'+camList+'">\n' +
          //     '\n' +
          //     '                      </div>\n' +
          //     '                    </section>');

          $("#8layout").append(
            '<div class="col-md-3 4layoutBy8 ipadnilay" style="padding-left: 0px;padding-right: 0px; margin-top: 0px; border:1px solid #ffffff42;margin-right: 3px;cursor:pointer;width: 24.7%;" ondrop="camdrop(event,' +
              camList +
              ',`ipadnilay`)" ondragover="allowcamDrop(event)" > <div class="row" style="padding-bottom: 10px; background: #2A3547; width: 100% !important; margin-left: 0px; padding: 5px 0px; margin: 0px !important;">\n' +
              '            <div class="col-md-7 camico">\n' +
              '            <i class="fa fa-circle" style="font-size:8px;margin-left: 0px;"></i><span class="camnm" style="position: relative;left: 3px;">' +
              response.cams[j].camera_list[camList].cam_name +
              "</span>\n" +
              "        </div>\n" +
              '        <div class="col-md-5" style="float:right;">\n' +
              '<i class="fa fa-play" style= "float: right; position: relative;top:4px; cursor:pointer" title="Playback" name="Playback" cam_name_l="'+response.cams[j].camera_list[camList].cam_name+'" onclick="Layoutfunction2(this);"> </i>'+
              "            </div>\n" +
              "            </div>\n" +
              '            <div class="vdo" cam_name_layout=' +
              response.cams[j].camera_list[camList].cam_name +
              ' onclick="openLiveStream(this)">\n' +
              '            <div class="vidc2" id="vidID9' +
              camList +
              '">\n' +
              "        </div>\n" +
              "        </div>\n" +
              "        </div>"
          );
        } else if (count_cam == 8) {
          heightVideoElement = "187";

          $("#8layout").append(
            '<div class="col-md-3 4layoutBy8 ipadnilay" style="padding-left: 0px;padding-right: 0px; margin-top: 0px; border:1px solid #ffffff42;margin-right: 3px;cursor:pointer;width: 24.7%;" ondrop="camdrop(event,' +
              camList +
              ',`ipadnilay`)" ondragover="allowcamDrop(event)"> <div class="row" style="padding-bottom: 10px; background: #2A3547; width: 100% !important; margin-left: 0px; padding: 5px 0px; margin: 0px !important;" >\n' +
              '            <div class="col-md-7 camico">\n' +
              '            <i class="fa fa-circle" style="font-size:8px;margin-left: 0px;"></i><span class="camnm" style="position: relative;left: 3px;">' +
              response.cams[j].camera_list[camList].cam_name +
              "</span>\n" +
              "        </div>\n" +
              '        <div class="col-md-5" style="float:right;">\n' +
              '<i class="fa fa-play" style= "float: right; position: relative;top:4px; cursor:pointer" title="Playback" name="Playback" cam_name_l="'+response.cams[j].camera_list[camList].cam_name+'" onclick="Layoutfunction2(this);"> </i>'+
              "            </div>\n" +
              "            </div>\n" +
              '            <div class="vdo" cam_name_layout=' +
              response.cams[j].camera_list[camList].cam_name +
              ' onclick="openLiveStream(this)">\n' +
              '            <div class="vidc2" id="vidID9' +
              camList +
              '">\n' +
              "        </div>\n" +
              "        </div>\n" +
              "        </div>"
          );
        }

        var timestamp = new Date().getMilliseconds();

        $("#vidID9" + camList).append(
          '<canvas id="my_video_12' +
            camList +
            '" class="video-js vjs-default-skin" style="width:100%;height:' +
            heightVideoElement +
            'px"\n' +
            "              >\n" +
            "        </canvas>"
        );
        var canvas1 = document.getElementById("my_video_12" + camList);
        var player1 = new JSMpeg.Player(
          "ws://" +
            base_domainip.split(":")[0] +
            ":" +
            response.cams[j].camera_list[camList].cam_output_url?.split(":")[2],
          { canvas: canvas1 }
        );
      }
    }
  }

  rightLength3x3 = 0;
  bottomLength3x3 = 0;

  if (lengthOfLiveCards == 8) {
    rightLength3x3 = 3;
    bottomLength3x3 = 4;
  } else if (lengthOfLiveCards == 7) {
    rightLength3x3 = 3;
    bottomLength3x3 = 4;
  } else if (lengthOfLiveCards == 6) {
    rightLength3x3 = 2;
    bottomLength3x3 = 4;
  } else if (lengthOfLiveCards == 5) {
    rightLength3x3 = 1;
    bottomLength3x3 = 4;
  } else if (lengthOfLiveCards == 4) {
    bottomLength3x3 = 4;
  } else if (lengthOfLiveCards == 3) {
    bottomLength3x3 = 3;
  } else if (lengthOfLiveCards == 2) {
    bottomLength3x3 = 2;
  } else if (lengthOfLiveCards == 1) {
    bottomLength3x3 = 1;
  }

  // for()

  for (noCam = 0; noCam < rightLength3x3; noCam++) {
    $("#3by3sectionHLS").append(
      '<section class="widget tiny" style="height: 211px;margin-bottom: 3px; padding: 0px 0px;border: 1px solid #ffffff42;" ondrop="camdrop(event,`nolivecamera`,`widget`)" ondragover="allowcamDrop(event)">\n' +
        '                      <div class="row" style="padding-bottom: 10px; background: #2A3547; width: 100% !important; margin-left: 0px; padding: 5px 0px; margin: 0px !important;">\n' +
        '                        <div class="col-md-7 camico">\n' +
        '                          <i class="fa fa-circle" style="font-size:8px;margin-left: 0px;"></i><span class="camnm" style="position: relative;left: 3px;">No Feed</span>\n' +
        "                        </div>\n" +
        '                        <div class="col-md-5" style="float:right;">\n' +
        "                        </div>\n" +
        "                      </div>\n" +
        '                      <div class="vdo">\n' +
        '                        <div class="vidc2" id="vidID9\'+camList+\'">\n' +
        '                          <div style="width:100%;height:350px; position: relative;">\n' +
        '                            <div style="text-align: center; position: ; position: absolute; left: 41%; top: 17%;"> No Live Feed</div> </div>\n' +
        "                        </div>\n" +
        "                      </div>\n" +
        "                    </section>"
    );
  }

  for (noCambottom = 0; noCambottom < bottomLength3x3; noCambottom++) {
    $("#8layout").append(
      '<div class="col-md-3 4layoutBy8 ipadnilay" style="padding-left: 0px;padding-right: 0px; margin-top: 0px; border:1px solid #ffffff42;margin-right: 3px;cursor:pointer;width: 24.7%;" ondrop="camdrop(event,`nolivecamera`,`ipadnilay`)" ondragover="allowcamDrop(event)" > <div class="row" style="padding-bottom: 10px; background: #2A3547; width: 100% !important; margin-left: 0px; padding: 5px 0px; margin: 0px !important;" >\n' +
        '            <div class="col-md-7 camico">\n' +
        '            <i class="fa fa-circle" style="font-size:8px;margin-left: 0px;"></i><span class="camnm" style="position: relative;left: 3px;">No Feed</span>\n' +
        "        </div>\n" +
        '        <div class="col-md-5" style="float:right;">\n' +
        "            </div>\n" +
        "            </div>\n" +
        '            <div class="vdo">\n' +
        '            <div class="vidc2" id="vidID9\'+camList+\'">\n' +
        '            <div style="width:100%;height:187px; position: relative;">\n' +
        '            <div style="text-align: center; position: ; position: absolute; left: 41%; top: 39%;"> No Live Feed</div> \n' +
        "        </div>\n" +
        "        </div>\n" +
        "        </div>\n" +
        "        </div>"
    );
  }

  // for(k=0;k<9;k++){
  //     try {
  //
  //     }
  //     catch(err) {
  //         continue;
  //     }
  //
  //
  //
  //
  // }
}

var deleteMultipleArray = [];
function GetNameDeleteCamera(deleteCamName) {
  var index = deleteMultipleArray.indexOf(
    $(deleteCamName).attr("checkbox_slected_val")
  );
  if (index !== -1) {
    deleteMultipleArray.splice(index, 1);
  } else {
    deleteMultipleArray.push($(deleteCamName).attr("checkbox_slected_val"));
  }

  console.log(deleteMultipleArray);
}

function deleteMultipleCamera() {}


function Layoutfunction2(e){
  localStorage.setItem("camName-DXB",$(e).attr('cam_name_l'))
  window.location.href="cctv_playback";
  
}

function chnage_Stream(e){
  console.log(e.value)
  // get_all_VMScams9()
  if($('#bttw').hasClass('active')){
    get_all_VMScams4()


  }else if($('#bttw_8').hasClass('active')){
    get_all_VMScams8()

  }else if($('#bttr').hasClass('active')){
    get_all_VMScams9()
  }
}