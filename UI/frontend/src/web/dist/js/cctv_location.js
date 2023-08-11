//show all users not admin
$(".modal-backdrop.fade.in").remove();
$(".active-li").removeClass("active-li");
$(".cctv_location").addClass("active-li");
var setlectedLocation;
var table;

getlocations = function () {
  $("#tagsnp").remove();
  
  $("#tags_4").remove();
  $("#emailDXBre").append(
    '<input id="tags_4" data-role="tagsinput" class="form-control input-transparent" type="text" name="url">'
  );
  
  $("#tags_4_tagsinput").remove();

  var head = document.getElementsByTagName("head")[0];
  var script = document.createElement("script");
  script.id = "tagsnp";
  script.src = "lib/Tags-Input/jquery.tagsinput.js";
  head.appendChild(script);







  $("#loading-spinner").show();
  $("#tble_cc").empty();
  var settings = {
    async: true,
    crossDomain: true,
    url: "/getlocations",
    // "http://" +
    // base_domainip +
    // "/event-app/get_users/saurabh/saurabh",
    method: "GET",
    headers: {
      "cache-control": "no-cache",
      "postman-token": "8fc0de8d-d948-de36-ee89-0ec4493fb82a",
    },
  };

  $.ajax(settings).done(function (responseData) {
    if (responseData.hasOwnProperty("Failure")) {
      Messenger().post({
        message: responseData.Failure,
        type: "error",
        showCloseButton: true,
      });
    }
    $("#loading-spinner").hide();
    // $("#addpincode").val(response.atm_id);
    // $("#addpincode").attr("disabled", true);
    // response = response.pincode_details;
    // var res=
    $("#tble_cc").empty();
    $("#tble_cc").append(
      '<table id="datatable-table" class="table table-striped table-hover"> <thead> <tr> <th>Location</th><th class=" hidden-xs"> City</th> <th class="hidden-xs">State</th> <th class=" hidden-xs"> Pincode</th> <th class="hidden-xs">Action</th></tr> </thead> <tbody id="locationtablebody" ></tbody> </table>'
    );
    var response = responseData.data
    if (response?.length > 0) {
      var count = 0;
      for (i = 0; i < response.length; i++) {
        count += 1;
        $("#locationtablebody").append(
          '<tr><td><a class="fw-semi-bold" style="cursor: pointer">' +
            response[i].location +
            '</a></td> <td class="hidden-xs"> <span>' +
            response[i].city +
            '</span> </td> <td class="hidden-xs"><span>' +
            response[i].state +
            '</span></td><td class="hidden-xs"> <span>' +
            response[i].pincode +
            '</span> </td><td class="hidden-xs"><span onclick="deleteLocation(this)" style="width: 31px;" class="btn btn-transparent btn-sm pull-left" id="back-btn" location=' +
            response[i].location.replaceAll(" ", "**") +
            '  > <i class="fa fa-trash"></i> </span></td></tr>'
        );
      }
      // $("#allcamsDXB").append('<tr><td>'+count+'</td><td><a class="fw-semi-bold getFlightDetails" get_camDXB='+response.cam_list[i].cam_name+'  style="cursor: pointer">' + response.cam_list[i].airport_name + "--" + response.cam_list[i].terminal + "--" + response.cam_list[i].cam_name + '</a></td> <td class="hidden-xs"> <span class="">' + response.cam_list[i].stand_type + '</span> </td> <td class="hidden-xs"><span >' + response.cam_list[i].aircraft_stand + '</span></td> <td class="hidden-xs">' + response.cam_list[i].cam_add_time + '</td></tr>');
    }

    var unsortableColumns = [];
    $("#datatable-table")
      .find("thead th")
      .each(function () {
        if ($(this).hasClass("no-sort")) {
          unsortableColumns.push({ bSortable: false });
        } else {
          unsortableColumns.push(null);
        }
      });

    table = $("#datatable-table").dataTable({
          order: [],
      destroy: true,
      sDom: "<'row'<'col-md-6 hidden-xs'l><'col-md-6'f>r>t<'row'<'col-md-6'i><'col-md-6'p>>",
      oLanguage: {
        sLengthMenu: "_MENU_",
        sInfo: "Showing <strong>_START_ to _END_</strong> of _TOTAL_ Locations",
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
    });

    $("#datatable-table_length > label > select").css({
      "background-color": "rgba(51, 51, 51, 0.425)",
      border: "none",
    });
  });
};

//add user
addLocation = function () {
  $("#addlocation").val("");
  $("#addcity").val("");
  $("#addstate").val("");
  $("#addpincode").val("");
  $("#addlat").val("");
  $("#addlong").val("");

  $("#addatmbtn").show();
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

  var settings = {
    async: true,
    crossDomain: true,
    url:
      "http://" +
      base_domainip +
      "/event-app/get_smtp/saurabh/saurabh",
    method: "GET",
    headers: {
      "cache-control": "no-cache",
      "postman-token": "61095204-3cc6-131a-0ac1-721195054aee",
    },
  };

  $.ajax(settings).done(function (response) {
    console.log(response.smtp.length);
    if (response.smtp.length > 0) {
      $("#serverSMTPDXB").val(response.smtp[0].smtp_server);
      $("#portSMTPDXB").val(response.smtp[0].smtp_port);
      $("#emailSMTPDXB").val(response.smtp[0].smtp_email_id);
      $("#passwordSMTPDXB").val(response.smtp[0].smtp_passwd);
    } else {
    }
  });
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

      var settings = {
        async: true,
        crossDomain: true,
        url:
          "http://" +
          base_domainip +
          "/event-app/add_smtp/saurabh/saurabh",
        method: "POST",
        headers: {
          "content-type": "application/json",
          "cache-control": "no-cache",
          "postman-token": "8afca705-1d1f-9634-8a61-4b3b2392f064",
        },
        processData: false,
        data: JSON.stringify(smtpJSON),
      };

      $.ajax(settings).done(function (response) {
        if (response.status == "success") {
          $("#modifySMTPDXB").modal("hide");
        } else {
        }
      });
    }
  }
};
console.log($("#addStatusDXB").val());
//add or change SMTP Details
addDetailsDXB = function () {
  if ($("#addlocation").val() == "") {
    Messenger().post({
      message: "Please add location name",
      type: "error",
      showCloseButton: true,
    });
  } else if ($("#addcity").val() == "") {
    Messenger().post({
      message: "Please add city name",
      type: "error",
      showCloseButton: true,
    });
  } else if ($("#addpincode").val() == "") {
    Messenger().post({
      message: "Please add pincode",
      type: "error",
      showCloseButton: true,
    });
  } else if ($("#addstate").val() == "") {
    Messenger().post({
      message: "Please add State name",
      type: "error",
      showCloseButton: true,
    });
  // } else if ($("#addlat").val() == "" || $("#addlong").val() == "") {
  //   Messenger().post({
  //     message: "Add Latitude & Longitude",
  //     type: "error",
  //     showCloseButton: true,
  //   });
  }
  // } else {
  //   var pincode_details = {
  //     location: $("#addlocation").val(),
  //     latitude: $("#addlat").val(),
  //     longitude: $("#addlong").val(),
  //     city: $("#addcity").val(),
  //     state: $("#addstate").val(),
  //     pincode: $("#addpincode").val(),
  //   };

  //   // var ad =
  //   //   "username=" +
  //   //   $("#addUsernameDXB").val() +
  //   //   "&password=" +
  //   //   $("#addPasswordDXB").val() +
  //   //   "&email=" +
  //   //   $("#addEmailDXB").val() +
  //   //   "&status=" +
  //   //   $("#addStatusDXB").val() +
  //   //   "&designation=" +
  //   //   $("#addDesignationDXB").val() +
  //   //   "&contact=" +
  //   //   $("#addContactDXB").val();

  //   // console.log(ad);

  //   var settings = {
  //     async: true,
  //     crossDomain: true,
  //     url: "/save_pincode_details",
  //     method: "POST",
  //     headers: {
  //       "content-type": "application/json",
  //       "cache-control": "no-cache",
  //       "postman-token": "7bbc62fa-4d44-2ecf-df05-4dd1d0d54603",
  //     },
  //     processData: false,
  //     data: JSON.stringify(pincode_details),
  //   };
  //   $.ajax(settings).done(function (response) {
  //     if (response.Failure) {
  //       Messenger().post({
  //         message: response.Failure,
  //         type: "error",
  //         showCloseButton: true,
  //       });
  //     } else {
  //       if (response.data.status == "success") {
  //         $("#addUserDXB").modal("hide");
  //         getlocations();
  //       }
  //       Messenger().post({
  //         message: response.data.status,
  //         type: "success",
  //         showCloseButton: true,
  //       });
  //     }
  //   });
  // }
};

// //you can delete any user with delete icon with row
// $(document).on("click", ".deleteUsersDXB", function () {
//   var username = $(this).attr("username");

//   var jsonUserDXB = {
//     username: username,
//   };
//   var settings = {
//     async: true,
//     crossDomain: true,
//     url: "/deleteuser",
//     method: "POST",
//     headers: {
//       "content-type": "application/json",
//       "cache-control": "no-cache",
//     },
//     processData: false,
//     data: JSON.stringify(jsonUserDXB),
//   };

//   var therow = this;

//   $.ajax(settings).done(function (response) {
//     console.log(response);
//     if (response.data.status == "success") {
//       var tablename = $(therow).closest("table").DataTable();
//       tablename.row($(therow).parents("tr")).remove().draw(false);
//       Messenger().post({
//         message: "Deleted user successfully",
//         type: "success",
//         showCloseButton: true,
//       });
//     } else {
//       Messenger().post({
//         message: "Sorry please try again.",
//         type: "error",
//         showCloseButton: true,
//       });
//     }
//   });
// });

function getlatlong() {
  var result;

  function showPosition() {
    // If geolocation is available, try to get the visitor's position
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    } else {
      alert("Sorry, your browser does not support HTML5 geolocation.");
    }
  }
  showPosition();

  // Define callback function for successful attempt
  function successCallback(position) {
    $("#addlat").val(position.coords.latitude);
    $("#addlong").val(position.coords.longitude);
  }

  // Define callback function for failed attempt
  function errorCallback(error) {
    if (error.code == 1) {
      Messenger().post({
        message: "You've decided not to share your position.",
        type: "error",
        showCloseButton: true,
      });
    } else if (error.code == 2) {
      Messenger().post({
        message:
          "The network is down or the positioning service can't be reached.",
        type: "error",
        showCloseButton: true,
      });
    } else if (error.code == 3) {
      Messenger().post({
        message: "The attempt timed out before it could get the location data.",
        type: "error",
        showCloseButton: true,
      });
    } else {
      Messenger().post({
        message: "Geolocation failed due to unknown error.",
        type: "error",
        showCloseButton: true,
      });
    }
  }
}

function deleteLocation(e) {
  var settings = {
    async: true,
    crossDomain: true,
    url: "/deletelocation",
    // "http://" +
    // base_domainip +
    // "/event-app/get_users/saurabh/saurabh",
    method: "POST",
    data: { location: $(e).attr("location").replaceAll("**", " ") },
    headers: {
      "cache-control": "no-cache",
      "postman-token": "8fc0de8d-d948-de36-ee89-0ec4493fb82a",
    },
  };

  $.ajax(settings).done(function (response) {
    if (response.data.status) {
      if (response.data.status == "success") {
        var tablename = $(e).closest("table").DataTable();
        tablename.row($(e).parents("tr")).remove().draw(false);
        Messenger().post({
          message: "Deleted Location Successfully",
          type: "success",
          showCloseButton: true,
        });
      } else {
        Messenger().post({
          message: response.data.status,
          type: "error",
          showCloseButton: true,
        });
      }
    } else {
      Messenger().post({
        message: response.Failure,
        type: "error",
        showCloseButton: true,
      });
    }
  });
}

function addATMid() {
  // alert($("#addpincode").val());

  if ($("#addlocation").val() == "") {
    Messenger().post({
      message: "Please add location name",
      type: "error",
      showCloseButton: true,
    });
  } else if ($("#addcity").val() == "") {
    Messenger().post({
      message: "Please add city name",
      type: "error",
      showCloseButton: true,
    });
  } else if ($("#addpincode").val() == "") {
    Messenger().post({
      message: "Please add pincode",
      type: "error",
      showCloseButton: true,
    });
  } else if ($("#addstate").val() == "") {
    Messenger().post({
      message: "Please add State name",
      type: "error",
      showCloseButton: true,
    });
  } else {
  if (!($("#addlat").val() == "" || $("#addlong").val() == "")) {
    if (
    !(
      isFinite($("#addlat").val()) &&
      Math.abs($("#addlat").val()) <= 90 &&
      $("#addlat").val().includes(".")
    )
  ) {
    Messenger().post({
      message: "Invalid Latitude",
      type: "error",
      showCloseButton: true,
    });
  } else if (
    !(
      isFinite($("#addlong").val()) &&
      Math.abs($("#addlong").val()) <= 180 &&
      $("#addlong").val().includes(".")
    )
  ) {
    Messenger().post({
      message: "Invalid Logitude",
      type: "error",
      showCloseButton: true,
    });
  }else{
     var settings = {
      async: true,
      crossDomain: true,
      url: "/savepincodedetails",
      method: "POST",
      headers: {
        "content-type": "application/json",
        "cache-control": "no-cache",
        "postman-token": "7bbc62fa-4d44-2ecf-df05-4dd1d0d54603",
      },
      processData: false,
      data: JSON.stringify({
        pincode: $("#addpincode").val(),
        location: titleCase($("#addlocation").val()),
        city: titleCase($("#addcity").val()),
        state: titleCase($("#addstate").val()),
        latitude: $("#addlat").val(),
        longitude: $("#addlong").val(),
        email_ids: $(".emaillist")
                  .toArray()
                  .map(function (e) {
                    return $(e).text()?.replaceAll(" ","")?.trim();
                  })
      }),
    };
    $.ajax(settings).done(function (response) {
      if (response.data) {
        if (response.data.status == "success") {
          Messenger().post({
            message: "Location Added Successfully",
            type: "success",
            showCloseButton: true,
          });
          $("#addUserDXB").modal("hide");
          getlocations();
        } else {
          Messenger().post({
            message: response.data.status,
            type: "error",
            showCloseButton: true,
          });
        }
      } else {
        Messenger().post({
          message: response.Failure,
          type: "error",
          showCloseButton: true,
        });
      }
    });
  }  
  }else{
     var settings = {
      async: true,
      crossDomain: true,
      url: "/savepincodedetails",
      method: "POST",
      headers: {
        "content-type": "application/json",
        "cache-control": "no-cache",
        "postman-token": "7bbc62fa-4d44-2ecf-df05-4dd1d0d54603",
      },
      processData: false,
      data: JSON.stringify({
        pincode: $("#addpincode").val(),
        location: titleCase($("#addlocation").val()),
        city: titleCase($("#addcity").val()),
        state: titleCase($("#addstate").val()),
        latitude: $("#addlat").val(),
        longitude: $("#addlong").val(),
        email_ids: $(".emaillist")
                  .toArray()
                  .map(function (e) {
                    return $(e).text()?.replaceAll(" ","")?.trim();
                  })
      }),
    };
    $.ajax(settings).done(function (response) {
      if (response.data) {
        if (response.data.status == "success") {
          Messenger().post({
            message: "Location Added Successfully",
            type: "success",
            showCloseButton: true,
          });
          $("#addUserDXB").modal("hide");
          getlocations();
        } else {
          Messenger().post({
            message: response.data.status,
            type: "error",
            showCloseButton: true,
          });
        }
      } else {
        Messenger().post({
          message: response.Failure,
          type: "error",
          showCloseButton: true,
        });
      }
    });
  }  
   
  }
}

$("#mapsearch-autocomplete").on("input", function () {
  if ($("#mapsearch-autocomplete").val().length < 2) {
    setTimeout(() => {
      $("#searchiconformap").show();
    }, 500);
  } else {
    $("#searchiconformap").hide();
  }
});

function pinonmap() {
  let markerLayer = new L.LayerGroup();

  setlectedLocation = undefined;
  $(".selectedaddressinfo").text(``);
  $("#pinonmapcontainer").remove();
  $(
    `<div id="pinonmapcontainer"   style="width: 100%; height:100%;" ></div>`
  ).insertBefore("#pinonmap_loader");
  try {
    map = L.map("pinonmapcontainer", {
      attributionControl: false,
      zoomControl: false,
    }).setView(L.latLng([20.5937, 78.9629]), 5);
  } catch (e) {
    console.log(e);
  }

  new Autocomplete("mapsearch-autocomplete", {
    selectFirst: true,
    insertToInput: true,
    cache: true,
    howManyCharacters: 2,
    // onSearch
    onSearch: ({ currentValue }) => {
      const api = `https://nominatim.openstreetmap.org/search?format=geocodejson&limit=5&countrycodes=in&q=${encodeURI(
        currentValue
      )}`;

      // You can also use static files
      // const api = './search.json'

      /**
       * jquery
       * If you want to use jquery you have to add the
       * jquery library to head html
       * https://cdnjs.com/libraries/jquery
       */
      // return $.ajax({
      //   url: api,
      //   method: 'GET',
      // })
      //   .done(function (data) {
      //     return data
      //   })
      //   .fail(function (xhr) {
      //     console.error(xhr);
      //   });

      // OR ----------------------------------

      /**
       * axios
       * If you want to use axios you have to add the
       * axios library to head html
       * https://cdnjs.com/libraries/axios
       */
      // return axios.get(api)
      //   .then((response) => {
      //     return response.data;
      //   })
      //   .catch(error => {
      //     console.log(error);
      //   });

      // OR ----------------------------------

      /**
       * Promise
       */
      return new Promise((resolve) => {
        fetch(api)
          .then((response) => response.json())
          .then((data) => {
            resolve(data.features.splice(0, 5));
          })
          .catch((error) => {
            console.error(error);
          });
      });
    },

    // nominatim GeoJSON format
    onResults: ({ currentValue, matches, template }) => {
      const regex = new RegExp(currentValue, "gi");

      // if the result returns 0 we
      // show the no results element
      return matches === 0
        ? template
        : matches
            .map((element) => {
              return `
          <li class="loupe">
            <p>
              ${element.properties.geocoding.label.replace(
                regex,
                (str) => `<b>${str}</b>`
              )}
            </p>
          </li> `;
            })
            .join("");
    },

    onSubmit: ({ object }) => {
      const { type } = object.properties.geocoding;
      const [lat, lng] = object.geometry.coordinates;
      // custom id for marker
      const customId = Math.random();

      // const marker = L.marker([lng, lat], {
      //   title: display_name,
      //   id: customId,
      // });

      // marker.addTo(map).bindPopup(display_name);
      if (object.geometry.type == "ATM") {
        map.setView([lng, lat], 20);
        openleft(object.location);
      } else if (type == "state") {
        map.setView([lng, lat], 7);
      } else if (type == "city" || type == "county" || type == "district") {
        map.setView([lng, lat], 12);
      } else if (type == "country") {
        map.setView([lng, lat], 5);
      } else {
        map.setView([lng, lat], 16);
      }

      map.eachLayer(function (layer) {
        if (layer.options && layer.options.pane === "markerPane") {
          if (layer.options.id !== customId) {
            map.removeLayer(layer);
          }
        }
      });
    },

    // get index and data from li element after
    // hovering over li with the mouse or using
    // arrow keys ↓ | ↑
    onSelectedItem: ({ index, element, object }) => {
      console.log("onSelectedItem:", { index, element, object });
    },

    // the method presents no results
    // no results
    noResults: ({ currentValue, template }) =>
      template(`<li>No results found: "${currentValue}"</li>`),
  });

  $("#mapsearch-autocomplete").on("keydown", (e) => {
    if (e.keyCode == 13) {
      e.preventDefault();
    }
  });

  // L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png", {
  //   detectRetina: true,
  //   maxNativeZoom: 19,
  // }).addTo(map);

  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png", {
    // L.tileLayer(
    //   "https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png",
    //   {
    // L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: "abcd",
    minZoom: 3,
  }).addTo(map);

  // map.on("drag", function () {
  //   map.panInsideBounds(bounds, { animate: false });
  // });

  map.on("click", function (e) {
    setlectedLocation = e.latlng;
    $.ajax({
      url: "https://nominatim.openstreetmap.org/reverse",
      data: {
        lat: e.latlng.lat,
        lon: e.latlng.lng,
        format: "json",
      },
      dataType: "json",
      type: "GET",
      async: true,
      crossDomain: true,
    })
      .done(function (res) {
        if (res.error) {
          $(".selectedaddressinfo").text(`Unknown location`);
          return;
        }
        $(".selectedaddressinfo").text(`
        ${res.display_name}  (${e.latlng.lat}, ${e.latlng.lng})
        `);
      })
      .fail(function (error) {
        console.error(error);
      });

    markerLayer.clearLayers();
    marker = L.marker(e.latlng, {
      icon: new L.DivIcon({
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -25],
        html: `<img class="my-div-image w-36 atmstatus_online" style="width:24px !important;" src="img/opin.png">`,
      }),
    });
    markerLayer.addLayer(marker);

    // console.log(setlectedLocation);
  });
  markerLayer.addTo(map);

  setTimeout(() => {
    map.invalidateSize();
  }, 200);
  $("#pinonmap").modal("show");
}

function setSelectedMapPin() {
  if (setlectedLocation) {
    $("#addlat").val(setlectedLocation.lat);
    $("#addlong").val(setlectedLocation.lng);
    $("#pinonmap").modal("hide");
  } else {
    Messenger().post({
      message: "Please add location on map",
      type: "error",
      showCloseButton: true,
    });
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