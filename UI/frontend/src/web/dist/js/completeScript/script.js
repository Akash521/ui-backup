camdetailsPage =function() {

    var airportLogsData= JSON.parse(localStorage.getItem('logsAirportData'));
    console.log(airportLogsData);

    $('#breadCrumbsLogs').append('<span>Logs &nbsp; <i class="fa fa-angle-right fa-lg" style="position: relative;top: -2px;right: 3px;font-size: 10px;"></i> Cities</span> &nbsp;');
    $('#breadCrumbsLogs').show();




    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "http://"+base_domainip+"/event-app/get_cityplant_alert_count/saurabh/saurabh/"+localStorage.getItem('camDXBLogsID'),
        "method": "GET",
        "headers": {
            "cache-control": "no-cache",
            "postman-token": "8fc0de8d-d948-de36-ee89-0ec4493fb82a"
        }
    }

    $.ajax(settings).done(function (response) {
        console.log(response);
        $('#loading-spinnerFlight').hide();

        // var response= {
        //     cam_flight_count_dict:[]
        // }
        // $('#tble_cc').append('<table id="datatable-table" class="table table-striped table-hover"> <thead> <tr> <th>Id </th> <th>Flight ID</th> <th class="no-sort hidden-xs">Arrival time</th> <th class="hidden-xs">Departure time</th>  <th class="hidden-xs">Events</th> <th class="hidden-xs">Alerts</th> </tr> </thead> <tbody id="allcamsDXB" ></tbody> </table>');
        $('#tble_cc').append('<table id="datatable-table" class="table table-striped table-hover"> <thead> <tr> <th>Id</th> <th>City Name</th> <th class=" hidden-xs">Intrusion</th> <th class="hidden-xs">Mask Violation</th> <th class="hidden-xs"> Social Distancing Violation</th></tr> </thead> <tbody id="allcamsDXB" ></tbody> </table>');
        if(response.cityplant_alert_dict.length>0){
            var count=0;
            for (i = 0; i < response.cityplant_alert_dict.length; i++) {
                count+=1;

                // $("#allcamsDXB").append('<tr><td>'+count+'</td><td><a class="fw-semi-bold getFlightDetails1" href="/flightDetails" getFlightDetails='+response.cam_flight_count_dict[i].flight_id+'  style="cursor: pointer">'+"#" + response.cam_flight_count_dict[i].flight_id + '</a></td> <td class="hidden-xs"> <span class="">'+response.cam_flight_count_dict[i].arrival+'</span> </td> <td class="hidden-xs"><span >'+response.cam_flight_count_dict[i].departure+'</span></td> <td class="hidden-xs">'+response.cam_flight_count_dict[i].event_count+'</td> <td class="hidden-xs">'+response.cam_flight_count_dict[i].alert_count+'</td></tr>');

                $("#allcamsDXB").append('<tr><td>'+count+'</td><td><a class="fw-semi-bold getFlightDetails1" href="/camLogs" get_FlightDXB='+response.cityplant_alert_dict[i].plant+'   style="cursor: pointer">' + response.cityplant_alert_dict[i].plant + '</a></td> <td class="hidden-xs"> <span class="">' + response.cityplant_alert_dict[i].alerts.Intrusion + '</span> </td> <td class="hidden-xs"><span >' + response.cityplant_alert_dict[i].alerts['Mask Violation'] + '</span></td><td class="hidden-xs"> <span class="" style="cursor: pointer;" ><span >'+response.cityplant_alert_dict[i].alerts['Social Distancing Violation']+'</span></span> </td> </tr>');



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


    sidebarlist();


};

//Left sidebar get all live cam function
function sidebarlist() {
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
                // if(JSON.parse(localStorage.getItem('getcam')) == null){

                // }
                // else {
                // var side_bar_dict = JSON.parse(localStorage.getItem('getcam'))
                // var side_bar_dict = JSON.parse(localStorage.getItem('getcam'))
                var side_bar_dict = response.live_cams;
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
                                if(window.location.pathname =='/cam' || window.location.pathname == '/') {
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
                // }


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
                // if(JSON.parse(localStorage.getItem('getcam')) == null){

                // }
                // else {
                // var side_bar_dict = JSON.parse(localStorage.getItem('getcam'))
                // var side_bar_dict = JSON.parse(localStorage.getItem('getcam'))
                var side_bar_dict = JSON.parse(localStorage.getItem('getcam'));
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
                                if(window.location.pathname =='/cam' || window.location.pathname == '/') {
                                    // myfun()
                                    localStorage.setItem('camName-DXB',e.target.innerText)
                                    console.log('camchnages')
                                    var abc='#'+e.target.innerText;
                                    $('.act').removeClass('active')
                                    $(abc).addClass('active');
                                    // clearInterval(intervalchart);
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

                if(window.location.pathname =="/cam" || window.location.pathname == '/'){
                    var abc='#'+localStorage.getItem('camName-DXB');
                    console.log(abc)
                    $('.act').removeClass('active')
                    $(abc).addClass('active');
                    updateCamData(localStorage.getItem('camName-DXB'));





                }


                // }


            }else {

            }
        });







    }

}

//strored flight details in local storage
$(document).on('click', '.getFlightDetails1', function () {
    // var flight_nameDXB=$(this).attr("get_FlightDXB");
    // localStorage.setItem('flightDXBLogsID',flight_nameDXB);
    var cityAreaName=$(this).attr("get_FlightDXB");
    localStorage.setItem('cityAreaName',cityAreaName);

});

//show specific flight details in logs with ganttchart,events and alerts
flightDetailsPage=function () {

        var airportLogsData= JSON.parse(localStorage.getItem('logsAirportData'));
        console.log(airportLogsData);




        $('#breadCrumbsLogs').append('<span>Logs &nbsp; <i class="fa fa-angle-right fa-lg" style="position: relative;top: -2px;right: 3px;font-size: 10px;"></i> '+airportLogsData.aircraft_stand+'</span> &nbsp;<i class="fa fa-angle-right fa-lg" style="position: relative;top: -2px;right: 3px;font-size: 10px;"></i> <span>'+localStorage.getItem('flightDXBLogsID')+'</span>');
        $('#breadCrumbsLogs').show();


        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "http://"+base_domainip+"/event-app/get_cam_alerts/saurabh/saurabh/"+localStorage.getItem('flightDXBLogsID'),
            "method": "GET",
            "headers": {
                "cache-control": "no-cache",
                "postman-token": "8fc0de8d-d948-de36-ee89-0ec4493fb82a"
            }
        }

        $.ajax(settings).done(function (response) {
            console.log(response);
            var test=response
            if(test.flight_alerts.length>0){
                for(i=0;i<test.flight_alerts.length;i++){
                    console.log(test.flight_alerts[i]);
                    $('#camAlertsDXB').append('<li style="margin: 0 -10px;"  class="getAlertData" flight_id="'+test.flight_alerts[i].flight_id+'" airport="'+test.flight_alerts[i].airport+'"  terminal="'+test.flight_alerts[i].terminal+'"  stand_type="'+test.flight_alerts[i].stand_type+'" camName="'+test.flight_alerts[i].cam_name+'"  camera_id="'+test.flight_alerts[i].cam_name+'"  event_name="'+test.flight_alerts[i].alert_name+'" event_url="'+test.flight_alerts[i].alert_url+'" event_time="'+test.flight_alerts[i].alert_time+'" status="'+test.flight_alerts[i].alert_status+'"> <img src='+"http://"+localStorage.getItem('DXB_ip')+"/nginx/"+test.flight_alerts[i].thumbnail+' alt="" class="pull-left img-circle"/> <div class="news-item-info"> <div class="name"><a href="#">'+test.flight_alerts[i].alert_name+'</a></div> <div class="position">'+'Aircraft Stand: E8</div> <div class="time" style="font-size: 11px;">Time: '+test.flight_alerts[i].alert_time+'</div> </div> </li>');
                }

            }else {
                $('#camAlertsDXB').append('<li > <div class="position" style="text-align:center ">No Alerts Found</div> </li>');
            }
        });


        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "http://"+base_domainip+"/event-app/get_flight_events/saurabh/saurabh/"+localStorage.getItem('flightDXBLogsID'),
            "method": "GET",
            "headers": {
                "cache-control": "no-cache",
                "postman-token": "8fc0de8d-d948-de36-ee89-0ec4493fb82a"
            }
        }

        $.ajax(settings).done(function (response) {
            console.log(response);
            for(p=0;p<response.graph_event_data.length;p++){
                if(response.graph_event_data[p].event_name == "PBB"){
                    response.graph_event_data[p].event_name ="PBS"
                }

            }

            localStorage.setItem('logsdata',JSON.stringify(response.graph_event_data));

            for(jh=0;jh<response.graph_event_data.length;jh++){
                if(response.graph_event_data[jh].event_name == "Parking Area Clear"){
                    var flightArrivalTime = response.graph_event_data[jh].event_start_time;
                    localStorage.setItem('flightArrivalTime',flightArrivalTime)
                }

                if(response.graph_event_data[jh].event_name == "Aircraft Towing Away" ){
                    var flightDepartureTime = response.graph_event_data[jh].event_end_time;
                    localStorage.setItem('flightDepartureTime',flightDepartureTime)
                }

            };
            for(j=0;j<response.event_data.length;j++){



                if(response.event_data.length >0 ){

                    var uniqueArr=['Parking Area Clear','Aircraft Arriving','Aircraft Parked','Tyre Blocks Applied','Aircraft Towing Away'];

                    // if(uniqueArr.includes(response.flight_events[j].operation_type)){
                    //     if(response.flight_events[j].operation_status != "end"){
                    //
                    //
                    //         $('#eventsDXB').prepend('<section class="feed-item "  style="border-top: 1px solid rgb(95, 100, 104); padding: 10px 0px 0px; width: 95%;"> <div class="icon pull-left"> <i class="fa fa-check color-green"></i> </div> <div class="feed-item-body"> <div class="text"> '+response.flight_events[j].event_name+' at '+response.flight_events[j].event_time+'</div> <div class="time pull-left" style="visibility: hidden"> 10 h </div> </div> </section>')
                    //     }
                    //
                    //
                    // }
                    // else {
                    //     $('#eventsDXB').prepend('<section class="feed-item "  style="border-top: 1px solid rgb(95, 100, 104); padding: 10px 0px 0px; width: 95%;"> <div class="icon pull-left"> <i class="fa fa-check color-green"></i> </div> <div class="feed-item-body"> <div class="text"> '+response.flight_events[j].event_name+' at '+response.flight_events[j].event_time+'</div> <div class="time pull-left" style="visibility: hidden"> 10 h </div> </div> </section>')
                    //
                    // }

                    if(uniqueArr.includes(response.event_data[j].event_name)){
                        if(response.event_data[j].event_start_time != "" && response.event_data[j].event_end_time == "" ){
                            //
                            //
                            $('#eventsDXB').prepend('<section class="feed-item "  style="border-top: 1px solid rgb(95, 100, 104); padding: 10px 0px 0px; width: 95%;"> <div class="icon pull-left"> <i class="fa fa-check color-green"></i> </div> <div class="feed-item-body"> <div class="text"> ' + response.event_data[j].event_name + ' at ' + response.event_data[j].event_start_time + '</div> <div class="time pull-left" style="visibility: hidden"> 10 h </div> </div> </section>')
                        }
                        //
                        //
                    }
                    else {
                        if(response.event_data[j].event_start_time !="" && response.event_data[j].event_end_time == "" ){

                            $('#eventsDXB').prepend('<section class="feed-item "  style="border-top: 1px solid rgb(95, 100, 104); padding: 10px 0px 0px; width: 95%;"> <div class="icon pull-left"> <i class="fa fa-check color-green"></i> </div> <div class="feed-item-body"> <div class="text"> ' + response.event_data[j].event_name + ' Started at ' + response.event_data[j].event_start_time + '</div> <div class="time pull-left" style="visibility: hidden"> 10 h </div> </div> </section>')

                        }

                        if(response.event_data[j].event_start_time !="" && response.event_data[j].event_end_time != "" ){

                            $('#eventsDXB').prepend('<section class="feed-item "  style="border-top: 1px solid rgb(95, 100, 104); padding: 10px 0px 0px; width: 95%;"> <div class="icon pull-left"> <i class="fa fa-check color-green"></i> </div> <div class="feed-item-body"> <div class="text"> ' + response.event_data[j].event_name + ' Ended at ' + response.event_data[j].event_end_time + '</div> <div class="time pull-left" style="visibility: hidden"> 10 h </div> </div> </section>')

                        }

                    }


                    // $('#eventsDXB').prepend('<section class="feed-item "  style="border-top: 1px solid rgb(95, 100, 104); padding: 10px 0px 0px; width: 95%;"> <div class="icon pull-left"> <i class="fa fa-check color-green"></i> </div> <div class="feed-item-body"> <div class="text"> '+response.event_data[l].event_name+' at '+response.event_data[l].event_time+'</div> <div class="time pull-left" style="visibility: hidden"> 10 h </div> </div> </section>')



                }else {
                    $('#eventsDXB').empty();
                    $('#eventsDXB').append('<div id="loadingEvent" class="position" style="text-align:center ">No Events Found</div>')
                }


            }


        });

    sidebarlist();
    fusioncharts();






}


//clcik on alert to play video of that alert
$(document).on('click', '.getAlertData', function () {
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
    var event_url="http://"+localStorage.getItem('DXB_ip')+"/nginx/"+event_url;

    console.log(event_url);



    // show modal box
    $('#alertsModal').modal('show');
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

//update alert usrl to play video
function changeSource(url) {
    var getVideo = document.getElementById("videoAlerts");
    var getSource = document.getElementById("videoSourceAlerts");
    getSource .setAttribute("src", url);
    getVideo .load()
    getVideo .play();
}

//close modal box if any audio in that modal its pause the video
close_modal = function () {

    document.getElementById('videoAlerts').pause();
}

//make ganttchart on flight details with flight id
function fusioncharts (){
    $('#chart-gantt').empty();
    $('#chart-gantt').append('<div id="chart-container" style="background-color: rgba(51, 51, 51, 0.425)!important;border-radius: 3px;"></div>')
    if(typeof intervalchart == "undefined"){

    }else {
        clearInterval(intervalchart);
    }

    $('#fusion1').remove();
    $('#fusion2').remove();
    $('#fusion3').remove();
    $('body').append("<script id='fusion1' src='js/chart/fusioncharts.js'></script>");
    $('body').append("<script id='fusion2' src='js/chart/fusioncharts.theme.fusion.js'></script>");
    $('body').append("<script id='fusion3' src='js/chart/fusioncharts.theme.candy.js'></script>");


    var head= document.getElementsByTagName('head')[0];
    var ss = document.createElement("link");
    ss.type = "text/css";
    ss.rel = "stylesheet";
    ss.href = "js/chart/fusion.css";
    head.appendChild(ss);


    console.log('loaded')

    // var update_task_end_flags = Array(taskDXb.length).fill(0);
    var countnum=1;
    var test1;
    var test2;
    var fusionTimeout;

    FusionCharts.ready(function() {
        var chartconf={
            dateformat: "dd/mm/yyyy",
            outputdateformat: "dd/mm/yyyy hh12:mn:ss ampm",
            canvasborderalpha: "40",
            ganttlinealpha: "50",
            theme: "candy",
        }
        // clearInterval(intervalchart);
        setTimeout(updateGanttChart, 3000);
        function  updateGanttChart (){

            var json;

            if(JSON.parse(localStorage.getItem('logsdata'))== null){
                json =[];

            }else {
                json=JSON.parse(localStorage.getItem('logsdata'));

            }
            console.log(json)

            var d = Date.now();

            var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            var today  = new Date();
            d = new Date(d);
            d = d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();

            // var item_list=['Parking Area Clear','Aircraft Arriving','Aircraft Parked','Tyre Blocks Applied','Staircase/PBB','Cargo Operation','Fuel Operation','Catering Operation','GPU Operation','AC Operation','WV/LV Operation','Aircraft Towing Away']
            var item_list = [
                {
                    type :'Parking Area Clear',
                    id : "EMP120"
                },
                {
                    type :'Aircraft Arriving',
                    id : "EMP121"
                },
                {
                    type :'Aircraft Parked',
                    id : "EMP122"
                },
                {
                    type :'Tyre Blocks Applied',
                    id : "EMP123"
                },
                {
                    type :'PBS',
                    id : "EMP124"
                },
                {
                    type :'Cargo Operation',
                    id : "EMP125"
                },{
                    type :'Fuel Operation',
                    id : "EMP126"
                },{
                    type :'Catering Operation',
                    id : "EMP127"
                },{
                    type :'GPU Operation',
                    id : "EMP128"
                },{
                    type :'AC Operation',
                    id : "EMP129"
                },{
                    type :'WV/LV Operation',
                    id : "EMP130"
                },{
                    type :'Aircraft Towing Away',
                    id : "EMP131"
                },


            ]
            var operation_counter=Array(item_list.length).fill(0);

            var startTimeFlight;
            var endTimeFlight;
            // console.log(json)
            var taskDXb=[];
            for(k=0;k<item_list.length;k++){
                for(i=0;i<json.length;i++){

                    if(json[i].event_name==item_list[k].type ){
                        var aobj ={
                            processid: item_list[k].id,
                            height: "8",
                            topPadding:"10",
                            end:""
                        };
                        if (json[i].event_start_time !=''){
                            aobj.start = json[i].event_start_time
                            aobj.operation_type = json[i].event_name
                            taskDXb.push(aobj);
                        }
                        if (json[i].event_end_time !=''){
                            for(j=0;j<taskDXb.length;j++){
                                if ((taskDXb[j].operation_type == json[i].event_name) && taskDXb[j].end==''){
                                    taskDXb[j].end = json[i].event_end_time;
                                    taskDXb[j].status = 'end'
                                }
                            }
                        }
                    }
                }
            }
            // console.log(taskDXb);



            for(m=0;m<json.length;m++){
                if(json[m].event_name == "Parking Area Clear" && json[m].event_start_time != "" ){
                    startTimeFlight =json[m].event_start_time;
                    test1=startTimeFlight;
                    break;
                }else {
                    var endtodayDate = new Date();
                    endtodayDate.setMinutes(endtodayDate.getMinutes() - 30);
                    startTimeFlight = endtodayDate.toLocaleDateString('en-US',{weekday: 'long'}) + " "+ endtodayDate.toLocaleDateString('en-US',{day: 'numeric'}) +" "+endtodayDate.toLocaleDateString('en-US',{month: 'long'})+" "+endtodayDate.toLocaleDateString('en-US',{year: 'numeric'})+ " "+ endtodayDate.getHours()+':'+endtodayDate.getMinutes()+':'+endtodayDate.getSeconds();
                    test1=startTimeFlight
                }
            }





            for(j=0;j<taskDXb.length;j++){
                if (taskDXb[j].end=='' || taskDXb[j].status =='running' ){
                    taskDXb[j].end= today.toLocaleDateString('en-US',{weekday: 'long'}) + " "+ today.toLocaleDateString('en-US',{day: 'numeric'}) +" "+today.toLocaleDateString('en-US',{month: 'long'})+" "+today.toLocaleDateString('en-US',{year: 'numeric'})+ " "+ d;
                    taskDXb[j].status = 'running'

                }
            }
            // console.log(taskDXb);

// console.log(taskDXb);




            myChart.setJSONData({
                tasks: {
                    showlabels: "1",
                    color: "#57b955",
                    task: taskDXb
                },
                processes: {
                    fontsize: "12",
                    isbold: "1",
                    align: "Center",
                    headertext: "Events",
                    headerfontsize: "14",
                    headervalign: "middle",
                    headeralign: "center",
                    headerbgcolor:"#262a33",
                    process: [
                        {
                            label: "Parking Area Clear",
                            id: "EMP120"
                        },
                        {
                            label: "Aircraft Arriving",
                            id: "EMP121"
                        },
                        {
                            label: "Aircraft Parked",
                            id: "EMP122"
                        },
                        {
                            label: "Tyre block Applied",
                            id: "EMP123"
                        },
                        {
                            label: "PBS/PBB Connected",
                            id: "EMP124"
                        },
                        {
                            label: "Cargo Operation",
                            id: "EMP125"
                        },
                        {
                            label: "Fuel Operation",
                            id: "EMP126"
                        },
                        {
                            label: "Catering operation",
                            id: "EMP127"
                        },
                        {
                            label: "GPU Operation",
                            id: "EMP128"
                        },
                        {
                            label: "AC Operation",
                            id: "EMP129"
                        },
                        {
                            label: "WV/LV Operation",
                            id: "EMP130"
                        },
                        {
                            label: "Aircraft Towing Away",
                            id: "EMP131"
                        }

                    ]
                },
                categories: [
                    {
                        bgcolor: "#262a33",
                        category: [
                            {
                                start: localStorage.getItem('flightArrivalTime'),
                                end: localStorage.getItem('flightDepartureTime'),
                                label: "Time"
                            }
                        ]
                    }
                ],
                chart: chartconf
            })


            // setTimeout(updateGanttChart, 3000);

        }
        if(FusionCharts('fusionDXB'))
            FusionCharts('fusionDXB').dispose();
        var  myChart = new FusionCharts({
            id:"fusionDXB",
            type: "gantt",
            renderAt: "chart-container",
            width: "100%",
            height: "560",
            dataFormat: "json",
            containerBackgroundOpacity: '0'
        });
        myChart.render();
    });
}
