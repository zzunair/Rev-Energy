async function fetchSiblingProduct(handle) {
    try {
      highlightSelectedProduct(handle);
      
      const response = await fetch(`/products/${handle}.js`);
      const product = await response.json();
      console.log(product, 'product');
      
      window.currentProduct = product;
      
      const titleElement = document.querySelector('h4.label-heading span');
      const titleElement1 = document.querySelector('.h2.main-product__heading span.title-part');
      const titleElement2 = document.querySelector('.h2.main-product__heading span.title-part-2');

      const title = product.title.toLowerCase();

      if(title.includes('polar mint')) {
        const titleParts = title.split('polar mint');

        if(titleParts.length > 1) {
          titleElement1.textContent = 'Polar Mint';
          titleElement2.textContent = titleParts[1];
        }
      }

      if(title.includes('spearmint')) {
        const titleParts = title.split('spearmint');
        
        if(titleParts.length > 1) {
          titleElement1.textContent = 'Spearmint';
          titleElement2.textContent = titleParts[1];
        }
      }

      if(titleElement) {
        titleElement.textContent = product.title;
      }
      
      const priceElement = document.querySelector('.product-price_top');
      if(priceElement) {
        priceElement.innerHTML = `<span class="price-item--regular">${Shopify.formatMoney(product.price)}</span>`;
      }
      
      const firstAvailableVariant = product.variants.find(v => v.available) || product.variants[0];
      if(firstAvailableVariant) {
          document.querySelectorAll('input[name="id"]').forEach(input => {
          input.value = firstAvailableVariant.id;
        });

        setTimeout(() => {
            const form = document.querySelector(`[data-product-form-id`);
            console.log(form, 'form2');
            if(form) {
                
            const sellingPlanInput = form.querySelector('input[name="selling_plan"]');
            console.log(sellingPlanInput, 'sellingPlanInput');
            
            let sellingPlanId = '';
            if(firstAvailableVariant.selling_plan_allocations && 
                firstAvailableVariant.selling_plan_allocations.length > 0) {
                sellingPlanId = firstAvailableVariant.selling_plan_allocations[0].selling_plan_id;
                console.log(sellingPlanId, 'sellingPlanId');
            }
            
            if(!sellingPlanId && product.selling_plan_groups && product.selling_plan_groups.length > 0) {
                const firstGroup = product.selling_plan_groups[0];
                if(firstGroup.selling_plans && firstGroup.selling_plans.length > 0) {
                sellingPlanId = firstGroup.selling_plans[0].id;
                console.log(sellingPlanId, 'sellingPlanId2');
                }
            }
            
            console.log("Setting selling plan ID:", sellingPlanId);
            
            if(sellingPlanInput) {
                sellingPlanInput.value = sellingPlanId || '';
            }
          
            const productIdInput = form.querySelector('input[name="product-id"]');
            if(productIdInput) {
              productIdInput.value = product.id;
            }
          
            const subsaveRadio = form.querySelector('input[value="subsave"]');
            if(sellingPlanId && subsaveRadio) {
              subsaveRadio.checked = true;
              subsaveRadio.dispatchEvent(new Event('change'));
            }
          }
      }, 1000);
        document.dispatchEvent(new CustomEvent('variant:changed', {
          detail: { 
            variant: {
              ...firstAvailableVariant,
              product_id: product.id
            }
          }
        }));
      }
      
      updateQuantityVariantsForSiblingProduct(product);
      
      const selectedQuantityInput = document.getElementById('selected-quantity');
      if (selectedQuantityInput && selectedQuantityInput.value) {
        document.querySelectorAll('form[action="/cart/add"] input[name="quantity"]').forEach(input => {
          input.value = selectedQuantityInput.value;
        });
      }
      
      initializeProductSlider(product);
      
      history.replaceState(null, null, `/products/${handle}`);
      
    } catch (error) {
      console.error('Error fetching sibling product:', error);
    }
  }
  

function updateQuantityVariantsForSiblingProduct(product) {
  const quantityVariantsContainer = document.querySelector('.quantity-variants');
  if (!quantityVariantsContainer) {
    console.warn("Quantity variants container not found");
    return;
  }
  
  console.log("Updating quantity variants for product:", product.title);
  
  let hasQuantityOption = false;
  let quantityOptionValues = [];
  let quantityOptionIndex = -1;
  
  if (product.options && product.options.length > 0) {
    for (let i = 0; i < product.options.length; i++) {
      const option = product.options[i];
      if (option && option.name && 
          (option.name.toLowerCase() === 'quantity' || 
           option.name.toLowerCase().includes('pack'))) {
        hasQuantityOption = true;
        quantityOptionValues = option.values || [];
        quantityOptionIndex = i;
        console.log("Found quantity option:", option.name, "with values:", quantityOptionValues);
        break;
      }
    }
  }
  

  if (!hasQuantityOption && product.variants && product.variants.length > 0) {
    const packVariants = product.variants.filter(variant => 
      variant.title && (
        variant.title.toLowerCase().includes('pack') || 
        variant.title.toLowerCase().includes('12') || 
        variant.title.toLowerCase().includes('24')
      )
    );
    
    if (packVariants.length > 0) {
      hasQuantityOption = true;
      quantityOptionValues = packVariants.map(v => v.title);
      console.log("Found pack variants:", quantityOptionValues);
    }
  }
  

  if (hasQuantityOption) {
    console.log("Product has quantity options - showing container");
    quantityVariantsContainer.style.display = 'block';
    quantityVariantsContainer.style.visibility = 'visible';
    quantityVariantsContainer.style.opacity = '1';
  } else {
    console.log("Product has NO quantity options - hiding container");
    quantityVariantsContainer.style.display = 'none';
    return;
  }
  

  const quantityOptions = document.querySelectorAll('.quantity-option');
  

  quantityOptions.forEach(option => {
    option.style.display = 'block';
  });
  

  const previouslyActiveOption = document.querySelector('.quantity-option.active');
  const previouslySelectedQuantity = previouslyActiveOption ? 
    previouslyActiveOption.getAttribute('data-quantity') : '12';
  
  quantityOptions.forEach(option => {
    option.classList.remove('active');
  });
  
  let hasSetActive = false;
  
  quantityOptions.forEach(option => {
    const optionQuantity = option.getAttribute('data-quantity');
    
    const matchingOptionValue = quantityOptionValues.find(val => 
      val.includes(optionQuantity) || 
      val.toLowerCase() === (optionQuantity + ' packs').toLowerCase()
    );
    
    if (matchingOptionValue) {
      console.log(`Option ${optionQuantity} matches product value ${matchingOptionValue}`);
      
      if (optionQuantity === previouslySelectedQuantity) {
        option.classList.add('active');
        hasSetActive = true;
      }
      
      option.style.display = 'block';
    } else {
      console.log(`Option ${optionQuantity} not found in product options`);
      option.style.display = 'none';
    }
  });
  
  if (!hasSetActive) {
    const firstVisibleOption = Array.from(quantityOptions).find(opt => 
      opt.style.display !== 'none'
    );
    
    if (firstVisibleOption) {
      firstVisibleOption.classList.add('active');
      console.log("Setting first visible option active:", firstVisibleOption.getAttribute('data-quantity'));
    }
  }
  
  const activeOption = document.querySelector('.quantity-option.active');
  if (activeOption) {
    const activeQuantity = activeOption.getAttribute('data-quantity');
    
    const selectedQuantityInput = document.getElementById('selected-quantity');
    if (selectedQuantityInput) {
      selectedQuantityInput.value = activeQuantity;
    }
    
    const selectedQuantityText = document.querySelector('.selected-quantity');
    if (selectedQuantityText) {
      selectedQuantityText.textContent = activeQuantity + ' Packs';
    }
    
    if (product.variants && product.variants.length > 0) {
      const matchingVariant = product.variants.find(variant => {
        const variantTitle = variant.title.toLowerCase();
        const quantityLower = activeQuantity.toLowerCase();
        return variantTitle.includes(quantityLower) || 
               variantTitle.includes(quantityLower + ' packs') ||
               variantTitle === quantityLower;
      });
      
      if (matchingVariant) {
        console.log("Setting initial variant for quantity", activeQuantity, ":", matchingVariant);
        
        document.querySelectorAll('input[name="id"]').forEach(input => {
          input.value = matchingVariant.id;
        });
        
        document.dispatchEvent(new CustomEvent('variant:changed', {
          detail: { 
            variant: {
              ...matchingVariant,
              product_id: product.id
            }
          }
        }));
      }
    }
    
    document.querySelectorAll('form[action="/cart/add"] input[name="quantity"]').forEach(input => {
      input.value = 1;
    });
    
    if (activeQuantity === '24' && activeOption.hasAttribute('data-discount')) {
      const discount = parseFloat(activeOption.getAttribute('data-discount'));
      if (!isNaN(discount) && discount > 0) {
        applyDiscountToPrice(discount);
      }
    } else {
      resetPrice();
    }
  }
}

function applyDiscountToPrice(discountPercentage) {
  const priceElement = document.querySelector('.product-price_top') || 
                      document.querySelector('.price__regular .price-item');
  
  if (priceElement) {
    const priceText = priceElement.textContent.trim();
    const numericPrice = parseFloat(priceText.replace(/[^0-9.]/g, ''));
    
    if (!isNaN(numericPrice)) {
      const discountAmount = (discountPercentage / 100) * numericPrice;
      const discountedPrice = numericPrice - discountAmount;
      
      const formattedPrice = '$' + discountedPrice.toFixed(2);
      const formattedOriginalPrice = '$' + numericPrice.toFixed(2);
      
      priceElement.innerHTML = `
        <span class="price-item--compare" style="text-decoration: line-through; margin-right: 10px;">${formattedOriginalPrice}</span>
        <span class="price-item--regular">${formattedPrice}</span>
      `;
    }
  }
}


function initQuantityVariants() {
  const quantityOptions = document.querySelectorAll('.quantity-option');
  
  if (window.currentProduct && window.currentProduct.variants) {
    const initialVariant = window.currentProduct.selected_variant || 
                           window.currentProduct.variants.find(v => v.available) || 
                           window.currentProduct.variants[0];
    
    if (initialVariant && initialVariant.title) {
      const variantTitle = initialVariant.title.toLowerCase();
      
      quantityOptions.forEach(option => {
        if (!option.getAttribute('data-quantity')) return;
        
        const optionQuantity = option.getAttribute('data-quantity').toLowerCase();
        
        if (variantTitle.includes(optionQuantity) || 
            variantTitle.includes(optionQuantity + ' packs') ||
            variantTitle === optionQuantity) {
          option.classList.add('active');
          
          const selectedQuantityInput = document.getElementById('selected-quantity');
          if (selectedQuantityInput) {
            selectedQuantityInput.value = option.getAttribute('data-quantity');
          }
          
          const selectedQuantityText = document.querySelector('.selected-quantity');
          if (selectedQuantityText) {
            selectedQuantityText.textContent = option.getAttribute('data-quantity') + ' Packs';
          }
        }
      });
    }
  }
  

  quantityOptions.forEach(option => {
    option.addEventListener('click', function() {

      if (this.style.display === 'none') return;
      
      quantityOptions.forEach(opt => opt.classList.remove('active'));
      
      this.classList.add('active');
      
      const quantity = this.getAttribute('data-quantity') || '12';
      
      const selectedQuantityInput = document.getElementById('selected-quantity');
      if (selectedQuantityInput) {
        selectedQuantityInput.value = quantity;
      }
      
      const selectedQuantityText = document.querySelector('.selected-quantity');
      if (selectedQuantityText) {
        selectedQuantityText.textContent = quantity + ' Packs';
      }
      
      const product = window.currentProduct || {};
      
      if (product.variants && product.variants.length > 0) {
        const matchingVariant = product.variants.find(variant => {
          if (!variant || !variant.title) return false;
          
          const variantTitle = variant.title.toLowerCase();
          const quantityLower = quantity.toLowerCase();
          return variantTitle.includes(quantityLower) || 
                 variantTitle.includes(quantityLower + ' packs') ||
                 variantTitle === quantityLower;
        });
        
        if (matchingVariant) {
          console.log("Found matching variant for quantity", quantity, ":", matchingVariant);
          
          document.querySelectorAll('input[name="id"]').forEach(input => {
            input.value = matchingVariant.id;
          });
          
          document.dispatchEvent(new CustomEvent('variant:changed', {
            detail: { 
              variant: {
                ...matchingVariant,
                product_id: product.id
              }
            }
          }));
        }
      }
      
      document.querySelectorAll('form[action="/cart/add"] input[name="quantity"]').forEach(input => {
        input.value = 1;
      });
      
      if (quantity === '24' && this.hasAttribute('data-discount')) {
        const discount = parseFloat(this.getAttribute('data-discount'));
        if (!isNaN(discount)) {
          applyDiscountToPrice(discount);
        }
      } else {
        resetPrice();
      }
    });
  });
}

function resetPrice() {
  const originalPriceElement = document.querySelector('.price-item--compare');
  const priceElement = document.querySelector('.product-price_top') || 
                       document.querySelector('.price__regular .price-item');
  
  if (originalPriceElement && priceElement) {
    const originalPrice = originalPriceElement.textContent;
    priceElement.innerHTML = `<span class="price-item--regular">${originalPrice}</span>`;
  }
}

function initCurrentProduct() {
  try {
    const variantIdInput = document.querySelector('input[name="id"]');
    if (variantIdInput && variantIdInput.value) {
      const variantId = variantIdInput.value;
      
      const pathParts = window.location.pathname.split('/');
      const productHandle = pathParts[pathParts.indexOf('products') + 1];
      
      if (productHandle) {
        highlightSelectedProduct(productHandle);
        
        fetch(`/products/${productHandle}.js`)
          .then(response => response.json())
          .then(product => {
            window.currentProduct = product;
            console.log("Fetched current product:", product);
            
            updateQuantityVariantsForSiblingProduct(product);
            
            // Initialize slider with the current product media
            initializeProductSlider(product);
          })
          .catch(error => {
            console.error("Error fetching product:", error);
          });
      }
    }
  } catch (error) {
    console.error("Error in initCurrentProduct:", error);
  }
}

// Extract slider initialization into its own function
function initializeProductSlider(product) {
  const mainSliderWrapper = document.querySelector('.product-main-slide-container .swiper-wrapper');
  const thumbSliderWrapper = document.querySelector('.swiper-thumbnails .swiper-wrapper');

  if(mainSliderWrapper && thumbSliderWrapper && product.media) {
    mainSliderWrapper.innerHTML = '';
    thumbSliderWrapper.innerHTML = '';

    product.media.forEach((media, index) => {
      const mainSlide = document.createElement('div');
      mainSlide.className = 'swiper-slide';
      mainSlide.innerHTML = `
        <div class="swiper-lazy-preloader"></div>
        <img data-src="${media.src}" 
             alt="${media.alt}" 
             class="swiper-lazy"
             data-media-id="${media.id}">`;
      mainSliderWrapper.appendChild(mainSlide);

      const thumbSlide = document.createElement('div');
      thumbSlide.className = 'swiper-slide';
      thumbSlide.innerHTML = `
        <img src="${media.preview_image.src}" 
             alt="${media.alt}" 
             class="swiper-lazy"
             data-media-target-id="media-${media.id}">`;
      thumbSliderWrapper.appendChild(thumbSlide);
    });

    const mainSwiperElement = document.querySelector('.product-main-slide-container');
    const thumbSwiperElement = document.querySelector('.swiper-thumbnails');

    if(mainSwiperElement && mainSwiperElement.swiper) {
      mainSwiperElement.swiper.destroy(true, true);
    }
    if(thumbSwiperElement && thumbSwiperElement.swiper) {
      thumbSwiperElement.swiper.destroy(true, true);
    }

    const thumbSwiper = new Swiper('.swiper-thumbnails', {
      lazy: true,
      loop: false,
      slidesPerView: 'auto',
      spaceBetween: 10,
      watchSlidesProgress: true,
      breakpoints: {
        320: {
          slidesPerView: 'auto',
          autoHeight: true
        },
        767: {
          slidesPerView: 1
        }
      }
    });

    const mainSwiper = new Swiper('.product-main-slide-container', {
      lazy: {
        loadPrevNext: true,
        loadPrevNextAmount: 2,
        loadOnTransitionStart: true
      },
      preloadImages: false,
      updateOnImagesReady: true,
      navigation: {
        nextEl: '.sliderPagination__next',
        prevEl: '.sliderPagination__prev'
      },
      thumbs: {
        swiper: thumbSwiper
      },
      slidesPerView: 1,
      autoHeight: true,
      speed: 500,
      effect: 'slide',
      preventClicks: false,
      watchSlidesProgress: true,
      breakpoints: {
        320: {
          autoHeight: true
        },
        640: {
          autoHeight: true
        }
      }
    });

    if(mainSwiper && typeof mainSwiper.update === 'function') {
      mainSwiper.update();
      mainSwiper.lazy.load();
      mainSwiper.slideTo(0, 0);
      setTimeout(() => mainSwiper.updateAutoHeight(), 500);
    }

    if(thumbSwiper) {
      thumbSwiper.update();
      thumbSwiper.slideTo(0);
      if(thumbSwiper.lazy) {
        thumbSwiper.lazy.load();
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', function initQuantityVariantsOnLoad() {
  initCurrentProduct();
  
  initQuantityVariants();
  
  const addToCartButtons = document.querySelectorAll('form[action="/cart/add"] button[type="submit"]');
  addToCartButtons.forEach(button => {
    button.addEventListener('click', function handleAddToCartClick(e) {
      const selectedQuantityInput = document.getElementById('selected-quantity');
      if (selectedQuantityInput && window.currentProduct) {
        const quantity = selectedQuantityInput.value;
        const product = window.currentProduct;
        
        if (product.variants && product.variants.length > 0) {
          const matchingVariant = product.variants.find(variant => {
            if (!variant || !variant.title) return false;
            
            const variantTitle = variant.title.toLowerCase();
            const quantityLower = quantity.toLowerCase();
            return variantTitle.includes(quantityLower) || 
                  variantTitle.includes(quantityLower + ' packs') ||
                  variantTitle === quantityLower;
          });
          
          if (matchingVariant) {
            console.log("Adding to cart:", matchingVariant);
            
            const form = this.closest('form');
            if (form) {
              const idInput = form.querySelector('input[name="id"]');
              if (idInput) {
                idInput.value = matchingVariant.id;
              }
              
              const quantityInputs = form.querySelectorAll('input[name="quantity"]');
              quantityInputs.forEach(input => {
                input.value = 1;
              });
            }
          }
        }
      }
    }, true); 
  });
  
  if (typeof variantObserver !== 'undefined' && !window.variantObserverInitialized) {
    document.querySelectorAll('input[name="id"]').forEach(input => {
      variantObserver.observe(input, { attributes: true });
    });
    window.variantObserverInitialized = true;
  }
});


document.addEventListener("DOMContentLoaded", function () {
const element = document.querySelectorAll(".sibling-product-link p");
    element.forEach(item => {
    item.textContent = item.textContent
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase());
    });
});

function highlightSelectedProduct(handle) {
  document.querySelectorAll('.sibling-product-link').forEach(item => {
    item.classList.remove('active-product');
  });
  
  const selectedProduct = document.querySelector(`.sibling-product-link[data-product-handle="${handle}"]`);
  if (selectedProduct) {
    selectedProduct.classList.add('active-product');
  }
}

document.addEventListener('DOMContentLoaded', function() {
  function initRadioOptions() {
    const radioOptions = document.querySelectorAll('.rc-radio.rc-option');
    
    if (!radioOptions.length) {
      setTimeout(initRadioOptions, 500); // Retry if not loaded yet
      return;
    }
    
    radioOptions.forEach(option => {
      option.removeEventListener('click', handleOptionClick); // Prevent duplicates
      option.addEventListener('click', handleOptionClick);
    });
  }

  function handleOptionClick(e) {
    const radioInput = this.querySelector('input[type="radio"]');
    if (!radioInput) return;
    
    document.querySelectorAll('.rc-radio.rc-option').forEach(opt => {
      opt.classList.remove('rc_widget__option--active', 'rc-option--active');
    });
    
    this.classList.add('rc_widget__option--active', 'rc-option--active');
    
    if (!radioInput.checked) {
      radioInput.checked = true;
      radioInput.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  initRadioOptions();
});