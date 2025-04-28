var targetNode = document.querySelector('.product__info-container');
var config = { attributes: true, childList: true, characterData: true ,subtree:true };   

  

 
var callback = function(mutationsList) {
  if(document.querySelector('og-prepaid-data[per-delivery-price]')){
    waitForPrepaidElement.disconnect();
setTimeout(function(){
  
    var checkboxes=document.querySelectorAll('og-prepaid-toggle');

    checkboxes.forEach((checkbox,index) => {
      
   
   if(checkbox.shadowRoot.querySelector('input[type="checkbox"]') != null)
  {
    checkbox.shadowRoot.querySelector('input[type="checkbox"]').addEventListener('click', function(e){
     
    //   var initial_percentage =  parseFloat(document.querySelectorAll('.og-saving-perc')[index].innerText.match(/(\d+)/));
      var initial_percentage =  10;
      var extra_percentage =  parseFloat(document.querySelectorAll('og-prepaid-data[extra-percentage-savings]')[index].shadowRoot.textContent);
     
      document.querySelectorAll('#qtyRadio')[index].checked=false;
      if(e.target.checked == true)
      {
          price=document.querySelectorAll('og-prepaid-data[per-delivery-price]')[index].shadowRoot.textContent;
          document.querySelectorAll('.regular-price')[index].textContent=price
   

        var comparePrice = document.querySelectorAll('.product-price')[index].querySelector('.compare-at-price').textContent;
        comparePrice=comparePrice.replace('$','') ;
        comparePrice=parseFloat(comparePrice)
        price=document.querySelectorAll('og-prepaid-data[per-delivery-price]')[index].shadowRoot.textContent;   
        newPrice=  price.replace('$','') 

        var savingsPerc = Math.round(((comparePrice - parseFloat(newPrice)) * 100)/comparePrice);
        $(".savings-percent").eq(index).text(savingsPerc); 
        console.log(newPrice)
        document.querySelectorAll('og-optin-toggle[subscribed] div[slot="default"] > span')[0].innerHTML='<span>Subscribe &amp; Save 20% <strong class="og-saving-perc">+ Free Shipping</strong><!--<og-incentive-text id="og-incentive-text" from="DiscountPercent"></og-incentive-text>--><span id="og-promo-special"></span></span>';
      
        // $('.og-saving-perc').eq(index).text(`Save an Additional ${initial_percentage+extra_percentage}%`)
      }
      else
      { 
        var toggler=document.querySelectorAll('og-optin-toggle')[index].shadowRoot;
        // $('.og-saving-perc').eq(index).text(`Save an Additional ${initial_percentage}%`)
        document.querySelectorAll('og-optin-toggle[subscribed] div[slot="default"] > span')[0].innerHTML='<span>Subscribe &amp; Save 10% <strong class="og-saving-perc">+ Free Shipping</strong><!--<og-incentive-text id="og-incentive-text" from="DiscountPercent"></og-incentive-text>--><span id="og-promo-special"></span></span>';
      
        document.querySelectorAll('#og-button-toggle')[index].click();
        document.querySelectorAll('#og-button-toggle')[index].click(); 
      }
  
    

     })  }
     });
    },5000)
    }
    }
    var waitForPrepaidElement = new MutationObserver(callback);
    waitForPrepaidElement.observe(targetNode, config);
   
  
