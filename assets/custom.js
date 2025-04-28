window.applylyvecomClickEvents = function(){
  document.querySelectorAll(".custom-video-play").forEach(el => {
    el.addEventListener("click", function(e) {
      // Find the mux-player element
      var muxPlayer = e.currentTarget.closest(".main-product__info").querySelector(".Script_Tag_outer .lyvecom_story_event--page").shadowRoot.querySelector("#mux-player");
      // Create a custom click event with bubbles enabled
      var clickEvent = new Event('click', {
        bubbles: true,
        cancelable: true
      });
      // Dispatch the custom event
      if (muxPlayer) {
        muxPlayer.dispatchEvent(clickEvent);
        document.querySelector(".Video_container_outer").classList.add("loading");
        setTimeout(function() {
          document.querySelector(".Video_container_outer").classList.remove("loading");
        }, 2000);
      }
    });
  }); 
}
window.applylyvecomClickEvents();
document.addEventListener("DOMContentLoaded", (event) => {
  if (window.location.href.indexOf("/products/") !== -1) {
    window.appendCustomDataToRechargeWidget(window.currentVariant, true);
    window.updateStickyATC(window.currentVariant, window.strings.moneyFormat.replace("{{amount_no_decimals}}", (window.currentVariant.price / 100).toFixed(0)), true);
    window.updateVariantBadges(window.currentVariant);
    window.updateVariantFaq(window.currentVariant);
    window.videoSection(window.currentVariant);
    window.appendAccordionEvent();
    window.comparisionChart(window.currentVariant);
    
    const submitButton = document.querySelector(".main-product");
    const stickyDiv = document.getElementById('stickyDiv');
    const stickyHeader = document.querySelector("height-calc nav");

    function isSubmitButtonOutOfView() {
      const rect = submitButton.getBoundingClientRect();
      return (rect.bottom < 0 || rect.top > window.innerHeight);
    }

    function toggleStickyDiv() {
      if (isSubmitButtonOutOfView()) {
        console.log("Submit btn out of view")
        stickyDiv.classList.add('sticky-visible');
        stickyDiv.classList.remove('sticky-hidden');
      } else {
        console.log("Submit btn in view")
        stickyDiv.classList.add('sticky-hidden');
        stickyDiv.classList.remove('sticky-visible');
      }
    }
    window.addEventListener('scroll', toggleStickyDiv);
    window.addEventListener('resize', toggleStickyDiv);
    toggleStickyDiv();
    document.querySelector("[sticky-div] [sticky-buy-now]").addEventListener("click", function(e) {
      const submitButton = document.querySelector("product-form button[type=submit]");
      if (submitButton) {
        const event = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        });
        submitButton.dispatchEvent(event);
      }
    });
  }
});
window.updateStickyATC = function(variant = null, priceBeforeDisc, onVariantChange) {
  let oneTimePrice = parseFloat(priceBeforeDisc.replace(/[^0-9.]/g, ''));
  let getDiscountedPrice = (oneTimePrice * (1 - window.variantMetafieldData[window.currentVariant.id].special_discount / 100)).toFixed(0);
  oneTimePrice = window.Shopify.money_format.replace("{{amount_no_decimals}}", getDiscountedPrice);
  const checkedInput = document.querySelector(".rc-widget input:checked");
  if (checkedInput && checkedInput.value === "subscription") {
    if (variant) {
      if (onVariantChange) {
        if (variant.featured_image) {
          document.querySelector("[sticky-div] .sticky-product-media img").src = variant.featured_image.src;
        }
        // console.log(window.variantMetafieldData[variant.id].variantDirections);
        if (document.querySelector('[sticky-div] [product-Variant-title]') && variant.title) {
          document.querySelector('[sticky-div] [product-Variant-title]').innerHTML = variant.title;
        }
        if (document.querySelector(".product-price-main [total-count]") && window.variantMetafieldData[variant.id]?.variantTotalCount) {
          document.querySelector(".product-price-main [total-count]").innerHTML = window.variantMetafieldData[variant.id].variantTotalCount;
        }
        if (document.querySelector(".product-price-main [variant-per-day-count]") && window.variantMetafieldData[variant.id]?.variantPerDayCount) {
          document.querySelector(".product-price-main [variant-per-day-count]").innerHTML = window.variantMetafieldData[variant.id].variantPerDayCount;
        }
        if (document.querySelector("[custom-description]") && window.variantMetafieldData[variant.id]?.description) {
          document.querySelector("[custom-description]").innerHTML = window.variantMetafieldData[variant.id].description;
        }
        if (document.querySelector("[variant-directions]") && window.variantMetafieldData[variant.id]?.variant_directions) {
          document.querySelector("[variant-directions]").innerHTML = window.variantMetafieldData[variant.id].variant_directions;
        }
        if (document.querySelector("[variant-ingredients]") && window.variantMetafieldData[variant.id]?.variant_ingredients) {
          document.querySelector("[variant-ingredients]").innerHTML = window.variantMetafieldData[variant.id].variant_ingredients;
        }      
      }
    }
    
    document.querySelector(".rc-widget .one-time-purchase-loader")?.classList.remove("visually-hidden");
    document.querySelector(".rc-widget .one-time-price-inner-span")?.classList.add("visually-hidden");
    
    setTimeout(function() {
      if (!document.querySelector(".rc-radio__input")) return;
      let discountedPrice = document.querySelector(".rc-radio__input").closest("label").querySelector("label span .rc-radio__price").innerHTML;
      document.querySelector('[sticky-div] [sticky-product-price]').innerHTML = `<s>${priceBeforeDisc}</s><span>${discountedPrice}</span>`;
      document.querySelector(".main-product .product-form__buttons .btn .btn--text").innerHTML = `<span class="ATC_Button">Buy Now</span><span class="ATC_Button_Price"><s>${priceBeforeDisc}</s><span>${discountedPrice}</span></span>`;
      document.querySelector(".main-product__price__wrapper .product-price_top").innerHTML = `<div class="product-price_top"><span class="price"><s>${priceBeforeDisc}</s></span><span class="price">${discountedPrice}</span></div>`;
      let oneTimeInnerText = document.querySelector(".onetime-radio .rc-radio__label").innerText;
      document.querySelector(".onetime-radio .rc-radio__label").innerHTML = `<span class="rc-onetime-label">One-time purchase</span> 
      <span class="rc-onetime-price">
        <div class="col-3 one-time-purchase-loader">
          <div class="snippet" data-title="dot-flashing">
            <div class="stage">
              <div class="dot-flashing"></div>
            </div>
          </div>
        </div>
        <span class="one-time-price-inner-span" >
          ${oneTimePrice}
        </span>
      </span>`;
      document.querySelector(".rc-widget .one-time-purchase-loader")?.classList.add("visually-hidden");
      document.querySelector(".rc-widget .one-time-price-inner-span")?.classList.remove("visually-hidden");
    }, 1000);
  } else {
    if (variant) {
      if (onVariantChange) {
        if (variant.featured_image) {
          document.querySelector("[sticky-div] .sticky-product-media img").src = variant.featured_image.src;
        }
        // console.log(window.variantMetafieldData[variant.id].variantDirections);
        if (document.querySelector('[sticky-div] [product-Variant-title]') && variant?.title) {
          document.querySelector('[sticky-div] [product-Variant-title]').innerHTML = variant.title;
        }
        if (document.querySelector(".product-price-main [total-count]") && window.variantMetafieldData[variant.id]?.variantTotalCount) {
          document.querySelector(".product-price-main [total-count]").innerHTML = window.variantMetafieldData[variant.id].variantTotalCount;
        }        
        if (document.querySelector(".product-price-main [variant-per-day-count]") && window.variantMetafieldData[variant.id]?.variantPerDayCount) {
          document.querySelector(".product-price-main [variant-per-day-count]").innerHTML = window.variantMetafieldData[variant.id].variantPerDayCount;
        }
        if (document.querySelector("[custom-description]") && window.variantMetafieldData[variant.id]?.description) {
          document.querySelector("[custom-description]").innerHTML = window.variantMetafieldData[variant.id].description;
        }
        if (document.querySelector("[variant-directions]") && window.variantMetafieldData[variant.id]?.variant_directions) {
          document.querySelector("[variant-directions]").innerHTML = window.variantMetafieldData[variant.id].variant_directions;
        }
        if (document.querySelector("[variant-ingredients]") && window.variantMetafieldData[variant.id]?.variant_ingredients) {
          document.querySelector("[variant-ingredients]").innerHTML = window.variantMetafieldData[variant.id].variant_ingredients;
        }
      }
    }

    document.querySelector(".rc-widget .one-time-purchase-loader")?.classList.remove("visually-hidden");
    document.querySelector(".rc-widget .one-time-price-inner-span")?.classList.add("visually-hidden");
    
    setTimeout(function() {
      // if(!document.querySelector(".rc-radio__input")) return;
      let discountedPrice = document.querySelector(".rc-radio__input")?.closest("label").querySelector("label span .rc-radio__price").innerHTML;
      document.querySelector('[sticky-div] [sticky-product-price]').innerHTML = `<span>${oneTimePrice}</span>`;
      document.querySelector(".main-product .product-form__buttons .btn .btn--text").innerHTML = `<span class="ATC_Button">Buy Now</span><span class="ATC_Button_Price"><span>${oneTimePrice}</span></span>`;
      if (document.querySelector(".onetime-radio .rc-radio__label")) {
        let oneTimeInnerText = document.querySelector(".onetime-radio .rc-radio__label").innerText;
        document.querySelector(".onetime-radio .rc-radio__label").innerHTML = `<span class="rc-onetime-label">One-time purchase</span> 
          <span class="rc-onetime-price">
          <div class="col-3 one-time-purchase-loader">
            <div class="snippet" data-title="dot-flashing">
              <div class="stage">
                <div class="dot-flashing"></div>
              </div>
            </div>
          </div>
          <span class="one-time-price-inner-span" >
            ${oneTimePrice}
          </span>`;
          document.querySelector(".rc-widget .one-time-purchase-loader")?.classList.add("visually-hidden");
          document.querySelector(".rc-widget .one-time-price-inner-span")?.classList.remove("visually-hidden");
      }
      if(document.querySelector(".rc-radio__input") != null){
        if (window.variantMetafieldData[window.currentVariant.id].special_discount != 0) {
          document.querySelector(".product-price-main .product-price_top").innerHTML = `<span class="price"> <s>${ window.Shopify.money_format.replace("{{amount_no_decimals}}", (window.currentVariant.price / 100).toFixed(0) ) }</s></span><span class="price"> ${ oneTimePrice }</span>`;
        } else {
          document.querySelector(".product-price-main .product-price_top").innerHTML = `<span class="price"> ${ window.Shopify.money_format.replace("{{amount_no_decimals}}", (window.currentVariant.price / 100).toFixed(0) ) }</span>`;
        }
      }
    }, 1000);
  }
};

/* Variant Based Video -- Start */

// Function to unmount and remount the widget
function reloadLyveComWidget(newParams) {
  // Wait until LyveComWidget is loaded
  const interval = setInterval(() => {
    if (typeof LyveComWidget !== 'undefined' && LyveComWidget.mountStoryEventPage) {
      clearInterval(interval); // Stop the interval once LyveComWidget is loaded

      // Unmount if the widget is already mounted
      if (LyveComWidget.unmountStoryEventPage) {
        LyveComWidget.unmountStoryEventPage();
      }

      const container = document.querySelector(newParams.parentElement);
      if (container) {
        // Temporarily remove the container to ensure a full reset
        const parent = container.parentNode;
        parent.removeChild(container);

        // Add it back after a slight delay to allow for reflow
        setTimeout(() => {
          parent.appendChild(container);
          container.innerHTML = ''; // Clear any existing content

          // Now mount the widget with the given parameters
          LyveComWidget.mountStoryEventPage(newParams);
        }, 10); // 10ms delay for reflow
      }
    }
  }, 50); // Check every 50ms for LyveComWidget availability
}


window.videoSection = function(variant) {
  const variantVideoHTML = window.variantMetafieldData[variant.id].variant_video;
  const variantVideoId = window.variantMetafieldData[variant.id].variant_video_id;

  const videoHTMLString = window.variantMetafieldData[variant.id].variant_video.replaceAll("##script##", "script");
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = videoHTMLString;
  const videoContainer = document.querySelector('custom-variant-video');
  if(videoContainer){
    videoContainer.innerHTML = tempDiv.querySelector('custom-variant-video').innerHTML;
    window.applylyvecomClickEvents();
  }

  // if(variantVideoId){
  //   window.hideLyvecomVideo();
  //   const params = {
  //     account: variantVideoId,
  //     parentElement: '#lyvecom_story_event--page',
  //     lng: 'en',
  //     stories: true,
  //     storyEvent: true,
  //     position: 'left',
  //     positionLeft: '0',
  //     positionBottom: '0'
  //   };
  //   reloadLyveComWidget(params);  
  // }
};
/* Variant Based Video -- End */

/* Variant Based Badges -- Start */
window.updateVariantBadges = function(variant){
  const badgeHTMLString = window.variantMetafieldData[variant.id].variant_badges;
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = badgeHTMLString;
  const variantProductBadgesContainer = document.querySelector('product-badges');
  if(variantProductBadgesContainer){
    variantProductBadgesContainer.innerHTML = tempDiv.querySelector('product-badges').innerHTML; 
  }
}
/* Variant Based Badges -- End */


/* Variant Based FAQ -- Start */
window.updateVariantFaq = function(variant){
  const badgeHTMLString = window.variantMetafieldData[variant.id].variant_faqs;
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = badgeHTMLString;
  const variantProductFaqContainer = document.querySelector('variant-based-faq');
  if(variantProductFaqContainer){
    variantProductFaqContainer.innerHTML = tempDiv.querySelector('variant-based-faq').innerHTML; 
  }
  window.appendAccordionEvent();
}

// Get all accordion items
window.appendAccordionEvent = function(){
  const accordionItems = document.querySelectorAll('.variant-faqs');
  accordionItems.forEach(item => {
    if(!item.classList.contains("event-added")){
      item.classList.add("event-added");
      const header = item.querySelector('.faq-question');
      const content = item.querySelector('.faq-answer');
      header.addEventListener('click', () => {
        item.classList.toggle('active');
        const contentHeight = content.scrollHeight + 'px';
        if (item.classList.contains('active')) {
          content.style.maxHeight = contentHeight;
        } else {
          content.style.maxHeight = '0';
        }
      });
    }
  });
}
/* Variant Based FAQ -- End */

/* Variant Based Commparision Chart -- Start */

window.comparisionChart = function(variant) {
  try {
    // Ensure variant data and comparision chart HTML are available
    const variantData = window.variantMetafieldData[variant.id];
    if (!variantData) {
      console.warn(`No data found for variant ID: ${variant.id}`);
      return;
    }

    const comparisionHTMLString = variantData.variant_comparision_chart;
    if (!comparisionHTMLString) {
      console.warn(`No comparison chart HTML found for variant ID: ${variant.id}`);
      return;
    }

    // Create a temporary div to parse the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = comparisionHTMLString;

    // Check if target container is available
    const variantProductFaqContainer = document.querySelector('variant-based-comparision-chart');
    if (!variantProductFaqContainer) {
      console.warn("Target container 'variant-based-comparision-chart' not found in the DOM.");
      return;
    }

    // Check if parsed HTML contains the expected structure
    const newContent = tempDiv.querySelector('variant-based-comparision-chart');
    if (!newContent) {
      console.warn("Parsed HTML does not contain 'variant-based-comparision-chart' structure.");
      return;
    }

    // Update the container's inner HTML
    variantProductFaqContainer.innerHTML = newContent.innerHTML;
    // console.log("Comparison chart updated successfully.");

  } catch (error) {
    console.error("An error occurred while updating the comparison chart:", error);
  }
}


/* Variant Based Commparision Chart -- End */

window.hideLyvecomVideo = function() {
  const intervalId = setInterval(function() {
    let shadowHost = document.querySelector('.lyvecom_story_event--page');
    let shadowRoot = shadowHost ? shadowHost.shadowRoot : null;
    if (shadowRoot) {
      const containerDiv = shadowRoot.querySelector('.ui.container');
      if (containerDiv) {
        const videoDiv = containerDiv.querySelector('.event-component.story-event');
        if (videoDiv) {
          videoDiv.style.display = 'inline-block';
          videoDiv.style.verticalAlign = 'middle';
          videoDiv.style.width = '100%';
          const wrapperElement = containerDiv.querySelector(".event-component--wrapper");
          if (wrapperElement) {
            wrapperElement.insertAdjacentHTML('afterend', `
              <div style="flex: 1 0 0;" class="event-component--content">
                <h2 style="font-family: PPObjectSans;font-size: 18px;font-weight: 700;line-height: 20px;letter-spacing: -0.3px;text-align: left;color: #333333;margin-bottom: 16px;">
                  Title
                </h2>
                <p style="font-family: PPObjectSans;font-size: 14px;font-weight: 400;line-height: 20px;letter-spacing: -0.3px;text-align: left;color: #333333;">
                    Lorem ipsum dolor sit amet consectetur. Sed eu nulla morbi semper auctor eget facilisi congue velit.
                </p>
              </div>
            `);
          }
        }
        containerDiv.style.width = "auto";
        shadowHost.style.opacity = "0";
        shadowHost.style.visibility = "hidden";
        shadowHost.style.height = "0";
        clearInterval(intervalId);
      }
    }
  }, 100);
}
window.hideLyvecomVideo();


function roundPercentageInString(str) {
  const match = str.match(/(\d+\.\d+|\d+)%/);
  if (!match) return str;
  const percentage = parseFloat(match[1]);
  const roundedPercentage = Math.round(percentage);
  return str.replace(match[1], roundedPercentage);
}

// Additional functionality for first list item update
window.showShipFreeDetailsInRecharge = function() {
  let textToReturn = ""
  // const selectedSize = document.querySelector('.select_size input[type="radio"]:checked').value;

  if(window.variantMetafieldData[window.currentVariant.id].tempVariantShipFreeMessageInRechargeWidget.trim() != ""){
    textToReturn = window.variantMetafieldData[window.currentVariant.id].tempVariantShipFreeMessageInRechargeWidget;
  }
  else{
    // Do else part :: Or apply default string

    // if (selectedSize.includes("1 Month")) {
    //   textToReturn = "Ships free every month";
    // } else if (selectedSize.includes("2 Month")) {
    //   textToReturn = "Ships free every 2 months";
    // } else if (selectedSize.includes("3 Month")) {
    //   textToReturn = "Ships free every 3 months";
    // } else if (selectedSize.includes("4 Month")) {
    //   textToReturn = "Ships free every 4 months";
    // } else if (selectedSize.includes("5 Month")) {
    //   textToReturn = "Ships free every 5 months";
    // } else if (selectedSize.includes("6 Month")) {
    //   textToReturn = "Ships free every 6 months";
    // } else {
    //   textToReturn = "Ships free every month";
    // }
  }
  
  if(window.variantMetafieldData[window.currentVariant.id].variant_hide_ship_free_in_recharge_widget){
    if(document.querySelector(".rc__shipping_text")){
      document.querySelector(".rc__shipping_text").innerHTML = textToReturn;
    }
  }
  else{
    if(document.querySelector(".rc__shipping_text")){
      document.querySelector(".rc__shipping_text").innerHTML = "";
    }
  }
}

window.appendCustomDataToRechargeWidget = function(variant, onload) {
  // console.log("window.appendCustomDataToRechargeWidget function called ")
  if (window.location.href.indexOf("/products/") !== -1) {
    var productHandle = window.location.pathname.match(/\/products\/([a-z0-9\-]+)/)[1];
    if(!document.querySelector(".rc-price-before-discount") && !onload){
      window.updateStickyATC(variant, window.strings.moneyFormat.replace("{{amount_no_decimals}}", (variant.price / 100).toFixed(0)), true);      
      window.videoSection(variant);
      window.updateVariantBadges(variant);
      window.updateVariantFaq(variant);
      window.comparisionChart(variant);
    }
    else if (document.querySelector(".rc-price-before-discount")) {
      // console.log("IN IF")
      document.querySelector(".rc-price-before-discount").innerHTML = window.strings.moneyFormat.replace("{{amount_no_decimals}}", (variant.price / 100).toFixed(0));
      const labelElement = document.querySelector(".rc-radio__input").closest("label").querySelector(".rc-radio__label");
      labelElement.querySelector(".rc-radio__subscription").innerHTML = roundPercentageInString(labelElement.querySelector(".rc-radio__subscription").innerHTML);
      window.updateStickyATC(variant, window.strings.moneyFormat.replace("{{amount_no_decimals}}", (variant.price / 100).toFixed(0)), true);      
      window.videoSection(variant);
      window.updateVariantBadges(variant);
      window.updateVariantFaq(variant);
      window.comparisionChart(variant);
    } else {
      // console.log("IN ELSE")
      function checkAndInsertElement() {
        let interval = setInterval(() => {
          let targetElement = document.querySelector(".rc-radio__input");
          let discountedPriceATC = document.querySelector(".rc-radio__input") ? document.querySelector(".rc-radio__input").closest("label").querySelector("label span .rc-radio__price").innerHTML : "";
          // Ensure priceBeforeDisc is fetched safely
          let priceElement = document.querySelector(".main-product__details .product-price_top .price");
          let priceBeforeDisc = priceElement ? priceElement.innerText.replace("USD", "").trim() : "";
          let oneTimePrice = (window.currentVariant.price / 100).toFixed(0);
          // let getDiscountedPrice = (oneTimePrice * (1 - window.variantMetafieldData[window.currentVariant.id].special_discount / 100)).toFixed(0);
          oneTimePrice = window.Shopify.money_format.replace("{{amount_no_decimals}}", oneTimePrice);
          if (targetElement && priceBeforeDisc && !document.querySelector(".rc-radio__input").closest("label").querySelector("label span .rc-price-before-discount")) {
            let obj = `<span class="rc-price-before-discount">${(window.currentVariant.selling_plan_allocations.length != 0) ? priceBeforeDisc : ""}</span> 
                               <ul class="nws-rc-custom-values">
                                    <li class="rc__shipping_text"></li>
                                    <li>VIP discounts & perks</li>
                                    <li>Pause, edit or cancel anytime</li>
                               </ul>`;
            document.querySelector(".rc-radio__input").closest("label").querySelector("label span").insertAdjacentHTML('beforeend', obj);
            const labelElement = document.querySelector(".rc-radio__input").closest("label").querySelector(".rc-radio__label");
            const childSpans = labelElement.querySelectorAll(":scope > span");
            const rcPriceOuterDiv = document.createElement('div');
            rcPriceOuterDiv.classList.add('rc-price-outer');
            const rcPriceInnerDiv = document.createElement('div');
            rcPriceInnerDiv.classList.add('rc-price-inner');
            childSpans.forEach(span => {
              if (span.classList.contains('rc-radio__price') || span.classList.contains('rc-price-before-discount')) {
                rcPriceInnerDiv.prepend(span);
              } else {
                rcPriceOuterDiv.prepend(span);
              }
            });
            rcPriceOuterDiv.append(rcPriceInnerDiv);
            labelElement.prepend(rcPriceOuterDiv);

            labelElement.querySelector(".rc-radio__subscription").innerHTML = roundPercentageInString(labelElement.querySelector(".rc-radio__subscription").innerHTML);


            
            // RC One time changes
            let oneTimeInnerText = document.querySelector(".onetime-radio .rc-radio__label").innerText;
            document.querySelector(".onetime-radio .rc-radio__label").innerHTML = `<span class="rc-onetime-label">One-time purchase</span> <span class="rc-onetime-price">${priceBeforeDisc}</span>`;
            // window.updateStickyATC(variant, priceBeforeDisc, false);
            window.applyRcChangeEvent();
            clearInterval(interval);
          }
          window.updateStickyATC(variant, priceBeforeDisc, false);
          // Update Buy Now button
          let btnText = document.querySelector(".main-product .product-form__buttons .btn .btn--text");
          if (btnText) {
            btnText.innerHTML = window.currentVariant.selling_plan_allocations.length == 0 ? `<span class="ATC_Button">Buy Now</span><span class="ATC_Button_Price">${priceBeforeDisc}<span>${discountedPriceATC}</span></span>` : `<span class="ATC_Button">Buy Now</span><span class="ATC_Button_Price"><s>${priceBeforeDisc}</s><span>${discountedPriceATC}</span></span>`;
          }
          if (window.currentVariant.selling_plan_allocations.length == 0) {
            clearInterval(interval);
          }
          window.showShipFreeDetailsInRecharge();
        }, 500);
      }
      checkAndInsertElement();
    }
  }
};
window.applyRcChangeEvent = function() {
  document.querySelectorAll(".rc-widget input").forEach(el => {
    el.addEventListener("change", function(e) {
      let priceBeforeDisc = document.querySelector(".main-product__details .product-price_top .price").innerText.replace("USD", "").trim();
      if (e.currentTarget.value == "subscription") {
        window.updateStickyATC(window.currentVariant, priceBeforeDisc, false);
      } else {
        window.updateStickyATC(null, priceBeforeDisc, false);
      }
    });
  });
};
window.handleOnVariantChange = function(variant) {
  window.currentVariant = variant;
  if (typeof window.variantMetafieldData !== "undefined") {
    if (window.variantMetafieldData[variant.id].tempImagesHTML) {
      if (window.variantMetafieldData[variant.id].tempImagesHTML.trim() != "") {
        let tempImagesHTML = window.variantMetafieldData[variant.id].tempImagesHTML;
        let tempDiv = document.createElement('div');
        tempDiv.innerHTML = tempImagesHTML;
        document.querySelector("product-carousel .product-main-slide-container .swiper-wrapper").innerHTML = tempDiv.querySelector(".desktop-images").innerHTML;
        document.querySelector("product-carousel .swiper-thumbnails [thumbnail-slider] .swiper-wrapper").innerHTML = tempDiv.querySelector(".mobile-images [thumbnail-slider] .swiper-wrapper").innerHTML;
        document.querySelector("product-zoom-carousel .product-main-slide-container .swiper-wrapper").innerHTML = tempDiv.querySelector(".carousel-zoom").innerHTML;
      }
    }
  }
  window.showShipFreeDetailsInRecharge();
};
if (window.location.href.indexOf("/products/") !== -1) {
  const checkForSwiperInit = setInterval(function() {
    const initializedElement = document.querySelector('product-carousel .swiper-initialized');
    if (initializedElement && window.currentVariant) {
      clearInterval(checkForSwiperInit);
      if (typeof window.currentVariant !== "undefined") {
        window.handleOnVariantChange(window.currentVariant);
      }
    }
  }, 100);
}
window.changeToNextAvailableOption = function(value) {
  let currentOption = parseInt(value) - 1;
  let nextOption = currentOption + 1;
  const fieldsetInputs = document.querySelectorAll("variant-pills fieldset")[nextOption].querySelectorAll("input");
  const checkedInput = document.querySelectorAll("variant-pills fieldset")[nextOption].querySelector("input:checked");
  let clickThisEl = "";
  if (checkedInput && !checkedInput.disabled) {
    for (let i = 0; i < fieldsetInputs.length; i++) {
      const ele = fieldsetInputs[i];
      if (!ele.disabled && !ele.classList.contains("disabled")) {
        clickThisEl = ele;
        let clickEvent = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true
        });
        clickThisEl.dispatchEvent(clickEvent);
        let changeEvent = new Event('change', {
          bubbles: true
        });
        clickThisEl.dispatchEvent(changeEvent);
        break;
      }
    }
  }
};
document.addEventListener("DOMContentLoaded", (event) => {
  function applyStyles() {
    // console.log("Applying styles...");

    const flavorFieldset = document.querySelector('.select_flavor');
    const functionFieldset = document.querySelector('.select_function');
    const rcForm = document.querySelector('label.rc-radio.rc-radio--active');
    const sliderArrows = document.querySelectorAll('.sliderPagination__next svg, .sliderPagination__prev svg');
    const sliderCircles = document.querySelectorAll('.sliderPagination__next svg circle, .sliderPagination__prev svg circle');
    const flavorExists = document.querySelector('.select_flavor input[type="radio"]');
    const selectedFunction = functionFieldset ? document.querySelector('.select_function input[type="radio"]:checked')?.value : null;

    // console.log("Flavor exists:", !!flavorExists);
    // console.log("Selected function:", selectedFunction);

    if (!rcForm || sliderArrows.length === 0 || sliderCircles.length === 0) {
      // console.log("Required elements not fully loaded, skipping applyStyles");
      return;
    }

    // Remove previous border classes
    document.querySelectorAll('.select_flavor input[type="radio"] + label, .select_size input[type="radio"] + label, .select_function input[type="radio"] + label').forEach(label => {
      label.classList.remove('orange-border', 'black-border');
    });

    const checkedFlavorLabel = document.querySelector('.select_flavor input[type="radio"]:checked + label');
    const checkedSizeLabel = document.querySelector('.select_size input[type="radio"]:checked + label');
    const checkedFunctionLabel = document.querySelector('.select_function input[type="radio"]:checked + label');

    // Style adjustments based on flavor existence and function selection
    if (flavorExists && (!selectedFunction || selectedFunction === "Core")) {
      flavorFieldset.style.display = 'block'; // Show flavor fieldset for Core
      rcForm.classList.remove('black-border');
      rcForm.classList.add('orange-border');
      checkedFunctionLabel?.classList.add('orange-border');
      checkedFlavorLabel?.classList.add('orange-border');
      checkedSizeLabel?.classList.add('orange-border');
      sliderArrows.forEach(arrow => arrow.style.fill = '#f57e26');
      sliderCircles.forEach(circle => circle.style.stroke = '#f57e26');
      // console.log("Applied orange styling.");
    } else {
      // flavorFieldset.style.display = 'none'; // Hide flavor fieldset for Daily Performance Gummy
      // rcForm.classList.remove('orange-border');
      // rcForm.classList.add('black-border');
      // checkedFunctionLabel?.classList.add('black-border');
      // checkedSizeLabel?.classList.add('black-border');
      // sliderArrows.forEach(arrow => arrow.style.fill = 'black');
      // sliderCircles.forEach(circle => circle.style.stroke = 'black');
      // // console.log("Applied black styling.");

      try {
        // Check if flavorFieldset exists before styling it
        if (flavorFieldset) {
          flavorFieldset.style.display = 'none'; // Hide flavor fieldset for Daily Performance Gummy
        } else {
          console.warn("flavorFieldset not found.");
        }
      
        // Check if rcForm exists and apply styling
        if (rcForm) {
          rcForm.classList.remove('orange-border');
          rcForm.classList.add('black-border');
        } else {
          console.warn("rcForm not found.");
        }
      
        // Check if checkedFunctionLabel exists and apply styling
        if (checkedFunctionLabel) {
          checkedFunctionLabel.classList.add('black-border');
        } else {
          console.warn("checkedFunctionLabel not found.");
        }
      
        // Check if checkedSizeLabel exists and apply styling
        if (checkedSizeLabel) {
          checkedSizeLabel.classList.add('black-border');
        } else {
          console.warn("checkedSizeLabel not found.");
        }
      
        // Check if sliderArrows is an array and apply styling to each arrow
        if (sliderArrows && sliderArrows.length > 0) {
          sliderArrows.forEach(arrow => arrow.style.fill = 'black');
        } else {
          console.warn("sliderArrows array is empty or undefined.");
        }
      
        // Check if sliderCircles is an array and apply styling to each circle
        if (sliderCircles && sliderCircles.length > 0) {
          sliderCircles.forEach(circle => circle.style.stroke = 'black');
        } else {
          console.warn("sliderCircles array is empty or undefined.");
        }
      
        // console.log("Applied black styling.");
      } catch (error) {
        console.error("An error occurred while applying styling:", error);
      }

      
    }
  }

  // Function to check for required elements and apply styles when found
  function checkForElements() {
    // // console.log("Checking for elements...");
    const rcForm = document.querySelector('label.rc-radio.rc-radio--active');
    const sliderArrows = document.querySelectorAll('.sliderPagination__next svg, .sliderPagination__prev svg');

    if (rcForm && sliderArrows.length > 0) {
      // console.log("Elements found, applying styles");
      applyStyles();
      clearInterval(checkIntervalElements);  // Clear interval after successful styling
    }
  }

  const checkIntervalElements = setInterval(checkForElements, 500);

  // Event listeners for radio buttons to trigger style updates on change
  document.querySelectorAll('.select_function input[type="radio"], .select_flavor input[type="radio"], .select_size input[type="radio"]').forEach(function(radio) {
    radio.addEventListener('change', applyStyles);
  });

  // Initial styling on page load
  applyStyles();
  let checkIntervalFirstItem;
  
  // function checkForFirstListItem() {
  //   try {
  //     const firstListItem = document.querySelector('.nws-rc-custom-values li:first-child');
  
  //     if (firstListItem) {
  //       clearInterval(checkIntervalFirstItem); // Clear interval for list item check
  
  //       const radioButtons = document.querySelectorAll('.select_size input[type="radio"]');
  //       if (radioButtons.length === 0) {
  //         console.warn("No radio buttons found in .select_size. Exiting.");
  //         return;
  //       }
  
  //       radioButtons.forEach(radio => {
  //         radio.addEventListener('change', function () {
  //           try {
  //             const selectedSize = this.value;
  //             if (!selectedSize) {
  //               console.warn("Radio button change event triggered, but no value found.");
  //               return;
  //             }
  
  //             if (selectedSize.includes("1 Month")) {
  //               firstListItem.textContent = "Ships free every month";
  //             } else if (selectedSize.includes("2 Month")) {
  //               firstListItem.textContent = "Ships free every 2 months";
  //             } else if (selectedSize.includes("3 Month")) {
  //               firstListItem.textContent = "Ships free every 3 months";
  //             } else if (selectedSize.includes("4 Month")) {
  //               firstListItem.textContent = "Ships free every 4 months";
  //             } else if (selectedSize.includes("5 Month")) {
  //               firstListItem.textContent = "Ships free every 5 months";
  //             } else if (selectedSize.includes("6 Month")) {
  //               firstListItem.textContent = "Ships free every 6 months";
  //             } else {
  //               firstListItem.textContent = "Ships free every month";
  //             }
  //           } catch (error) {
  //             console.error("Error occurred while handling size selection change:", error);
  //           }
  //         });
  //       });
  //     } else {
  //       console.warn("First list item not found in .nws-rc-custom-values.");
  //     }
  //   } catch (error) {
  //     console.error("An error occurred during the checkForFirstListItem execution:", error);
  //   }
  // }
  
  // try {
  //   if (window.rechargeWidgetStrings['show_ship_free']) {
  //     // Assign the interval to the outer-scoped variable
  //     checkIntervalFirstItem = setInterval(checkForFirstListItem, 500);
  //   } else {
  //     console.warn("window.rechargeWidgetStrings['show_ship_free'] is not defined or falsy.");
  //   }
  // } catch (error) {
  //   console.error("An error occurred while setting up the interval for checkForFirstListItem:", error);
  // }

});
