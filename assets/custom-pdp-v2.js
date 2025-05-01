document.addEventListener('DOMContentLoaded', function() {

  function highlightSelectedProduct() {
    const pathParts = window.location.pathname.split('/');
    const productHandle = pathParts[pathParts.indexOf('products') + 1];
    
    if (!productHandle) return;
    
    document.querySelectorAll('.sibling-product-link').forEach(item => {
      item.classList.remove('active-product');
    });
    
    const selectedProduct = document.querySelector(`.sibling-product-link[data-product-handle="${productHandle}"]`);
    if (selectedProduct) {
      selectedProduct.classList.add('active-product');
    }
  }
  
  highlightSelectedProduct();
  
  document.querySelectorAll('.sibling-product-link').forEach(link => {
    link.addEventListener('click', function(e) {
      if (e.target === this || this.contains(e.target)) {
        document.querySelectorAll('.sibling-product-link').forEach(item => {
          item.classList.remove('active-product');
        });
        
        this.classList.add('active-product');
      }
    });
  });
});



// script to handle radio options clicking area
// document.addEventListener('DOMContentLoaded', function() {
//     function initRadioOptions() {
//       const radioOptions = document.querySelectorAll('.rc-radio.rc-option');
      
//       if (!radioOptions.length) {
//         setTimeout(initRadioOptions, 500); // Retry if not loaded yet
//         return;
//       }
      
//       radioOptions.forEach(option => {
//         option.removeEventListener('click', handleOptionClick); // Prevent duplicates
//         option.addEventListener('click', handleOptionClick);
//       });
//     }
  
//     function handleOptionClick(e) {
//       const radioInput = this.querySelector('input[type="radio"]');
//       if (!radioInput) return;
      
//       document.querySelectorAll('.rc-radio.rc-option').forEach(opt => {
//         opt.classList.remove('rc_widget__option--active', 'rc-option--active');
//       });
      
//       this.classList.add('rc_widget__option--active', 'rc-option--active');
      
//       if (!radioInput.checked) {
//         radioInput.checked = true;
//         radioInput.dispatchEvent(new Event('change', { bubbles: true }));
//       }
//     }
  
//     initRadioOptions();
//   });


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
    
    // Simply trigger a click on the input (browser handles the rest)
    radioInput.click();
  }

  initRadioOptions();
});