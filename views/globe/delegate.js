
GlobeView = function() {

  console.log("creating Globe view, you should not see this twice!");

  this.key = "test";
  this.controller = false;
  this.domContainer = false;
  
};

GlobeView.prototype.onCreate = function() {

  console.log("Globe view CREATED");

};

GlobeView.prototype.onDOMReady = function() {

  console.log("Globe DOM READY");
    
  
  $("#world-container").bind("touchmove", function(inEvent) {
    
    inEvent.preventDefault();

  });
  
  $("#world-masker").bind("touchmove", function(inEvent) {
    
    inEvent.preventDefault();

  });
  
  $(".world").bind("touchmove", function(inEvent) {
    
    inEvent.preventDefault();

  });
  

  if ($("body").hasClass("safari")) {
    
    $("#moz-lockup").css({ top: $(window).height() + 65 });  
    
  }
  
  
  
  
  var nav = navigator.userAgent.toLowerCase();
  
  var rev = parseInt($.browser.version);
  
  // check for FF v21 or above, otherwise fall back to flat globe for pre-hardware accel FF
  
  /*
  if (nav.indexOf("firefox") > -1 && rev < 21) {
    
    $(".world #flat-world #flat-globe").show();
    $(".world #world-container").hide();
    
  }
  
  else if ($("body").hasClass("android") && rev < 21) { // TBD TEST ME!
  
    $(".world #flat-world #flat-globe").show();
    $(".world #world-container").hide();
    
  }
  else {
    
    $(".world #flat-world").hide();
    $(".world #world-container").show();
    
  }
*/

  $(".world #flat-world").show();
  $(".world #world-container").hide();
  
  
  // checks for legacy renderers
  // ff 20 and below can't deal with translate3d unless
  // elements are top-level, the .retro class overrides 
  // the animation to a simple translate() -- shouldn't be
  // faster, but it is.
  

  
  if (nav.indexOf("firefox") > -1 && rev < 21) {
    
    $(".world #flat-world #flat-globe").addClass("retro");
    
  }
  else if (nav.indexOf("firefox") > -1 && nav.indexOf("mobile") > -1) {
  
    $(".world #flat-world #flat-globe").addClass("retro");    
  
  }
  
  
  var maskCanvas = document.getElementById("alt-mask");
  
  var context = maskCanvas.getContext("2d");
  
  var centerX = 433;
  var centerY = 435;
  var radius = 378;
  
  /*
context.beginPath();
  context.rect(0, 0, 1000, 1000);
  context.fillStyle = 'yellow';
  context.fill();
*/
  
  var imageObj = new Image();
  imageObj.onload = function() {
  
    var pattern = context.createPattern(imageObj, 'repeat');

    context.rect(0, 0, maskCanvas.width, maskCanvas.height);
    context.fillStyle = pattern;
    context.fill();
    
    context.globalCompositeOperation = "destination-out";
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    context.fillStyle = 'white';
    context.fill();
    
  };
  
  imageObj.src = 'views/globe/new/bgSides.jpg';

  
  //context.lineWidth = 5;
  ///context.strokeStyle = '#003300';
  //context.stroke();
  

};

  
GlobeView.prototype.onBeforeVisible = function() {

  console.log("Globe view delegate on before visible");
  
  if ($("body").hasClass("safari")) {
    
    $(".world-panel").each(function(i) {
      
      $(this).css({ webkitTransform: "translate3d(300px,0,0px) rotateY(" + (15 * i) + "deg)" });
      
    });
    
    
  }
  
};

GlobeView.prototype.onVisible = function() {

  console.log("Globe view delegate on visible");
  
  dApplication.canDisplayExternalTraffic = true;
  
  this.maxEmitterRemoteViews = 15; // sweet spot is probbaly about... 50-100?
  this.maxEmitterLocalViews = 20; // sweet spot is probbaly about... 10-15?
  
  if ($("body").hasClass("ff-mobile")) {
    console.log("slower renderer, trimming emitter values");
    this.maxEmitterRemoteViews = 5; 
    this.maxEmitterLocalViews = 5;
  }

	if ($(window).width() < 481 && $(window).width() > 479) { 
		
			//$("#app-client-counter, #display-toggle").show();
  } 
  else {
		//$("#app-info, #app-client-counter, #display-toggle").show();
  }	
  
  $("#info").show();
  $("#moz-lockup").show();
  
  
};

GlobeView.prototype.onBeforeInvisible = function() {

  console.log("Globe view delegate on before invisible");

};

GlobeView.prototype.onInvisible = function() {

  console.log("Globe view delegate on invisible");

};

GlobeView.prototype.show = function() {

  console.log("Globe view delegate on show");

};

GlobeView.prototype.hide = function() {

  console.log("Globe view delegate on hide");

};



GlobeView.prototype.triggerSound = function(inEvent, inArgs) {

  var _self = this;
  
  var totalCurrentViews = document.querySelectorAll(".bloom:not(.remote)"); 
  var maxEmitterViews = this.maxEmitterLocalViews; 
  
        
  if (totalCurrentViews.length && totalCurrentViews.length > maxEmitterViews) {
    
    // OR should we just block like so?
    return;
    
  }
  
  
  if (DcUtil.isTouch()) {
    var x = inEvent.originalEvent.touches[0].pageX;
    var y = inEvent.originalEvent.touches[0].pageY;
    
    
    
  }
  else {
    var x = inEvent.pageX;
    var y = inEvent.pageY;
  }
    
  var xWithOffset = x - $("#bloomers").offset().left;
  
  this.drawBloom(xWithOffset, y, false);
  
  //console.log("plotting, x: " + x + " y: " + y);
    
    // double check out socket status: 
  if (! SocketTransport.socket) {
    
    SocketTransport.openNewSocketCx();
    
  }
  
  if (SocketTransport.socket) {
  
    var msg = '{ "clientID": "' + dApplication.clientID + '","type": "tone", "status": "ok", "message": "tone", "x": ' + x + ', "y": ' + y + ' }';
    
    SocketTransport.socket.send(msg);
    
  }
  
  
};


GlobeView.prototype.drawBloom = function(inX, inY, inIsRemote) {

  var _self = this;
  
  var bloomClass = "bloom local";
  if (inIsRemote) bloomClass += "bloom remote";
  
  // remove old elements if we race: 

  if (inIsRemote) {
    var totalCurrentViews = document.querySelectorAll(".bloom.remote");
    var maxEmitterViews = this.maxEmitterRemoteViews;  
  }
  else {
    var totalCurrentViews = document.querySelectorAll(".bloom:not(.remote)"); 
    var maxEmitterViews = this.maxEmitterLocalViews; 
  }
        
  if (totalCurrentViews.length && totalCurrentViews.length > maxEmitterViews) {
    
    // should we just block like so?
    return;
    
/*
    var dif = totalCurrentViews.length - maxEmitterViews;
    
    for (var x=0; x<dif; x++) {
      
      console.log("removing old element");
      totalCurrentViews[x].parentNode.removeChild(totalCurrentViews[x]);
      
    }
*/
    
  }
  
  
  // TBD: move to a %-based tone generation!
  
  console.log("drawing bloom at: " + inX + " and " + inY);
  
  var tonePercent =  Math.round( 100 * (inY / $(window).height()) );
  
  // trigger sound
  if      (tonePercent < 20) { AudioTransport.playSound(6); }
  else if (tonePercent < 35) { AudioTransport.playSound(5); }
  else if (tonePercent < 50) { AudioTransport.playSound(4); }
  else if (tonePercent < 65) { AudioTransport.playSound(3); }
  else if (tonePercent < 80) { AudioTransport.playSound(2); }
  else                { AudioTransport.playSound(1); }
  
  
  // now append the bloom: 
  //var bContainer = "#bloomer-container";
  //var bContainer = ".world";
  var bContainer = "#bloomers";
  
  /*
dApplication.addView("bloom", true, bContainer, false, function(inView) {
    
    
    
    $(inView.domContainer)
      .addClass(bloomClass)
      .css({
      
        top: inY,
        left: inX
      
      });
    
    
  
  });
*/
  
  
  
  
  
  // tweak the x and y position to account 
  // for the crazy-scaling we're doing on the icons

  
  if (DcUtil.isTouch() && $("body").hasClass("safari")) {
    
  }
  else {
    //inY = inY + 94;
    //inX = inX - 22;
  }
  
 
  var newBloom = document.createElement("div");
  newBloom.innerHTML = '<div class="side side-1"></div><div class="side side-2"></div><div class="side side-3"></div><div class="side side-4"></div><div class="side side-5"></div><div class="side side-6"></div>';
  newBloom.className = bloomClass ;
  newBloom.style.top = inY + "px";
  newBloom.style.left = inX + "px"; 


  $(newBloom).bind(dApplication.animationEnd, function(inEvent) { 
    if ($(inEvent.target).hasClass("bloom")) $(this).remove();
  });

  document.querySelector(bContainer).appendChild(newBloom);
  
  //setTimeout(function() {
  
    newBloom.className += " bloom-transform-in";
  
  //}, 25);
  



  
  if (_gaq) _gaq.push(['_trackEvent', 'globe', 'click', 'click globe']);

  // category='globe' or 'menu' or 'share'
  // action='click'
  // optional_label='click globe' or 'open location' or 'close location' or 'open share' or 'close share' or 'one voice' or 'many voices'
  
  
}

