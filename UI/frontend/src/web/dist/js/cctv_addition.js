var defaulEmailAddressdata = []
//verify Stream url is working or not
verifyStreamDXB = function (e) {
  $(e).attr("disabled",true)
  $("#cameraName-field-DXB").val("");
  $("#cameracity-field-SPT").val("");
  $("#camerawarehouse-field-SPT").val("");
  $("#aircraftStand-field-DXB").val("");
  EventsArrayList_Demo = [];
  // document.getElementById("checkboxArson").checked = false;
  // document.getElementById("checkboxExplosion").checked = false;
  // document.getElementById("checkboxFighting").checked = false;
  // document.getElementById("checkboxRoadAccident").checked = false;
  // document.getElementById("checkboxRobbery").checked = false;
  // document.getElementById("checkboxShooting").checked = false;
  // document.getElementById("checkboxVandalism").checked = false;
  // document.getElementById("checkboxFire").checked = false;
  // document.getElementById("checkboxSnatching").checked = false;
  // document.getElementById("checkboxProtest").checked = false;
  // document.getElementById("checkboxRiot").checked = false;
  // document.getElementById("checkboxSelectAll").checked = false;

  if ($("#cameraUrl-field-DXB").val() == "") {
    Messenger().post({
      message: "Please add stream(RTSP/RTMP) camera URL",
      type: "error",
      showCloseButton: true,
    });
  } else {
    $(".verify-url-load").css("display", "block");
    var jsonObjVerify = {
      cam_url: $("#cameraUrl-field-DXB").val(),
    };
    var settings = {
      async: true,
      crossDomain: true,
      url: "/capture_frame",
      method: "POST",
      headers: {
        "content-type": "application/json",
        "cache-control": "no-cache",
      },
      processData: false,
      data: JSON.stringify(jsonObjVerify),
    };
    //
    $.ajax(settings).done(function (response) {
  $(e).removeAttr("disabled")

      
      // if(response.status =="success"){
      //     var PerimiterJSON={
      //         "img":response.breach_image,
      //         "width":response.image_width,
      //         "height":response.image_height,
      //     }

      $(".verify-url-load").hide();
      if (response.Success) {
        Messenger().post({
          message: response.Success,
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

      $("#service_list").empty();
      $("#perimeterList").empty();
      $("#atmID").val("");
      EventsArrayList = [];
      EventsArrayList_Demo = [];
      perimeter_arr = [];
      emaillistDXB = [];
      phonelistDXB = [];
      $("#tags_1").remove();
      $("#tags_2").remove();
      $("#emailDXBre").append(
        '<input id="tags_2" data-role="tagsinput" class="form-control input-transparent" type="text" name="url" placeholder="Email Id (Primary Alerts)">'
      );
      $("#phoneDXBre").append(
        '<input id="tags_1" data-role="tagsinput" class="form-control input-transparent" type="text" name="url" placeholder="Phone Number(Optional)">'
      );
      $("#tags_2_tagsinput").remove();
      $("#tags_1_tagsinput").remove();
      var head = document.getElementsByTagName("head")[0];
      var script = document.createElement("script");
      script.id = "tagsnp";
      script.src = "lib/Tags-Input/jquery.tagsinput.js";
      head.appendChild(script);
      $("#select_pincode_list").empty();

      $("#select_pincode_list").select2({
        
        placeholder: "Location",
        language: {
          noResults: function () {
            return `<button  style="width: 100%" type="button"
            class="btn btn-primary"
            onclick="newaddlocation()">+ Add New Location</button>
            </li>`;
            //     return `
            // <p>Location Not Found, Please Add Location First.</p>`;
          },
        },
        escapeMarkup: function (markup) {
          return markup;
        },
      });

      // $(".select2-drop").append('<div><input type="text" style="width: 86%;padding: 9px;"name="lname"><input class="PrimaryBtn" type="submit" value="Add"></div>');

      $(document).on("keypress", ".select2-search__field", function () {
        // // $('.select2-search__field').attr("placeholder", "Enter pincode to add new region.");
        // $(this).val(
        //   $(this)
        //     .val()
        //     .replace(/[^\d].+/, "")
        // );
        // if (event.which < 48 || event.which > 57) {
        //   event.preventDefault();
        // }
      });

      // $("#tags_1_tagsinput").css({"height": "30px!important;"});

      // var arr_service_non_perimeter_without_time= response.perimeter_without_time;
      // var arr_service_non_perimeter_with_time= response.perimeter_with_time;
      // var  arr_service=response.non_perimeter_without_time;
      // var arr_service_with_time =response.non_perimeter_with_time;

      // for(perimeter_index_with_time=0;perimeter_index_with_time<arr_service_non_perimeter_with_time.length;perimeter_index_with_time++){
      //     var input_id="checkbox"+arr_service_non_perimeter_with_time[perimeter_index_with_time];
      //     var input_id_modify = input_id.replace(/\s+/g, "");
      //     var input_id_perimeter="draw"+arr_service_non_perimeter_with_time[perimeter_index_with_time];
      //     var input_id_perimeter_modify = input_id_perimeter.replace(/\s+/g, "");
      //
      //     var input_id_perimeter_data="display"+arr_service_non_perimeter_with_time[perimeter_index_with_time];
      //     var input_id_perimeter_data_modify = input_id_perimeter_data.replace(/\s+/g, "");
      //     var placeholer_text ="Define "+arr_service_non_perimeter_with_time[perimeter_index_with_time];
      //     console.log(placeholer_text);
      //
      //     // $('#branch_service_list').empty();
      //     // $('#catagory_name_with_service').empty();
      //     // $('#catagory_name_with_service').append(name_main_cat);
      //     // $('#branch_icici').show();
      //     $('#service_list').append(' <div class="checkbox checkbox-primary col-sm-3" style="margin-top: 5px;">\n' +
      //         '                                                     <input  id=\''+input_id_modify+'\' type="checkbox" value=\''+arr_service_non_perimeter_with_time[perimeter_index_with_time]+'\'  onclick="getArrayEventsList(this);" >\n' +
      //         '                                                     <label for=\''+input_id_modify+'\'>\n' +
      //         '                                                         '+arr_service_non_perimeter_with_time[perimeter_index_with_time]+'\n' +
      //         '                                                     </label>\n' +
      //         '                                                 </div>');
      //
      //     // $('#perimeterList').empty();
      //     $('#perimeterList').append('<div class="col-sm-6" style="display:none; " id=\''+input_id_perimeter_data_modify+'\'>\n' +
      //         '                                                    <div class="input-group">\n' +
      //         '                                                        <input  id=\''+input_id_perimeter_modify+'\' readonly class="form-control input-transparent" placeholder=\''+placeholer_text+'\' title=\''+placeholer_text+'\' type="text"/>\n' +
      //         '                                                        <span class="input-group-addon ">\n' +
      //         '                                                            <i style="cursor: pointer"  title="Click me to draw" value=\''+input_id_perimeter_modify+'\'   class="fa fa-camera" time="perimeter_with_time" onclick="say_thanks_overlay_1(this);"></i>\n' +
      //         '                                                        </span>\n' +
      //         '                                                     </div>\n' +
      //         '                                                </div>')
      //
      // }
      // for(perimeter_index=0;perimeter_index<arr_service_non_perimeter_without_time.length;perimeter_index++){
      //     var input_id="checkbox"+arr_service_non_perimeter_without_time[perimeter_index];
      //     var input_id_modify = input_id.replace(/\s+/g, "");
      //     var input_id_perimeter="draw"+arr_service_non_perimeter_without_time[perimeter_index];
      //     var input_id_perimeter_modify = input_id_perimeter.replace(/\s+/g, "");
      //
      //     var input_id_perimeter_data="display"+arr_service_non_perimeter_without_time[perimeter_index];
      //     var input_id_perimeter_data_modify = input_id_perimeter_data.replace(/\s+/g, "");
      //     var placeholer_text ="Define "+arr_service_non_perimeter_without_time[perimeter_index];
      //     console.log(placeholer_text);
      //
      //
      //     // $('#catagory_name_with_service').empty();
      //     // $('#catagory_name_with_service').append(name_main_cat);
      //     // $('#branch_icici').show();
      //     $('#service_list').append(' <div class="checkbox checkbox-primary col-sm-3" style="margin-top: 5px;">\n' +
      //         '                                                     <input  id=\''+input_id_modify+'\' type="checkbox" value=\''+arr_service_non_perimeter_without_time[perimeter_index]+'\'  onclick="getArrayEventsList(this);" >\n' +
      //         '                                                     <label for=\''+input_id_modify+'\'>\n' +
      //         '                                                         '+arr_service_non_perimeter_without_time[perimeter_index]+'\n' +
      //         '                                                     </label>\n' +
      //         '                                                 </div>');
      //
      //     // $('#perimeterList').empty();
      //
      //
      //     $('#perimeterList').append('<div class="col-sm-6" style="display:none; " id=\''+input_id_perimeter_data_modify+'\'>\n' +
      //         '                                                    <div class="input-group">\n' +
      //         '                                                        <input  id=\''+input_id_perimeter_modify+'\' readonly class="form-control input-transparent" placeholder=\''+placeholer_text+'\' title=\''+placeholer_text+'\' type="text"/>\n' +
      //         '                                                        <span class="input-group-addon ">\n' +
      //         '                                                            <i style="cursor: pointer"  title="Click me to draw" value=\''+input_id_perimeter_modify+'\'   class="fa fa-camera" time="perimeter_without_time" onclick="say_thanks_overlay_1(this);"></i>\n' +
      //         '                                                        </span>\n' +
      //         '                                                     </div>\n' +
      //         '                                                </div>')
      //
      // }
      // for(service_index=0;service_index<arr_service.length;service_index++){
      //
      //
      //         var input_id="checkbox"+arr_service[service_index];
      //         var input_id_modify = input_id.replace(/\s+/g, "");
      //         var input_id_perimeter="draw_"+arr_service[service_index];
      //         var input_id_perimeter_modify = input_id_perimeter.replace(/\s+/g, "");
      //
      //         console.log(input_id);
      //
      //
      //
      //
      //
      //         $('#service_list').append(' <div class="checkbox checkbox-primary col-sm-3" style="margin-top: 5px;">\n' +
      //             '                                                     <input id='+input_id_modify+' type="checkbox" value=\''+arr_service[service_index]+'\' onclick="getArrayEventsList(this);" >\n' +
      //             '                                                     <label for='+input_id_modify+'>\n' +
      //             '                                                         '+arr_service[service_index]+'\n' +
      //             '                                                     </label>\n' +
      //             '                                                 </div>');
      //
      //
      //
      //     }
      // for(list_val_with_time=0;list_val_with_time< arr_service_with_time.length;list_val_with_time++ ){
      //
      //     var input_id = "checkbox" +arr_service_with_time[list_val_with_time];
      //     var input_id_modify = input_id.replace(/\s+/g, "");
      //     var input_id_perimeter = "draw" + arr_service_with_time[list_val_with_time];
      //     var input_id_perimeter_modify = input_id_perimeter.replace(/\s+/g, "");
      //
      //
      //
      //     // $('#catagory_name_with_service').empty();
      //     // $('#catagory_name_with_service').append(name_main_cat);
      //     // $('#branch_icici').show();
      //     $('#service_list').append(' <div class="checkbox checkbox-primary col-sm-3" style="margin-top: 5px;">\n' +
      //         '                                                     <input id=' + input_id_modify + ' type="checkbox" value=\'' + arr_service_with_time[list_val_with_time] + '\' time="non_perimeter_with_time" onclick="getArrayEventsList(this);" >\n' +
      //         '                                                     <label for=' + input_id_modify + '>\n' +
      //         '                                                         ' + arr_service_with_time[list_val_with_time] + '\n' +
      //         '                                                     </label>\n' +
      //         '                                                 </div>');
      //
      // }

      $("#select_pincode_list").prepend('<option value="">Select</option>');

      for (
        pincode = 0;
        pincode < response.data.pincode_details.length;
        pincode++
      ) {
        var pincode_det = response.data.pincode_details[pincode].location;
        var location_name = response.data.pincode_details[pincode].location;
        var pincode_num = response.data.pincode_details[pincode].pincode;
        var pincode_city = response.data.pincode_details[pincode].city;
        var pincode_state = response.data.pincode_details[pincode].state;

        var isSelected = pincode == 0  ? "selected" : ""

        if(isSelected){
          defaulEmailAddressdata = response.data.pincode_details[pincode].email_ids
        }

        $("#select_pincode_list").append(
          `<option ${isSelected} loc_name="${location_name}" city_name="${response.data.pincode_details[pincode].city}" state_name="${response.data.pincode_details[pincode].state}" value="${pincode_num}" data='${JSON.stringify(response.data.pincode_details[pincode])}'>${pincode_det}</option>`
        );
      }

      $("#select_pincode_list").on("change",function(e){
        $("#tags_1").remove();
      $("#tags_2").remove();
      $("#emailDXBre").append(
        '<input id="tags_2" data-role="tagsinput" class="form-control input-transparent" type="text" name="url" placeholder="Email Id (Primary Alerts)">'
      );
      $("#phoneDXBre").append(
        '<input id="tags_1" data-role="tagsinput" class="form-control input-transparent" type="text" name="url" placeholder="Phone Number(Optional)">'
      );
      $("#tags_2_tagsinput").remove();
      $("#tags_1_tagsinput").remove();
      var head = document.getElementsByTagName("head")[0];
      var script = document.createElement("script");
      script.id = "tagsnp";
      script.src = "lib/Tags-Input/jquery.tagsinput.js";
      head.appendChild(script);

        defaulEmailAddressdata = JSON.parse($("#select_pincode_list option:selected").attr("data")).email_ids
        defaultEmailIds(defaulEmailAddressdata)
      })

      // $('#select_pincode_list').append('<option value="addArea"><button  style="width: 100% text-align: left; padding: 5px 7px;" type="button" class="btn btn-primary" onclick="openNav(this);"> Add New Area</button></option>')

      $("#select2-select_pincode_list-container").click(function (e) {
        $(".select2-search__field").attr("placeholder", "Enter Location");
        // $('.select2-results__option select2-results__option--highlighted').addcss({'margin':'4px','border-radius'})
        // margin: 4px;
        // border-radius: 3px;
      });

      // $("#select_pincode_list").select2({
      //     searchInputPlaceholder: 'Search state...'
      // });

      // localStorage.setItem('breach_image_perimeter',JSON.stringify(PerimiterJSON));
      $(".verify-url-load").css("display", "none");
      $(".streamTest").css("display", "block");
      $(".verify-url").removeClass("verify-url");
      $(".verify-url-headline").css("display", "none");
      $(".verify-url-btn").css("display", "none");
      document.getElementById("cameraUrl-field-DXB").readOnly = true;

      $("#verifyURLText").hide();
      $("#fillVerify").show();
      $("#fillformcam").show();
      $("#camUrlDXBHS").show();
      $("#camUrlbtnDXB").hide();
      // }else {
      //     $('.verify-url-load').css('display','none');
      //     Messenger().post({
      //         message: "Please Try again We can't validate this stream",
      //         type: 'error',
      //         showCloseButton: true
      //     });
      // }
      
    });
  }
};

// function getPincode(val){
//     console.log(val)
//     if(val == 'addArea'){
//         openNav(val)
//
//     }else{
//         console.log('its Okey')
//     }
//
// }

//verify all cam field is it correct or not and camera add
var emaillistDXB = [];
var phonelistDXB = [];
verifyAddDetails = function (e) {
  var events_val;
  var peri_val;
  var breach_cord;
  var mot_val;
  emaillistDXB = [];
  phonelistDXB = [];

  var outputemails = $(".emaillist")
    .toArray()
    .map(function (e) {
      emaillistDXB.push($(e).text().replace(/\s/g, ""));
      return $(e).text();
    })
    .filter(Boolean)
    .join(",");
  var outputphone = $(".phonelist")
    .toArray()
    .map(function (e) {
      phonelistDXB.push($(e).text().replace(/\s/g, ""));
      return $(e).text();
    })
    .filter(Boolean)
    .join(",");

  // if($('#camerastate-field-SPT').val()== ''){
  //     Messenger().post({
  //         message: 'Please type State name',
  //         type: 'error',
  //         showCloseButton: true
  //     });
  //
  // }
  // else if($('#cameracity-field-SPT').val()== ''){
  //     Messenger().post({
  //         message: 'Please type city name',
  //         type: 'error',
  //         showCloseButton: true
  //     });
  //
  // }
  // else
  if ($("#cameraName-field-DXB").val() == "") {
    Messenger().post({
      message: "Please add camera name",
      type: "error",
      showCloseButton: true,
    });
  }else if($("#cameraName-field-DXB").val().includes(".")){
    Messenger().post({
      message: 'Please remove "." from camera name',
      type: "error",
      showCloseButton: true,
    });
  } else if ($("#atmID").val() == "") {
    Messenger().post({
      message: "Please enter ATM ID",
      type: "error",
      showCloseButton: true,
    });
  } else if ($("#select_pincode_list").val() == "") {
    Messenger().post({
      message: "Please select Area name or type pincode to add area",
      type: "error",
      showCloseButton: true,
    });
  }
  // else if($('#aircraftStand-field-DXB').val() ==''){
  //     Messenger().post({
  //         message: 'Please add area name',
  //         type: 'error',
  //         showCloseButton: true
  //     });
  //
  // }
  // else if (emaillistDXB.length == 0) {
  //   Messenger().post({
  //     message: "Please add emails to get alerts",
  //     type: "error",
  //     showCloseButton: true,
  //   });
  // }
  // else if(EventsArrayList_Demo.length == 0){
  //     Messenger().post({
  //         message: 'Please select minimum one service to continue',
  //         type: 'error',
  //         showCloseButton: true
  //     });
  // }
  else if ($("#transparent-input").val() == "") {
    Messenger().post({
      message: "Please define boundary ",
      type: "error",
      showCloseButton: true,
    });
  }else if($("#cameraName-field-DXB").val().includes(".")){
    Messenger().post({
      message: 'Please remove "." from camera name',
      type: "error",
      showCloseButton: true,
    });
  }else if($("#cameraName-field-DXB").val().includes("#")){
    Messenger().post({
      message: 'Please remove "#" from camera name',
      type: "error",
      showCloseButton: true,
    });
  }else if($("#cameraName-field-DXB").val().includes("!")){
    Messenger().post({
      message: 'Please remove "!" from camera name',
      type: "error",
      showCloseButton: true,
    });
  } else {
    $(".verify-url-load-save").css("display", "block");
    $(".addCamBtnDxb").prop("disabled", true);
    // if(localStorage.getItem('perimeterBoundary') == null){
    // }else{
    //     var jsonDataDXB={
    //         "city_name": $('#cameracity-field-SPT').val(),
    //         "area": $('#camerawarehouse-field-SPT').val(),
    //         "street": $('#aircraftStand-field-DXB').val() ,
    //         "cam_name":$('#cameraName-field-DXB').val(),
    //         "cam_url": $('#cameraUrl-field-DXB').val(),
    //         "user_email": tagslist,
    //         'vandalism_flag' : 1,
    //         'arson_flag' : 1,
    //         'fighting_flag' : 1,
    //         'road_accident_flag' : 1,
    //         'explosion_flag' : 1,
    //         'robbery_flag' : 1,
    //         'shooting_flag' : 1,
    //         'riot_flag' : 1,
    //         'sterile_zone_detection_flag' : 0,
    //         'intrusion_detection_flag' : 0,
    //         'unattended_flag' : 0,
    //         'event_detection_services': 0,
    //         'breach_detection_services':0
    //         // "breach_coordinates":JSON.parse(localStorage.getItem('perimeterBoundary'))
    //     };

    //     if(EventsArrayList_Demo.length == 0){
    //         events_val =0;
    //     }else{
    //         events_val=1;
    //
    //     }
    //
    //
    //     if(JSON.parse(localStorage.getItem('perimeterBoundary'))== null){
    //         breach_cord = "";
    //     }else{
    //         breach_cord = JSON.parse(localStorage.getItem('perimeterBoundary'));
    //     }
    //
    //
    //     if(typeof(perimeter_Val) == "undefined"){
    //         peri_val=0;
    //     }else{
    //         peri_val=perimeter_Val
    //     }
    //
    //     if(typeof(motion_Val) == "undefined"){
    //         mot_val=0;
    //     }else{
    //         mot_val=motion_Val;
    //     }
    //
    // var imagePath =JSON.parse(localStorage.getItem('breach_image_perimeter'));
    // // var jsonDataDXB ={  "account_id": "saurabh",
    // //     "user_name": "saurabh",
    // //     "cam_name": $('#cameraName-field-DXB').val(),
    // //     "user_email": emaillistDXB,
    // //     "to_phone_number":phonelistDXB,
    // //     "cam_url": $('#cameraUrl-field-DXB').val(),
    // //     "state":$('#camerastate-field-SPT').val(),
    // //     "city": $('#cameracity-field-SPT').val(),
    // //     "plant": $('#camerawarehouse-field-SPT').val(),
    // //     "area": $('#aircraftStand-field-DXB').val(),
    // //     "alert_detection_arr":EventsArrayList_Demo,
    // //     "alert_detection_flag":events_val,
    // //     "motion_detection_flag":mot_val,
    // //     "intrusion_detection_flag":peri_val,
    // //     "breach_coordinates":breach_cord,
    // //     "breach_image":imagePath.img,}
    //

    var imagePath = JSON.parse(localStorage.getItem("breach_image_perimeter"));
    var jsonDataDXB = {
      // account_id: "saurabh",
      // user_name: "saurabh",
      cam_name: $("#cameraName-field-DXB").val(),
      area: $("#areaname").val(),
      user_email: emaillistDXB,
      to_phone_number: phonelistDXB,
      type: $("#select_camera_type").val(),
      cam_url: $("#cameraUrl-field-DXB").val(),
      state: $("#select_pincode_list option:selected").attr("state_name"),
      city: $("#select_pincode_list option:selected").attr("city_name"),
      location: $("#select_pincode_list option:selected").attr("loc_name"),
      pincode: $("#select_pincode_list option:selected").attr("value"),
      // "area": $('#aircraftStand-field-DXB').val(),
      alert_array: EventsArrayList_Demo,
      // "alert_detection_flag":events_val,
      // "motion_detection_flag":mot_val,
      // "intrusion_detection_flag":peri_val,
    };

    if (EventsArrayList_Demo.length == 0) {
      events_val = 0;
    } else {
      events_val = 1;
    }

    if (JSON.parse(localStorage.getItem("perimeterBoundary")) == null) {
      breach_cord = "";
    } else {
      breach_cord = JSON.parse(localStorage.getItem("perimeterBoundary"));
    }

    if (typeof perimeter_Val == "undefined") {
      peri_val = 0;
    } else {
      peri_val = perimeter_Val;
    }

    if (typeof motion_Val == "undefined") {
      mot_val = 0;
    } else {
      mot_val = motion_Val;
    }

    var imagePath = JSON.parse(localStorage.getItem("breach_image_perimeter"));
    // var jsonDataDXB ={  "account_id": "saurabh",
    //     "user_name": "saurabh",
    //     "cam_name": $('#cameraName-field-DXB').val(),
    //     "user_email": emaillistDXB,
    //     "to_phone_number":phonelistDXB,
    //     "cam_url": $('#cameraUrl-field-DXB').val(),
    //     "state":$('#camerastate-field-SPT').val(),
    //     "city": $('#cameracity-field-SPT').val(),
    //     "plant": $('#camerawarehouse-field-SPT').val(),
    //     "area": $('#aircraftStand-field-DXB').val(),
    //     "alert_detection_arr":EventsArrayList_Demo,
    //     "alert_detection_flag":events_val,
    //     "motion_detection_flag":mot_val,
    //     "intrusion_detection_flag":peri_val,
    //     "breach_coordinates":breach_cord,
    //     "breach_image":imagePath.img,}

    // var cat_d=$('#service_category').val().toLowerCase();
    // var cat_string =cat_d+"IDselect"

    // var jsonDataDXB ={  "account_id": "saurabh",
    //     "user_name": "saurabh",
    //     "cam_name": $('#cameraName-field-DXB').val(),
    //     "user_email": emaillistDXB,
    //     "to_phone_number":phonelistDXB,
    //     "cam_url": $('#cameraUrl-field-DXB').val(),
    //     "state":$('#camerastate-field-SPT').val(),
    //     "city": $('#cameracity-field-SPT').val(),
    //     "location": ('#select_pincode_list option:selected').attr('loc_name');
    //     // "area": $('#aircraftStand-field-DXB').val(),
    //     "alert_array":EventsArrayList_Demo,
    //     "pincode":('#select_pincode_list option:selected').attr('value');
    //     "location"
    //     // "b_type":$('#service_category').val(),
    //     // "alert_detection_flag":events_val,
    //     // "motion_detection_flag":mot_val,
    //     // "intrusion_detection_flag":peri_val,
    //
    //     "breach_image":imagePath.img,}

    console.log(jsonDataDXB);
    var settings = {
      async: true,
      crossDomain: true,
      url: "/start_service",
      method: "POST",
      headers: {
        "content-type": "application/json",
        "cache-control": "no-cache",
      },
      processData: false,
      data: JSON.stringify(jsonDataDXB),
    };
  $(e).attr("disabled",true)

    $.ajax(settings).done(function (response) {
  $(e).removeAttr("disabled")

      $(".verify-url-load-save").hide();
      $(".addCamBtnDxb").removeAttr("disabled");
      if (response.Failure) {
        Messenger().post({
          message: response.Failure,
          type: "error",
          showCloseButton: true,
        });
      } else {
        if (response.data.status == "success") {
          successFillDetails();
        } else {
          Messenger().post({
            message: response.data.error,
            type: "error",
            showCloseButton: true,
          });
        }
      }
    });
    // }
  }
};

//after adding camera get all live cameras in left side bar
successFillDetails = function () {
  

          emaillistDXB = [];
          phonelistDXB = [];
          $("#tags_1").remove();
          $("#tags_2").remove();
          $("#emailDXBre").append(
            '<input id="tags_2" data-role="tagsinput" class="form-control input-transparent" type="text" name="url">'
          );
          $("#phoneDXBre").append(
            '<input id="tags_1" data-role="tagsinput" class="form-control input-transparent" type="text" name="url">'
          );
          $("#tags_2_tagsinput").remove();
          $("#tags_1_tagsinput").remove();
          var head = document.getElementsByTagName("head")[0];
          var script = document.createElement("script");
          script.id = "tagsnp";
          script.src = "lib/Tags-Input/jquery.tagsinput.js";
          head.appendChild(script);

          $("#select-Terminal-DXB").val("none");
          $("#select-stand-type-DXB").val("none");
          $("#select-airport-DXB").val("none");
          $("#camerastate-field-SPT").val("none");
          $("#atmID").val("");
          // $(']').val(1);
          $(".selectpicker").selectpicker("refresh");
          $("#cameraName-field-DXB").val("");
          $("#aircraftStand-field-DXB").val("");
          $("#transparent-input").val("");
          $("#cameraUrl-field-DXB").val("");

          localStorage.removeItem("perimeterBoundary");
          $(".tag").remove();
          window.tagslist = [];
          $("#svg_div").empty();
          svg_div_var_cc = null;
          videoDict_cc_p_s["Intrusion Detection"] = [];
          polygon_no = 0;
          RoadDict = {};
          drawing = true;
          dragging = false;
          $("#verifyURLText").show();
          $("#fillVerify").hide();
          $("#fillformcam").hide();
          $("#camUrlDXBHS").show();
          $("#camUrlbtnDXB").show();
          document.getElementById("cameraUrl-field-DXB").readOnly = false;
          $(".addCamBtnDxb").prop("disabled", false);
          Messenger().post({
            message: "Camera added successfully",
            type: "success",
            showCloseButton: true,
          });

          $("#collapesairport").removeClass("collapsed");
          $("#menu-levels-collapse").addClass("in");
        
    

  localStorage.setItem(
    "aircraftStandName",
    $("#aircraftStand-field-DXB").val()
  );
};

//
function selectFromDropdown(selector, text) {
  $(selector)
    .find("option")
    .each(function () {
      if ($(this).text() == text) {
        $(selector).val($(this).val());
        return false;
      }
    });
}

//when you click airport in left side bar its collapes but if no camera added at that time its show error message
camExist = function () {
  if (JSON.parse(localStorage.getItem("getcam")) == null) {
    Messenger().post({
      message: "Please add camera first",
      type: "error",
      showCloseButton: true,
    });
  } else {
  }
};

//reset form fields
resetFormAddCam = function () {
  tagslist = [];
  emaillistDXB = [];
  phonelistDXB = [];
  $("#tagsnp").remove();

  $("#tags_1").remove();
  $("#tags_2").remove();
  $("#emailDXBre").append(
    '<input id="tags_2" data-role="tagsinput" class="form-control input-transparent" type="text" name="url">'
  );
  $("#phoneDXBre").append(
    '<input id="tags_1" data-role="tagsinput" class="form-control input-transparent" type="text" name="url">'
  );
  $("#tags_2_tagsinput").remove();
  $("#tags_1_tagsinput").remove();
  var head = document.getElementsByTagName("head")[0];
  var script = document.createElement("script");
  script.id = "tagsnp";
  script.src = "lib/Tags-Input/jquery.tagsinput.js";
  head.appendChild(script);
  $(".verify-url-load").hide();

  // $('#select-Terminal-DXB').val('none')
  // $('#select-stand-type-DXB').val('none')
  $("#select-stand-type-SPT").val("none");
  // $(']').val(1);
  $(".selectpicker").selectpicker("refresh");
  $("#cameraName-field-DXB").val("");
  $("#cameracity-field-SPT").val("");
  $("#camerawarehouse-field-SPT").val("");
  // $('#transparent-input').val('')
  $("#aircraftStand-field-DXB").val("");
  $("#camerastate-field-SPT").val("");

  $("#cameraUrl-field-DXB").val("");
  localStorage.removeItem("perimeterBoundary");
  $(".tag").remove();
  window.tagslist = [];
  $("#svg_div").empty();
  svg_div_var_cc = null;
  videoDict_cc_p_s["Intrusion Detection"] = [];
  polygon_no = 0;
  RoadDict = {};
  drawing = true;
  dragging = false;
  $(".addCamBtnDxb").prop("disabled", false);

  $("#verifyURLText").show();
  $("#fillVerify").hide();
  $("#fillformcam").hide();
  $("#camUrlDXBHS").show();
  $("#camUrlbtnDXB").show();
  document.getElementById("cameraUrl-field-DXB").readOnly = false;
};

var EventsArrayList = [];
var EventsArrayList_Demo = [];
var perimeter_arr = [];
var non_perimeter_with_time_arr = [];

var perimeter_Val;
var motion_Val;

var getArrayEventsList = function (eventName) {
  var EventName = $(eventName).attr("value");

  var idx = $.inArray(EventName, EventsArrayList);

  if (EventName == "Perimeter Breach") {
    if (idx == -1) {
      $("#ERLDraw").show();
      perimeter_Val = 1;
      EventsArrayList_Demo.push(EventName);
    } else {
      perimeter_Val = 0;
      $("#ERLDraw").hide();
      EventsArrayList_Demo.splice(idx, 1);
    }
  }
  // else if(EventName == "Motion Detection"){
  //     if (idx == -1) {
  //         motion_Val=1;
  //         // EventsArrayList.push(EventName);
  //         EventsArrayList_Demo.push(EventName);
  //     } else {
  //         motion_Val=0;
  //         // EventsArrayList.splice(idx, 1);
  //         EventsArrayList_Demo.splice(idx, 1);
  //     }
  //
  // }
  else if (EventName == "Select All") {
    // if (idx == -1) {
    //     motion_Val=1;
    //     // EventsArrayList.push(EventName);
    //     EventsArrayList_Demo.push(EventName);
    // } else {
    //     motion_Val=0;
    //     // EventsArrayList.splice(idx, 1);
    //     EventsArrayList_Demo.splice(idx, 1);
    // EventsArrayList_Demo.push("Robbery");
    // }

    if (document.getElementById("checkboxSelectAll").checked) {
      EventsArrayList_Demo = [];

      document.getElementById("checkboxArson").checked = true;
      EventsArrayList_Demo.push(document.getElementById("checkboxArson").value);
      document.getElementById("checkboxExplosion").checked = true;
      EventsArrayList_Demo.push(
        document.getElementById("checkboxExplosion").value
      );
      document.getElementById("checkboxFighting").checked = true;
      EventsArrayList_Demo.push(
        document.getElementById("checkboxFighting").value
      );
      document.getElementById("checkboxRoadAccident").checked = true;
      EventsArrayList_Demo.push(
        document.getElementById("checkboxRoadAccident").value
      );
      document.getElementById("checkboxRobbery").checked = true;
      EventsArrayList_Demo.push(
        document.getElementById("checkboxRobbery").value
      );
      document.getElementById("checkboxShooting").checked = true;
      EventsArrayList_Demo.push(
        document.getElementById("checkboxShooting").value
      );
      document.getElementById("checkboxVandalism").checked = true;
      EventsArrayList_Demo.push(
        document.getElementById("checkboxVandalism").value
      );
      // document.getElementById("checkboxFire").checked = true;
      // EventsArrayList_Demo.push(document.getElementById("checkboxFire").value);
      document.getElementById("checkboxSnatching").checked = true;
      EventsArrayList_Demo.push(
        document.getElementById("checkboxSnatching").value
      );
      document.getElementById("checkboxProtest").checked = true;
      EventsArrayList_Demo.push(
        document.getElementById("checkboxProtest").value
      );
      document.getElementById("checkboxRiot").checked = true;
      EventsArrayList_Demo.push(document.getElementById("checkboxRiot").value);
    } else {
      document.getElementById("checkboxArson").checked = false;
      document.getElementById("checkboxExplosion").checked = false;
      document.getElementById("checkboxFighting").checked = false;
      document.getElementById("checkboxRoadAccident").checked = false;
      document.getElementById("checkboxRobbery").checked = false;
      document.getElementById("checkboxShooting").checked = false;
      document.getElementById("checkboxVandalism").checked = false;
      // document.getElementById("checkboxFire").checked = false;
      document.getElementById("checkboxSnatching").checked = false;
      document.getElementById("checkboxProtest").checked = false;
      document.getElementById("checkboxRiot").checked = false;
      EventsArrayList_Demo = [];
    }
  }
  // else if(){
  //
  //
  // }
  else {
    console.log(EventName);

    var id_perimeter_name = "display" + EventName.replace(/\s+/g, "");
    if (idx == -1) {
      var myEle = document.getElementById(id_perimeter_name);
      if (myEle != null) {
        $("[id=" + id_perimeter_name + "]").show();
        perimeter_arr.push(EventName);
        EventsArrayList.push(EventName);
        EventsArrayList_Demo.push(EventName);
      } else if (eventName.getAttribute("time") == "non_perimeter_with_time") {
        // $('#selectTime').modal('show');

        $("#checkbox" + EventName).on("change", function () {
          if ($(this).is(":checked")) {
            $(this).attr("value", "true");

            localStorage.setItem("event_name_service", EventName);

            $("#selectTime").modal({
              backdrop: "static",
              keyboard: false,
            });
            $(".from_time_service").val("00:00");
            $(".to_time_service").val("00:00");

            // console.log(id_perimeter_name)
            EventsArrayList.push(EventName);
            EventsArrayList_Demo.push(EventName);
            non_perimeter_with_time_arr.push(EventName);
          } else {
            $(this).attr("value", "false");
            EventsArrayList.splice(idx, 1);
            EventsArrayList_Demo.splice(idx, 1);
            non_perimeter_with_time_arr.splice(idx, 1);
          }
        });
      } else {
        console.log(id_perimeter_name);
        EventsArrayList.push(EventName);
        EventsArrayList_Demo.push(EventName);
      }
      // $('#'+id_perimeter_name).show();
    } else {
      // $('#'+id_perimeter_name).hide();
      $("[id=" + id_perimeter_name + "]").hide();
      console.log(id_perimeter_name);
      perimeter_arr.splice(idx, 1);
      EventsArrayList.splice(idx, 1);
      EventsArrayList_Demo.splice(idx, 1);
      non_perimeter_with_time_arr.splice(idx, 1);
    }
  }
};

var saveserviceTime = function () {
  if (
    $(".from_time_service").val() !== "00:00" &&
    $(".to_time_service").val() !== "00:00"
  ) {
    var selected_service_name = localStorage.getItem("event_name_service");
    var time_dict_service = {
      from_time: $(".from_time_service").val(),
      to_time: $(".to_time_service").val(),
    };

    var element_perimeter_name = localStorage.getItem("event_name_service");

    var new_str = element_perimeter_name.split(/(?=[A-Z])/).join("_");
    var new_str_m = new_str + "service";
    localStorage.setItem(
      new_str_m.toLowerCase(),
      JSON.stringify(time_dict_service)
    );

    $("#selectTime").modal("hide");
  } else {
    Messenger().post({
      message: "Please add start time and end time",
      type: "error",
      showCloseButton: true,
    });
  }
};

var load_page = function () {
  $("#emailDXBre").focusin(function () {
    $("#tags_2_tagsinput").css("background-color", "rgb(40 49 61);");
    $("#tags_2_tagsinput").css("border", "1px solid  rgb(45 86 165)");
  });
  $("#phoneDXBre").focusin(function () {
    $("#tags_1_tagsinput").css("background-color", "rgb(40 49 61);");
    $("#tags_1_tagsinput").css("border", "1px solid  rgb(45 86 165)");
  });
  $("#emailDXBre").focusout(function () {
    $("#tags_2_tagsinput").css("background-color", "rgb(40 49 61);");
    $("#tags_2_tagsinput").css("border", "1px solid transparent");
  });
  $("#phoneDXBre").focusout(function () {
    $("#tags_1_tagsinput").css("background-color", "rgb(40 49 61);");
    $("#tags_1_tagsinput").css("border", "1px solid transparent");
  });

  $("#tags_2_tag").css("width", "auto");
};

// $('#firstadd li').on( "click", function() {
//
//
// });

var fill_postcode = function (pincode_data) {
  var pincode_attr = $(pincode_data).attr("pincode");
  var latitude_attr = $(pincode_data).attr("latitude");
  var longitude_attr = $(pincode_data).attr("longitude");
  var display_name_attr = $(pincode_data).attr("display_name");
  var city_attr = $(pincode_data).attr("city");
  var state_attr = $(pincode_data).attr("state");
  var country_attr = $(pincode_data).attr("country");
  $("#pincode_area").val("");
  $("#pincode_number").val("");
  $("#pincode_lat").val("");
  $("#pincode_long").val("");
  $("#pincode_city").val("");
  $("#pincode_state").val("");
  $("#pincode_country").val("");
  $("#pincode_number").val(pincode_attr);
  // $('#pincode_area').val(latitude_attr)
  $("#pincode_lat").val(latitude_attr);
  $("#pincode_long").val(longitude_attr);
  $("#pincode_city").val(city_attr);
  $("#pincode_state").val(state_attr);
  $("#pincode_country").val(country_attr);

  // console.log(pincode_attr + " "+ latitude_attr + " "+ longitude_attr+" "+display_name_attr)

  $("#firstadd").css({
    transform: "translate(-498px, 10px)",
    transition: "all 0.5s ease-in-out 0s",
  });
  // $('#firstadd').hide();
  $("#secondadd").css({
    transform: "translate(0px, 10px)",
    transition: "all 1.0s ease-in-out 0s",
  });
};

function openNav(e) {
  var zipcode = $(".select2-search__field").val();
  $("#pincode_id").empty();
  $("#pincode_id").append(zipcode);
  document.getElementById("mySidepanel").style.width = "376px";
  $(".li_pincode").remove();
  $("#loader_spin").show();
  var settings = {
    async: true,
    crossDomain: true,
    url:
      "https://nominatim.openstreetmap.org/search.php?q=" +
      zipcode +
      "&polygon_geojson=1&format=jsonv2",
    method: "GET",
    headers: {
      "cache-control": "no-cache",
      "postman-token": "05831469-aa0b-98c3-5f15-5ec25dabefa0",
    },
  };
  $.ajax(settings).done(function (response) {
    $("#loader_spin").hide();
    if (response.Failure) {
      Messenger().post({
        message: response.Failure,
        type: "error",
        showCloseButton: true,
      });
    } else {
      if (response.length > 0) {
        for (pincode_list = 0; pincode_list < response.length; pincode_list++) {
          var location_det_pincode = response[pincode_list].display_name;

          var location_det_pincode_split = location_det_pincode.split(", ");

          var array_pincode_det = location_det_pincode_split.reverse();

          $("#firstadd").append(
            '<li class="li_pincode" pincode="' +
              zipcode +
              '" latitude="' +
              response[pincode_list].lat +
              '" longitude="' +
              response[pincode_list].lon +
              '" display_name="' +
              response[pincode_list].display_name +
              '"  city="' +
              array_pincode_det[3] +
              '"  state="' +
              array_pincode_det[2] +
              '"  country="' +
              array_pincode_det[0] +
              '" onclick="fill_postcode(this);"><p class="add-more">' +
              response[pincode_list].display_name +
              "</p></li>"
          );
        }

        $("#secondadd").show();
      } else {
        $("#firstadd").append(
          '<li class="li_pincode" style="border: 1px solid transparent;margin-bottom: 0px;padding: 0px;background-color: transparent;cursor: pointer;margin: 10px 10px;text-align: center;"><p class="add-more">No Results Found.</p></li>'
        );
      }
    }

    $("#firstadd").css("transform", "translate(0px, 10px)");
    $("#secondadd").css("transform", "translate(460px, 10px)");
  });

  //
}
//
//

function back_to_list() {
  $("#secondadd").css("transform", "translate(460px, 10px)");
  $("#firstadd").css("transform", "translate(0px, 10px)");
}
function closeNav() {
  document.getElementById("mySidepanel").style.width = "0";
  $("#firstadd").css("transform", "translate(0px, 10px)");
  $("#secondadd").css("transform", "translate(460px, 10px)");
}
function back_to_list() {
  $("#firstadd").css("transform", "translate(0px, 10px)");
  $("#secondadd").css("transform", "translate(460px, 10px)");
}
// setTimeout( function(){
//     document.getElementById("mySidepanel").style.width = "0";
//     $("#firstadd").css("transform", "translate(0px, 10px)");
//     $("#secondadd").css("transform", "translate(460px, 10px)");
// }  , 3000 );
//
//

var save_pincodeDetails = function () {
  var pincode_details = {
    pincode: $("#pincode_number").val(),
    location: $("#pincode_area").val(),
    latitude: $("#pincode_lat").val(),
    longitude: $("#pincode_long").val(),
    city: $("#pincode_city").val(),
    state: $("#pincode_state").val(),
    country: $("#pincode_country").val(),
    send_notif_flag: "Y",
  };
  var settings = {
    async: true,
    crossDomain: true,
    url: "/save_pincode_details",
    method: "POST",
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
      "postman-token": "7bbc62fa-4d44-2ecf-df05-4dd1d0d54603",
    },
    processData: false,
    data: JSON.stringify(pincode_details),
  };
  $.ajax(settings).done(function (response) {
    if (response.Failure) {
      Messenger().post({
        message: response.Failure,
        type: "error",
        showCloseButton: true,
      });
    } else {
      if (response.data.status == "success") {
        Messenger().post({
          message: "Pincode details added successfully",
          type: "success",
          showCloseButton: true,
        });
        closeNav();
        console.log(response);

        $("#select_pincode_list").append(
          '<option value="' +
            pincode_details.location +
            '"  loc_name="' +
            pincode_details.location +
            '" city_name="' +
            pincode_details.city +
            '" state_name="' +
            pincode_details.state +
            '" selected>' +
            pincode_details.location +
            "</option>"
        );
      } else {
        Messenger().post({
          message: "Please add stream(RTSP/RTMP) camera URL",
          type: "error",
          showCloseButton: true,
        });
      }
    }
  });
};

$("#uploadBtnAdd").change(function (e) {
  var fname = $("#uploadBtnAdd").val().split("\\").pop().split("/").pop();
  console.log(fname);
  $("#uploadFileTextAdd").val(fname);
});

function upload_bulk_CCTV() {
  if ($("#uploadBtnAdd")[0].files[0] == undefined) {
    Messenger().post({
      message: "Please choose csv to continue.",
      type: "error",
      showCloseButton: true,
    });
  } else {
    $(".bulk_load").show();

    var form = new FormData();
    form.append("file", $("#uploadBtnAdd")[0].files[0]);

    var settings = {
      async: true,
      crossDomain: true,
      url:
        "http://" +
        base_domainip +
        "/event-app/validate_csv/s/s",
      method: "POST",
      headers: {
        "cache-control": "no-cache",
        "postman-token": "af0e72a6-a9c9-f375-eb79-df33d94c59aa",
      },
      processData: false,
      contentType: false,
      mimeType: "multipart/form-data",
      data: form,
    };

    $.ajax(settings).done(function (response) {
      $(".bulk_load").hide();
      $("#uploadFileTextAdd").val("");

      // Messenger().post({
      //     message: 'CCTV added succesfully.',
      //     type: 'success',
      //     showCloseButton: true
      // });

      successFillDetails();
    });
  }
}

function newaddlocation() {
  window.location.href = "/cctv_location";
}


function add_onvif(){
  $('.bulk_load_search').show()
  
  obj = {
  ip:$('#cctv_ip').val(),
  port:$('#cctv_port').val(),
  username:$('#cctv_username_ip').val(),
  password:$('#cctv_password_ip').val()
  }
  var settings = {
    async: true,
    crossDomain: true,
    url: "/get_onvif_camera",
    method: "POST",
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
      "postman-token": "7bbc62fa-4d44-2ecf-df05-4dd1d0d54603",
    },
    processData: false,
    data: JSON.stringify(obj),
  };
  $.ajax(settings).done(function (response) {
    console.log(response)
    if(response.Failure){

      Messenger().post({
        message: response.Failure,
        type: "error",
        showCloseButton: true,
      });
    }else{
      $('.bulk_load_search').hide()
      getusers(response)

    }
    

  });

}

getusers = function (response) {
  let table;
  $("#loading-spinner").show();
  $("#tble_cc").empty();
  
  $("#loading-spinner").hide();

  $("#tble_cc").empty();
      $("#tble_cc").append(
        '<table id="user-datatable-table" class="table table-striped table-hover"> <thead> <tr> <th>#</th> <th>Cam Name</th> <th class=" hidden-xs"> Onvif Status</th>  </tr> </thead> <tbody id="allusers" ></tbody> </table>'
      );

    if (response.Failure) {
      // Messenger().post({
      //   message: response.Failure,
      //   type: "error",
      //   showCloseButton: true,
      // });
    } else {
      

      $("#loading-spinner").hide();
      $("#addOnvif_location").empty();
      $("#addOnvif_location").prepend('<option value="">Select</option>');

      for (
        pincode_onvif = 0;
        pincode_onvif < response.data.location.length;
        pincode_onvif++
      ) {
        var pincode_det = response.data.location[pincode_onvif].location;
        var location_name = response.data.location[pincode_onvif].location;
        var pincode_num = response.data.location[pincode_onvif].pincode;
        var pincode_city = response.data.location[pincode_onvif].city;
        var pincode_state = response.data.location[pincode_onvif].state;

        var isSelected = pincode_onvif == 0  ? "selected" : ""

        if(isSelected){
          defaulEmailAddressdata = response.data.location[pincode_onvif].email_ids
        }

        
        $("#addOnvif_location").append(
          `<option ${isSelected} loc_name="${location_name}" city_name="${response.data.location[pincode_onvif].city}" state_name="${response.data.location[pincode_onvif].state}" value="${pincode_num}" data='${JSON.stringify(response.data.location[pincode_onvif])}'>${pincode_det}</option>`
    
        );
      }

      
      if (response.data.result.length > 0) {
        var count = 0;
        for (i = 0; i < response.data.result.length; i++) {
          count += 1;
          
            
            // console.log(response.users[i]);
            $("#allusers").append(
              "<tr id=" +
                response.data.result[i].cam_name +
                ">" +
                '<td style=" vertical-align:middle;"><a class="fw-semi-bold getUserDetails"> <input type="checkbox" class="checkbox_onvif" cam_name="'+response.data.result[i].cam_name+'"  rtsp_url="'+response.data.result[i].rtsp+'" > </a></a></td><td style=" vertical-align:middle;"><a class="fw-semi-bold getUserDetails"> ' +
                response.data.result[i].cam_name +
                '</a></td><td class="hidden-xs"> <span class=""><i class="fa fa-circle text-success" style="color: rgb(30, 234, 18); position: relative;  margin-top: 11%; "></i></span> </td> </tr>'
            );
          
            // <td class="hidden-xs"> <span class="">' +
            //     response.data.result[i].rtsp +
            //     '</span> </td>
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
      $('#hideitem_onvif').show()
  
};


function addcam_onvif(){
  if($('.checkbox_onvif').is(':checked')){
    $('#addOnvifCam').modal('show')

    
  }else{
    Messenger().post({
      message: "Please select one camera to add",
      type: "error",
      showCloseButton: true,
    });
  }
}


function add_cam_onvif_afterModal(){
  $('.bulk_load_add_search_add').show();
  var e = document.getElementById("addOnvif_location");
  var value = e.value;
  var text = e.options[e.selectedIndex].text;
  var selectedValues = [];
    
  
    $('.checkbox_onvif:checked').each(function() {
      // Push the selected value into the array
      var obj = {
        cam_name:$(this).attr('cam_name'),
        cam_url:$(this).attr('rtsp_url')


      }
      selectedValues.push(obj);
    });  
    // Now you have an array 'selectedValues' with all the selected checkbox values
  
    var jsonObj = {
      cam_list:selectedValues,
      location:text,
      ip: $('#cctv_ip').val(),
      port: $('#cctv_port').val(),
      username: $('#cctv_username_ip').val(),
      password: $('#cctv_password_ip').val()

    }
    console.log(jsonObj)


    var settings = {
      async: true,
      crossDomain: true,
      url: "/start_onvif_livestream",
      method: "POST",
      headers: {
        "content-type": "application/json",
        "cache-control": "no-cache",
        "postman-token": "7bbc62fa-4d44-2ecf-df05-4dd1d0d54603",
      },
      processData: false,
      data: JSON.stringify(jsonObj),
    };
    $.ajax(settings).done(function (response) {
      console.log(response)

      if(response.Failure){

        Messenger().post({
          message: response.Failure,
          type: "error",
          showCloseButton: true,
        });

      }else{
        $('#addOnvifCam').modal('hide')
        Messenger().post({
          message: "Camera Added Successfully",
          type: "success",
          showCloseButton: true,
        });

        // getScripts(["js/app.js"], function () {
          // sidebarlist();
          $('.bulk_load_add_search_add').hide();
          get_live_cam_addcam()
          $('#tble_cc').empty();
          $('#hideitem_onvif').hide()
          $('#cctv_ip').val('')
          $('#cctv_port').val('')
          $('#cctv_username_ip').val('')
          $('#cctv_password_ip').val('')
          
        // });

      }

     
  
    });


    

}

  function get_live_cam_addcam(){
  
  
  
    var settings = {
   async: true,
   crossDomain: true,
   url: "/get_live_cams?service=ALL",
   method: "GET",
   headers: {
     "cache-control": "no-cache",
   },
 };
 $("#camera-loading-spinner").show();
 $.ajax(settings).done(function (response) {
   

   var selectedCameraName = localStorage.getItem("camName-DXB")

   if(selectedCameraName == null){
     selectedCameraName = response.live_cams[0]?.camera[0]?.cam_name 
     localStorage.setItem("camName-DXB", selectedCameraName)
       function getScripts(scripts, callback) {
           var progress = 0;
           scripts.forEach(function (script) {
             $.getScript(script, function () {
               if (++progress == scripts.length) callback();
             });
           });
         }
     getScripts(["js/cctv_monitoring.js"],function(){
       updateCamData(selectedCameraName)
     })
   }



   $("#camera-loading-spinner").hide();
   if (response.Failure) {
     Messenger().post({
       message: response.Failure,
       type: "error",
       showCloseButton: true,
     });
   } else {
     if (response.live_cams.length > 0) {
       duration_parameter = response.duration_parameter
       count_parameter = response.count_parameter
       
       localStorage.setItem("getcam", JSON.stringify([{city: response.live_cams[0].camera[0].city  ,location: response.live_cams}]));
       var side_bar_dict = [{city: response.live_cams[0].camera[0].city  ,location: response.live_cams}];
       var li_DXB;
       var li_ul_li_a_DXB;
       var li_ul_li_ul_DXB;
       var li_ul_li_ul_li_DXB;
       var li_ul_li_ul_li_a_DXB;
       var live_icon;
       var countTest = 0;
       var counttest1 = 0;
       for (i = 0; i < side_bar_dict.length; i++) {
         countTest += 1;
         li_DXB = document.createElement("li");
         li_DXB.className = "panel" ;
         // var li_a_DXB = document.createElement('a');
         // li_a_DXB.className = "accordion-toggle ";
         // li_a_DXB.setAttribute('data-toggle', "collapse");
         // li_a_DXB.setAttribute('data-parent', "#menu-levels-collapse");
         // li_a_DXB.setAttribute('href',"#sub-menu-"+countTest+"-collapse");
         // li_a_DXB.textContent =side_bar_dict[i].city;
         // li_DXB.appendChild(li_a_DXB);
         var li_ul_DXB = document.createElement("ul");
         li_ul_DXB.id = "sub-menu-" + countTest + "-collapse";
         li_ul_DXB.className = "panel-collapse  in";
         for (j = 0; j < side_bar_dict[i].location.length; j++) {
           var li_ul_li_DXB = document.createElement("li");
           li_ul_li_DXB.className = "panel";
           li_ul_li_DXB.className += " paneldata";
           li_ul_li_DXB.className += " " + side_bar_dict[i].location[j].name+"_location";
           $(li_ul_li_DXB).append('<i class="fa fa-th" style= "float: right; position: absolute;top:4px;right: -4%;font-size: 11px; cursor:pointer" name="'+ side_bar_dict[i].location[j].name+'" onclick="Layoutfunction(this);"></i>')
           li_ul_li_DXB.setAttribute(
             "data",
             JSON.stringify({
               location: side_bar_dict[i].location[j].name,
               camera: [
                 ...side_bar_dict[i].location[j].camera.map(
                   (camera) => camera.cam_name
                 ),
               ],
             })
           );
           counttest1 += 1;
           li_ul_li_ul_DXB = document.createElement("ul");

           li_ul_li_ul_DXB.id = "sub-menu-1" + counttest1 + "-collapse";
           li_ul_li_a_DXB = document.createElement("div");
           if(selectedCameraName){
             if(selectedCameraName == ""){
               if(j == 0){
               li_ul_li_ul_DXB.className = "panel-collapse in";
               li_ul_li_a_DXB.className = "accordion-toggle";
             }else{
               li_ul_li_ul_DXB.className = "panel-collapse collapse";
               li_ul_li_a_DXB.className = "accordion-toggle collapsed";
             }
             }else{
               if(side_bar_dict[i].location[j].camera.find(cam=>cam.cam_name == selectedCameraName)){
               li_ul_li_ul_DXB.className = "panel-collapse in";
               li_ul_li_a_DXB.className = "accordion-toggle";
             }else{
               li_ul_li_ul_DXB.className = "panel-collapse collapse";
               li_ul_li_a_DXB.className = "accordion-toggle collapsed";
             }
             }
           }else{
             if(j == 0){
               li_ul_li_ul_DXB.className = "panel-collapse in";
               li_ul_li_a_DXB.className = "accordion-toggle";
             }else{
               li_ul_li_ul_DXB.className = "panel-collapse collapse";
               li_ul_li_a_DXB.className = "accordion-toggle collapsed";
             }

           }
           li_ul_li_a_DXB.setAttribute("data-toggle", "collapse");
           li_ul_li_a_DXB.setAttribute(
             "data-parent",
             "#sub-menu-" + countTest + "-collapse"
           );
           li_ul_li_a_DXB.setAttribute(
             "href",
             "#sub-menu-1" + counttest1 + "-collapse"
           );
           li_ul_li_a_DXB.style.cursor = "pointer";
           li_ul_li_a_DXB.textContent = side_bar_dict[i].location[j].name;
           li_ul_li_a_DXB.style.paddingLeft = "30px;";
           
           // li_ul_li_a_DXB.addEventListener(
           //   "click",
           //   function (f) {
           //     if (window.location.pathname == "/cctv_vms") {
           // myfun()
           // localStorage.setItem('camName-DXB',e.target.innerText)
           // var abc='#'+e.target.innerText;
           // $('.act').removeClass('active')
           // $(abc).addClass('active');
           // clearInterval(intervalchart);
           // updateCamData(e.target.innerText);
           //   window.location.href = "/cctv_vms";
           // } else {
           //   window.location.href = "/cctv_vms";
           // localStorage.setItem('camName-DXB',e.target.innerText)
           // updateCamData(localStorage.getItem('camName-DXB'));
           // window.location.href="/cam"
           // getCamName();
           //     }
           //   },
           //   false
           // );
           li_ul_li_DXB.appendChild(li_ul_li_a_DXB);
           li_ul_DXB.appendChild(li_ul_li_DXB);
           li_DXB.appendChild(li_ul_DXB);
           for (k = 0; k < side_bar_dict[i].location[j].camera.length; k++) {
             li_ul_li_ul_li_DXB = document.createElement("li");
             li_ul_li_ul_li_DXB.id =
               side_bar_dict[i].location[j].camera[k].cam_name;
             li_ul_li_ul_li_DXB.className = "act";
             li_ul_li_ul_li_DXB.addEventListener(
               "click",
               function (e) {
                 // $(".navbar-dark a").removeClass("active-li");
                 // $(".cctv_monitoring a").addClass("active-li");
                 if (
                   window.location.pathname == "/cctv_monitoring" ||
                   window.location.pathname == "/"
                 ) {
                   // myfun()
                   localStorage.setItem("camName-DXB", e.target.innerText);
                   var abc = "#" + e.target.innerText;
                   $(".act").removeClass("active");
                   $(abc).addClass("active");
                   // clearInterval(intervalchart);
                   updateCamData(e.target.innerText);
                 } else {
                   localStorage.setItem("camName-DXB", e.target.innerText);
                   updateCamData(localStorage.getItem("camName-DXB"));
                   // window.location.href="/cam"
                   // getCamName();
                 }
               },
               false
             );
             $(li_ul_DXB).attr(
               "title",
               side_bar_dict[i].city +
                 ", " +
                 side_bar_dict[i].location[j].camera[k].state
             );
             live_icon = document.createElement("i");
             live_icon.className = "fa fa-circle text-success";
             live_icon.style.color = "#1eea12";
             live_icon.style.position = "absolute";
             live_icon.style.left = "10%";
             live_icon.style.top = "14%";
             live_icon.style.fontSize = "9px";
             li_ul_li_ul_li_a_DXB = document.createElement("a");
             li_ul_li_ul_li_a_DXB.style.cursor = "pointer";
             li_ul_li_ul_li_a_DXB.href = "/cctv_monitoring";
             li_ul_li_ul_li_a_DXB.addEventListener(
               "dragstart",
               function (event) {
                 event.dataTransfer.setData("text", $(this).text());
               }
             );
             li_ul_li_ul_li_a_DXB.addEventListener("click", () => {
              $(".active-li").removeClass("active-li");
              $(".cctv_monitoring").addClass("active-li");
             });
             li_ul_li_ul_li_a_DXB.style.position = "relative";
             li_ul_li_ul_li_a_DXB.style.wordWrap = "break-word";
             li_ul_li_ul_li_a_DXB.style.paddingLeft = "45px;";
             li_ul_li_ul_li_a_DXB.textContent =
               side_bar_dict[i].location[j].camera[k].cam_name;
             li_ul_li_ul_li_a_DXB.insertBefore(
               live_icon,
               li_ul_li_ul_li_a_DXB.firstChild
             );
             // li_ul_li_ul_li_a_DXB.appendChild(live_icon);
             li_ul_li_ul_li_DXB.appendChild(li_ul_li_ul_li_a_DXB);
             li_ul_li_ul_DXB.appendChild(li_ul_li_ul_li_DXB);
             li_ul_li_DXB.appendChild(li_ul_li_ul_DXB);
             li_ul_DXB.appendChild(li_ul_li_DXB);
             li_DXB.appendChild(li_ul_DXB);
           }
         }

         



         if($($("#side-nav").children()[0]).prop("tagName") == "P"){

           $("#side-nav").empty().append(
       `<li class="panel">
                         <ul id="menu-levels-collapse" class="panel-collapse collapse in">
                         </ul>
                     </li>`
                     )
         }

         $("#menu-levels-collapse").empty();
         $("#menu-levels-collapse").append(li_DXB);
         
       }
       var abc = "#" + localStorage.getItem("camName-DXB");

       $(".act").removeClass("active");

       if (
         window.location.pathname == "/cctv_monitoring" ||
         window.location.pathname == "/"
       ) {
         $(abc).addClass("active");
       }

       //
       // updateCamData(abc);
       // }

       if (abc == "#null") {
         $("#prioritesTab").empty();
         $("#prioritesTab").append(
           '<li class="su" ><a href="#NoAlerts" class="NoAlerts" data-toggle="tab">Camera Alerts</a></li>'
         );

         $("#prioritesTabContent").empty();
         $("#prioritesTabContent").append(
           ' <div class="tab-pane fade " id="NoAlerts">\n' +
             '                                                <div class="row">\n' +
             '                                                    <div id="" class="tab-pane active clearfix">\n' +
             '                                                        <div id="feedP2" class="feed">\n' +
             '                                                            <ul class="news-list" id="cam-Alerts-No">\n' +
             "                                                            </ul>\n" +
             "                                                        </div>\n" +
             "                                                    </div>\n" +
             "                                                </div>\n" +
             "                                            </div>"
         );
         $("#cam-Alerts-No").empty();
         $("#cam-Alerts-No").append(
           '<li id="alertsDXBA" > <div class="position" style="text-align:center ">No Alerts Found</div> </li>'
         );
         $("#prioritesTab li:first").addClass("active");
         $("#prioritesTabContent div:first").addClass("in active");
       }
     } else {
       // $("#prioritesTabContent").append('<li id="alertsDXBA" > <div class="position" style="text-align:center ">No Alerts Found</div> </li>');

       localStorage.removeItem("camName-DXB");

       if (
         window.location.pathname == "/cctv_monitoring" ||
         window.location.pathname == "/"
       ) {
         Messenger().post({
           message: "No Live Camera Found",
           type: "error",
           showCloseButton: true,
         });
         $("#side-nav").empty();
         $("#side-nav").append(`
         <p style="
   text-align: center;
">No Live Camera</p>`);
       } else {
         $("#side-nav").empty();
         $("#side-nav").append(`
         <p style="
   text-align: center;
">No Live Camera</p>`);
       }
       $("#prioritesTab").empty();
       $("#prioritesTabContent").empty();
       $("#prioritesTab").append(
         '<li class="su" ><a href="#NoAlerts" class="NoAlerts" data-toggle="tab">Camera Alerts</a></li>'
       );

       //
       $("#prioritesTabContent").append(
         ' <div class="tab-pane fade " id="NoAlerts">\n' +
           '                                                <div class="row">\n' +
           '                                                    <div id="" class="tab-pane active clearfix">\n' +
           '                                                        <div id="feedP2" class="feed">\n' +
           '                                                            <ul class="news-list" id="cam-Alerts-No">\n' +
           "                                                            </ul>\n" +
           "                                                        </div>\n" +
           "                                                    </div>\n" +
           "                                                </div>\n" +
           "                                            </div>"
       );

       $("#cam-Alerts-No").append(
         '<li id="alertsDXBA" > <div class="position" style="text-align:center ">No Alerts Found</div> </li>'
       );
       $("#prioritesTab li:first").addClass("active");
       $("#prioritesTabContent div:first").addClass("in active");
       getScripts(["js/index.js"], function () {
         // modifyPerimeter();
       });
     }
     localStorage.setItem("getlivecams", JSON.stringify(response))
     // modify_services(response);
   }
 })
}
    