//modify perimeter

var e_ip1 = localStorage.getItem("e_ip");

var imgsrc;
var myImg;

var e_img_src;
var e_img_src_reload;

var svg_div_var_cc;

var img_width;
var img_height;
var original_width;
var original_height;
var aspect_width;
var aspect_height;
var videoDict;
var videoDict_cc_p;
var videoDict_cc_p_s;

videoDict_cc_p = {};
videoDict_cc_p_s = {};

var new_width = 740;
var new_height = 500;
var dragging = false,
  drawing = false,
  startPoint;
var svg = d3
  .select("#imgCanv")
  .append("svg")
  .attr("height", new_height)
  .attr("width", new_width)
  .attr("id", "svg_div");
//var svg_1 = d3.select('#imgCanv').append('svg_1').attr('height',new_height).attr('width',new_width).attr('id','svg_div_1')
$("#svg_div").css("display", "none");
//$("#svg_div_1").css("display","none");
var points = [],
  g;
var str1 = [];
var count_click = -1;
var idxs = [];
idxs.push(0);
var polygon_no = 0;
var RoadDict = {};
var RoadDict_int_cc = {};

var only_points = [];
var dragger = d3.behavior
  .drag()
  .on("drag", handleDrag)
  .on("dragend", function (d) {
    dragging = false;
  });

function capture(video) {
  var baseImage = new Image();
  baseImage.setAttribute("crossOrigin", "anonymous");
  baseImage.src = e_img_src;

  var canvas = document.getElementById("output");

  canvas.width = new_width;
  canvas.height = new_height;
  var w = new_width;
  var h = new_height;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(baseImage, 0, 0, w, h);

  return canvas;
}

$("#here").click(function () {
  //imgsrc = "http://13.233.179.132/video/123/breach_detection/image_thumbnail.jpg";
});

function myfun1() {
  // action goes here!!

  //imgsrc = "http://13.233.179.132/video/123/breach_detection/image_thumbnail.jpg";

  var dataURL;

  var img = new Image();
  img.crossOrigin = "*";
  img.onload = function () {
    var canvas = document.getElementById("output");
    var ctx = canvas.getContext("2d");

    canvas.height = new_height;
    canvas.width = new_width;
    var w = new_width;
    var h = new_height;
    ctx.drawImage(this, 0, 0, w, h);
    dataURL = canvas.toDataURL();
    //        console.log(dataURL);
    div_canv = document.getElementById("imgCanv");
    div_canv.style.backgroundImage = "url(" + dataURL + ")";
    $("#svg_div").css("display", "inline-block");
    $("#output").hide();
    //        document.getElementById("accordion-6").style.display = "block";
    return dataURL;
  };
  img.src = e_img_src;

  //console.log(myImg.src);
  $("#imgCanv").width(new_width).height(new_height);

  myImg = document.getElementById("video_p");
  $(".modal-backdrop").remove();
  $("#sslBoundaryDXB").modal("show");

  //    canvas = capture(myImg);

  original_width = img_width;
  original_height = img_height;
  aspect_width = 0;
  aspect_height = 0;
  videoDict = {};

  aspect_width = original_width / new_width;
  aspect_height = original_height / new_height;

  console.log(original_width);

  console.log(original_height);
  console.log(new_width);
  console.log(new_height);
  console.log(aspect_width);
  console.log(aspect_height);
  $("#perimeter_img_reload").hide();

  svg.on("mouseup", function () {
    if (dragging) return;
    drawing = true;
    startPoint = [d3.mouse(this)[0], d3.mouse(this)[1]];
    if (svg.select("g.drawPoly").empty())
      g = svg.append("g").attr("class", "drawPoly");
    if (d3.event.target.hasAttribute("is-handle")) {
      var idx_end = count_click;
      //console.log('idx_end',idx_end);
      idxs.push(idx_end);
      //console.log(idxs);
      closePolygon(idx_end);
      return;
    }
    console.log("mouse this " + d3.mouse(this));
    if (d3.mouse(this)) count_click = count_click + 1;
    console.log("count click", count_click);

    str1.push(d3.mouse(this));
    points.push(d3.mouse(this));
    g.select("polyline").remove();
    var polyline = g
      .append("polyline")
      .attr("points", points)
      .style("fill", "none")
      .attr("stroke", "#000");
    for (var i = 0; i < points.length; i++) {
      g.append("circle")
        .attr("cx", points[i][0])
        .attr("cy", points[i][1])
        .attr("r", 4)
        .attr("fill", "yellow")
        .attr("stroke", "#000")
        .attr("is-handle", "true")
        .style({ cursor: "pointer" });
    }
  });

  svg.on("mousemove", function () {
    if (!drawing) return;
    var g = d3.select("g.drawPoly");
    g.select("line").remove();
    var line = g
      .append("line")
      .attr("x1", startPoint[0])
      .attr("y1", startPoint[1])
      .attr("x2", d3.mouse(this)[0] + 2)
      .attr("y2", d3.mouse(this)[1])
      .attr("stroke", "#11d7fa")
      .attr("stroke-width", 2);
  });
}

function closePolygon(idx) {
  var temp = [];
  var poly_points = [];
  svg.select("g.drawPoly").remove();
  var g = svg.append("g");
  g.append("polygon")
    .attr("points", points)
    .style("fill", getRandomColor())
    .style("fill-opacity", "0.4");
  polygon_no = polygon_no + 1;
  var name = prompt("Please Enter Region Name", "");
  console.log("original Width" + original_width);
  console.log("original Height" + original_height);
  console.log("New Width" + new_width);
  console.log("New Height" + new_height);
  console.log("Aspect Width" + aspect_width);
  console.log("Aspect Height" + aspect_height);
  if (name == "") {
    name = "";
  }
  if (name == null) {
    //alert("cancelled");
    g.remove();
    poly_points = [];
    polygon_no = polygon_no - 1;
  } else {
    for (i = 0; i < idxs.length; i++) {
      if (idx == idxs[i]) {
        if (i == 1) {
          // console.log("first poly")
          for (j = 0; j <= idx; j++) {
            poly_points.push(str1[j]);
          }
          console.log(poly_points);
        } else {
          // console.log("not first poly");
          //console.log(i,idxs[i-1]+1,idxs[i]);
          for (j = idxs[i - 1] + 1; j <= idxs[i]; j++) {
            poly_points.push(str1[j]);
          }
          console.log(poly_points);
        }
      }
    }
    ///////////////// ROAD NAME DISPLAY //////////////////
    var x = (poly_points[0][0] + poly_points[2][0]) / 2;
    var y = (poly_points[0][1] + poly_points[2][1]) / 2;
    svg
      .append("text")
      .text(name)
      .attr("class", "tooltipText")
      .attr("stroke-width", "0")
      .attr("fill", "#000000")
      .attr("transform", "translate(" + x + "," + y + ")")
      .attr("font-weight", "bold");

    //////////////////////////////////////////////////////

    for (j = 0; j < poly_points.length; j++) {
      console.log(
        "points before scaling " + poly_points[j][0] + " " + poly_points[j][1]
      );
      poly_points[j][0] = poly_points[j][0] * aspect_width;
      poly_points[j][1] = poly_points[j][1] * aspect_height;
      console.log(
        "points after scaling " + poly_points[j][0] + " " + poly_points[j][1]
      );
    }
    RoadDict[name] = JSON.stringify(poly_points);
    drawing = false;
    dragging = true;
    localStorage.setItem("svg_div_var_cc", $("#svg_div").clone().html());
    svg_div_var_cc = $("#svg_div").clone().html();

    //    RoadDict_int_cc

    console.log(RoadDict);

    localStorage.setItem("perimeterBoundaryModify", JSON.stringify(RoadDict));
  }

  videoDict["POINTS"] = JSON.stringify(RoadDict);
  console.log(videoDict);

  for (var i = 0; i < points.length; i++) {
    var circle = g
      .selectAll("circles")
      .data([points[i]])
      .enter()
      .append("circle")
      .attr("cx", points[i][0])
      .attr("cy", points[i][1])
      .attr("r", 4)
      .attr("fill", "#FDBC07")
      .attr("stroke", "#000")
      .attr("is-handle", "true")
      .style({ cursor: "move" })
      .call(dragger);
  }
  points.splice(0);
  drawing = false;
}

function handleDrag() {
  if (drawing) return;
  var dragCircle = d3.select(this),
    newPoints = [],
    circle;
  dragging = true;
  var poly = d3.select(this.parentNode).select("polygon");
  var circles = d3.select(this.parentNode).selectAll("circle");
  dragCircle.attr("cx", d3.event.x).attr("cy", d3.event.y);
  for (var i = 0; i < circles[0].length; i++) {
    circle = d3.select(circles[0][i]);
    newPoints.push([circle.attr("cx"), circle.attr("cy")]);
  }
  poly.attr("points", newPoints);
}

function getRandomColor() {
  var letters = "0123456789ABCDEF".split("");
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

//modify ERL function and open modal box
modifyPerimeter = function () {
  localStorage.removeItem("perimeterBoundaryModify");

  var liveCams = JSON.parse(localStorage.getItem("getcam"));
  for (i = 0; i < liveCams.length; i++) {
    for (j = 0; j < liveCams[i].location.length; j++) {
      for (k = 0; k < liveCams[i].location[j].camera.length; k++) {
        if (
          $("li.active").attr("id") ==
          liveCams[i].location[j].camera[k].cam_name
        ) {
          localStorage.setItem(
            "liveRTMPModify",
            liveCams[i].location[j].camera[k].cam_url
          );
        }
      }
    }
  }

  $("#video_p").attr("src", "");
  $("#imgCanv").attr("style", "");

  var jsonModifyPerimeter = {
    cam_url: localStorage.getItem("liveRTMPModify"),
  };

  var settings = {
    async: true,
    crossDomain: true,
    url:
      "http://" +
      base_domainip +
      "/event-app/capture_frame/saurabh/saurabh",
    method: "POST",
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
    },
    processData: false,
    data: JSON.stringify(jsonModifyPerimeter),
  };
  $.ajax(settings)
    .done(function (response) {
      if (response.status == "success") {
        var PerimiterJSONModify = {
          img: response.breach_image,
          width: response.image_width,
          height: response.image_height,
        };
        localStorage.setItem(
          "breach_image_perimeter_modify",
          JSON.stringify(PerimiterJSONModify)
        );
        console.log("hey");
        int_detect_modify();
      }
    })
    .fail(function (error) {
      $(".modal-backdrop").remove();
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

// show modal and  show svg image to draw perimeter
function int_detect_modify() {
  localStorage.removeItem("perimeterBoundaryModify");

  var perimeterImageDetailsModify = JSON.parse(
    localStorage.getItem("breach_image_perimeter_modify")
  );
  var capture_fram_img_cc_widthModify = perimeterImageDetailsModify.width;
  var capture_fram_img_cc_heightMody = perimeterImageDetailsModify.height;

  var capture_fram_img_cc_width = capture_fram_img_cc_widthModify;
  var capture_fram_img_cc_height = capture_fram_img_cc_heightMody;

  // $('#perimeter_img_reload').show();
  $("#video_p").attr("src", "");
  $("#imgCanv").attr("style", "");
  $("#svg_div").empty();
  // $('#loit_btn_ccr').hide();
  // $('#loit_btn_ccc').hide();
  // $('#res_int_cc').show();
  // $('#conf_int_btn_cc').show();
  RoadDict = {};
  videoDict = {};
  polygon_no = 0;
  console.log("start");
  // e_img_src="http://"+localStorage.getItem("e_ip")+"/nginx/"+capture_fram_img_cc;
  // e_img_src="https://images.unsplash.com/photo-1499084732479-de2c02d45fcc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80";
  e_img_src =
    "http://" +
    base_domainip +
    "/nginx/" +
    perimeterImageDetailsModify.img;
  var image = document.getElementById("video_p");
  console.log(e_img_src);
  console.log(image);
  image.src = e_img_src;

  $("#iVideo").css("display", "none");
  img_width = capture_fram_img_cc_width;
  img_height = capture_fram_img_cc_height;
  myfun1();

  // var localdataPeri=JSON.parse(localStorage.getItem('TempJsonPerimeterOverlay'));
  // $('#svg_div')[0].innerHTML = localdataPeri.polygon_points_html;

  // if(localdataPeri.polygon_points_html == ""){
  //
  //
  // }else {
  //     drawing =false;
  //     dragging =true;
  //     $('#svg_div')[0].innerHTML = localdataPeri.polygon_points_html;
  //
  // }

  $("#int_per_cc").show();
  // $("#instruct_per_cc").hide();
  // $("#intu_perim").show();
  // $("#lit_perim").hide();
  RoadDict = {};
  // $("#int_class").addClass("active");
  // $("#loit_class").removeClass("active");
}

//reload image for modify camera
function int_detect_cc_reload() {
  localStorage.removeItem("perimeterBoundaryModify");
  $(".modifyssl").show();
  $("#transparent-input").val("");
  $("#video_p").attr("src", "");
  $("#imgCanv").attr("style", "");
  $("#svg_div").empty();
  svg_div_var_cc = null;
  RoadDict = {};
  videoDict = {};
  polygon_no = 0;
  console.log("start");

  var liveCams = JSON.parse(localStorage.getItem("getcam"));
  for (i = 0; i < liveCams.length; i++) {
    for (j = 0; j < liveCams[i].location.length; j++) {
      for (k = 0; k < liveCams[i].location[j].camera.length; k++) {
        if (
          localStorage.getItem("camName-DXB") ==
          liveCams[i].location[j].camera[k].cam_name
        ) {
          localStorage.setItem(
            "liveRTMPModify",
            liveCams[i].location[j].camera[k].cam_url
          );
        }
      }
    }
  }

  var jsonModifyPerimeter = {
    cam_url: localStorage.getItem("liveRTMPModify"),
  };

  var settings = {
    async: true,
    crossDomain: true,
    url:
      "http://" +
      base_domainip +
      "/event-app/capture_frame/saurabh/saurabh",
    method: "POST",
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
    },
    processData: false,
    data: JSON.stringify(jsonModifyPerimeter),
  };
  $.ajax(settings)
    .done(function (response) {
      if (response.status == "success") {
        $(".modifyssl").hide();
        var PerimiterJSONModify = {
          img: response.breach_image,
          width: response.image_width,
          height: response.image_height,
        };
        localStorage.setItem(
          "breach_image_perimeter_modify",
          JSON.stringify(PerimiterJSONModify)
        );
        e_img_src_reload = null;
        var perimeterImage = JSON.parse(
          localStorage.getItem("breach_image_perimeter_modify")
        );
        // e_img_src_reload="http://"+localStorage.getItem("e_ip")+"/nginx/"+response.breach_image;
        e_img_src_reload =
          "http://" +
          base_domainip +
          "/nginx/" +
          perimeterImage.img;
        //        e_img_src="http://3.19.62.106/nginx/image.jpg";
        //        console.log(e_img_src);
        var image = document.getElementById("video_p");
        image.src = e_img_src_reload;
        console.log(e_img_src_reload);

        $("#iVideo").css("display", "none");
        //
        img_width = perimeterImage.width;
        img_height = perimeterImage.height;

        drawing = true;
        dragging = false;
        var dataURL;
        var img = new Image();
        img.crossOrigin = "*";
        img.src = e_img_src_reload;
        console.log(e_img_src);
        img.onload = function () {
          var canvas = document.getElementById("output");
          var ctx = canvas.getContext("2d");
          canvas.height = new_height;
          canvas.width = new_width;
          var w = new_width;
          var h = new_height;
          ctx.drawImage(this, 0, 0, w, h);
          dataURL = canvas.toDataURL();
          console.log(dataURL);
          div_canv = document.getElementById("imgCanv");
          div_canv.style.backgroundImage = "url(" + dataURL + ")";
          $("#svg_div").css("display", "inline-block");
          $("#output").hide();
          return dataURL;
        };
        $("#imgCanv").width(new_width).height(new_height);
        myImg = document.getElementById("video_p");
        original_width = img_width;
        original_height = img_height;
        aspect_width = 0;
        aspect_height = 0;
        videoDict = {};
        aspect_width = original_width / new_width;
        aspect_height = original_height / new_height;
        console.log(original_width);
        console.log(original_height);
        console.log(new_width);
        console.log(new_height);
        console.log(aspect_width);
        console.log(aspect_height);
        $("#perimeter_img_reload").hide();
        svg.on("mouseup", function () {
          if (dragging) return;
          drawing = true;
          startPoint = [d3.mouse(this)[0], d3.mouse(this)[1]];
          if (svg.select("g.drawPoly").empty())
            g = svg.append("g").attr("class", "drawPoly");
          if (d3.event.target.hasAttribute("is-handle")) {
            var idx_end = count_click;
            //console.log('idx_end',idx_end);
            idxs.push(idx_end);
            //console.log(idxs);
            closePolygon(idx_end);
            return;
          }
          console.log("mouse this " + d3.mouse(this));
          if (d3.mouse(this)) count_click = count_click + 1;
          console.log("count click", count_click);

          str1.push(d3.mouse(this));
          points.push(d3.mouse(this));
          g.select("polyline").remove();
          var polyline = g
            .append("polyline")
            .attr("points", points)
            .style("fill", "none")
            .attr("stroke", "#000");
          for (var i = 0; i < points.length; i++) {
            g.append("circle")
              .attr("cx", points[i][0])
              .attr("cy", points[i][1])
              .attr("r", 4)
              .attr("fill", "yellow")
              .attr("stroke", "#000")
              .attr("is-handle", "true")
              .style({ cursor: "pointer" });
          }
        });

        svg.on("mousemove", function () {
          if (!drawing) return;
          var g = d3.select("g.drawPoly");
          g.select("line").remove();
          var line = g
            .append("line")
            .attr("x1", startPoint[0])
            .attr("y1", startPoint[1])
            .attr("x2", d3.mouse(this)[0] + 2)
            .attr("y2", d3.mouse(this)[1])
            .attr("stroke", "#53DBF3")
            .attr("stroke-width", 1);
        });
      }
    })
    .fail(function (error) {
      $(".modifyssl").hide();
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

//reset all ERl in modify modal box fot ERL
function resetPerimeterDXB() {
  $("#svg_div").empty();
  (points = []), g;
  str1 = [];
  count_click = -1;
  idxs = [];
  idxs.push(0);
  svg_div_var_cc = null;
  videoDict_cc_p_s["Intrusion Detection"] = [];
  polygon_no = 0;
  RoadDict = {};
  $("#transparent-input").val("");
  drawing = true;
  dragging = false;
  localStorage.removeItem("perimeterBoundaryModify");
}

Object.size = function (obj) {
  var size = 0,
    key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};

closeModal = function () {
  $(".modal-backdrop").remove();
};

//submit new ERL in live camera
submitModifyCoordinates = function () {
  // $('.modal-backdrop').remove();
  // $('body').append('<div class="modal-backdrop fade in" style="opacity: 0.5;"><i style="position: absolute;top: 15%;left: 50%; font-size: 24px;" class="fa fa-circle-o-notch fa-spin"></i></div>');

  if (localStorage.getItem("perimeterBoundaryModify") == null) {
    Messenger().post({
      message: "Please define perimeter",
      type: "error",
      showCloseButton: true,
    });
  } else {
    // var perimetermodify =JSON.parse(localStorage.getItem('breach_image_perimeter_modify'))
    // // var modifyperimerterDXB =  {
    // //     cam_name:localStorage.getItem('camName-DXB'),
    // //     breach_coordinates:localStorage.getItem('perimeterBoundaryModify'),
    // //     breach_image: perimetermodify.img
    // // };

    var getcamli = JSON.parse(localStorage.getItem("getcam"));
    var listModifyServices;
    var perimetermodify = JSON.parse(
      localStorage.getItem("breach_image_perimeter_modify")
    );
    // if(EventsArrayList_DemoLive.length>0){

    // $('.modifyCamLoad').show();
    for (i = 0; i < getcamli.length; i++) {
      for (j = 0; j < getcamli[i].location.length; j++) {
        for (k = 0; k < getcamli[i].location[j].camera.length; k++) {
          if (
            $("li.active").attr("id") ==
            getcamli[i].location[j].camera[k].cam_name
          ) {
            getcamli[i].location[j].camera[k].breach_coordinates =
              localStorage.getItem("perimeterBoundaryModify");
            getcamli[i].location[j].camera[k].breach_image =
              perimetermodify.img;
            listModifyServices = getcamli[i].location[j].camera[k];
          }
        }
      }
    }

    $(".modifyssl").show();

    var settings = {
      async: true,
      crossDomain: true,
      url:
        "http://" +
        base_domainip +
        "/event-app/modify_service/saurabh/saurabh",
      method: "POST",
      headers: {
        "content-type": "application/json",
        "cache-control": "no-cache",
        "postman-token": "6d6bfdc0-1a36-9554-37a7-369524ee2388",
      },
      processData: false,
      data: JSON.stringify(listModifyServices),
    };

    $.ajax(settings)
      .done(function (response) {
        console.log(response);
        if (response.status == "success") {
          $(".modifyssl").hide();

          $("#sslBoundaryDXB").modal("hide");
          $(".modal-backdrop").remove();
          Messenger().post({
            message: "Perimeter modified successfully",
            type: "success",
            showCloseButton: true,
          });

          // FusionCharts("fusionDXB").dispose();
          localStorage.removeItem($("li.active").attr("id"));
          $("#eventsDXB").empty();
          fusioncharts();

          localStorage.removeItem("svg_div_var_cc");
          $("#svg_div").empty();
          svg_div_var_cc = null;
          videoDict_cc_p_s["Intrusion Detection"] = [];
          polygon_no = 0;
          RoadDict = {};
          // $('#transparent-input').val('');
          drawing = true;
          dragging = false;
          localStorage.removeItem("perimeterBoundaryModify");
        } else {
          Messenger().post({
            message: "Some error occurred, Please try later",
            type: "error",
            showCloseButton: true,
          });
        }
      })
      .fail(function (error) {
        $(".modifyssl").hide();
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
