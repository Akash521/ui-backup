var secondsStartTime;
function playbackVideoGet(fromTime) {
  // console.log($("#picker").find("input").val())
  var JsonDictplayback = {
    from_time: fromTime,
    cam_name: localStorage.getItem("camName-DXB"),
  };

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
    url: "/go_to_time",
    method: "POST",
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
      "postman-token": "969f9395-b052-56c6-48a3-1e8bf712f721",
    },
    processData: false,
    data: JSON.stringify(JsonDictplayback),
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
      response = response.data;
      

      if(response.status == "success"){
         response = response.data
        localStorage.setItem(
          "playback_start_date",
          response.cam_add_time.split(" ")[0]
        );
  
        var playbackVideoURl =
          "http://" +
          base_domainip +
          "/nginx" +
          response.file_path;
        console.log(playbackVideoURl);
  
        let valuestart = moment.duration(response.start_file_time, "HH:mm:ss", {
          trim: false,
        });
        let valuestop = moment.duration(
          $("#picker > span:nth-child(3)").text(),
          "HH:mm:ss",
          { trim: false }
        );
        let difference = valuestop.subtract(valuestart);
  
        // var hms = ("0"+difference.hours()).substr(-2) + ":"+("0"+difference.minutes()).substr(-2) + ":" +("0"+difference.seconds()).substr(-2);   // your input string
        // var a = hms.split(':'); // split it at the colons
        // var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
        //
        // var secondsFrom = seconds;
        // console.log(secondsFrom)
        // var secondsTo = findSeconds(response.start_file_time,response.end_file_time);
  
        // console.log(seconds);
        if (videojs.getPlayers()["my_video_playback"]) {
          videojs("my_video_playback").dispose();
          // $('#videoPlayback').append('<video id="my_video_playback" muted class="video-js vjs-default-skin" controls  style="width:100%;height:700px"\n' +
          //     '>\n' +
          //     '            <source src='+playbackVideoURl+'  type=\'application/x-mpegURL\'>\n' +
          //     '        </video>');
  
          $("#videoPlayback").append(
            '<video id="my_video_playback" muted class="video-js vjs-default-skin" controls preload="auto" style="width:100%;height:700px"\n' +
              "                                       data-setup='{}'>\n" +
              "                                    <source src=" +
              playbackVideoURl +
              "  type='application/x-mpegURL'>\n" +
              "                                </video>"
          );
          videojs("my_video_playback", {
            playbackRates: [0.5, 1, 2, 4, 8],
          });
          // $('#videoDiv').append(' <source src="http://192.168.10.8/nginx/hls/aka/manifest.m3u8"  type=\'application/x-mpegURL\'>');
          videojs.getPlayer("my_video_playback").ready(function () {
            // +++ Create divs for buttons +++
            var myPlayer = this,
              jumpAmount = 5,
              controlBar,
              insertBeforeNode,
              newElementBB = document.createElement("div"),
              newElementFB = document.createElement("div"),
              newImageBB = document.createElement("span"),
              newImageFB = document.createElement("span");
  
            // +++ Assign IDs for later element manipulation +++
            newElementBB.id = "backButton";
            newElementFB.id = "forwardButton";
  
            // +++ Assign properties to elements and assign to parents +++
            newImageBB.setAttribute("class", "fa fa-backward");
            newImageBB.setAttribute(
              "style",
              "position: relative; top: 8px; font-size: 13px; left: 3px;"
            );
            newElementBB.appendChild(newImageBB);
            newImageFB.setAttribute("class", "fa fa-forward");
            newImageFB.setAttribute(
              "style",
              "position: relative; top: 8px; font-size: 13px; right: 3px;"
            );
            newElementFB.appendChild(newImageFB);
  
            // +++ Get controlbar and insert elements +++
            controlBar = myPlayer.$(".vjs-control-bar");
            // Get the element to insert buttons in front of in conrolbar
            insertBeforeNode = myPlayer.$(".vjs-volume-panel");
  
            // Insert the button div in proper location
            controlBar.insertBefore(
              newElementBB,
              myPlayer.$(".vjs-play-control")
            );
            // controlBar.insertBefore(newElementBB, insertBeforeNode);
            controlBar.insertBefore(newElementFB, insertBeforeNode);
  
            // +++ Add event handlers to jump back or forward +++
            // Back button logic, don't jump to negative times
            newElementBB.addEventListener("click", function () {
              var newTime,
                rewindAmt = jumpAmount,
                videoTime = myPlayer.currentTime();
              if (videoTime >= rewindAmt) {
                newTime = videoTime - rewindAmt;
              } else {
                newTime = 0;
              }
              myPlayer.currentTime(newTime);
            });
  
            // Forward button logic, don't jump past the duration
            newElementFB.addEventListener("click", function () {
              var newTime,
                forwardAmt = jumpAmount,
                videoTime = myPlayer.currentTime(),
                videoDuration = myPlayer.duration();
              if (videoTime + forwardAmt <= videoDuration) {
                newTime = videoTime + forwardAmt;
              } else {
                newTime = videoDuration;
              }
              myPlayer.currentTime(newTime);
            });
          });
  
          // videojs('my_video_playback').currentTime(secondsFrom);
          videojs("my_video_playback").play();
          // player.play();
          setTimeout(function () {
            // $('.vjs-big-play-button').trigger('click');
          }, 500);
          // $('#my_video_playback_html5_api').css('height','-webkit-fill-available')
          $(".vjs-default-skin").append(
            '<div class="alert alert-warning alert-sm pull-right no-margin" id="app-alert1" style=" padding:6px; background-color:rgb(10 10 10); border-color:#373b3f; position: absolute;top: 2px;right: 2px; display:none;">\n' +
              '                            <span class="fw-semi-bold">Person Count:</span> <span id="person_count1">-</span>\n' +
              "                        </div>"
          );
        } else {
          // $('#videoPlayback').append('<video id="my_video_playback" muted class="video-js vjs-default-skin" controls  style="width:100%;height:700px"\n' +
          //     '              >\n' +
          //     '            <source src='+playbackVideoURl+'  type=\'application/x-mpegURL\'>\n' +
          //     '        </video>');
  
          $("#videoPlayback").append(
            '<video id="my_video_playback" muted class="video-js vjs-default-skin" controls preload="auto" style="width:100%;height:700px"\n' +
              "                                       data-setup='{}'>\n" +
              "                                    <source src=" +
              playbackVideoURl +
              "  type='application/x-mpegURL'>\n" +
              "                                </video>"
          );
          // $('#videoDiv').append(' <source src="http://192.168.10.8/nginx/hls/aka/manifest.m3u8"  type=\'application/x-mpegURL\'>');
          videojs("my_video_playback", {
            playbackRates: [0.5, 1, 2, 4, 8],
          });
  
          videojs.getPlayer("my_video_playback").ready(function () {
            // +++ Create divs for buttons +++
            var myPlayer = this,
              jumpAmount = 5,
              controlBar,
              insertBeforeNode,
              newElementBB = document.createElement("div"),
              newElementFB = document.createElement("div"),
              newImageBB = document.createElement("span"),
              newImageFB = document.createElement("span");
  
            // +++ Assign IDs for later element manipulation +++
            newElementBB.id = "backButton";
            newElementFB.id = "forwardButton";
  
            // +++ Assign properties to elements and assign to parents +++
            newImageBB.setAttribute("class", "fa fa-backward");
            newImageBB.setAttribute(
              "style",
              "position: relative; top: 8px; font-size: 13px; left: 3px; cursor:pointer;"
            );
            newElementBB.appendChild(newImageBB);
            newImageFB.setAttribute("class", "fa fa-forward");
            newImageFB.setAttribute(
              "style",
              "position: relative; top: 8px; font-size: 13px; right: 3px; cursor:pointer;"
            );
            newElementFB.appendChild(newImageFB);
  
            // +++ Get controlbar and insert elements +++
            controlBar = myPlayer.$(".vjs-control-bar");
            // Get the element to insert buttons in front of in conrolbar
            insertBeforeNode = myPlayer.$(".vjs-volume-panel");
  
            // Insert the button div in proper location
            controlBar.insertBefore(
              newElementBB,
              myPlayer.$(".vjs-play-control")
            );
            // controlBar.insertBefore(newElementBB, insertBeforeNode);
            controlBar.insertBefore(newElementFB, insertBeforeNode);
  
            // +++ Add event handlers to jump back or forward +++
            // Back button logic, don't jump to negative times
            newElementBB.addEventListener("click", function () {
              var newTime,
                rewindAmt = jumpAmount,
                videoTime = myPlayer.currentTime();
              if (videoTime >= rewindAmt) {
                newTime = videoTime - rewindAmt;
              } else {
                newTime = 0;
              }
              myPlayer.currentTime(newTime);
            });
  
            // Forward button logic, don't jump past the duration
            newElementFB.addEventListener("click", function () {
              var newTime,
                forwardAmt = jumpAmount,
                videoTime = myPlayer.currentTime(),
                videoDuration = myPlayer.duration();
              if (videoTime + forwardAmt <= videoDuration) {
                newTime = videoTime + forwardAmt;
              } else {
                newTime = videoDuration;
              }
              myPlayer.currentTime(newTime);
            });
          });
  
          // videojs('my_video_playback').currentTime(secondsFrom);
          videojs("my_video_playback").play();
  
          // player.play();
          setTimeout(function () {
            // $('.vjs-big-play-button').trigger('click');
          }, 500);
          $("#my_video_playback_html5_api").css(
            "height",
            "-webkit-fill-available"
          );
  
          $(".vjs-default-skin").append(
            '<div class="alert alert-warning alert-sm pull-right no-margin" id="app-alert" style=" padding:6px; background-color:rgb(10 10 10);; border-color:#373b3f; position: absolute;top: 2px;right: 2px; display:none;">\n' +
              '                            <span class="fw-semi-bold">Person Count:</span> <span id="person_count">-</span>\n' +
              "                        </div>"
          );
        }
  
        $("#livePlaybackCamName").empty();
        $("#livePlaybackCamName").append(localStorage.getItem("camName-DXB"));
        var abc = "#" + localStorage.getItem("camName-DXB");
  
        $(".act").removeClass("active");
        $(abc).addClass("active");
  
        var PlaybackStartTime = response.current_time.split(" ");
        PlaybackStartTime = PlaybackStartTime[0] + " " + response.start_file_time;
        var PlaybackEndTime = response.current_time.split(" ");
        var PlaybackEndTime = PlaybackEndTime[0] + " " + response.end_file_time;
        console.log(PlaybackEndTime);
        var starttimePlayback =
          new Date(PlaybackStartTime).getTime() +
          new Date().getTimezoneOffset() * 60 * 1000 * -1;
        // console.log($("#picker > span:nth-child(1)").text()+" "+response.end_file_time)
        var current_time =
          new Date(PlaybackEndTime).getTime() +
          new Date().getTimezoneOffset() * 60 * 1000 * -1;
        // var current_time = (new Date()).getTime() + ((new Date()).getTimezoneOffset() * 60 * 1000 * -1);
        var d;
        d = new Date(starttimePlayback);
        // alert(d.getMinutes() + ':' + d.getSeconds()); //11:55
        d.setSeconds(d.getSeconds() + 300);
  
        $("#slider456").TimeSlider({
          start_timestamp: starttimePlayback,
          current_timestamp: current_time,
          // update_timestamp_interval: 10,
          // update_interval: 1,
          // show_s: true,
          hours_per_ruler: 24,
          graduation_step: 9,
  
          // start_timestamp: current_time - 3600 * 7 * 1000,
  
          // alert(d.getMinutes() + ':0' + d.getSeconds());
          init_cells: [
            // {'_id': 'c1', 'start': (current_time - (3600 * 6.2 * 1000) + 5678), 'stop': current_time - 3600 * 4.8 * 1000},
            { _id: "c2", start: starttimePlayback, stop: current_time },
            { _id: "c3", start: starttimePlayback },
            // {'_id': 'c3', 'start': 60*12*1000, 'stop': 60*20*1000*2}
          ],
          on_change_timecell_callback: function (a, b, c) {
            console.log(a, b, c);
            console.log(msToTime(c));
  
            var hmsFrom = "00:1:10";
            var hmsTo = "00:1:35"; // your input string
            var fromTime = hmsFrom.split(":"); // split it at the colons
            var toTime = hmsTo.split(":");
            // minutes are worth 60 seconds. Hours are worth 60 minutes.
            var secondsFrom =
              +fromTime[0] * 60 * 60 + +fromTime[1] * 60 + +fromTime[2];
            var secondsTo = +toTime[0] * 60 * 60 + +toTime[1] * 60 + +toTime[2];
  
            console.log(secondsFrom + " " + secondsTo);
  
            // console.log(msToTime(b) )
            $("#vc-video").empty();
            // var url = "https://./img/video/Pivotchain - Raven (AI driven apron area analytics platform for Airports).mp4"+from_time+","+to_time;
            // this.$element.append('<div id="#vc-video">url</div>');
            // var url = ("./img/video/Pivotchain - Raven (AI driven apron area analytics platform for Airports).mp4") + current_time;
            // document.getElementById("vc-video").append(url);
  
            var c = document.getElementById("vc-video");
            // Create an element <video>
            var v = document.createElement("video");
            // Set the attributes of the video
            v.src =
              "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4#t=" +
              secondsFrom +
              "," +
              secondsTo;
            v.controls = true;
            v.autoplay = true;
            // Add the video to <div>
            c.append(v);
            // console.log(current_time)
            // c.append(current_time);
          },
        });
  
        // videojs('my_video_playback').ready(function(){
        //   var myPlayer = this;
        //   myPlayer.on('timeupdate', function(){
        //     console.log('the time was updated to: ' + myPlayer.currentTime());
        //   });
        // });
  
        videojs("my_video_playback").ready(function () {
          this.on("timeupdate", function () {
            // secondsStartTime
  
            var time =
              response.selected_date +
              " " +
              new Date(this.currentTime() * 1000).toISOString().substr(11, 8);
            // console.log(time)
  
            $("#slider456").TimeSlider("edit", {
              _id: "c3",
              start:
                new Date(time).getTime() +
                new Date().getTimezoneOffset() * 60 * 1000 * -1,
            });
  
            console.log();
          });
        });
      }else{
        Messenger().post({
          message: response.message ? response.message : response.status,
          type:"error",
          showCloseButton:true
        })
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

  $(".playbackRightIcon").css("display", "flex");
  $("#open-modal-snap").show();
  $("#open-modal").show();
}
var TimeSliderCount = 0;
function playbackVideoGet1(fromTime) {
  // console.log($("#picker").find("input").val())
  var JsonDictplayback = {
    from_time: fromTime,
    cam_name: localStorage.getItem("camName-DXB"),
  };

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
    url: "/go_to_time",
    method: "POST",
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
      "postman-token": "969f9395-b052-56c6-48a3-1e8bf712f721",
    },
    processData: false,
    data: JSON.stringify(JsonDictplayback),
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
      response = response.data;
      if(response.status == "success"){
        response = response.data
        localStorage.setItem(
          "playback_start_date",
          response.cam_add_time.split(" ")[0]
        );
  
        var playbackVideoURl =
          "http://" +
          base_domainip +
          "/nginx" +
          response.file_path;
        console.log(playbackVideoURl);
  
        let valuestart = moment.duration(response.start_file_time, "HH:mm:ss", {
          trim: false,
        });
        let valuestop = moment.duration(
          $("#picker > span:nth-child(3)").text(),
          "HH:mm:ss",
          { trim: false }
        );
        let difference = valuestop.subtract(valuestart);
  
        var hms =
          ("0" + difference.hours()).substr(-2) +
          ":" +
          ("0" + difference.minutes()).substr(-2) +
          ":" +
          ("0" + difference.seconds()).substr(-2); // your input string
        var a = hms.split(":"); // split it at the colons
        var seconds = +a[0] * 60 * 60 + +a[1] * 60 + +a[2];
  
        var secondsFrom = seconds;
        console.log(secondsFrom);
        var secondsTo = findSeconds(
          response.start_file_time,
          response.end_file_time
        );
  
        console.log(seconds);
        if (videojs.getPlayers()["my_video_playback"]) {
          videojs("my_video_playback").dispose();
          // $('#videoPlayback').append('<video id="my_video_playback" muted class="video-js vjs-default-skin" controls  style="width:100%;height:700px"\n' +
          //     '>\n' +
          //     '            <source src='+playbackVideoURl+'  type=\'application/x-mpegURL\'>\n' +
          //     '        </video>');
  
          $("#videoPlayback").append(
            '<video id="my_video_playback" muted class="video-js vjs-default-skin" controls preload="auto" style="width:100%;height:700px"\n' +
              "                                       data-setup='{}'>\n" +
              "                                    <source src=" +
              playbackVideoURl +
              "#t=" +
              secondsFrom +
              "," +
              secondsTo +
              "  type='application/x-mpegURL'>\n" +
              "                                </video>"
          );
          var overrideNative = false;
          videojs("my_video_playback", {
            playbackRates: [0.5, 1, 2, 4, 8],
            html5: {
              hls: {
                overrideNative: overrideNative
              },
              nativeVideoTracks: !overrideNative,
              nativeAudioTracks: !overrideNative,
              nativeTextTracks: !overrideNative
            }
          });
          // $('#videoDiv').append(' <source src="http://192.168.10.8/nginx/hls/aka/manifest.m3u8"  type=\'application/x-mpegURL\'>');
          videojs.getPlayer("my_video_playback").ready(function () {
            // +++ Create divs for buttons +++
            var myPlayer = this,
              jumpAmount = 5,
              controlBar,
              insertBeforeNode,
              newElementBB = document.createElement("div"),
              newElementFB = document.createElement("div"),
              newImageBB = document.createElement("span"),
              newImageFB = document.createElement("span");
  
            // +++ Assign IDs for later element manipulation +++
            newElementBB.id = "backButton";
            newElementFB.id = "forwardButton";
  
            // +++ Assign properties to elements and assign to parents +++
            newImageBB.setAttribute("class", "fa fa-backward");
            newImageBB.setAttribute(
              "style",
              "position: relative; top: 8px; font-size: 13px; left: 3px;"
            );
            newElementBB.appendChild(newImageBB);
            newImageFB.setAttribute("class", "fa fa-forward");
            newImageFB.setAttribute(
              "style",
              "position: relative; top: 8px; font-size: 13px; right: 3px;"
            );
            newElementFB.appendChild(newImageFB);
  
            // +++ Get controlbar and insert elements +++
            controlBar = myPlayer.$(".vjs-control-bar");
            // Get the element to insert buttons in front of in conrolbar
            insertBeforeNode = myPlayer.$(".vjs-volume-panel");
  
            // Insert the button div in proper location
            controlBar.insertBefore(
              newElementBB,
              myPlayer.$(".vjs-play-control")
            );
            // controlBar.insertBefore(newElementBB, insertBeforeNode);
            controlBar.insertBefore(newElementFB, insertBeforeNode);
  
            // +++ Add event handlers to jump back or forward +++
            // Back button logic, don't jump to negative times
            newElementBB.addEventListener("click", function () {
              var newTime,
                rewindAmt = jumpAmount,
                videoTime = myPlayer.currentTime();
              if (videoTime >= rewindAmt) {
                newTime = videoTime - rewindAmt;
              } else {
                newTime = 0;
              }
              myPlayer.currentTime(newTime);
            });
  
            // Forward button logic, don't jump past the duration
            newElementFB.addEventListener("click", function () {
              var newTime,
                forwardAmt = jumpAmount,
                videoTime = myPlayer.currentTime(),
                videoDuration = myPlayer.duration();
              if (videoTime + forwardAmt <= videoDuration) {
                newTime = videoTime + forwardAmt;
              } else {
                newTime = videoDuration;
              }
              myPlayer.currentTime(newTime);
            });
          });
  
          videojs("my_video_playback").currentTime(secondsFrom);
          videojs("my_video_playback").play();
          // player.play();
          setTimeout(function () {
            // $('.vjs-big-play-button').trigger('click');
          }, 500);
          // $('#my_video_playback_html5_api').css('height','-webkit-fill-available')
          $(".vjs-default-skin").append(
            '<div class="alert alert-warning alert-sm pull-right no-margin" id="app-alert" style=" padding:6px; background-color:rgb(10 10 10);; border-color:#373b3f; position: absolute;top: 2px;right: 2px; display:none;">\n' +
              '                            <span class="fw-semi-bold">Person Count:</span> <span id="person_count">-</span>\n' +
              "                        </div>"
          );
        } else {
          // $('#videoPlayback').append('<video id="my_video_playback" muted class="video-js vjs-default-skin" controls  style="width:100%;height:700px"\n' +
          //     '              >\n' +
          //     '            <source src='+playbackVideoURl+'  type=\'application/x-mpegURL\'>\n' +
          //     '        </video>');
  
          $("#videoPlayback").append(
            '<video id="my_video_playback" muted class="video-js vjs-default-skin" controls preload="auto" style="width:100%;height:700px"\n' +
              "                                       data-setup='{}'>\n" +
              "                                    <source src=" +
              playbackVideoURl +
              "#t=" +
              secondsFrom +
              "," +
              secondsTo +
              "  type='application/x-mpegURL'>\n" +
              "                                </video>"
          );
          // $('#videoDiv').append(' <source src="http://192.168.10.8/nginx/hls/aka/manifest.m3u8"  type=\'application/x-mpegURL\'>');
          videojs("my_video_playback", {
            playbackRates: [0.5, 1, 2, 4, 8],
          });
  
          videojs.getPlayer("my_video_playback").ready(function () {
            // +++ Create divs for buttons +++
            var myPlayer = this,
              jumpAmount = 5,
              controlBar,
              insertBeforeNode,
              newElementBB = document.createElement("div"),
              newElementFB = document.createElement("div"),
              newImageBB = document.createElement("span"),
              newImageFB = document.createElement("span");
  
            // +++ Assign IDs for later element manipulation +++
            newElementBB.id = "backButton";
            newElementFB.id = "forwardButton";
  
            // +++ Assign properties to elements and assign to parents +++
            newImageBB.setAttribute("class", "fa fa-backward");
            newImageBB.setAttribute(
              "style",
              "position: relative; top: 8px; font-size: 13px; left: 3px; cursor:pointer;"
            );
            newElementBB.appendChild(newImageBB);
            newImageFB.setAttribute("class", "fa fa-forward");
            newImageFB.setAttribute(
              "style",
              "position: relative; top: 8px; font-size: 13px; right: 3px; cursor:pointer;"
            );
            newElementFB.appendChild(newImageFB);
  
            // +++ Get controlbar and insert elements +++
            controlBar = myPlayer.$(".vjs-control-bar");
            // Get the element to insert buttons in front of in conrolbar
            insertBeforeNode = myPlayer.$(".vjs-volume-panel");
  
            // Insert the button div in proper location
            controlBar.insertBefore(
              newElementBB,
              myPlayer.$(".vjs-play-control")
            );
            // controlBar.insertBefore(newElementBB, insertBeforeNode);
            controlBar.insertBefore(newElementFB, insertBeforeNode);
  
            // +++ Add event handlers to jump back or forward +++
            // Back button logic, don't jump to negative times
            newElementBB.addEventListener("click", function () {
              var newTime,
                rewindAmt = jumpAmount,
                videoTime = myPlayer.currentTime();
              if (videoTime >= rewindAmt) {
                newTime = videoTime - rewindAmt;
              } else {
                newTime = 0;
              }
              myPlayer.currentTime(newTime);
            });
  
            // Forward button logic, don't jump past the duration
            newElementFB.addEventListener("click", function () {
              var newTime,
                forwardAmt = jumpAmount,
                videoTime = myPlayer.currentTime(),
                videoDuration = myPlayer.duration();
              if (videoTime + forwardAmt <= videoDuration) {
                newTime = videoTime + forwardAmt;
              } else {
                newTime = videoDuration;
              }
              myPlayer.currentTime(newTime);
            });
          });
  
          videojs("my_video_playback").currentTime(secondsFrom);
          videojs("my_video_playback").play();
  
          // player.play();
          setTimeout(function () {
            // $('.vjs-big-play-button').trigger('click');
          }, 500);
          $("#my_video_playback_html5_api").css(
            "height",
            "-webkit-fill-available"
          );
  
          $(".vjs-default-skin").append(
            '<div class="alert alert-warning alert-sm pull-right no-margin" id="app-alert" style=" padding:6px; background-color:rgb(10 10 10);; border-color:#373b3f; position: absolute;top: 2px;right: 2px; display:none;">\n' +
              '                            <span class="fw-semi-bold">Person Count:</span> <span id="person_count">-</span>\n' +
              "                        </div>"
          );
        }
  
        $("#livePlaybackCamName").empty();
        $("#livePlaybackCamName").append(localStorage.getItem("camName-DXB"));
        var abc = "#" + localStorage.getItem("camName-DXB");
  
        $(".act").removeClass("active");
        $(abc).addClass("active");
  
        // var PlaybackStartTime = response.current_time.split(' ');
        var PlaybackStartTime =
          response.selected_date + " " + response.start_file_time;
        // var PlaybackEndTime = response.current_time.split(' ');
        var PlaybackEndTime =
          response.selected_date + " " + response.end_file_time;
        // PlaybackEndTime = PlaybackEndTime[0]+" "+ response.end_file_time
        var starttimePlayback =
          new Date(PlaybackStartTime).getTime() +
          new Date().getTimezoneOffset() * 60 * 1000 * -1;
        var current_time =
          new Date(PlaybackEndTime).getTime() +
          new Date().getTimezoneOffset() * 60 * 1000 * -1;
        console.log(PlaybackEndTime);
        // $('#slider456').empty();
        // var current_time = (new Date()).getTime() + ((new Date()).getTimezoneOffset() * 60 * 1000 * -1);
        // $('#slider456').remove();
        // $('#slider457').show();
  
        $("#slider456").remove();
        $(".testPlayback").remove();
        $("#slider21" + TimeSliderCount).remove();
        TimeSliderCount += 1;
        var idTime = "slider21" + TimeSliderCount;
  
        $("#timeSliderPlayback").append(
          "<div id=" +
            idTime +
            ' class="time-slider testPlayback" style="height: 64px !important;"></video>'
        );
        // $('#timeSliderPlayback').append("<div id="+idTime+"" class='time-slider testPlayback' style='height: 64px !important;'>
        //
        // </div>")
        // $("#slider456").TimeSlider("new_start_timestamp",{"start_timestamp":starttimePlayback});
        // $("#slider456").TimeSlider("edit",{'_id': 'c2', 'start': starttimePlayback, 'stop': current_time});
        $("#slider21" + TimeSliderCount).TimeSlider({
          start_timestamp: starttimePlayback,
          current_timestamp: current_time,
          // update_timestamp_interval: 10,
          // update_interval: 1,
          // show_s: true,
          hours_per_ruler: 24,
          graduation_step: 9,
          // start_timestamp: current_time - 3600 * 7 * 1000,
          init_cells: [
            // {'_id': 'c1', 'start': (current_time - (3600 * 6.2 * 1000) + 5678), 'stop': current_time - 3600 * 4.8 * 1000},
            { _id: "c2", start: starttimePlayback, stop: current_time },
            // {'_id': 'c3', 'start': (current_time - (3600 * 2.1 * 1000)) ,},
            // {'_id': 'c3', 'start': 60*12*1000, 'stop': 60*20*1000*2}
          ],
          on_change_timecell_callback: function (a, b, c) {
            console.log(a, b, c);
            console.log(msToTime(c));
  
            var hmsFrom = "00:1:10";
            var hmsTo = "00:1:35"; // your input string
            var fromTime = hmsFrom.split(":"); // split it at the colons
            var toTime = hmsTo.split(":");
            // minutes are worth 60 seconds. Hours are worth 60 minutes.
            var secondsFrom =
              +fromTime[0] * 60 * 60 + +fromTime[1] * 60 + +fromTime[2];
            var secondsTo = +toTime[0] * 60 * 60 + +toTime[1] * 60 + +toTime[2];
  
            console.log(secondsFrom + " " + secondsTo);
  
            // console.log(msToTime(b) )
            $("#vc-video").empty();
            // var url = "https://./img/video/Pivotchain - Raven (AI driven apron area analytics platform for Airports).mp4"+from_time+","+to_time;
            // this.$element.append('<div id="#vc-video">url</div>');
            // var url = ("./img/video/Pivotchain - Raven (AI driven apron area analytics platform for Airports).mp4") + current_time;
            // document.getElementById("vc-video").append(url);
  
            var c = document.getElementById("vc-video");
            // Create an element <video>
            var v = document.createElement("video");
            // Set the attributes of the video
            v.src =
              "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4#t=" +
              secondsFrom +
              "," +
              secondsTo;
            v.controls = true;
            v.autoplay = true;
            // Add the video to <div>
            c.append(v);
            // console.log(current_time)
            // c.append(current_time);
          },
        });
      }else{
        Messenger().post({
          message: response.message ? response.message : response.status,
          type:"error",
          showCloseButton:true
        })
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

  $(".playbackRightIcon").css("display", "flex");
  $("#open-modal-snap").show();
  $("#open-modal").show();
}
function saveSnapPlayback(el) {
  var image = document.getElementById("canv2").toDataURL("image/jpg");
  el.href = image;
}

// $('#my_video_playback').on('seeking', function() {
//     if(seekStart === null) {
//         seekStart = previousTime;
//     }
// });
// $('#my_video_playback').on('seeked', function() {
//     console.log('seeked from', seekStart, 'to', currentTime, '; delta:', currentTime - previousTime);
//     seekStart = null;
// });

function findSeconds(f, e) {
  let valuestart = moment.duration(f, "HH:mm:ss", { trim: false });
  let valuestop = moment.duration(e, "HH:mm:ss", { trim: false });
  let difference = valuestop.subtract(valuestart);

  var hms =
    ("0" + difference.hours()).substr(-2) +
    ":" +
    ("0" + difference.minutes()).substr(-2) +
    ":" +
    ("0" + difference.seconds()).substr(-2); // your input string
  var a = hms.split(":"); // split it at the colons
  var seconds = +a[0] * 60 * 60 + +a[1] * 60 + +a[2];

  return seconds;
}
