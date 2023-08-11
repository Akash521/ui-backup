var videoId = 'my_video_playback_html5_api';
var scaleFactor = 0.25;
var snapshots = [];
var cropBoolean=false;
var imageCropper = {

    ctx: null,

    image: null,

    click: false,

    downPointX: 100,

    downPointY: 100,

    lastPointX: 0,

    lastPointY: 0,

    hoverBoxSize: 5,

    cropedFile: null,

    resize: false,

    canvasBackgroundColor: "#FFFFFF",

    init: function() {


      // $('#open-modal-snap').modal('show');
        // var video_screen = document.getElementById('my_video_playback_html5_api');
        // video_screen.pause();
      document.getElementById("cropBttn").onclick = this.cropImage.bind(this);
        var video = document.getElementById(videoId);
        var output = document.getElementById('output');

        cropBoolean=false;
        var canvas = this.initCanvas(video, scaleFactor);
        console.log(canvas);
        // canvas.onclick = function() {
        //     window.open(this.toDataURL(image/jpg));
        // };
        // snapshots.unshift(canvas);
        // output.innerHTML = '';
        // for (var i = 0; i < 4; i++) {
            output.appendChild(canvas);
        // }
        // this.ctx = document.getElementById("panel").getContext("2d");
        // var imageUploader = document.getElementById('imageLoader');
        // this.initCanvas();
        // document.getElementById("cropBttn").onclick = this.cropImage.bind(this);

    },

    initCanvas: function(video, scaleFactor) {
      $('#output').empty();
      $('.cropDeactive').hide()
      $('.cropActive').show()

      console.log(scaleFactor)

        if (scaleFactor == null) {
            scaleFactor = 1;
        }
        this.w = video.videoWidth * scaleFactor;
        this.h = video.videoHeight * scaleFactor;
        $('#canv2').remove();
        var canvas = document.createElement('canvas');
        canvas.setAttribute('id','canv2')
        canvas.width = 1320;
        canvas.height = 620;
        this.ctx = canvas.getContext('2d');
        this.ctx.drawImage(document.getElementById(videoId), 0, 0,1320,620);

        // ctx.drawImage(video, 0, 0, w, h);

        // this.reDrawCanvas();
        return canvas;
        // this.image = new Image();
        // this.image.setAttribute('crossOrigin', 'anonymous'); //optional,  it is needed only if your image is not avalible on same domain.
        // this.image.src = "https://image.shutterstock.com/image-photo/mountains-under-mist-morning-amazing-260nw-1725825019.jpg";
        // this.image.onload = function() {
        //     this.ctx.canvas.width = this.image.width;
        //     this.ctx.canvas.height = this.image.height;
        //     this.reDrawCanvas();
        //     this.initEventsOnCanvas();
        // }.bind(this);
    },
    initTakeSnapchot:function(){
      $('.cropActive').hide();
      $('.cropDeactive').show();
      var video = document.getElementById(videoId);
      var output = document.getElementById('output');
      var canvas = this.takeSnapshot(video, scaleFactor);
      output.appendChild(canvas);

    },

    takeSnapshot: function(video, scaleFactor) {
        // cropImageCoord = true;
        cropBoolean=true;
        $('#output').empty();
        if (scaleFactor == null) {
            scaleFactor = 1;
        }
        var canvas = document.createElement('canvas');
        canvas.setAttribute('id','canv2')
        canvas.width = 1320;
        canvas.height = 620;

        this.ctx = canvas.getContext('2d');
        this.reDrawCanvas();
        this.initEventsOnCanvas();
        return canvas;


    },

    // cropFunction : function(){
    //     // $("#canv2").css({ "opacity" :"0.4", "background-color" :"Black"});
    //
    //     cropBoolean=true;
    //     this.initEventsOnCanvas();
    //
    //
    // },

    /**
     * Initlize mousedown and mouseup event, third brother of this type of event, onmousemove, will be set little letter.
     *
     */
    initEventsOnCanvas: function() {
      console.log(this.onMouseDown.bind(this))
        this.ctx.canvas.onmousedown = this.onMouseDown.bind(this);
        this.ctx.canvas.onmouseup = this.onMouseUp.bind(this);
    },

    /**
     * This event is bit tricky!
     * Normal task of this method is to pin point the starting point, from where we will  strat making the selectin box.
     * However, it work diffrently if user is hover over the resize boxes
     *
     */
    onMouseDown: function(e) {
        var loc = this.windowToCanvas(e.clientX, e.clientY);
        console.log()
        e.preventDefault();
        this.click = true;
        if (!this.resize) {
            this.ctx.canvas.onmousemove = this.onMouseMove.bind(this);
            this.downPointX = loc.x;
            this.downPointY = loc.y;
            this.lastPointX = loc.x;
            this.lastPointY = loc.y;
        }
    },

    /**
     * register normal movement, with click but no re-size.
     */
    onMouseMove: function(e) {
        e.preventDefault();
        if (this.click) {
            var loc = this.windowToCanvas(e.clientX, e.clientY);
            this.lastPointX = loc.x;
            this.lastPointY = loc.y;
            this.reDrawCanvas();
        }
    },

    onMouseUp: function(e) {
        e.preventDefault();
        this.ctx.canvas.onmousemove = this.onImageResize.bind(this);
        this.click = false;
    },

    reDrawCanvas: function() {
        this.clearCanvas();
        this.drawImage();
        this.drawSelRect();
        // this.drawResizerBox();
    },

    clearCanvas: function() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        // this.ctx.fillStyle = this.canvasBackgroundColor;
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    },

    /**
     * Draw image on canvas.
     */
    drawImage: function() {
        // console.log(video+" "+this.w +" "+ this.h)
        this.ctx.drawImage(document.getElementById(videoId), 0, 0,1320,620);
    },

    /**
     * Draw selection box on canvas
     */
    drawSelRect: function() {
        // this.ctx.strokeStyle = '#000000';
        // this.ctx.lineWidth = 1;
        // this.ctx.strokeRect(this.downPointX, this.downPointY, (this.lastPointX - this.downPointX), (this.lastPointY - this.downPointY));
        this.ctx.strokeStyle = '#fff';
        this.ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
        this.ctx.setLineDash([30]);
        this.ctx.lineWidth = 1;
        this.ctx.fillRect(this.downPointX, this.downPointY, (this.lastPointX - this.downPointX), (this.lastPointY - this.downPointY));

        this.ctx.strokeRect(this.downPointX, this.downPointY, (this.lastPointX - this.downPointX), (this.lastPointY - this.downPointY));
    },

    /**
     * This method take care of resizeing the selection box.
     * It does so by looking on (click == true and hover on resize box == true)
     * if both are true, it adjust the resize.
     *
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    onImageResize: function(e) {
        var centerPointX = (this.lastPointX + this.downPointX) / 2;
        var centerPointY = (this.lastPointY + this.downPointY) / 2;
        var loc = this.windowToCanvas(e.clientX, e.clientY);
        this.ctx.fillStyle = '#FF0000';
        this.ctx.lineWidth = 1;
        // if (this.isResizeBoxHover(loc, centerPointX, this.downPointY)) {
        //     if (this.click) {
        //         this.downPointY = loc.y;
        //         this.reDrawCanvas();
        //     }
        // } else if (this.isResizeBoxHover(loc, this.lastPointX, centerPointY)) {
        //     if (this.click) {
        //         this.lastPointX = loc.x;
        //         this.reDrawCanvas();
        //     }
        // } else if (this.isResizeBoxHover(loc, centerPointX, this.lastPointY)) {
        //     if (this.click) {
        //         this.lastPointY = loc.y;
        //         this.reDrawCanvas();
        //     }
        // } else if (this.isResizeBoxHover(loc, this.downPointX, centerPointY)) {
        //     if (this.click) {
        //         this.downPointX = loc.x;
        //         this.reDrawCanvas();
        //     }
        // } else {
        //     this.resize = false;
        //     this.reDrawCanvas();
        // }
    },

    /**
     * Detect the mousehover on given axis
     */
    // isResizeBoxHover: function(loc, xPoint, yPoint) {
    //     var hoverMargin = 3;
    //     if (loc.x > (xPoint - this.hoverBoxSize - hoverMargin) && loc.x < (xPoint + this.hoverBoxSize + hoverMargin) && loc.y > (yPoint - this.hoverBoxSize - hoverMargin) && loc.y < (yPoint + 5 + hoverMargin)) {
    //         this.ctx.fillRect(xPoint - this.hoverBoxSize, yPoint - this.hoverBoxSize, this.hoverBoxSize * 2, this.hoverBoxSize * 2);
    //         this.resize = true;
    //         return true;
    //     }
    //     return false;
    // },

    /**
     * Draw 4 resize box of 10 x 10
     * @return {[type]} [description]
     */
    drawResizerBox: function() {
        var centerPointX = (this.lastPointX + this.downPointX) / 2;
        var centerPointY = (this.lastPointY + this.downPointY) / 2;
        this.ctx.fillStyle = '#000000';
        this.ctx.lineWidth = 1;
        // this.ctx.fillRect(centerPointX - this.hoverBoxSize, this.downPointY - this.hoverBoxSize, this.hoverBoxSize * 2, this.hoverBoxSize * 2);
        // this.ctx.fillRect(this.lastPointX - this.hoverBoxSize, centerPointY - this.hoverBoxSize, this.hoverBoxSize * 2, this.hoverBoxSize * 2);
        // this.ctx.fillRect(centerPointX - this.hoverBoxSize, this.lastPointY - this.hoverBoxSize, this.hoverBoxSize * 2, this.hoverBoxSize * 2);
        // this.ctx.fillRect(this.downPointX - this.hoverBoxSize, centerPointY - this.hoverBoxSize, this.hoverBoxSize * 2, this.hoverBoxSize * 2);
    },

    /**
     * Translate to HTML coardinates to Canvas coardinates.
     */
    windowToCanvas: function(x, y) {
        var canvas = this.ctx.canvas,
            bbox = canvas.getBoundingClientRect();
        return {
            x: x - bbox.left * (canvas.width / bbox.width),
            y: y - bbox.top * (canvas.height / bbox.height)
        };
    },

    /**
     * Get the canavs, remove cutout, create image elemnet on UI.
     * @return {[type]}
     */
    cropImage: function() {


      if(cropBoolean == true){

        if((this.lastPointY - this.downPointY)>0){
          $('#output2').empty();
          var tempCtx = document.createElement('canvas');
          tempCtx.id="can_download"
          tempCtx.width = 1320;
          tempCtx.height = 620;
          this.tctx = tempCtx.getContext('2d');
          console.log(this.downPointX, this.downPointY, (this.lastPointX - this.downPointX), (this.lastPointY - this.downPointY), 0, 0, (this.lastPointX - this.downPointX), (this.lastPointY - this.downPointY));
          this.tctx.drawImage(document.getElementById('canv2'), this.downPointX, this.downPointY, (this.lastPointX - this.downPointX), (this.lastPointY - this.downPointY), 0, 0, (this.lastPointX - this.downPointX), (this.lastPointY - this.downPointY));


          document.getElementById('output2').appendChild(tempCtx);
          // var imageData = tempCtx.canvas.toDataURL("image/jpg");
          // console.log(imageData)

          var canvas = document.getElementById("can_download");
          var img    = canvas.toDataURL("image/png");
          var link = document.createElement('a');
          link.download = 'filename.png';
          link.href = img
          link.click();
          this.reDrawCanvas();
          return tempCtx;

        }else{
          imageCropper.init();
          imageCropper.initTakeSnapchot();
          Messenger().post({
              message: 'Please crop again',
              type: 'error',
              showCloseButton: true
          });
        }


      }else{

        var canvas = document.getElementById("canv2");
        var img    = canvas.toDataURL("image/png");
        var link = document.createElement('a');
        link.download = 'filename.png';
        link.href = img
        link.click();
        return tempCtx;

      }


        // document.getElementById('croppedImage').src = imageData;
    }
}

// imageCropper.init();

/**
 * Captures a image frame from the provided video element.
 *
 * @param {Video} video HTML5 video element from where the image frame will be captured.
 * @param {Number} scaleFactor Factor to scale the canvas element that will be return. This is an optional parameter.
 *
 * @return {Canvas}
 */
// function capture(video, scaleFactor) {
//
// }

/**
 * Invokes the <code>capture</code> function and attaches the canvas element to the DOM.
 */
// function shoot() {
//
// }

// (function() {
//     var captureit = document.getElementById('cit');
//     captureit.click();
// })();
