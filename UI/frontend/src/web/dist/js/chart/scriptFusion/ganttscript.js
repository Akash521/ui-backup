
//Gantt chart function
var intervalchart;
function fusioncharts (){
    $('#chart-gantt').empty();
    $('#chart-gantt').append('<div id='+localStorage.getItem("camName-DXB")+"c"+' style="border-radius: 3px;"></div>')
    $('#chart-gantt').append('<div class="visits-info well-sm" id="optActulTurn" style=" margin: -1px 0px 0px;padding-top: 0px; padding-bottom: 3px; padding: 3px;  ">\n' +

        '                </div>');

    // $('#chart-gantt').prepend('<a data-widgster="fullscreen" title="Full Screen" href="#"><i class="glyphicon glyphicon-resize-full"></i></a>');
    if(typeof intervalchart == "undefined"){

    }else {
        clearInterval(intervalchart);
    }

    $('#fusion1').remove();
    // $('#fusion2').remove();
    $('#fusion3').remove();
    $('body').append("<script id='fusion1' src='js/chart/fusioncharts.js'></script>");
    // $('body').append("<script id='fusion2' src='js/chart/fusioncharts.theme.fusion.js'></script>");
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
        intervalchart = setTimeout(updateGanttChart, 1000);

        function  updateGanttChart (){

            try{
                var json;

                var categorayCAC;

                // json=  [
                //                 //     {
                //                 //         "_id": "ae1c30eb-6564-4a68-b154-050df37d2c00",
                //                 //         "cam_name": "opk",
                //                 //         "end_time": "",
                //                 //         "event_end_time": "",
                //                 //         "event_end_time_mqtt": "",
                //                 //         "event_id": "ae1c30eb-6564-4a68-b154-050df37d2c00",
                //                 //         "event_name": "Truck operation",
                //                 //         "event_start_time": "Wednesday 24 June 2020 16:14:09",
                //                 //         "event_start_time_mqtt": "Y",
                //                 //         "event_time": "Wednesday 24 June 2020 16:14:09",
                //                 //         "operation_date": "06/24/20",
                //                 //         "start_time": 1592995449.8018203,
                //                 //         "truck_id": "ae1c30eb-6564-4a68-b154-050df37d2c00",
                //                 //         "truck_status": "running"
                //                 //     },
                //                 //     {
                //                 //         "_id": "4f7fb2dc-2998-464a-9410-842bc115c3a9",
                //                 //         "cam_name": "opk",
                //                 //         "end_time": 1592996363.0939145,
                //                 //         "event_end_time": "Wednesday 24 June 2020 16:26:53",
                //                 //         "event_end_time_mqtt": "Y",
                //                 //         "event_id": "4f7fb2dc-2998-464a-9410-842bc115c3a9",
                //                 //         "event_name": "Idle",
                //                 //         "event_start_time": "Wednesday 24 June 2020 16:16:30",
                //                 //         "event_start_time_mqtt": "Y",
                //                 //         "operation_date": "06/24/20",
                //                 //         "start_time": 1592995740.7115595,
                //                 //         "truck_id": "ae1c30eb-6564-4a68-b154-050df37d2c00",
                //                 //         "truck_status": "running"
                //                 //     },
                //                 //     {
                //                 //         "_id": "7e347c93-a2df-4874-8450-7361466827f7",
                //                 //         "cam_name": "opk",
                //                 //         "end_time": 1592996363.097883,
                //                 //         "event_end_time": "Wednesday 24 June 2020 16:27:08",
                //                 //         "event_end_time_mqtt": "Y",
                //                 //         "event_id": "7e347c93-a2df-4874-8450-7361466827f7",
                //                 //         "event_name": "Unloading Activity",
                //                 //         "event_start_time": "Wednesday 24 June 2020 16:26:53",
                //                 //         "event_start_time_mqtt": "Y",
                //                 //         "operation_date": "06/24/20",
                //                 //         "start_time": 1592996363.0957565,
                //                 //         "truck_id": "ae1c30eb-6564-4a68-b154-050df37d2c00",
                //                 //         "truck_status": "running"
                //                 //     },
                //                 //     {
                //                 //         "_id": "437c1557-ab2c-4e7d-8506-9b39955126b0",
                //                 //         "cam_name": "opk",
                //                 //         "end_time": "",
                //                 //         "event_end_time": "",
                //                 //         "event_end_time_mqtt": "",
                //                 //         "event_id": "437c1557-ab2c-4e7d-8506-9b39955126b0",
                //                 //         "event_name": "Loading Activity",
                //                 //         "event_start_time": "Wednesday 24 June 2020 16:27:08",
                //                 //         "event_start_time_mqtt": "Y",
                //                 //         "event_time": "Wednesday 24 June 2020 16:27:08",
                //                 //         "operation_date": "06/24/20",
                //                 //         "start_time": 1592996363.0996273,
                //                 //         "truck_id": "ae1c30eb-6564-4a68-b154-050df37d2c00",
                //                 //         "truck_status": "running"
                //                 //     }
                //                 // ];


                if( localStorage.getItem($('li.active').attr('id')) == 'null'){

                    json =[];
                    $('#optActulTurn').empty();
                    // $('#optActulTurn').append('                    <div class="row" style="visibility: hidden">\n' +
                    //     '                        <div class="col-sm-6 col-xs-6">\n' +
                    //     '                            <div class="key" style="padding-top: 0px;"><span class="spantext" style="font-family: \'Open Sans\', sans-serif !important;cursor: default; font-size: 12px; text-anchor: start; font-weight: 100!important;"  id="optimizeTurnTimelabel">Optimized Turnaround Time</span></div>\n' +
                    //     '                            <div class="value" id="optimizeTurnTime" style="font-size: 13px;margin-top: 3px; margin-bottom: 3px; "> 2h 45m 10s</div>\n' +
                    //     '                        </div>\n' +
                    //     '                        <div class="col-sm-6 col-xs-6">\n' +
                    //     '                            <div class="key"><span class="spantext" style="font-family: \'Open Sans\', sans-serif !important;cursor: default; font-size: 12px; text-anchor: start; font-weight: 100!important;" id="actualturnTimelabel" >Actual Turnaround Time </span></div>\n' +
                    //     '                            <div class="value" id="actualturnTime" style="font-size: 13px; margin-top: 3px; margin-bottom: 3px;"> - </div>\n' +
                    //     '                        </div>\n' +
                    //     '\n' +
                    //     '                    </div>');


                }
                else if(localStorage.getItem($('li.active').attr('id')) == null) {

                    json =[];
                    $('#optActulTurn').empty();
                    // $('#optActulTurn').append('                    <div class="row" style="visibility: hidden">\n' +
                    //     '                        <div class="col-sm-6 col-xs-6">\n' +
                    //     '                            <div class="key" style="padding-top: 0px;"><span class="spantext" style="font-family: \'Open Sans\', sans-serif !important;cursor: default; font-size: 12px; text-anchor: start; font-weight: 100!important;"  id="optimizeTurnTimelabel">Optimized Turnaround Time</span></div>\n' +
                    //     '                            <div class="value" id="optimizeTurnTime" style="font-size: 13px;margin-top: 3px; margin-bottom: 3px; "> 2h 45m 10s</div>\n' +
                    //     '                        </div>\n' +
                    //     '                        <div class="col-sm-6 col-xs-6">\n' +
                    //     '                            <div class="key"><span class="spantext" style="font-family: \'Open Sans\', sans-serif !important;cursor: default; font-size: 12px; text-anchor: start; font-weight: 100!important;" id="actualturnTimelabel" >Actual Turnaround Time </span></div>\n' +
                    //     '                            <div class="value" id="actualturnTime" style="font-size: 13px; margin-top: 3px; margin-bottom: 3px;"> - </div>\n' +
                    //     '                        </div>\n' +
                    //     '\n' +
                    //     '                    </div>');


                }
                else {

                    json=JSON.parse(localStorage.getItem($('li.active').attr('id')));

                    $('#optActulTurn').empty();
                    // $('#optActulTurn').append('                    <div class="row">\n' +
                    //     '<div class="col-sm-2 col-xs-6">\n' +
                    //     '                            <div class="key" style="padding-top: 0px;"><span class="spantext" style="font-family: \'Open Sans\', sans-serif !important;cursor: default; font-size: 12px; text-anchor: start; font-weight: 500!important;"  id="optimizeTurnTimelabel">Flight Code</span></div>\n' +
                    //     '                            <div class="value" id="optimizeTurnTime" style="font-size: 13px;margin-top: 3px; margin-bottom: 3px; "> XX XXX</div>\n' +
                    //     '                        </div>\n' +
                    //     '<div class="col-sm-2 col-xs-6">\n' +
                    //     '                            <div class="key" style="padding-top: 0px;"><span class="spantext" style="font-family: \'Open Sans\', sans-serif !important;cursor: default; font-size: 12px; text-anchor: start; font-weight: 500!important;"  id="optimizeTurnTimelabel">ORG</span></div>\n' +
                    //     '                            <div class="value" id="optimizeTurnTime" style="font-size: 13px;margin-top: 3px; margin-bottom: 3px; "> XXX</div>\n' +
                    //     '                        </div>\n' +
                    //     '   <div class="col-sm-2 col-xs-6">\n' +
                    //     '                            <div class="key" style="padding-top: 0px;"><span class="spantext" style="font-family: \'Open Sans\', sans-serif !important;cursor: default; font-size: 12px; text-anchor: start; font-weight: 500!important;"  id="optimizeTurnTimelabel">SIBT</span></div>\n' +
                    //     '                            <div class="value" id="optimizeTurnTime" style="font-size: 13px;margin-top: 3px; margin-bottom: 3px; "> XX:XX/XX</div>\n' +
                    //     '                        </div>\n' +
                    //     '                        <div class="col-sm-3 col-xs-6">\n' +
                    //     '                            <div class="key" style="padding-top: 0px;"><span class="spantext" style="font-family: \'Open Sans\', sans-serif !important;cursor: default; font-size: 12px; text-anchor: start; font-weight: 500!important;"  id="optimizeTurnTimelabel">Optimized Turnaround Time</span></div>\n' +
                    //     '                            <div class="value" id="optimizeTurnTime" style="font-size: 13px;margin-top: 3px; margin-bottom: 3px; "> 1h 45m 10s</div>\n' +
                    //     '                        </div>\n' +
                    //     '                        <div class="col-sm-3 col-xs-6">\n' +
                    //     '                            <div class="key"><span class="spantext" style="font-family: \'Open Sans\', sans-serif !important;cursor: default; font-size: 12px; text-anchor: start; font-weight: 500!important;" id="actualturnTimelabel" >Actual Turnaround Time </span></div>\n' +
                    //     '                            <div class="value" id="actualturnTime" style="font-size: 13px; margin-top: 3px; margin-bottom: 3px;"> - </div>\n' +
                    //     '                        </div>\n' +
                    //     '\n' +
                    //     '                    </div>');



                }


                var d;
                var dDate =new Date().toLocaleString('en-US', {timeZone: 'Asia/Kolkata'});

                var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                var today  = new Date();
                d = new Date(dDate);
                // d.setMinutes(d.getMinutes() +30);

                var hourDateDXb ;
                if (d.getHours() < 10) {
                    hourDateDXb = '0'+d.getHours();
                }else {
                    hourDateDXb = d.getHours();
                }
                var minDateDXb ;
                if (d.getMinutes() < 10) {
                    minDateDXb = '0'+d.getMinutes();
                }else {
                    minDateDXb = d.getMinutes();
                }

                var secDateDXb ;
                if (d.getSeconds() < 10) {
                    secDateDXb = '0'+d.getSeconds();
                }else {
                    secDateDXb = d.getSeconds();
                }

                d = hourDateDXb+':'+minDateDXb+':'+secDateDXb;

                // var item_list=['Parking Area Clear','Aircraft Arriving','Aircraft Parked','Tyre Blocks Applied','Staircase/PBB','Cargo Operation','Fuel Operation','Catering Operation','GPU Operation','AC Operation','WV/LV Operation','Aircraft Towing Away']
                var item_list = [
                    {
                        type :'Truck operation',
                        id : "EMP120"
                    },
                    // {
                    //     type :'Unloading Activity',
                    //     id : "EMP121"
                    // },
                    {
                        type :'Unloading Activity',
                        id : "EMP122"
                    },
                    {
                        type :'Idle',
                        id : "EMP123"
                    }



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
                                topPadding:"11",
                                end:"",
                                fontsize:'8',
                            };

                            var predictJson ={
                                processid: item_list[k].id,
                                height: "3",
                                topPadding:"26",
                                color: "#C0D9D9",
                                fontsize:'8',
                                hAlign:"right",

                            };

                            if (json[i].event_start_time !=''){
                                aobj.start = json[i].event_start_time
                                aobj.operation_type = json[i].event_name
                                // predictJson.start =json[i].predicted_event_start_time;
                                // predictJson.end =json[i].predicted_event_end_time;
                                // var Timepredictstart =new Date(json[i].predicted_event_start_time);
                                // var Timepredictend = new Date(json[i].predicted_event_end_time);
                                // var diff =Timepredictend - Timepredictstart;
                                // var ms = diff;
                                // var min = ms / 1000 / 60;
                                // var r = min % 1;
                                // var sec = Math.floor(r * 60);
                                // // console.log(sec);
                                // if (sec < 10) {
                                //     sec = '0'+sec;
                                // }
                                // min = Math.floor(min);
                                // if(min ==0){
                                //     predictJson.label =sec+'s';
                                //
                                // }else {
                                //     predictJson.label =min+'m '+ sec+'s';
                                //
                                // }
                                // taskDXb.push(predictJson)
                                taskDXb.push(aobj);
                            }
                            if (json[i].event_end_time !=''){
                                for(j=0;j<taskDXb.length;j++){
                                    if ((taskDXb[j].operation_type == json[i].event_name) && taskDXb[j].end==''){
                                        taskDXb[j].end = json[i].event_end_time;
                                        taskDXb[j].status = 'end';
                                        taskDXb[j].color= "#5F9F9F";
                                        var TimeActualstart =new Date(json[i].event_start_time);
                                        var TimeActualend = new Date(json[i].event_end_time);
                                        var diff =TimeActualend - TimeActualstart;
                                        var ms = diff;
                                        var min = ms / 1000 / 60;
                                        var r = min % 1;
                                        var sec = Math.floor(r * 60);
                                        if (sec < 10) {
                                            sec = '0'+sec;
                                        }
                                        min = Math.floor(min);
                                        if(min ==0){
                                            taskDXb[j].label =sec+'s';

                                        }else{
                                            taskDXb[j].label =min+'m '+ sec+'s';

                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                for(m=0;m<json.length;m++){
                    if(json[m].event_name == "Truck operation" && json[m].event_start_time != "" ){
                        startTimeFlight =json[m].event_start_time;
                        var unixTime =new Date(startTimeFlight);
                        unixTime.setMinutes(unixTime.getMinutes() - 1);
                        var testTime= unixTime.toLocaleDateString('en-US',{weekday: 'long'}) + " "+ unixTime.toLocaleDateString('en-US',{day: 'numeric'}) +" "+unixTime.toLocaleDateString('en-US',{month: 'long'})+" "+unixTime.toLocaleDateString('en-US',{year: 'numeric'})+ " "+ unixTime.getHours()+':'+unixTime.getMinutes()+':'+unixTime.getSeconds();
                        test1=testTime;
                        break;
                    }else {
                        var abendtodayDate = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
                        var endtodayDate =new Date(abendtodayDate);
                        endtodayDate.setMinutes(endtodayDate.getMinutes() - 30);
                        startTimeFlight = endtodayDate.toLocaleDateString('en-US',{weekday: 'long'}) + " "+ endtodayDate.toLocaleDateString('en-US',{day: 'numeric'}) +" "+endtodayDate.toLocaleDateString('en-US',{month: 'long'})+" "+endtodayDate.toLocaleDateString('en-US',{year: 'numeric'})+ " "+ endtodayDate.getHours()+':'+endtodayDate.getMinutes()+':'+endtodayDate.getSeconds();
                        test1=startTimeFlight;
                    }
                }


                for(n=0;n<json.length;n++){
                    if(json[n].event_name == "Truck operation" && json[n].event_end_time != ""){
// if(json[m].operation_status == "end"){
                        endTimeFlight =json[n].event_end_time;
                        test2 =endTimeFlight;
                        localStorage.removeItem($('li.active').attr('id'));
                        // localStorage.setItem('cameventarr',JSON.stringify(anc));
                        // $('#eventsDXB').empty();
                        $('#eventsDXB').html('');
                        // $('#camAlertsDXB').empty();
                        $('#eventsDXB').append('<div id="loadingEvent" class="position eventsDXBA" style="text-align:center ">No Events Found</div>')
                        // $('#camAlertsDXB').append('<li id="alertsDXBA" > <div class="position" style="text-align:center ">No Alerts Found</div> </li>');
                        FusionCharts("fusionDXB").dispose();


                        fusioncharts();
                        break;
// }
                    }else {
                        var  ab= new Date().toLocaleString('en-US', {timeZone: 'Asia/Kolkata'});
                        var endtodayDate =new Date(ab);
                        endtodayDate.setMinutes(endtodayDate.getMinutes() +30);
                        var endtodayDateCAC =new Date(ab);
                        endtodayDateCAC.setMinutes(endtodayDateCAC.getMinutes());
                        var hourDateDXb ;
                        if (endtodayDate.getHours() < 10) {
                            hourDateDXb = '0'+endtodayDate.getHours();
                        }else {
                            hourDateDXb = endtodayDate.getHours();
                        }
                        var minDateDXb ;
                        if (endtodayDate.getMinutes() < 10) {
                            minDateDXb = '0'+endtodayDate.getMinutes();
                        }else {
                            minDateDXb = endtodayDate.getMinutes();
                        }

                        var secDateDXb ;
                        if (endtodayDate.getSeconds() < 10) {
                            secDateDXb = '0'+endtodayDate.getSeconds();
                        }else {
                            secDateDXb = endtodayDate.getSeconds();
                        }

                        var EndCurrTime = hourDateDXb+':'+minDateDXb+':'+secDateDXb;

                        var hourDateDXbCAC ;
                        if (endtodayDateCAC.getHours() < 10) {
                            hourDateDXbCAC = '0'+endtodayDateCAC.getHours();
                        }else {
                            hourDateDXbCAC = endtodayDateCAC.getHours();
                        }
                        var minDateDXbCAC ;
                        if (endtodayDateCAC.getMinutes() < 10) {
                            minDateDXbCAC = '0'+endtodayDateCAC.getMinutes();
                        }else {
                            minDateDXbCAC = endtodayDateCAC.getMinutes();
                        }

                        var secDateDXbCAC ;
                        if (endtodayDateCAC.getSeconds() < 10) {
                            secDateDXbCAC = '0'+endtodayDateCAC.getSeconds();
                        }else {
                            secDateDXbCAC = endtodayDateCAC.getSeconds();
                        }

                        var EndCurrTimeCAC = hourDateDXbCAC+':'+minDateDXbCAC+':'+secDateDXbCAC;
                        endTimeFlight =endtodayDate.toLocaleDateString('en-US',{weekday: 'long'}) + " "+ endtodayDate.toLocaleDateString('en-US',{day: 'numeric'}) +" "+endtodayDate.toLocaleDateString('en-US',{month: 'long'})+" "+endtodayDate.toLocaleDateString('en-US',{year: 'numeric'})+ " "+EndCurrTime;
                        test2=endTimeFlight
                        var testCAC =endtodayDateCAC.toLocaleDateString('en-US',{weekday: 'long'}) + " "+ endtodayDateCAC.toLocaleDateString('en-US',{day: 'numeric'}) +" "+endtodayDate.toLocaleDateString('en-US',{month: 'long'})+" "+endtodayDateCAC.toLocaleDateString('en-US',{year: 'numeric'})+ " "+EndCurrTimeCAC;


                        if(JSON.parse(localStorage.getItem($('li.active').attr('id')+"DictCAC")) == null){
                            categorayCAC ={align: "center",
                                category: []};
                        }else {
                            categorayCAC =JSON.parse(localStorage.getItem($('li.active').attr('id')+"DictCAC"))

                            for(iCAC=0;iCAC<categorayCAC.category.length;iCAC++){
                                if(categorayCAC.category[iCAC].end == "" && categorayCAC.category[iCAC].name == "change" || categorayCAC.category[iCAC].statusCAC =="running" && categorayCAC.category[iCAC].name == "change"){
                                    categorayCAC.category[iCAC].end=testCAC;
                                    categorayCAC.category[iCAC].label= getTimeDuration(categorayCAC.category[iCAC].start,testCAC);
                                    categorayCAC.category[iCAC].statusCAC="running";
                                }else {
                                    // categorayCAC.category[iCAC].label= getTimeDuration(categorayCAC.category[iCAC].start,categorayCAC.category[iCAC].end);
                                    // categorayCAC.category[iCAC].end=testCAC;
                                    // categorayCAC.category[0].label= getTimeDuration(categorayCAC.category[0].start,testCAC);

                                }

                            }
                            // localStorage.setItem($('li.active').attr('id')+"DictCAC",JSON.stringify(categorayCAC))

                        }

                    }

                }

                for(j=0;j<taskDXb.length;j++){
                    if (taskDXb[j].end=='' || taskDXb[j].status =='running' ){
                        taskDXb[j].end= today.toLocaleDateString('en-US',{weekday: 'long'}) + " "+ today.toLocaleDateString('en-US',{day: 'numeric'}) +" "+today.toLocaleDateString('en-US',{month: 'long'})+" "+today.toLocaleDateString('en-US',{year: 'numeric'})+ " "+ d;
                        taskDXb[j].status = 'running';
                        taskDXb[j].color='#5ce25a';

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
                    legend: {
                        item: [
                            //     {
                            //     label: "Optimized",
                            //     color: "#C0D9D9",
                            //     isbold: "1",
                            //     fontsize:'5'
                            // },
                            {
                                label: "Actual (Completed)",
                                color: "#5F9F9F",
                                isbold: "1",
                            },{
                                label: "Actual (Running)",
                                color: "#5ce25a",
                                isbold: "1",
                            }

                        ]
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
                                label: "Truck Operation",
                                id: "EMP120",
                                hoverBandColor: "#666c74",
                            },
                            // {
                            //     label: "Unloading Activity",
                            //     id: "EMP121",
                            //     hoverBandColor: "#666c74",
                            // },
                            {
                                label: "Unloading Activity",
                                id: "EMP122",
                                hoverBandColor: "#666c74",
                            },
                            {
                                label: "Idle",
                                id: "EMP123",
                                hoverBandColor: "#666c74",
                            }

                        ]
                    },
                    categories: [
                        {
                            category: [
                                {
                                    start: test1,
// end: endTimeFlight,
// label: startTimeFlight + "--"+ endTimeFlight
// start:"00:00:00",
                                    end: test2,
                                    label: "Time",
                                    hoverBandColor: "#666c74",

// start: "00:00:00",
// end: "23:59:59",
// label: "Time"
                                }
                            ]
                        },{
                            align: "center",
                            category: [
                                {
                                    start: test1,
                                    end: test2,
                                    label: test1 +"  --  "+ test2,
                                    hoverBandColor: "#666c74",
                                    fontsize:'12'
// start: "00:00:00",
// end: "23:59:59",
// label: "24 hour"
                                },
                            ]
                        },
                        categorayCAC
                    ],
                    chart: chartconf
                })


                intervalchart = setTimeout(updateGanttChart, 1000);
                console.log("hello")

            }catch (e) {
                if(e.message == "Uncaught TypeError: Cannot read property 'node' of undefined"){
                    fusioncharts();
                }else {
                    fusioncharts();
                }




            }










        }

        if(FusionCharts('fusionDXB')){
            FusionCharts('fusionDXB').dispose();
        }

        var  myChart = new FusionCharts({
            id:"fusionDXB",
            type: "gantt",
            renderAt: localStorage.getItem('camName-DXB')+"c",
            width: "100%",
            height: "320",
            dataFormat: "json",
            containerBackgroundOpacity: '0',
            dataSource:{
                tasks: {
                    showlabels: "1",
                    color: "#57b955"

                },
                processes: {
                    fontsize: "12",
                    isbold: "1",
                    align: "Center",
                    headertext: "Events",
                    headerfontsize: "14",
                    headervalign: "middle",
                    headeralign: "center",

                },
                categories: [
// {
//    bgcolor: "#262a33",
//    category: [
//        {
//            start: "00:00:00",
//            end: "23:59:59",
//            label: "Time"
//        }
//    ]
//}
                ],
                chart: chartconf
            }
        });
        myChart.render();
    });

    // setTimeout(updateGanttChart, 1000);
}

// updateGanttChart();

function getTimeDuration (start,end){
    var timeDuration;

    var TimepredictstartAlert =new Date(start);
    var TimepredictendAlert = new Date(end);
    var diff =TimepredictendAlert - TimepredictstartAlert;
    var ms = diff;
    var min = ms / 1000 / 60;
    var r = min % 1;
    var sec = Math.floor(r * 60);
    // console.log(sec);
    if (sec < 10) {
        sec = '0'+sec;
    }
    min = Math.floor(min);
    if(min ==0){
        timeDuration =sec+'s';

    }else {
        timeDuration =min+'m '+ sec+'s';

    }

    return timeDuration
}
