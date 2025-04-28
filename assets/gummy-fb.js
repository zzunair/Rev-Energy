$(window).scroll(function() {
       var height = $(window).scrollTop();
       if (height > 100) {
            $("div#shopify-section-header-01-gummy").addClass("activecopy");
             $("div#shopify-section-header-03-gummy").addClass("activecopy");
             $("div#shopify-section-header-04-gummy").addClass("activecopy");
             $("div#shopify-section-header-01-listicle").addClass("activecopy");
         
       } else {
          $('div#shopify-section-header-01-gummy').removeClass('activecopy');
          $("div#shopify-section-header-03-gummy").removeClass("activecopy");
           $("div#shopify-section-header-04-gummy").removeClass("activecopy");
           $("div#shopify-section-header-01-listicle").removeClass("activecopy");
       }


   });