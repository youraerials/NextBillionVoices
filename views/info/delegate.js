
InfoView = function() {

  console.log("creating Info view, you should not see this twice!");

  this.key = "Info";
  this.controller = false;
  this.domContainer = false;
  
};

InfoView.prototype.onCreate = function() {

  console.log("Info view CREATED");
  

};

InfoView.prototype.scrollStartTime = 0;
InfoView.prototype.scrollPosition = 0;
InfoView.prototype.initialScrollPosition = 0;
InfoView.prototype.scrollStartPosition = 0;

InfoView.prototype.onDOMReady = function() {
  
  // PUT YOUR DOM BINDINGS AND OTHER ONE-OFF THINGS HERE!
  

  var _self = this;
  
  /*
$(".country-block").live("click", function() {
    $(this).prevAll(".country-block.focus").removeClass("focus");
    $(this).nextAll(".country-block.focus").removeClass("focus");
    $(this).toggleClass("focus");
  });
*/
  
  $(".info #voices-toggle").click(function(inEvent) {
    
    inEvent.preventDefault();
  
    $(".info .selected").not(this).removeClass("selected");
    $(this).toggleClass("selected");
    
    
  
    if ($(this).hasClass("selected")) {
      dApplication.canDisplayExternalTraffic = true;   
    }
    else {
      dApplication.canDisplayExternalTraffic = false;
    }
  
  });
  
  // TBD, move us to markup?
  
  $(".info #voices-region").click(function(inEvent) {
    
    $(".info .selected").not(this).removeClass("selected");
    $(this).toggleClass("selected");
    if ($(this).hasClass("selected")) $(".info #voices-data").addClass("selected");
    else $(".info #voices-data").removeClass("selected");
   
    SocketTransport.getToneCount();
    SocketTransport.getAppStats();
  
  });
  
  $(".info #voices-info").click(function(inEvent) {
    
    $(".info .selected").not(this).removeClass("selected");
    $(this).toggleClass("selected");
    
    if ($(this).hasClass("selected")) $(".info #info-data").addClass("selected");
    else $(".info #info-data").removeClass("selected");
  
  });
  
  
  $(".info .voices-share").click(function(inEvent) {
    
    $(".info .selected").not(this).removeClass("selected");
    $(this).toggleClass("selected");
  
  });

  
  var transformProp = PrefixFree.prefixProperty("transform", false);
  transformProp = transformProp.charAt(0).toLowerCase() + transformProp.slice(1);
      
  var transitionDuration = PrefixFree.prefixProperty("transition-duration", false);
  transitionDuration = transitionDuration.charAt(0).toLowerCase() + transitionDuration.slice(1);
  
  var startEvent = DcUtil.isTouch() ? "touchstart" : "mousedown";
  var moveEvent = DcUtil.isTouch() ? "touchmove" : "mousemove";
  var endEvent = DcUtil.isTouch() ? "touchend" : "mouseup";
  
  
  $(".info #country-scroller")
    .bind(startEvent, function(inEvent) {
      inEvent.preventDefault();
      inEvent.stopPropagation();
      
      var originalTarget = $(inEvent.target);
      if (! originalTarget.hasClass("country-block")) {
        originalTarget = originalTarget.closest(".country-block");
      }
      $(".country-block.focus").removeClass("focus");
      originalTarget.addClass("focus");
      
      
      _self.initialScrollPosition = _self.scrollPosition;
      
      $(".info #country-scroller").css(transitionDuration, "0ms");
      
      _self.scrollStartPosition = DcUtil.isTouch() ? inEvent.originalEvent.touches[0].pageX : inEvent.pageX;
      _self.scrollStartTime = new Date().getTime();
      
      
      $(window)
        .bind(moveEvent, function(inMoveEvent) {
        
          var scrollPoint =  DcUtil.isTouch() ? inMoveEvent.originalEvent.touches[0].pageX : inMoveEvent.pageX;
          _self.scrollPosition = _self.initialScrollPosition + (scrollPoint - _self.scrollStartPosition);
          
          inMoveEvent.preventDefault();
          inMoveEvent.stopPropagation();
          console.log("move: " + _self.scrollPosition);
          
          $(".info #country-scroller").css(transformProp, "translate3d(" + _self.scrollPosition + "px, 0, 0)");
          
        })
        .bind(endEvent, function() {
            
          $(window).unbind(moveEvent);
          $(window).unbind(endEvent);
        
          var timeDelta = new Date().getTime() - _self.scrollStartTime;
          if (timeDelta < 220) {
            
            console.log("current: " + _self.scrollPosition  + " start: " + _self.initialScrollPosition );
            
            $(".info #country-scroller").css(transitionDuration, "500ms");
            if ( _self.scrollPosition - _self.initialScrollPosition < 0) {
              _self.scrollPosition -= 180;
              var negScrollMin = -1 * $(".info #country-scroller").width();
              
              if (_self.scrollPosition < negScrollMin + 220) _self.scrollPosition = negScrollMin + 220;
              
              
            }
            else {
              _self.scrollPosition += 180;
              
              if (_self.scrollPosition > 0) _self.scrollPosition = 0;
              //$(".info #country-scroller").css(transformProp, "translate3d(" + _self.scrollPosition + "px, 0, 0)"); 
            }
            
            
            
          }
          
          else {
           
            var negScrollMin = -1 * $(".info #country-scroller").width();
           
            if (_self.scrollPosition < negScrollMin + 220) {
              _self.scrollPosition = negScrollMin + 220;
              $(".info #country-scroller").css(transitionDuration, "200ms");
              //$(".info #country-scroller").css(transformProp, "translate3d(" + _self.scrollPosition + "px, 0, 0)");
            }
            else if (_self.scrollPosition > 0){
              $(".info #country-scroller").css(transitionDuration, "200ms");
              
              _self.scrollPosition = 0;
              
              //$(".info #country-scroller").css(transformProp, "translate3d(" + _self.scrollPosition + "px, 0, 0)"); 
            }
            else {
              $(".info #country-scroller").css(transitionDuration, "0");
            }
            
          }
          
          
          // round to the closest FRAME
          
          _self.scrollPosition = Math.ceil(_self.scrollPosition / 220) * 220;
          
          
          $(".info #country-scroller").css(transformProp, "translate3d(" + _self.scrollPosition + "px, 0, 0)");
          
        });
      
      
    });
    
    
    $(".info #country-scroll-left").bind("click", function() {
      
      console.log("scrolling left");
      
      
      $(".info #country-scroller").css(transitionDuration, "500ms");
      
      if (_self.scrollPosition < -219) _self.scrollPosition += 220;
      
      _self.scrollPosition = Math.ceil(_self.scrollPosition / 220) * 220;
          
          
      $(".info #country-scroller").css(transformProp, "translate3d(" + _self.scrollPosition + "px, 0, 0)");
    
    });
    
    
    $(".info #country-scroll-right").bind("click", function() {
      
      console.log("scrolling right");
      
      var totalWidth = $(".info #country-scroller").width() - 220;
      
      $(".info #country-scroller").css(transitionDuration, "500ms");
      
      if ( _self.scrollPosition > (-1 * totalWidth) ) _self.scrollPosition -= 220;
      
      _self.scrollPosition = Math.ceil(_self.scrollPosition / 220) * 220;
          
          
      $(".info #country-scroller").css(transformProp, "translate3d(" + _self.scrollPosition + "px, 0, 0)");
    

      
    });
    
  
};


InfoView.prototype.onBeforeVisible = function() {

  console.log("Info view delegate onBeforeVisible() called");
  $("#app-info").empty().append("X");
  
  //$("#debug").show().appendTo(".info");
  
  
};

InfoView.prototype.onVisible = function() {

  console.log("Info view delegate onVisible() called");
  $("#user-count").empty().append( NBVUtil.numForm(dApplication.clientCount) );
  
  SocketTransport.getToneCount();
  SocketTransport.getAppStats();
  
  if (_gaq) _gaq.push(['_trackEvent', 'menu', 'click', 'click info']);

  // category='globe' or 'menu' or 'share'
  // action='click'
  // optional_label='click globe' or 'open location' or 'close location' or 'open share' or 'close share' or 'one voice' or 'many voices'
  
  

};

InfoView.prototype.onBeforeInvisible = function() {

  console.log("Info view delegate onBeforeInvisible() called");
  $("#app-info").empty().append("i");

};

InfoView.prototype.onInvisible = function() {

  console.log("Info view delegate onInvisible() called");

};

InfoView.prototype.show = function() {

  console.log("Info view delegate show() called");

};

InfoView.prototype.hide = function() {

  console.log("Info view delegate hide() called");

};


InfoView.prototype.updateStats = function() {

  if ( $("#info").hasClass("expanded") ) {
    
    $("#user-count").empty().append( NBVUtil.numForm(dApplication.clientCount) );
  
    SocketTransport.getToneCount();
    SocketTransport.getAppStats();
    
  }
  

};

InfoView.prototype.updatesRunning = false;


InfoView.prototype.toggleUpdates = function() {

  if (this.updatesRunning) {
    
    this.updatesRunning = false;
    this.stopUpdates();
    
    //$("#display-toggle").show();
    //$("#app-client-counter").show();
    
    $("#nfo-toggle").empty().append("info");
    
    
  }
  else {
    this.updatesRunning = true;
    this.startUpdates();
    
    //$("#display-toggle").hide();
    $("#app-client-counter").hide();
    
    $("#nfo-toggle").empty().append("close");
    
  }

}


InfoView.prototype.startUpdates = function() {

  var _self = this;
  this.updateTimer = setInterval(function() {
    
    console.log("updating");
    _self.updateStats()
    
  }, 30000);
  
  this.updateStats();
  
};

InfoView.prototype.stopUpdates = function() {

  clearInterval(this.updateTimer);  
  
};



