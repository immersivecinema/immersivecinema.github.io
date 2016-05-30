/* ========================================================================
 * Itercept: app.js v1.0
 * http://itercept.com/
 * ========================================================================
 * Copyright 2011-2014 Itercept.
 * ======================================================================== */



(function($) {
  /* Configuration */
  var Config = {
      enableTransitions: true,
      enableMobileTransitions: false,
      enableParallax: true,
      enableMobileParallax: false,
      scrollDuration: 1000,
      websiteType: {
        onePage: true
      }
  }

  /* Utilities */
  var Util = window.Util = {
	  showLoading: function(el) {
		$("body").css("cursor", "wait");
	  },
	  hideLoading: function(el) {
		$("body").css("cursor", "auto");
	  },
      getScrollTop: function() {
        return $("body").scrollTop() || $("html").scrollTop();
      },
      scrollTo: function(pos, time) {
          if (Util.environment.isMobile()) {
              pos = pos - 121;
          }
          if (time == 0) {
              $("html, body").css({scrollTop: pos});
          } else if (time != undefined) {
              $("html, body").animate({scrollTop: pos}, time);
          } else {
              $("html, body").animate({scrollTop: pos}, 1500);
          }
      },
      hexToRgb: function(hex) {
          var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
          return result ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16)
          } : null;
      },
      showNotification: function(message) {
          clearTimeout(Util.removeNotificationMessageTimeout);
          $(".notification-message .text").text(message);

          $(".notification-message").addClass("show");

          setTimeout(function() {
              $(".notification-message").addClass("whiten");
              setTimeout(function() {
                  $(".notification-message").removeClass("whiten");
              }, 300);
          }, 300);

          Util.removeNotificationMessageTimeout = setTimeout(function() {
              $(".notification-message").removeClass("show");
          }, 6000);
      },
      afterTransitionTime: function(callback) {
          setTimeout(function() {
              callback();
          }, 300);
      },
      preparePageUnload: function() {
          //$(".page-section").removeClass("show");
          //$(".page-section .content-container").removeClass("show");
      },
      environment: {
          isAndroid: function() {
                  return navigator.userAgent.match(/Android/i);
          },
          isBlackBerry: function() {
                  return navigator.userAgent.match(/BlackBerry/i);
          },
          isNewBlackberry: function() {
                  return navigator.userAgent.match(/BB10/i);
          },
          isIOS: function() {
                  return navigator.userAgent.match(/iPhone|iPad|iPod/i);
          },
          isOpera: function() {
                  return navigator.userAgent.match(/Opera Mini/i);
          },
          isIPad: function() {
                  return navigator.userAgent.match(/iPad/i);
          },
          isWindows: function() {
                  return navigator.userAgent.match(/IEMobile/i);
          },
          isMSIE9: function(){
                  return navigator.userAgent.match(/MSIE 9.0/i);
          },
          isGS4Browser: function(){
                  var cond1 = navigator.userAgent.match(/SAMSUNG GT-I9505/i);
                  var cond2 = navigator.userAgent.match(/Version\/1.0/i);
                  return (cond1 && cond2);
          },
          isTablet: function(){
                  return (Util.environment.isIPad() || ($(window).width() > 991 && $(window).width() < 1329));
          },
          isMobile: function() {
                  return ($(window).width() < 991) || (Util.environment.isAndroid() || Util.environment.isBlackBerry() || Util.environment.isNewBlackberry() || Util.environment.isIOS() || Util.environment.isOpera() || Util.environment.isWindows());
          }
      }
  }

  var App = window.App = {
	init: function() {
	    $(".color").animate({"width": "100%"}, 10000);
		App.generalBindings();
	},
    generalBindings: function() {

      //contact form
      $("body").on("click", "*[data-open='contact-form']", function(e){
        $(".contact-container").removeClass("fly-from-left");
        $(".side-container").addClass("reduced-side-container-conditionally-contact");
      });
      $("body").on("click", ".contact-container .close", function(e){
        e.preventDefault();
        $(".contact-container").addClass("fly-from-left");
        $(".side-container").removeClass("reduced-side-container-conditionally-contact");
      });
      $(".ajax-form").on("submit", function(e) {
        e.preventDefault();
        var frm = $(this);
        $(".corner-indicator").addClass("la-animate");
        $.ajax({
          url: frm.attr("action"),
          data: frm.serialize(),
          type: "post",
          success: function(response) {
            if (response == "1") {
              $.growl.notice({
                  title: "<span class='fa fa-check-circle'></span>&nbsp;Email Sent",
                  message: "Your inquiry has been received successfully.",
                  duration: 10000
              });
            } else {
              $.growl.warning({
                  title: "<span class='fa fa-exclamation-circle'></span>&nbsp;Not Sent",
                  message: "There was an error sending your inquiry.",
                  duration: 10000
              });
            }
          },
          error: function(response) {
            $.growl.warning({
                title: "<span class='fa fa-exclamation-circle'></span>&nbsp;Not Sent",
                message: "There was an error sending your inquiry.",
                duration: 10000
            });
          },
          complete: function() {
            $(".corner-indicator").removeClass("la-animate");
          }
        });
      });





      $("body").on("click", ".page-resizer", function(e){
        e.preventDefault();
        $(this).toggleClass("active");

        var $page = $(this).parents(".page-container");

        if ($(this).hasClass("active")) {

          $page.addClass("full-width-page no-menu-page");
          $(".side-container").addClass("reduced-side-container");
          setTimeout(function() {
                  $("#filters button:first", $page).click();
                  setTimeout(function() {
                          App.initWaypoints();
                          $(".side-container").addClass("reduced-side-container");
                  }, 800);
          }, 800);


        } else {

          $page.removeClass("full-width-page no-menu-page");
          App.initWaypoints();
          $(".side-container").removeClass("reduced-side-container");
          setTimeout(function() {
                  $("#filters button:first", $page).click();
          }, 800);
        }


      });

      $("body").on("click", ".portfolio-item", function(e){
        $("a", this).click();
      });

      //$('.tabcordion').tabcordion();

      $("body").on("click", "nav li a", function(e){
        e.preventDefault();
        $elem = $($(this).attr("href"));
        if ($elem.length) {
          //window.location.hash = $(this).attr("href");
          if (Util.environment.isMobile() && !Util.environment.isTablet())
            $("body, html").animate({scrollTop: $elem.offset().top - 130}, Config.scrollDuration);
          else
            $("body, html").animate({scrollTop: $elem.offset().top}, Config.scrollDuration);
        } else {
          if (Config.websiteType.onePage && ($(this).attr("href") != "#")) {
            window.location = "./" + $(this).attr("href");
          }
        }

        //close popups, if any
        if ($.magnificPopup) {
          $.magnificPopup.close();
        }

      });

      // var toggled = false;

      $("body").on("click", ".menu-trigger-container", function(e){

        console.log("click in general");

        e.preventDefault();

        // this scrolls back up to the top
        if (Util.environment.isMobile()) {
          if (!$(".rest-section").hasClass("hide-mobile") && (Util.getScrollTop() > $(".rest-section").height())) {
            Util.scrollTo(0, 500);
            console.log("1");
            return;
          } else { // has to scroll back up to the top{
            console.log("2");
            Util.scrollTo(0, 500);
          }
        }


        // console.log("clicked shit");

        // if (toggled === false){
          $(".rest-section").toggleClass("hide-mobile");
            // toggled = true;
        // }


      });


      $(".side-container").hover(function() {
        if ($(this).hasClass("reduced-side-container") || $(this).hasClass("reduced-side-container-conditionally") || $(this).hasClass("reduced-side-container-conditionally-contact")) {
          $(this).addClass("temporarily-not-reduced");
        }
      }, function() {
        $(this).removeClass("temporarily-not-reduced");
      });
    },

    initHelpers: function() {
      $("abbr, *[data-toggle='tooltip']").tooltip({});
    },
	initMaps: function() {
		//Google map
      if ($("#google_map").length) {

        var lat = 44.789511, lng = 20.43633, coName = "Glamore", coPrompt = "Come, visit us.";
        var e=new google.maps.LatLng(lat ,lng),
                o={zoom:15,center:new google.maps.LatLng(lat ,lng),
                mapTypeId:google.maps.MapTypeId.ROADMAP,
                mapTypeControl:!1,
                scrollwheel:!1,
                draggable:!0,
                navigationControl:!1
        },
                n=new google.maps.Map(document.getElementById("google_map"),o);
                google.maps.event.addDomListener(window,"resize",function(){var e=n.getCenter();
                google.maps.event.trigger(n,"resize"),n.setCenter(e)});

                var g='<div class="map-tooltip"><h6>'+coName+'</h6><p>'+coPrompt+'</p></div>',a=new google.maps.InfoWindow({content:g})
                ,t=new google.maps.MarkerImage("images/map-marker.png",new google.maps.Size(70,70),
                new google.maps.Point(0,0),new google.maps.Point(20,55)),
                i=new google.maps.LatLng(lat, lng),
                p=new google.maps.Marker({position:i,map:n,icon:t,zIndex:3});
                var styles = [
                  {
                    stylers: [
                      { hue: "#9a9a9a" },
                      { saturation: -100 }
                    ]
                  },{
                    featureType: "road",
                    elementType: "geometry",
                    stylers: [
                      { lightness: 100 },
                      { visibility: "simplified" }
                    ]
                  }
                ];

                n.setOptions({styles: styles});

        //code

      }
	},
    initIsotope: function() {
      var $container = $('.isotope-list');
      $container.isotope({
        // options
        itemSelector: '.item',
        layoutMode: 'fitRows',
        transitionDuration: '0.7s'
      });

      $('#filters').on( 'click', 'button', function() {
        var filterValue = $( this ).attr('data-filter');
        // use filterFn if matches value
        $container.isotope({ filter: filterValue });
      });
       // change is-checked class on buttons
      $('.button-group').each( function( i, buttonGroup ) {
        var $buttonGroup = $( buttonGroup );
        $buttonGroup.on( 'click', 'button', function() {
          $buttonGroup.find('.is-checked').removeClass('is-checked');
          $( this ).addClass('is-checked');
        });
      });
    },
    initItrSlider: function() {
            if (window.itrSliderInited != undefined)
                    return;

            function do_slide(elem) {
              if ($("li", elem).length) {
                var next = $("li.shown", elem).next();
                $("li.shown", elem).removeClass("shown");

                      if (next.length) {
                              next.addClass("shown");
                      } else {
                              $("li:first", elem).addClass("shown");
                      }
              } else {
                      $("li:first", elem).addClass("shown");
              }
              setTimeout(function() {
                var maxHeight = 0;
                $("li", elem).each(function() {
                  var h = $(this).height();
                  maxHeight = h > maxHeight ? h : maxHeight;
                })
                calculatedHeight = maxHeight + parseInt($(elem).css("padding-top")) + parseInt($(elem).css("padding-bottom"));
                $(elem).css("height", calculatedHeight);
                if (Util.environment.isMobile()) {
                  $(".home-slider.bottom-aligned").css({marginTop: 100});
                } else {
                  $(".home-slider.bottom-aligned").css({marginTop: ($(window).height() - $(".home-slider.bottom-aligned").height() - 200)});
                }
              }, 1);
            }

            window.itrSliderInited = [];
            $(".itr-slider").each(function(i, elem) {
                var duration = $(elem).attr("data-duration");
                duration = (duration == undefined ? 6000 : duration);
                window.elem = elem;
                window.itrSliderInited.push(setInterval(function()  {
                        do_slide(elem);
                }, duration));
                do_slide(elem);
            });

    },
    initPopups: function() {
      $('*[data-rel="popup"]').each(function(i, elem) {
        var thisEl = $(elem);
        var presentableLink = $(thisEl).attr("data-url") || "#";
        var popupCallbacks = {
          open: function() {
            $(".side-container").addClass("reduced-side-container-conditionally");
            //App.changeHistory({}, "", )
            history.pushState({popup: true, link: $(thisEl).attr("href")}, "", presentableLink);
          },
          close: function() {
            $(".side-container").removeClass("reduced-side-container-conditionally");
            history.pushState({popup: false, link: ""}, "", "./");
          }
        }

        $(thisEl).magnificPopup({
          type: 'ajax',
          preloader: true,
          callbacks: popupCallbacks,
          removalDelay: 600,
          mainClass: "scale-up slow-transitions"
        });

      });

      // Revert to a previously saved state
      window.addEventListener('popstate', function(event) {
        if (event.state == null) {
          return;
        }
        if(event.state.popup) {
          $.magnificPopup.open({
            items: {
              src: event.state.link
            },
            callbacks: {
              open: function() {
                $(".side-container").addClass("reduced-side-container-conditionally");
              },
              close: function() {
                $(".side-container").removeClass("reduced-side-container-conditionally");
                history.pushState({popup: false, link: ""}, "", "./");
              }
            },
            preloader: true,
            type: 'ajax'

            // You may add options here, they're exactly the same as for $.fn.magnificPopup call
            // Note that some settings that rely on click event (like disableOn or midClick) will not work here
          }, 0);
        } else {
          $.magnificPopup.close();
        }
      });

      $('*[data-rel="popup-form"]').magnificPopup({
        type: 'inline',
        preloader: false,
        focus: '#keyword',
        mainClass: "above-all hide-close fade-content",
        removalDelay: 600,
        // When elemened is focused, some mobile browsers in some cases zoom in
        // It looks not nice, so we disable it:
        callbacks: {
          beforeOpen: function() {
            if($(window).width() < 700) {
              this.st.focus = false;
            } else {
              this.st.focus = '#keyword';
            }
          }
        }
      });
    },
    initWaypoints: function() {


      /* Destroy all waypoints */
      $(".waypointed, .waypointed2, .waypointed3, .waypointed-transition, .menu-waypointed").removeClass("waypointed").removeClass("waypointed2").removeClass("waypointed3").removeClass("menu-waypointed").waypoint('destroy');

      /*
      $(".page-container:not(.menu-waypointed)").addClass("menu-waypointed").waypoint(function(direction, s) {
          var id = $(this).attr("id")
          if (id != undefined) {
            $("nav li.active").removeClass("active");
            $("*[data-target='"+id+"']").parent().addClass("active");
          }
      });

      $(".home-page:not(.waypointed)").addClass("waypointed").waypoint(function(direction, s) {
          var id = $(this).attr("id")
          if (id != undefined) {
            $("nav li.active").removeClass("active");
            $("*[data-target='"+id+"']").parent().addClass("active");
          }
      }, {offset: -1});
      */

      $(".no-menu-page:not(.waypointed)").addClass("waypointed").waypoint(function(direction, s) {
            $(".side-container").addClass("reduced-side-container");
      }, {offset: $(window).height()}); //offset was 500
      $(".no-menu-page:not(.waypointed2)").addClass("waypointed2").waypoint(function(direction, s) {
            $(".side-container").addClass("reduced-side-container");
      }, {offset: 0});
      $(".no-menu-page:not(.waypointed3)").addClass("waypointed2").waypoint(function(direction, s) {
            $(".side-container").addClass("reduced-side-container");
      }, {offset: -1*($(window).height()/2)});


      $(".page-container:not(.waypointed,.no-menu-page)").addClass("waypointed").waypoint(function(direction, s) {
          $(".side-container").removeClass("reduced-side-container");
      }, {offset: 500});
      $(".page-container:not(.waypointed2,.no-menu-page)").addClass("waypointed2").waypoint(function(direction, s) {
          $(".side-container").removeClass("reduced-side-container");
      }, {offset: 0});


    },

    initStellar: function() {
      /* DESTROY Existing Stellar */
      try {
          $("*[data-stellar-ratio]").css("transform", "none");
          $(window).data('plugin_stellar').destroy();
      } catch(e) {}


      if (Util.environment.isMobile()) {
          enableParallax = Config.enableMobileParallax;
      } else {
          enableParallax = Config.enableParallax;
      }
      if (!enableParallax) {
          // dont init stellar
          return false;
      }
      try {
        $(window).data('plugin_stellar').init();
      } catch(e) {}
      $.stellar.positionProperty.foobar = {

          setPosition: function($el, x, startX, y, startY) {
              if ($el.hasClass("hparallax")) {
                console.log(startY, y, $el.offset().top);
                if ($el.offset().top < y) {
                  $el.css('background-position', (y - startY - $el.offset().top + $(window).height()/2) + 'px ' + (x - startX) + 'px ');
                }


                  /*
                  //$el.css({opacity: 1/(y - startY)});
                  var transformX = (-1 * (y - startY));
                  transformXfinal = transformX > 0 ? transformX * -1 : transformX;
                  $el.css('transform', 'translate3d(' +
                  Math.min((-1 * ((y - startY)/6)), 0) + 'px, ' +
                  //    transformXfinal + 'px, ' +
                      (0) + 'px, ' +
                  '0)');*/
              } else if ($el.hasClass("custom-parallax")) {
                  $el.css('background-position',
                  (x - startX) + 'px ' +
                  (y - startY - $el.offset().top) + 'px '
                  );
              } else {
                  $el.css('transform', 'translate3d(' +
                  (x - startX) + 'px, ' +
                  (y - startY) + 'px, ' +
                  '0)');
              }

          }
      }



      /* INITIALIZE Stellar */
      jQuery(window).stellar( {

          // Set scrolling to be in either one or both directions
          horizontalScrolling: false,
          verticalScrolling: true,

          // Set the global alignment offsets
          horizontalOffset: 0,
          verticalOffset: 0,

          // Refreshes parallax content on window load and resize
          responsive: false,

          // Select which property is used to calculate scroll.
          // Choose 'scroll', 'position', 'margin' or 'transform',
          // or write your own 'scrollProperty' plugin.
          scrollProperty: 'scroll',

          // Select which property is used to position elements.
          // Choose between 'position' or 'transform',
          // or write your own 'positionProperty' plugin.
          //positionProperty: 'transform',
          positionProperty: 'foobar',


          // Enable or disable the two types of parallax
          parallaxBackgrounds: true,
          parallaxElements: true,

          // Hide parallax elements that move outside the viewport
          hideDistantElements: false,

          // Customise how elements are shown and hidden
          hideElement: function($elem) { $elem.hide(); },
          showElement: function($elem) { $elem.show(); }
      });
    },
    botherToScroll: function() {
      setInterval(function() {
        $(".scroll-prompt").css("bottom", 0);
        setTimeout(function() {
          $(".scroll-prompt").css("bottom", -5);
        }, 500);
      }, 800);

    },
    loadDone: function() {
      setTimeout(function() {
        if (Util.getScrollTop() == 0) {
          //$(".side-container").addClass("reduced-side-container");
        }
        $(".loading").fadeOut(function() {
          $("body").removeClass("before-load");
          $(".scale-down").removeClass("scale-down");
          setTimeout(function() {
            $("body").removeClass("before-load-2");
            App.botherToScroll();
			App.initMaps();
          }, 400);
        });

        $(".content-container").addClass("transition-rotate");

      }, 500);
    }
  }
  $(window).scroll(function() {
    var percent = Util.getScrollTop()/($("body").height()-$(window).height()) *100;
    $(".website-progress").width(percent + "%");
  })
  $(window).resize(function() {
    App.initStellar(); // for responsiveness

    //($(".hide-on-low-height").offset().top - $(".hide-on-low-height").parent().offset().top + $(".hide-on-low-height").height())
    $(".hide-on-low-height").each(function() {
      if (($(this).offset().top - $(this).parent().offset().top + $(this).height()) > $(window).height()) {
        $(this).css({opacity: 0});
      } else {
        $(this).css({opacity: 1});
      }
    });

    if (Util.environment.isMobile()) {
      if (!$(".rest-section").hasClass("height-done")) {

        // CHANGED
        $(".rest-section").css({height: $(".rest-section").height()}).addClass("height-done");
      }

    }

    //CHANGED AGAIN
    $(".rest-section").addClass("hide-mobile");



    $(".page-container:not(.auto-height), .full-height-space").css({minHeight: $(window).height()});
    $(".content-container", ".page-container:not(.auto-height)").css({minHeight: $(window).height()});

    $(".half-height-space").css({minHeight: $(window).height()/2});
    $(".quarter-height-space").css({minHeight: $(window).height()/4});

    $(".go-out").each(function() {
      $(this).css({marginTop: -1*$(this).height()});
    });
    App.initStellar();
    App.initItrSlider();
    App.initWaypoints();
    App.initIsotope();
    App.initPopups();
    App.initHelpers();

    setTimeout(function() {
      $(".go-out").each(function() {
        $(this).css({marginTop: -1*$(this).height()});
      });
    }, 500);

  });
  $(window).trigger("resize");

  $(window).load(function() {
    $(".color").stop().animate({"width": "100%"}, 500);

    setTimeout(function() {
      App.loadDone();
      App.initWaypoints(); //this is required after slider heights are set

      if (hash = window.location.hash) {
        $elem = $("#"+hash.replace("#",""));
        if ($elem.length) {
          if (Util.environment.isMobile() && !Util.environment.isTablet())
            $("body, html").animate({scrollTop: $elem.offset().top - 130}, Config.scrollDuration);
          else
            $("body, html").animate({scrollTop: $elem.offset().top}, Config.scrollDuration);
        }
      }

    }, 1);
    //App.loadDone();
  })
  App.init();

})(jQuery);
