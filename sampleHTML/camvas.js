function camvas(ctx, callback) {
  document.getElementById("loader").style.display = "none";
  var self = this;
  this.ctx = ctx;
  this.callback = callback;
  const Ratio = 0.8;
  // We can't `new Video()` yet, so we'll resort to the vintage
  // "hidden div" hack for dynamic loading.

  var streamContainer = document.createElement('div');
  this.video = document.createElement('video');

  // If we don't do this, the stream will not be played.
  // By the way, the play and pause controls work as usual 
  // for streamed videos.
  this.video.setAttribute('autoplay', '1');
  this.video.setAttribute('playsinline', '1'); // important for iPhones

  // The video should fill out all of the canvas
  this.video.width = window.innerWidth < 900 ? window.innerWidth - 30 : 640;
  this.video.height = window.innerWidth < 900 ? (window.innerWidth - 20) / Ratio : 480;

  streamContainer.appendChild(this.video);
  document.getElementById("canvas-outer").appendChild(streamContainer);
  

const getConfig = () => {
  if (window.innerWidth < 900) {
    if (canvasMode === "pc") {
      return {
        video : {
          facingMode: "environment",
        },
        audio: false,
      }
    } else {
      return {
        video : {
          //height: parseInt((window.innerWidth - 20)/ Ratio),
          facingMode: "user",
        },
        audio: false,
      }
    }
    
  } else {
    return {
      video: true,
      audio: false,
      facingMode: "user",
    }
  }
}

if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
  navigator.mediaDevices.getUserMedia(getConfig()).then(function(stream) {
    // Yay, now our webcam input is treated as a normal video and
    // we can start having fun
    self.video.srcObject = stream;
	if (canvasMode === "mobile") {
		self.video.style = "-webkit-transform:scaleX(-1);transform:scaleX(-1);";
	}
	
    cameraStartTick = Date.now();
    failedStatusTick = Date.now();
    document.getElementById("canvasTxt").classList.add("visible");
    self.update()
  }, function(err) {
    throw err
  })
}
  // The callback happens when we are starting to stream the video.
 

  this.stop = function() {
    
    const tracks = self.video.srcObject.getTracks();
    tracks[0].stop();
    document.getElementsByTagName("video")[0].remove();
  }

  // As soon as we can draw a new frame on the canvas, we call the `draw` function 
  // we passed as a parameter.
  this.update = function() {
	var self = this
    var last = Date.now()
    var loop = function() {
      // For some effects, you might want to know how much time is passed
      // since the last frame; that's why we pass along a Delta time `dt`
      // variable (expressed in milliseconds)
      var dt = Date.now() - last
      self.callback(self.video, dt)
      last = Date.now()
      requestAnimationFrame(loop) 
    }
    requestAnimationFrame(loop) 
  } 
}
