if(JSON.parse(localStorage.getItem('getcam')) == null){

    var a=[];

    // localStorage.setItem('EventsDXB',JSON.stringify(a));
    // console.log(a);
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
                li_a_DXB.textContent =side_bar_dict[i].city;
                li_DXB.appendChild(li_a_DXB);
                var li_ul_DXB=document.createElement('ul');
                li_ul_DXB.id='sub-menu-'+countTest+'-collapse'
                li_ul_DXB.className="panel-collapse collapse in";
                for(j=0;j<side_bar_dict[i].plant.length;j++){
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
                    li_ul_li_a_DXB.textContent =side_bar_dict[i].plant[j].name;
                    li_ul_li_DXB.appendChild(li_ul_li_a_DXB);
                    li_ul_DXB.appendChild(li_ul_li_DXB);
                    li_DXB.appendChild(li_ul_DXB);
                    for(k=0;k<side_bar_dict[i].plant[j].camera.length;k++){
                        li_ul_li_ul_li_DXB =document.createElement('li');
                        li_ul_li_ul_li_DXB.id=side_bar_dict[i].plant[j].camera[k].cam_name;
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
                        li_ul_li_ul_li_a_DXB.textContent=side_bar_dict[i].plant[j].camera[k].cam_name;
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
                li_a_DXB.textContent =side_bar_dict[i].city;
                li_DXB.appendChild(li_a_DXB);
                var li_ul_DXB=document.createElement('ul');
                li_ul_DXB.id='sub-menu-'+countTest+'-collapse'
                li_ul_DXB.className="panel-collapse collapse in";
                for(j=0;j<side_bar_dict[i].plant.length;j++){
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
                    li_ul_li_a_DXB.textContent =side_bar_dict[i].plant[j].name;
                    li_ul_li_DXB.appendChild(li_ul_li_a_DXB);
                    li_ul_DXB.appendChild(li_ul_li_DXB);
                    li_DXB.appendChild(li_ul_DXB);
                    for(k=0;k<side_bar_dict[i].plant[j].camera.length;k++){
                        li_ul_li_ul_li_DXB =document.createElement('li');
                        li_ul_li_ul_li_DXB.id=side_bar_dict[i].plant[j].camera[k].cam_name;
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
                        li_ul_li_ul_li_a_DXB.textContent=side_bar_dict[i].plant[j].camera[k].cam_name;
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

        }else {
            localStorage.removeItem('getcam');

        }
    });
}




var settings = {
    "async": true,
    "crossDomain": true,
    "url": "http://"+base_domainip+"/event-app/get_priority/s/s",
    "method": "GET",
    "headers": {
        "cache-control": "no-cache",
        "postman-token": "d010ca6f-b906-d966-e9a4-4cd00649d9c8"
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);

    var testJson=response;