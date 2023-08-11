// show  camera alerts logs
cameralogs = function () {


    var airportLogsData= JSON.parse(localStorage.getItem('logsAirportData'));
    console.log(airportLogsData);

    // $('#breadCrumbsLogs').append('<span>Alerts &nbsp;</span> &nbsp;');
    // $('#breadCrumbsLogs').show();




    var settings = {
        "async": true,
        "crossDomain": true,
        // "url": "http://"+base_domainip+"/event-app/get_alerts_by_area/saurabh/saurabh/"+localStorage.getItem('camAlertsLogsID'),
        "url": "http://"+base_domainip+"/event-app/get_alerts_view/saurabh/saurabh",
        "method": "GET",
        "headers": {
            "cache-control": "no-cache",
            "postman-token": "8fc0de8d-d948-de36-ee89-0ec4493fb82a"
        }
    }


    $.ajax(settings).done(function (response) {



     // }
    //     console.log(response);
        $('#loading-spinnerFlight').hide();

        // var response= {
        //     cam_flight_count_dict:[]
        // }
        $('#tble_cc').append('<table id="datatable-table" class="table table-striped table-hover"> <thead> <tr> <th>Id </th> <th>Camera Name </th> <th>Location </th> <th>Area </th>   <th> Alert ID</th>  <th>Alert Name</th> <th class="no-sort hidden-xs">Priority </th>  <th class="hidden-xs">Date </th>  <th class="no-sort hidden-xs">Status </th> <th class="hidden-xs">Thumbnail</th> <th class="hidden-xs">Preview</th></tr> </thead> <tbody id="allcamsDXB" ></tbody> </table>');
        if(response.alert_data.length>0){
            console.log("here");
            var count=0;

            for (i = 0; i < response.alert_data.length; i++) {


                var event_name ;
                if(response.alert_data[i].alert_2 =="" ){
                    event_name =response.alert_data[i].alert_1;
                }else {
                    event_name =response.alert_data[i].alert_1 + " & " + response.alert_data[i].alert_1
                }

                var cityName = response.alert_data[i].city+", "+response.alert_data[i].state;


                var imgThumb ="http://"+base_domainip+"/nginx/"+response.alert_data[i].thumbnail;

                // var imgThumb ="http:/"+base_domainip+"/nginx/"+response.alert_data[i].thumbnail;
// >>>>>>> 2f1c1fcd9661d05a90abcb63da01eeecfd70ffad

                // var imgThumb ='img/1.png';


                count+=1;
                var location = response.alert_data[i].location+", "+response.alert_data[i].city+", "+response.alert_data[i].state;
                console.log("thumbnil"+imgThumb)

                $("#allcamsDXB").append('<tr><td>'+count+'</td> <td>'+response.alert_data[i].cam_name+'</td> <td>'+location+'</td> <td>'+response.alert_data[i].area+'</td> <td>'+response.alert_data[i].alert_id+'</td><td><a class="fw-semi-bold "    style="cursor: pointer">'+ response.alert_data[i].alert_1 + '</a></td> <td class="hidden-xs"> <span class="">'+response.alert_data[i].priority+'</span> </td> <td class="hidden-xs"><span >'+response.alert_data[i].date+'</span></td>   </td> <td class="hidden-xs"><span >'+response.alert_data[i].alert_status+'</span></td>  <td>\n' +
                    '                                    <img class="img-rounded" src='+imgThumb+' alt="" height="50">\n' +
                    '                            </td> <td> <span flight_id="'+response.alert_data[i].alert_id+'" airport="'+cityName+'"  terminal="'+response.alert_data[i].location+'"  stand_type="'+response.alert_data[i].area+'"  camName="'+response.alert_data[i].cam_name+'"  camera_id="'+response.alert_data[i].cam_name+'"  event_name="'+event_name+'"  event_url="'+response.alert_data[i].video+'" event_time="'+response.alert_data[i].date+'" status="'+response.alert_data[i].alert_status+'" class="getCamAlertsDXB" style="text-decoration:underline; cursor: pointer; color:#8ec5fd;"> Preview</span> </td></tr>');

            }

        }else {

        }

        var unsortableColumns = [];
        $('#datatable-table').find('thead th').each(function(){
            if ($(this).hasClass( 'no-sort')){
                unsortableColumns.push({"bSortable": false});
            } else {
                unsortableColumns.push(null);
            }
        });

        $("#datatable-table").dataTable({
          order: [],
            "sDom": "<'row'<'col-md-6 hidden-xs'l><'col-md-6'f>r>t<'row'<'col-md-6'i><'col-md-6'p>>",
            "oLanguage": {
                "sLengthMenu": "_MENU_",
                "sInfo": "Showing <strong>_START_ to _END_</strong> of _TOTAL_ entries"
            },
            "oClasses": {
                "sFilter": "pull-right",
                "sFilterInput": "form-control input-transparent ml-sm"
            },
            "aoColumns": unsortableColumns
        });
        $('#datatable-table_length > label > select').css({"background-color": "rgba(51, 51, 51, 0.425)","border": "none"});

    });



    $('#menu-levels-collapse').empty();

    if(JSON.parse(localStorage.getItem('getcam')) == null){

        var a=[];

        localStorage.setItem('EventsDXB',JSON.stringify(a));
        console.log(a);
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "http://"+base_domainip+"/event-app/get_live_cams/saurabh/saurabh",
            "method": "GET",
            "headers": {
                "cache-control": "no-cache",
            }
        }
        $.ajax(settings).done(function (response) {
            console.log(response);

            if(response.live_cams.length>0){
                localStorage.setItem('getcam',JSON.stringify(response.live_cams));
                if(JSON.parse(localStorage.getItem('getcam')) == null){

                }
                else {
                    // var side_bar_dict = JSON.parse(localStorage.getItem('getcam'))
                    var side_bar_dict = JSON.parse(localStorage.getItem('getcam'))
                    var li_DXB;
                    var li_ul_li_a_DXB;
                    var li_ul_li_ul_DXB;
                    var li_ul_li_ul_li_DXB;
                    var li_ul_li_ul_li_a_DXB;
                    var countTest=0;
                    var counttest1=0;
                    for(i=0;i<side_bar_dict.length; i++){
                        countTest+=1;
                        li_DXB= document.createElement("li");
                        li_DXB.className = "panel";
                        var li_a_DXB = document.createElement('a');
                        li_a_DXB.className = "accordion-toggle ";
                        li_a_DXB.setAttribute('data-toggle', "collapse");
                        li_a_DXB.setAttribute('data-parent', "#menu-levels-collapse");
                        li_a_DXB.setAttribute('href',"#sub-menu-"+countTest+"-collapse");
                        li_a_DXB.textContent =side_bar_dict[i].Airport_Name;
                        li_DXB.appendChild(li_a_DXB);
                        var li_ul_DXB=document.createElement('ul');
                        li_ul_DXB.id='sub-menu-'+countTest+'-collapse'
                        li_ul_DXB.className="panel-collapse collapse in";
                        for(j=0;j<side_bar_dict[i].Terminals.length;j++){
                            var li_ul_li_DXB=document.createElement('li');
                            li_ul_li_DXB.className="panel"
                            counttest1+=1;
                            li_ul_li_ul_DXB=document.createElement('ul');
                            li_ul_li_ul_DXB.className ="panel-collapse collapse in";
                            li_ul_li_ul_DXB.id ="sub-menu-1"+counttest1+"-collapse";
                            li_ul_li_a_DXB=document.createElement('a');
                            li_ul_li_a_DXB.className="accordion-toggle ";
                            li_ul_li_a_DXB.setAttribute('data-toggle',"collapse");
                            li_ul_li_a_DXB.setAttribute('data-parent','#sub-menu-'+countTest+'-collapse');
                            li_ul_li_a_DXB.setAttribute('href','#sub-menu-1'+counttest1+'-collapse')
                            li_ul_li_a_DXB.textContent =side_bar_dict[i].Terminals[j].name;
                            li_ul_li_DXB.appendChild(li_ul_li_a_DXB);
                            li_ul_DXB.appendChild(li_ul_li_DXB);
                            li_DXB.appendChild(li_ul_DXB);
                            for(k=0;k<side_bar_dict[i].Terminals[j].camera.length;k++){
                                li_ul_li_ul_li_DXB =document.createElement('li');
                                li_ul_li_ul_li_DXB.id=side_bar_dict[i].Terminals[j].camera[k].cam_name;
                                li_ul_li_ul_li_DXB.className="act";
                                li_ul_li_ul_li_DXB.addEventListener('click', function(e) {
                                    if(window.location.pathname =='/cam') {
                                        // myfun()
                                        localStorage.setItem('camName-DXB',e.target.innerText)
                                        console.log('camchnages');
                                        var abc='#'+e.target.innerText;
                                        $('.act').removeClass('active')
                                        $(abc).addClass('active');
                                        updateCamData(e.target.innerText);
                                        console.log('hey i am here')
                                    }else {
                                        // console.log('hey i am here')
                                        console.log('camchnages')
                                        localStorage.setItem('camName-DXB',e.target.innerText)
                                        // window.location.href="/cam"
                                        updateCamData(e.target.innerText);
                                        // getCamName();
                                    }
                                }, false);
                                li_ul_li_ul_li_a_DXB =document.createElement('a');
                                li_ul_li_ul_li_a_DXB.style.cursor='pointer';
                                // li_ul_li_ul_li_a_DXB.href='/cam';
                                li_ul_li_ul_li_a_DXB.textContent=side_bar_dict[i].Terminals[j].camera[k].cam_name;
                                li_ul_li_ul_li_DXB.appendChild(li_ul_li_ul_li_a_DXB);
                                li_ul_li_ul_DXB.appendChild(li_ul_li_ul_li_DXB)
                                li_ul_li_DXB.appendChild(li_ul_li_ul_DXB);
                                li_ul_DXB.appendChild(li_ul_li_DXB)
                                li_DXB.appendChild(li_ul_DXB)
                            }
                        }
                        // $('#menu-levels-collapse').(li_DXB);
                        $('#menu-levels-collapse').append(li_DXB);

                    }
                    var abc='#'+localStorage.getItem('camName-DXB');
                    console.log(abc)
                    $('.act').removeClass('active')
                    $(abc).addClass('active');

                    updateCamData(abc);
                }


            }else {

            }
        });

    }
    else {
        var a=[];

        localStorage.setItem('EventsDXB',JSON.stringify(a));
        console.log(a);

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "http://"+base_domainip+"/event-app/get_live_cams/saurabh/saurabh",
            "method": "GET",
            "headers": {
                "cache-control": "no-cache",
            }
        }
        $.ajax(settings).done(function (response) {
            console.log(response);

            if(response.live_cams.length>0){
                localStorage.setItem('getcam',JSON.stringify(response.live_cams));
                if(JSON.parse(localStorage.getItem('getcam')) == null){

                }
                else {
                    // var side_bar_dict = JSON.parse(localStorage.getItem('getcam'))
                    var side_bar_dict = JSON.parse(localStorage.getItem('getcam'))
                    var li_DXB;
                    var li_ul_li_a_DXB;
                    var li_ul_li_ul_DXB;
                    var li_ul_li_ul_li_DXB;
                    var li_ul_li_ul_li_a_DXB;
                    var countTest=0;
                    var counttest1=0;
                    for(i=0;i<side_bar_dict.length; i++){
                        countTest+=1;
                        li_DXB= document.createElement("li");
                        li_DXB.className = "panel";
                        var li_a_DXB = document.createElement('a');
                        li_a_DXB.className = "accordion-toggle ";
                        li_a_DXB.setAttribute('data-toggle', "collapse");
                        li_a_DXB.setAttribute('data-parent', "#menu-levels-collapse");
                        li_a_DXB.setAttribute('href',"#sub-menu-"+countTest+"-collapse");
                        li_a_DXB.textContent =side_bar_dict[i].Airport_Name;
                        li_DXB.appendChild(li_a_DXB);
                        var li_ul_DXB=document.createElement('ul');
                        li_ul_DXB.id='sub-menu-'+countTest+'-collapse'
                        li_ul_DXB.className="panel-collapse collapse in";
                        for(j=0;j<side_bar_dict[i].Terminals.length;j++){
                            var li_ul_li_DXB=document.createElement('li');
                            li_ul_li_DXB.className="panel"
                            counttest1+=1;
                            li_ul_li_ul_DXB=document.createElement('ul');
                            li_ul_li_ul_DXB.className ="panel-collapse collapse in";
                            li_ul_li_ul_DXB.id ="sub-menu-1"+counttest1+"-collapse";
                            li_ul_li_a_DXB=document.createElement('a');
                            li_ul_li_a_DXB.className="accordion-toggle ";
                            li_ul_li_a_DXB.setAttribute('data-toggle',"collapse");
                            li_ul_li_a_DXB.setAttribute('data-parent','#sub-menu-'+countTest+'-collapse');
                            li_ul_li_a_DXB.setAttribute('href','#sub-menu-1'+counttest1+'-collapse')
                            li_ul_li_a_DXB.textContent =side_bar_dict[i].Terminals[j].name;
                            li_ul_li_DXB.appendChild(li_ul_li_a_DXB);
                            li_ul_DXB.appendChild(li_ul_li_DXB);
                            li_DXB.appendChild(li_ul_DXB);
                            for(k=0;k<side_bar_dict[i].Terminals[j].camera.length;k++){
                                li_ul_li_ul_li_DXB =document.createElement('li');
                                li_ul_li_ul_li_DXB.id=side_bar_dict[i].Terminals[j].camera[k].cam_name;
                                li_ul_li_ul_li_DXB.className="act";
                                li_ul_li_ul_li_DXB.addEventListener('click', function(e) {
                                    if(window.location.pathname =='/cam') {
                                        // myfun()
                                        localStorage.setItem('camName-DXB',e.target.innerText)
                                        console.log('camchnages')
                                        var abc='#'+e.target.innerText;
                                        $('.act').removeClass('active')
                                        $(abc).addClass('active');
                                        updateCamData(e.target.innerText);
                                        console.log('hey i am here')
                                    }else {
                                        // console.log('hey i am here')


                                        console.log('camchnages')
                                        localStorage.setItem('camName-DXB',e.target.innerText)
                                        updateCamData(localStorage.getItem('camName-DXB'));
                                        // window.location.href="/cam"
                                        // getCamName();
                                    }
                                }, false);
                                li_ul_li_ul_li_a_DXB =document.createElement('a');
                                li_ul_li_ul_li_a_DXB.style.cursor='pointer';
                                li_ul_li_ul_li_a_DXB.href='/cam';
                                li_ul_li_ul_li_a_DXB.textContent=side_bar_dict[i].Terminals[j].camera[k].cam_name;
                                li_ul_li_ul_li_DXB.appendChild(li_ul_li_ul_li_a_DXB);
                                li_ul_li_ul_DXB.appendChild(li_ul_li_ul_li_DXB)
                                li_ul_li_DXB.appendChild(li_ul_li_ul_DXB);
                                li_ul_DXB.appendChild(li_ul_li_DXB)
                                li_DXB.appendChild(li_ul_DXB)
                            }
                        }
                        // $('#menu-levels-collapse').(li_DXB);
                        $('#menu-levels-collapse').append(li_DXB);

                    }

                    if(window.location.pathname =="/cam"){

                        var abc='#'+localStorage.getItem('camName-DXB');
                        console.log(abc)
                        $('.act').removeClass('active')
                        $(abc).addClass('active');
                        updateCamData(localStorage.getItem('camName-DXB'));

                    }


                }


            }else {

            }
        });







    }

};



//click any alert to play alert
$(document).on('click', '.getCamAlertsDXB', function () {
    // data-toggle="modal" data-target="#alertsModal"
    var flight_id=$(this).attr("flight_id");
    var airport=$(this).attr("airport");
    var terminal=$(this).attr("terminal");
    var stand_type=$(this).attr("stand_type");
    var event_name=$(this).attr("event_name");
    var camName=$(this).attr("camName");
    var event_time=$(this).attr("event_time");
    var status=$(this).attr("status");
    var event_url=$(this).attr("event_url");
    var event_url="http://"+base_domainip+"/nginx/"+event_url;

    console.log(event_url);



    // show modal box
    $('#alertsModalCammLogs').modal('show');
    // $('#alertsModal').modal({backdrop: 'static', keyboard: false})

    // empty all alert info.
    $('#airport_Alerts').empty();
    $('#terminal_Alerts').empty();
    $('#stand_type_Alerts').empty();
    $('#event_name_Alerts').empty();
    $('#cam_name_Alerts').empty();
    $('#event_time_Alerts').empty();
    $('#status_Alerts').empty();

    // fill all details for alert info.
    $('#airport_Alerts').append(airport);
    $('#terminal_Alerts').append(terminal);
    $('#stand_type_Alerts').append(stand_type);
    $('#event_name_Alerts').append(event_name);
    $('#cam_name_Alerts').append(camName);
    $('#event_time_Alerts').append(event_time);
    $('#status_Alerts').append(status);

    changeSource(event_url)



});

//update alert video url
function changeSource(url) {
    var getVideo = document.getElementById("videoAlerts");
    var getSource = document.getElementById("videoSourceAlerts");
    getSource .setAttribute("src", url);
    getVideo .load()
    getVideo .play();
}

//close modal box
close_modal = function () {

    document.getElementById('videoAlerts').pause();
}

