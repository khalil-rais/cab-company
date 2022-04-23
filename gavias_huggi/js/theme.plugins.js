(function ($) {
   "use strict";
  
   //------- OWL carousle init  ---------------
    jQuery(document).ready(function(){
      $('.init-carousel-owl').each(function(){ 
        var items = 4;
        var items_lg = 3;
        var items_md = 2;
        items = $(this).data('items');
        switch (items){
          case 1:
            items_lg = items_md = 1;
          break;
          case 2:
            items_lg = items_md = 2;
          break;
          case 3: 
            items_lg = 3; items_md = 2;
          break;
          case 4: 
            items_lg = 3; items_md = 2;
          break;
          case 5: 
            items_lg = 4; items_md = 2;
          break;
          case 6: 
            items_lg = 4; items_md = 2; 
          break;  
           default: items_lg = items - 2; items_md = items - 3;
        }
         
        $(this).owlCarousel({
          items: items,
            nav: true,
            autoplay: false,
            autoplayTimeout: 20000,
            smartSpeed: 350,
            navText: [ '<span class="zmdi zmdi-arrow-left"></span>', '<span class="zmdi zmdi-arrow-right"></span>' ],
            autoHeight: false,
            loop: true,
            responsive : {
                0 : {
                    items: 1,
                    nav: false
                },
                640 : {
                   items : items_md
                },
                992: {
                    items : items_lg
                },
                1200: {
                    items: items
                }
            }
       }); 
     });
  });



jQuery(document).ready(function () {
 
 if ($(window).width() > 780) {
    if ( $.fn.jpreLoader ) {
      var $preloader = $( '.js-preloader' );
      $preloader.jpreLoader({
        autoClose: true,
      }, function() {
        $preloader.addClass( 'preloader-done' );
        $( 'body' ).trigger( 'preloader-done' );
        $( window ).trigger( 'resize' );
      });
    }
  }else{
    $('body').removeClass('js-preloader');
  };

 //===== WOW ============
 new WOW().init();

  var $container = $('.post-masonry-style');
  $container.imagesLoaded( function(){
      $container.masonry({
          itemSelector : '.item-masory',
          gutterWidth: 0,
          columnWidth: 1,
      }); 
  });

if($('.post-masonry-style').length){
  $('.block-views').bind('DOMNodeInserted', function(event) {
    if($(this).find('.post-masonry-style').length){
      var $container = $('.post-masonry-style');
      $container.imagesLoaded( function(){
          $container.masonry({
              itemSelector : '.item-masory',
              gutterWidth: 0,
              columnWidth: 1,
          }); 
      });
    }  
  });
}

  $('.gva-search-region .icon').on('click',function(e){
    if($(this).parent().hasClass('show')){
        $(this).parent().removeClass('show');
    }else{
        $(this).parent().addClass('show');
    }
    e.stopPropagation();
  })

  // ==================================================================================
  // Offcavas
  // ==================================================================================
  $('#menu-bar').on('click',function(e){
    if($('.gva-offcanvas-inner').hasClass('show-view')){
        $(this).removeClass('show-view');
        $('.gva-offcanvas-inner').removeClass('show-view');
    }else{
        $(this).addClass('show-view');
       $('.gva-offcanvas-inner').addClass('show-view'); 
    }
    e.stopPropagation();
  })

    /*========== Click Show Sub Menu ==========*/
   
    $('.gva-navigation a').on('click','.nav-plus',function(){
        if($(this).hasClass('nav-minus') == false){
            $(this).parent('a').parent('li').find('> ul, > div').slideDown();
            $(this).addClass('nav-minus');
        }else{
            $(this).parent('a').parent('li').find('> ul, > div').slideUp();
            $(this).removeClass('nav-minus');
        }
        return false;
    });

  /* ============ Isotope ==============*/
    if ( $.fn.isotope ) {
      $( '.isotope-items' ).each(function() {

        var $el = $( this ),
            $filter = $( '.portfolio-filter a' ),
            $loop =  $( this );

        $loop.isotope();

        $loop.imagesLoaded(function() {
          $loop.isotope( 'layout' );
        });

        if ( $filter.length > 0 ) {

          $filter.on( 'click', function( e ) {
            e.preventDefault();
            var $a = $(this);
            $filter.removeClass( 'active' );
            $a.addClass( 'active' );
            $loop.isotope({ filter: $a.data( 'filter' ) });
          });
        };
      });
    };

/*===========  Material Design Ripples ==============*/

  var $body = document.body || document.documentElement,
    $bodyStyle = $body.style,
    isTransitionsSupported = $bodyStyle.transition !== undefined || $bodyStyle.WebkitTransition !== undefined;
  var removeRipple = function($ripple) {
    $ripple.off();
    if (isTransitionsSupported) {
      $ripple.addClass("ripple-out");
    } else {
      $ripple.animate({
        "opacity": 0
      }, 100, function() {
        $ripple.trigger("transitionend");
      });
    }
    $ripple.on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
      $ripple.remove();
    });
  };

  $.fn.mdRipple = function(){
    return this.each(function(){
      var $element = $(this),
        $container, containerOffset,
        startTimer = null;

      if ( ! $element.find('.ripple-container').length){
        $element.append('<span class="ripple-container"></span>');
      }

      $container = $element.find(".ripple-container");

      var lastTouch = null;
      if ($.isMobile){
        $element.on('touchstart touchmove', function(e){
          e = e.originalEvent;
          if (e.touches.length === 1) {
            lastTouch = e.touches[0];
          }
        });
      }

      $element.on($.isMobile ? 'touchend' : 'mouseup', function(e){
        var offsetLeft, offsetTop, offsetRight,
          $ripple = $('<span class="ripple"></span>'),
          rippleSize = Math.max($element.outerWidth(), $element.outerHeight()) / Math.max(20, $ripple.outerWidth()) * 2.5;

        containerOffset = $container.offset();

        // get pointer position
        if ( ! $.isMobile){
          offsetLeft = e.pageX - containerOffset.left;
          offsetTop = e.pageY - containerOffset.top;
        } else if (lastTouch !== null) {
          offsetLeft = lastTouch.pageX - containerOffset.left;
          offsetTop = lastTouch.pageY - containerOffset.top;
          lastTouch = null;
        } else {
          return;
        }

        if ($('body').hasClass('rtl')) {
          offsetRight = $container.width() - offsetLeft;
          $ripple.css({right: offsetRight, top: offsetTop});
        }else{
          $ripple.css({left: offsetLeft, top: offsetTop});
        }

        (function() { return window.getComputedStyle($ripple[0]).opacity; })();
        $container.append($ripple);

        startTimer = setTimeout(function(){
          $ripple.css({
            "-webkit-transform": "scale(" + rippleSize + ")",
            "transform": "scale(" + rippleSize + ")"
          });
          $ripple.addClass('ripple-on');
          $ripple.data('animating', 'on');
          $ripple.data('mousedown', 'on');
        }, 25);

        setTimeout(function() {
          $ripple.data('animating', 'off');
          removeRipple($ripple);
        }, 700);

      });
    });
  };
  // Init effect
  jQuery('md-btn-effect, .btn-slide, .btn-theme, .nav > li > a, .navigation .gva_menu > li > a').mdRipple();
  

   //==== Customize =====
    $('.gavias-skins-panel .control-panel').click(function(){
        if($(this).parents('.gavias-skins-panel').hasClass('active')){
            $(this).parents('.gavias-skins-panel').removeClass('active');
        }else $(this).parents('.gavias-skins-panel').addClass('active');
    });

    $('.gavias-skins-panel .layout').click(function(){
        $('body').removeClass('wide-layout').removeClass('boxed');
        $('body').addClass($(this).data('layout'));
        $('.gavias-skins-panel .layout').removeClass('active');
        $(this).addClass('active');
        var $container = $('.post-masonry-style');
        $container.imagesLoaded( function(){
            $container.masonry({
                itemSelector : '.item-masory',
                gutterWidth: 0,
                columnWidth: 1,
            }); 
        });
    });


/*-------------Milestone Counter----------*/
  jQuery('.milestone-block').each(function() {
    jQuery(this).appear(function() {
      var $endNum = parseInt(jQuery(this).find('.milestone-number').text());
      jQuery(this).find('.milestone-number').countTo({
        from: 0,
        to: $endNum,
        speed: 4000,
        refreshInterval: 60,
      });
    },{accX: 0, accY: 0});
  });

/*----------- Animation Progress Bars --------------------*/

  $("[data-progress-animation]").each(function() {
    var $this = $(this);
    $this.appear(function() {
      var delay = ($this.attr("data-appear-animation-delay") ? $this.attr("data-appear-animation-delay") : 1);
      if(delay > 1) $this.css("animation-delay", delay + "ms");
      setTimeout(function() { $this.animate({width: $this.attr("data-progress-animation")}, 800);}, delay);
    }, {accX: 0, accY: -50});
  });
  
  /*----------------------------------------------------*/
  /*  Pie Charts
  /*----------------------------------------------------*/

  var pieChartClass = 'pieChart',
      pieChartLoadedClass = 'pie-chart-loaded';
    
  function initPieCharts() {
    var chart = $('.' + pieChartClass);
    chart.each(function() {
      $(this).appear(function() {
        var $this = $(this),
          chartBarColor = ($this.data('bar-color')) ? $this.data('bar-color') : "#F54F36",
          chartBarWidth = ($this.data('bar-width')) ? ($this.data('bar-width')) : 150
        if( !$this.hasClass(pieChartLoadedClass) ) {
          $this.easyPieChart({
            animate: 2000,
            size: chartBarWidth,
            lineWidth: 8,
            scaleColor: false,
            trackColor: "#eee",
            barColor: chartBarColor,
          }).addClass(pieChartLoadedClass);
        }
      });
    });
  }
  initPieCharts();

 /*-------------------------------------------------------*/
      /* Video box
  /*-------------------------------------------------------*/

$('.modal-video-box').each(function(){
   $(this).on('hidden.bs.modal', function () {
      var clone = $(this).find('.modal-body').html();
      $(this).find('.modal-body').html('');
      $(this).find('.modal-body').html(clone);
  })
})

  // ============================================================================
  // Fixed top Menu Bar
  // ============================================================================
   if($('.gv-sticky-menu').length > 0){
      var sticky = new Waypoint.Sticky({
        element: $('.gv-sticky-menu')[0]
    });
   }  


});


})(jQuery);
