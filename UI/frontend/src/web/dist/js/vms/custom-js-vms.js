var video = document.getElementById("video1");
 var volumeRange = document.getElementById('volume');
 var seekbar = document.getElementById('seekbar');

 window.onload = function () {
     video.addEventListener('timeupdate', UpdateTheTime, false);
     video.addEventListener('durationchange', SetSeekBar, false);
     volumeRange.value = video.volume;
 }

 // fires when volume element is changed
 function ChangeVolume() {
     var myVol = volumeRange.value;
     video.volume = myVol;
     if (myVol == 0) {
         video.muted = true;
     } else {
         video.muted = false;
     }
 }

 // fires when page loads, it sets the min and max range of the video
 function SetSeekBar() {
     seekbar.min = 0;
     seekbar.max = video.duration;
 }

 // fires when seekbar is changed
 function ChangeTheTime() {
     video.currentTime = seekbar.value;
 }

 function UpdateTheTime() {
     var sec = video.currentTime;
     var h = Math.floor(sec / 3600);
     sec = sec % 3600;
     var min = Math.floor(sec / 60);
     sec = Math.floor(sec % 60);
     if (sec.toString().length < 2) sec = "0" + sec;
     if (min.toString().length < 2) min = "0" + min;
     document.getElementById('lblTime').innerHTML = h + ":" + min + ":" + sec;
     seekbar.min = video.startTime;
     seekbar.max = video.duration;
     seekbar.value = video.currentTime;
 }

 // fires when Play button is clicked
 function PlayNow() {
     if (video.paused) {
         video.play();
     } else if (video.ended) {
         video.currentTime = 0;
         video.play();
     }
 }

 // fires when Pause button is clicked
 function PauseNow() {
     if (video.play) {
         video.pause();
     }
 }

 // fires when Mute button is clicked
 function MuteNow() {
     if (video.muted) {
         video.muted = false;
         olumeRange.value = video.volume;
     }
     else {
         video.muted = true;
         volumeRange.value = 0;
     }
 }


// time lapsed js start
var current_time = (new Date()).getTime() + ((new Date()).getTimezoneOffset() * 60 * 1000 * -1);
$(document).ready(function () {
(function () {
 $('#version').text('Version: '+ $.fn.TimeSlider.VERSION);
 $('#zoom-slider123').slider({
   min: 1,
   max: 48,
   value: 24,
   step: 0.2,
   slide: function(event, ui) {
     $('#slider123').TimeSlider({hours_per_ruler: ui.value});
   }
 });

 $('#zoom-slider456').slider({
   min: 1,
   max: 48,
   value: 9,
   step: 0.2,
   slide: function(event, ui) {
     $('#slider456').TimeSlider({hours_per_ruler: ui.value});
   }
 });

 $('#slider123').TimeSlider({
   start_timestamp: current_time - 3600 * 12 * 1000,
   init_cells: [
     {
                     '_id': 'c1',
                     'start': (current_time - (3600 * 5.4 * 1000) + 1234),
                     'stop': current_time - 3600 * 3.2 * 1000,
                     'style': {
                         'background-color': '#76C4FF'
                     }
                 },
     {
                     '_id': 'c2',
                     'start': (current_time - (3600 * 2.1 * 1000))
                 }
   ]
 });

 $('#slider456').TimeSlider({
   update_timestamp_interval: 10,
   update_interval: 10,
   show_ms: true,
   hours_per_ruler: 9,
   graduation_step: 6,
   start_timestamp: current_time - 3600 * 7 * 1000,
   init_cells: [
     // {'_id': 'c1', 'start': (current_time - (3600 * 6.2 * 1000) + 5678), 'stop': current_time - 3600 * 4.8 * 1000},
     {'_id': 'c2', 'start': (current_time - (3600 * 3.1 * 1000) + 864), 'stop': current_time}
   ]
 });
 })();
});






// time lapsed js end

// start js for date time picker
$(document).ready( function () {
       $('#picker').dateTimePicker();
       // $('#picker-no-time').dateTimePicker({ showTime: false, dateFormat: 'DD/MM/YYYY', title: 'Select Date'});
   })


   (function ($) {
'use strict';
$.fn.dateTimePicker = function (options) {

 var settings = $.extend({
     selectData: "now",
     dateFormat: "DD-MM-YYYY HH:mm",
     showTime: true,
     locale: 'en',
     positionShift: { top: 20, left: 0},
     title: "Select Date and Time",
     buttonTitle: "Go To"
 }, options);
 moment.locale(settings.locale);
 var elem = this;
 var limitation = {"hour": 23, "minute": 59};
 var mousedown = false;
 var timeout = 800;
 var selectDate = settings.selectData == "now" ? moment() : moment(settings.selectData, settings.dateFormat);
 if (selectDate < moment()) {
     selectDate = moment();
 }
 var startDate = copyDate(moment());
 var lastSelected = copyDate(selectDate);
 return this.each(function () {
     if (lastSelected != selectDate) {
         selectDate = copyDate(lastSelected);
     }
     elem.addClass("dtp_main");
     updateMainElemGlobal();
     //  elem.text(selectDate.format(settings.dateFormat));
     function updateMainElemGlobal() {
         var arrF = settings.dateFormat.split(' ');
         if (settings.showTime && arrF.length != 2) {
             arrF.length = 2;
             arrF[0] = 'DD/MM/YY';
             arrF[1] = 'HH:mm';
         }
         var $s = $('<span>');
         $s.text(lastSelected.format(arrF[0]));
         elem.empty();
         elem.append($s);
         $s = $('<i>');
         $s.addClass('fa fa-calendar ico-size');
         elem.append($s);
         if (settings.showTime) {
             $s = $('<span>');
             $s.text(lastSelected.format(arrF[1]));
             elem.append($s);
             $s = $('<i>');
             $s.addClass('fa fa-clock-o ico-size');
             elem.append($s);
         }
     }
     elem.on('click', function () {
         var $win = $('<div>');
         $win.addClass("dtp_modal-win");
         var $body = $('body');
         $body.append($win);
         var $content = createContent();
         $body.append($content);
         var offset = elem.offset();
         $content.css({top: (offset.top + settings.positionShift.top) + "px", left: (offset.left + settings.positionShift.left) + "px"});
         feelDates(selectDate);
         $win.on('click', function () {
             $content.remove();
             $win.remove();
         })
         if (settings.showTime) {
             attachChangeTime();
             var $fieldTime = $('#field-time');
             var $hour = $fieldTime.find('#d-hh');
             var $minute = $fieldTime.find('#d-mm');
         }

         function feelDates(selectM) {
             var $fDate = $content.find('#field-data');
             $fDate.empty();
             $fDate.append(createMonthPanel(selectM));
             $fDate.append(createCalendar(selectM));
         }

         function createCalendar(selectedMonth) {
             var $c = $('<div>');
             $c.addClass('dtp_modal-calendar');
             for (var i = 0; i < 7; i++) {
                 var $e = $('<div>');
                 $e.addClass('dtp_modal-calendar-cell dtp_modal-colored');
                 $e.text(moment().weekday(i).format('ddd'));
                 $c.append($e);
             }
             var m = copyDate(selectedMonth);
             m.date(1);
             // console.log(m.format('DD--MM--YYYY'));
             // console.log(selectData.format('DD--MM--YYYY'));
             // console.log(m.weekday());
             var flagStart = totalMonths(selectedMonth) === totalMonths(startDate);
             var flagSelect = totalMonths(lastSelected) === totalMonths(selectedMonth);
             var cerDay = parseInt(selectedMonth.format('D'));
             var dayNow = parseInt(startDate.format('D'));
             for (var i = 0; i < 6; i++) {
                 for (var j = 0; j < 7; j++) {
                     var $b = $('<div>');
                     $b.html('&nbsp;');
                     $b.addClass('dtp_modal-calendar-cell');
                     if (m.month() == selectedMonth.month() && m.weekday() == j) {
                         var day = parseInt(m.format('D'));
                         $b.text(day);
                         if (flagStart && day < dayNow) {
                             $b.addClass('dtp_modal-grey');
                         }
                         else if (flagSelect && day == cerDay) {
                             $b.addClass('dtp_modal-cell-selected');
                         }
                         else {
                             $b.addClass('cursorily');
                             $b.bind('click', changeDate);
                         }
                         m.add(1, 'days');
                     }
                     $c.append($b);
                 }
             }
             return $c;
         }

         function changeDate() {

             var $div = $(this);
             selectDate.date($div.text());
             lastSelected = copyDate(selectDate);
             updateDate();
             var $fDate = $content.find('#field-data');
             var old = $fDate.find('.dtp_modal-cell-selected');
             old.removeClass('dtp_modal-cell-selected');
             old.addClass('cursorily');
             $div.addClass('dtp_modal-cell-selected');
             $div.removeClass('cursorily');
             old.bind('click', changeDate);
             $div.unbind('click');
             // console.log(selectDate.format('DD-MM-YYYY'));
         }

         function createMonthPanel(selectMonth) {
             var $d = $('<div>');
             $d.addClass('dtp_modal-months');
             var $s = $('<i></i>');
             $s.addClass('fa fa-angle-left cursorily ico-size-month hov');
             //$s.attr('data-fa-mask', 'fas fa-circle');
             $s.bind('click', prevMonth);
             $d.append($s);
             $s = $('<span>');
             $s.text(selectMonth.format("MMMM YYYY"));
             $d.append($s);
             $s = $('<i></i>');
             $s.addClass('fa fa-angle-right cursorily ico-size-month hov');
             $s.bind('click', nextMonth);
             $d.append($s);
             return $d;
         }

         function close() {
             if (settings.showTime) {
                 lastSelected.hour(parseInt($hour.text()));
                 lastSelected.minute(parseInt($minute.text()));
                 selectDate.hour(parseInt($hour.text()));
                 selectDate.minute(parseInt($minute.text()));
             }
             updateDate();
             $content.remove();
             $win.remove();
         }

         function nextMonth() {
             selectDate.add(1, 'month');
             feelDates(selectDate);
         }

         function prevMonth() {
             if (totalMonths(selectDate) > totalMonths(startDate)) {
                 selectDate.add(-1, 'month');
                 feelDates(selectDate);
             }
         }

         function attachChangeTime() {
             var $angles = $($content).find('i[id^="angle-"]');
             // $angles.bind('click', changeTime);
             $angles.bind('mouseup', function () {
                 mousedown = false;
                 timeout = 800;
             });
             $angles.bind('mousedown', function () {
                 mousedown = true;
                 changeTime(this);
             });
         }

         function changeTime(el) {
             var $el = this || el;
             $el = $($el);
             ///angle-up-hour angle-up-minute angle-down-hour angle-down-minute
             var arr = $el.attr('id').split('-');
             var increment = 1;
             if (arr[1] == 'down') {
                 increment = -1;
             }
             appendIncrement(arr[2], increment);
             setTimeout(function () {
                 autoIncrement($el);
             }, timeout);
         }

         function autoIncrement(el) {
             if (mousedown) {
                 if (timeout > 200) {
                     timeout -= 200;
                 }
                 changeTime(el);
             }
         }

         function appendIncrement(typeDigits, increment) {

             var $i = typeDigits == "hour" ? $hour : $minute;
             var val = parseInt($i.text()) + increment;
             if (val < 0) {
                 val = limitation[typeDigits];
             }
             else if (val > limitation[typeDigits]) {
                 val = 0;
             }
             $i.text(formatDigits(val));
         }

         function formatDigits(val) {

             if (val < 10) {
                 return '0' + val;
             }
             return val;
         }

         function createTimer() {
             var $div = $('<div>');
             $div.addClass('dtp_modal-time-mechanic');
             var $panel = $('<div>');
             $panel.addClass('dtp_modal-append');
             var $i = $('<i>');
             $i.attr('id', 'angle-up-hour');
             $i.addClass('fa fa-angle-up ico-size-large cursorily hov');
             $panel.append($i);
             var $m = $('<span>');
             $m.addClass('dtp_modal-midle');
             $panel.append($m);
             $i = $('<i>');
             $i.attr('id', 'angle-up-minute');
             $i.addClass('fa fa-angle-up ico-size-large cursorily hov');
             $panel.append($i);
             $div.append($panel);

             $panel = $('<div>');
             $panel.addClass('dtp_modal-digits');
             var $d = $('<span>');
             $d.addClass('dtp_modal-digit');
             $d.attr('id', 'd-hh');
             $d.text(lastSelected.format('HH'));
             $panel.append($d);
             $m = $('<span>');
             $m.addClass('dtp_modal-midle-dig');
             $m.html(':');
             $panel.append($m);
             $d = $('<span>');
             $d.addClass('dtp_modal-digit');
             $d.attr('id', 'd-mm');
             $d.text(lastSelected.format('mm'));
             $panel.append($d);
             $div.append($panel);

             $panel = $('<div>');
             $panel.addClass('dtp_modal-append');
             $i = $('<i>');
             $i.attr('id', 'angle-down-hour');
             $i.addClass('fa fa-angle-down ico-size-large cursorily hov');
             $panel.append($i);
             $m = $('<span>');
             $m.addClass('dtp_modal-midle');
             $panel.append($m);
             $i = $('<i>');
             $i.attr('id', 'angle-down-minute');
             $i.addClass('fa fa-angle-down ico-size-large cursorily hov');
             $panel.append($i);
             $div.append($panel);
             return $div;
         }

         function createContent() {
             var $c = $('<div>');
             if (settings.showTime) {
                 $c.addClass("dtp_modal-content");
             }
             else {
                 $c.addClass("dtp_modal-content-no-time");
             }
             var $el = $('<div>');
             $el.addClass("dtp_modal-title");
             $el.text(settings.title);
             $c.append($el);
             $el = $('<div>');
             $el.addClass('dtp_modal-cell-date');
             $el.attr('id', 'field-data');
             $c.append($el);
             if (settings.showTime) {
                 $el = $('<div>');
                 $el.addClass('dtp_modal-cell-time');
                 var $a = $('<div>');
                 $a.addClass('dtp_modal-time-block');
                 $a.attr('id', 'field-time');
                 $el.append($a);
                 var $line = $('<div>');
                 $line.attr('id', 'time-line');
                 $line.addClass('dtp_modal-time-line');
                 $line.text(lastSelected.format(settings.dateFormat));

                 $a.append($line);
                 $a.append(createTimer());
                 var $but = $('<div>');
                 $but.addClass('dpt_modal-button');
                 $but.text(settings.buttonTitle);
                 $but.bind('click', close);
                 $el.append($but);
                 $c.append($el);
             }
             return $c;
         }
         function updateDate() {
             if (settings.showTime) {
                 $('#time-line').text(lastSelected.format(settings.dateFormat));
             }
             updateMainElem();
             elem.next().val(selectDate.format(settings.dateFormat));
             if (!settings.showTime) {
                 $content.remove();
                 $win.remove();
             }
         }

         function updateMainElem() {
             var arrF = settings.dateFormat.split(' ');
             if (settings.showTime && arrF.length != 2) {
                 arrF.length = 2;
                 arrF[0] = 'DD/MM/YY';
                 arrF[1] = 'HH:mm';
             }
             var $s = $('<span>');
             $s.text(lastSelected.format(arrF[0]));
             elem.empty();
             elem.append($s);
             $s = $('<i>');
             $s.addClass('fa fa-calendar ico-size');
             elem.append($s);
             if (settings.showTime) {
                 $s = $('<span>');
                 $s.text(lastSelected.format(arrF[1]));
                 elem.append($s);
                 $s = $('<i>');
                 $s.addClass('fa fa-clock-o ico-size');
                 elem.append($s);
             }
         }

     });

 });

};

function copyDate(d) {
 return moment(d.toDate());
}

function totalMonths(m) {
 var r = m.format('YYYY') * 12 + parseInt(m.format('MM'));
 return r;
}

}(jQuery));
// end js for date time picker


// tooltip js start
$(document).ready(function(){
$('[data-toggle="tooltip"]').tooltip();
});

// tooltip js end





$("#bton").click(function () {
 $(".1frame").css("display", "block");
 $(".2frame").css("display", "none");
 $(".3frame").css("display", "none");
});

$("#bttw").click(function () {
 $(".1frame").css("display", "none");
 $(".2frame").css("display", "block");
 $(".3frame").css("display", "none");

});
$("#bttr").click(function () {
 $(".1frame").css("display", "none");
 $(".2frame").css("display", "none");
 $(".3frame").css("display", "block");

});


//    select dropdown js start

$('input[name=pincode]').focus();



// vms js start
// global variable for the player
var player;

// this function gets called when API is ready to use
function onYouTubePlayerAPIReady() {
 // create the global player from the specific iframe (#video)
 player = new YT.Player('video', {
   events: {
     // call this function when player is ready to use
     'onReady': onPlayerReady
   }
 });
}

function onPlayerReady(event) {

 // bind events
 var playButton = document.getElementById("play-button");
 playButton.addEventListener("click", function () {
   player.playVideo();
 });

 var pauseButton = document.getElementById("pause-button");
 pauseButton.addEventListener("click", function () {
   player.pauseVideo();
 });

 var stopButton = document.getElementById("stop-button");
 stopButton.addEventListener("click", function () {
   player.stopVideo();
 });

}

// Inject YouTube API script
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// vms js end


// vms 2*2 js start

// Get a reference to the video poster image and the lightbox


// vms 2*2 js end

// start js for timeline dragbale

const DATA = [

 {
   id: 1,
   title: "tile2",
   startTime: new Date(Date.UTC(2018, 1, 26, 8, 0, 0)),
   endTime: new Date(Date.UTC(2018, 1, 26, 10, 0, 0))
 }
];

// Mins to pixels ratio
const scheduleState = {
 startTime: new Date(Date.UTC(2018, 1, 26, 7, 45, 0)),
 zoom: 1
}

const settings = {
 tileMargin: 10,
 tileHeight: 20,
 tileTop: 20
};

// Get reference to schedule
const schedule = document.getElementById('schedule');

// Set up event handlers
const btnZoomIn = document.getElementById('btnZoomIn');
const btnZoomOut = document.getElementById('btnZoomOut');

btnZoomIn.addEventListener('click', btnZoomInHandler, false);
btnZoomOut.addEventListener('click', btnZoomOutHandler, false);

render();

function render() {
 renderSchedule();
 renderTimeline();
 updateDate(scheduleState.startTime);
}

function setScheduleEndTime(scheduleState, schedule) {
 if (scheduleState.hasOwnProperty('zoom') === false) {
   throw new Error(`scheduleState does not have zoom property`);
 }
 if (scheduleState.hasOwnProperty('startTime') === false) {
   throw new Error(`scheduleState does not have startTime property`);
 }
 // Check if schedule is a HTMLElement
 if (!(schedule instanceof HTMLElement)) {
   throw new Error('schedule is not an HTMLCollection');
 }

 // Convert pixel width of schedule to minutes using zoom (pixels:mins)
 const scheduleWidthMins = schedule.offsetWidth / scheduleState.zoom;
 // Set scheduleEndTime to start time then add scheduleWidthMins to get end time
 let scheduleEndTime = new Date(scheduleState.startTime);
 // Need to convert scheduleWidthMins to milliseconds, add, create new date.
 scheduleEndTime = new Date(scheduleEndTime.getTime() + new Date(scheduleWidthMins * 60000).getTime());

 return scheduleEndTime;
}

function createTileElement(tileData, schedule) {
 // Check tileData has the properties expected
 if (
   tileData.hasOwnProperty('id') === false ||
   tileData.hasOwnProperty('title') === false ||
   tileData.hasOwnProperty('startTime') === false ||
   tileData.hasOwnProperty('endTime') === false
 ) {
   throw new Error(`tileData (id:${tileData.id}) object does not have required properties`);
 }
 // Check if schedule is a HTMLElement
 if (!(schedule instanceof HTMLElement)) {
   throw new Error('schedule is not an HTMLCollection');
 }
 // check times are Date objects
 if (!(tileData.startTime instanceof Date) || !(tileData.endTime instanceof Date)) {
   throw new Error(`tileData (id:${tileData.id}) expected Date object for time`);
 }

 const tileDiv = document.createElement("div");
 tileDiv.className = "tile";

 // difference from start time in ms
 let left = tileData.startTime - scheduleState.startTime
 let width = tileData.endTime - tileData.startTime

 // to mins
 left /= 60000;
 width /= 60000;


 // convert minutes to pixels with the .zoom scale
 tilePos = {
   left: left * scheduleState.zoom,
   width: width * scheduleState.zoom,
   height: settings.tileHeight,
   top: settings.tileTop
 };

 // Collision Detection of tile
 let scheduleChildren = schedule.children;
 // Array.from() used as a workaround for Edge. Edge does not support
 // HTMLCollection with 'for of'
 if (!(typeof scheduleChildren[Symbol.iterator] === 'function')) {
   scheduleChildren = Array.from(scheduleChildren)
 }

 for (let element of scheduleChildren) {
   if (
     element.offsetLeft < tilePos.left + tilePos.width &&
     element.offsetLeft + element.offsetWidth > tilePos.left &&
     element.offsetTop < tilePos.top + tilePos.height &&
     element.offsetTop + element.offsetHeight > tilePos.top
   ) {
     // Move conflicting tile down
     tilePos.top += element.offsetHeight + settings.tileMargin;
   }
   // collision detected!
   tileDiv.style.top = `${tilePos.top}px`;
 }

 // Set content & tile div absolute positions
 tileDiv.dataset.id = tileData.id;
 tileDiv.innerText = tileData.title;
 tileDiv.style.left = `${tilePos.left}px`;
 tileDiv.style.width = `${tilePos.width}px`;
 tileDiv.style.height = `${tilePos.height}px`;
 tileDiv.style.top = `${tilePos.top}px`;

 return tileDiv;
}

function renderSchedule() {
 // Clear schedule
 schedule.innerHTML = "";

 // Draw schedule grid
 // renderScheduleGrid();

 // Save to scheduleState
 scheduleState.scheduleEndTime = setScheduleEndTime(scheduleState, schedule);

 // Create div for each data
 for (let tileData of DATA) {
   // difference from start time in ms
   const left = tileData.startTime - scheduleState.startTime
   const width = tileData.endTime - tileData.startTime
   const maxWidth = scheduleState.scheduleEndTime - scheduleState.startTime
   if (left + width >= 0 && left <= maxWidth) {
     const tileDiv = createTileElement(tileData, schedule);
     // Add tile to schedule
     schedule.appendChild(tileDiv);
   }
 }
}

function renderScheduleGrid() {

 const grid = document.createDocumentFragment();


 // Convert UTC time in ms to mins
 const startTimeInMins = scheduleState.startTime.getTime() / 60000;
 // Convert pixel width of schedule to minutes using zoom (pixels:mins)
 const scheduleWidthMins = schedule.offsetWidth * scheduleState.zoom;
 // If first time is a whole hour place at 0px
 // otherwise offset by number of mins
 var startX;
 if ((startTimeInMins % 60) === 0) {
   startX = 0;
 } else {
   startX = (60 - (startTimeInMins % 60)) * scheduleState.zoom;
 }

 // 60 minutes * schedule zoom
 const hourSpacing = 60 * scheduleState.zoom;

 // +hourSpacing to make enough room to add leading time 1hr before start
 const timelineWidth = timeline.offsetWidth + hourSpacing;

 // to ensure that only the remain time/width after the first whole hour after
 // scheduleState.startTime is used
 const timelineWidthAdjustedForStartX = timelineWidth - startX;

 // With the remain timeline width work out how many time blocks to create
 const numberOfHourLines = timelineWidthAdjustedForStartX / hourSpacing;

 // Create a hour grid line for each hour
 for (let i = 0; i < numberOfHourLines - 1; i++) {
   const hourLine = createSVGGridLine();
   // console.log(hourLine.width);
   hourLine.style.marginLeft = `${hourSpacing - 5}px`
   grid.appendChild(hourLine);
 }
 grid.firstElementChild.style.marginLeft = `${startX - 2.5}px`;


 schedule.appendChild(grid);

}

function createSVGGridLine() {
 const marginTop = 5;
 const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
 svg.setAttributeNS(null, 'width', '5');
 svg.setAttributeNS(null, 'height', schedule.offsetHeight);
 svg.style.marginTop = `${marginTop}px`;

 const lineElement = document.createElementNS("http://www.w3.org/2000/svg", 'path');
 lineElement.setAttributeNS(null, 'd', `M2.5 3.5v${schedule.offsetHeight - marginTop}`);
 lineElement.setAttributeNS(null, 'stroke', '#4D4D4D');
 lineElement.setAttributeNS(null, 'stroke-linecap', 'square');

 const circleElement = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
 circleElement.setAttributeNS(null, 'cx', '2.5');
 circleElement.setAttributeNS(null, 'cy', '2.5');
 circleElement.setAttributeNS(null, 'r', '2.5');
 circleElement.setAttributeNS(null, 'fill', '#4D4D4D');

 svg.appendChild(lineElement);
 svg.appendChild(circleElement);

 return svg;
}

function btnZoomInHandler(e) {
 e.preventDefault();
 scheduleState.zoom += 0.1;
 render();
}

function btnZoomOutHandler(e) {
 e.preventDefault();
 scheduleState.zoom -= 0.1;
 // Ensure zoom doesn't go less than 0.1 to avoid display issues
 if (scheduleState.zoom < 0.1) {
   scheduleState.zoom = 0.1;
 }
 render();
}

function renderTimeline() {
 // Convert UTC time in ms to mins
 const startTimeInMins = scheduleState.startTime.getTime() / 60000;

 // Get reference to timeline element
 const timeline = document.getElementById('timeline');

 // Clear the timeline
 timeline.innerHTML = "";

 // Convert pixel width of schedule to minutes using zoom (pixels:mins)
 const scheduleWidthMins = schedule.offsetWidth * scheduleState.zoom;

 // If first time is a whole hour place at 0px
 // otherwise offset by number of mins
 var startX;
 var time = new Date(scheduleState.startTime.getTime());
 if ((startTimeInMins % 60) === 0) {
   startX = 0;
   // - 2 hours becuase we will initally add an hour in the for loop and
   // the first time block is going to be an hour before the schedule start
   time.setUTCHours(time.getUTCHours() - 2, 0, 0, 0);
 } else {
   startX = (60 - (startTimeInMins % 60)) * scheduleState.zoom;
   time.setUTCHours(time.getUTCHours() - 1, 0, 0, 0);
 }

 // 60 minutes * schedule zoom
 const timeBlockWidth = 60 * scheduleState.zoom;

 // +timeBlockWidth to make enough room to add leading time 1hr before start
 const timelineWidth = timeline.offsetWidth + timeBlockWidth;

 // to ensure that only the remain time/width after the first whole hour after
 // scheduleState.startTime is used
 const timelineWidthAdjustedForStartX = timelineWidth - startX;

 // With the remain timeline width work out how many time blocks to create
 const numberOfTimeBlocks = timelineWidthAdjustedForStartX / timeBlockWidth;

 // Create a timeBlockElement for each
 for (let i = 0; i < numberOfTimeBlocks; i++) {
   time.setUTCHours(time.getUTCHours() + 1);
   const TimeBlockDiv = createTimeBlockElement(time, timeBlockWidth, startX);
   timeline.appendChild(TimeBlockDiv);
 }
 // Set the first timeblock margin to position entire timeline
 // - timeBlockWidth as start X is position of first schedule time
 // However, the first actual time (normally not visible) block is 1hr before.
 // *1.5 to center the text over the actual time
 timeline.firstElementChild.style.marginLeft = `${startX - timeBlockWidth * 1.5}px`;
}

function createTimeBlockElement(time, timeBlockWidth, startX) {
 // check time is a Date object
 if (!(time instanceof Date)) {
   throw new Error(`time is not time`);
 }

 // Convert pixel width of schedule to minutes using zoom (pixels:mins)
 const scheduleWidthMins = schedule.offsetWidth * scheduleState.zoom;

 // Create a div and add its css class
 const tbDiv = document.createElement('div');
 tbDiv.className = 'timeBlock';

 // Format the hours and minutes strings to display
 var hours, minutes;
 if (time.getUTCHours() < 10) {
   hours = `0${time.getUTCHours()}`;
 } else {
   hours = time.getUTCHours();
 }

 if (time.getUTCMinutes() < 10) {
   minutes = `0${time.getUTCMinutes()}`;
 } else {
   minutes = time.getUTCMinutes();
 }

 // Set the width, calculated in renderTimeline()
 tbDiv.style.width = `${timeBlockWidth}px`;

 // Create spans with repestive classes for hours and minutes
 // Append them to the timeBlock div
 const timeDiv = document.createElement('div');
 timeDiv.className = 'time';
 const hoursSpan = document.createElement('span');
 hoursSpan.className = 'hours';
 hoursSpan.innerText = hours;
 const minutesSpan = document.createElement('span');
 minutesSpan.className = 'minutes';
 minutesSpan.innerText = minutes;
 timeDiv.appendChild(hoursSpan);
 timeDiv.appendChild(minutesSpan);
 tbDiv.appendChild(timeDiv);

 return tbDiv;
}

function updateDate(date) {
 const dateDd = document.getElementById('date-dd');
 dateDd.innerText = date.getUTCDate();

 const ordinalIndicator = document.getElementById('date-ordinalIndicator');

 switch (date.getUTCDate()) {
   case 1:
   case 21:
   case 31:
     ordinalIndicator.innerText = 'st';
     break;
   case 2:
   case 22:
     ordinalIndicator.innerText = 'nd';
     break;
   case 3:
     ordinalIndicator.innerText = 'rd';
     break;
   default:
     ordinalIndicator.innerText = 'th';
 }

 const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
 const dateDdd = document.getElementById('date-ddd');
 dateDdd.innerText = daysOfWeek[date.getUTCDay()];

 const months = ['January', 'Februrary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
 const dateMmmYYYY = document.getElementById('date-mmmYYYY');
 const month = months[date.getUTCMonth()];
 const yyyy = date.getUTCFullYear();
 dateMmmYYYY.innerText = `${month} ${yyyy}`;

}

// Globals for dragging
let lastXPos, dragging;

// Add listeners for mouse, touch and wheel (could use new pointer events)
schedule.addEventListener('mousedown', onMouseDown, false);
schedule.addEventListener('touchstart', onTouchStart, false);
schedule.addEventListener('wheel', onWheelEvent, false);

// wheel event handler. simply scroll by the wheel delta
function onWheelEvent(e) {
 e.preventDefault();
 scrollSchedule(e.deltaX)
}


// Only if left mouse is pressed. Start drag and set up 'ending drag' events
function onMouseDown(e) {
 if (e.button === 0) {
   lastXPos = e.pageX - timeline.offsetLeft;
   dragging = true;
   schedule.addEventListener('mousemove', onMouseDrag, false);
   window.addEventListener('mouseup', stopDrag, false);
 }
}

function onMouseDrag(e) {
 if (dragging) {
   e.stopPropagation();
   scrollSchedule(lastXPos - (e.pageX - timeline.offsetLeft));
   lastXPos = e.pageX - timeline.offsetLeft;
 }
}

function stopDrag(e) {
 dragging = false;
 document.removeEventListener('mousemove', onMouseDrag);
 document.removeEventListener('mouseup', stopDrag);
}

function onTouchStart(e) {
 e.preventDefault();
 if (e.touches.length === 1) {
   lastXPos = e.touches[0].pageX - timeline.offsetLeft;
   dragging = true;
   document.addEventListener('touchmove', onTouchMove, false);
   document.addEventListener('touchend', onTouchEnd, false);
   document.addEventListener('touchcancel', onTouchEnd, false)
 }
}

function onTouchMove(e) {
 event.preventDefault();
 if (dragging && e.touches.length === 1) {
   scrollSchedule(lastXPos - (e.touches[0].pageX - timeline.offsetLeft));
   lastXPos = e.pageX - timeline.offsetLeft;
 }
}

function onTouchEnd(e) {
 event.preventDefault();
 if (event.touches.length === 0) {
   dragging = false;
   document.removeEventListener('touchmove', onTouchMove);
   document.removeEventListener('touchend', onTouchEnd);
   document.removeEventListener('touchcancel', onTouchEnd);
 }
}

function scrollSchedule(dx = 0) {
 const currentMins = scheduleState.startTime.getUTCMinutes();
 scheduleState.startTime.setUTCMinutes(currentMins + dx);
 render();
}






// function addZeros(h,m,s){
//
//     console.log(("0"+difference.hours()).substr(-2) + ":"+("0"+difference.minutes).substr(-2) + ":" +("0"+difference.seconds).substr(-2))
//
//     return   ("0"+h).substr(-2) + ":"+("0"+m).substr(-2) + ":" +("0"+s).substr(-2);
// }
//
//
// addZeros(difference.hours(),difference.minutes(),difference.seconds())
// console.log(addZeros())

// $("#starttime, #endtime").change(calculateTime);
