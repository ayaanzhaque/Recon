function initSliders(){
    $(function() {
        $( "#slider-range" ).slider({
          range: true,
          min: 0,
          max: 1440,
          values: [ 0, 1440 ],
          slide: function( event, ui ) {
  
            updateSliderUI(ui);
          }
        });
        function updateSliderUI(ui){
          var string1 =  (Math.floor(ui.values[ 0 ] / 60)< 10?'0':'') + Math.floor(ui.values[ 0 ] / 60)  + ":" +  (ui.values[ 0 ] % 60 < 10?'0':'') +  ui.values[ 0 ] % 60 
            var string2 = (Math.floor(ui.values[ 1 ] / 60)< 10?'0':'') +  Math.floor(ui.values[ 1 ] / 60)  + ":" + (ui.values[ 1 ] % 60 < 10?'0':'') +  ui.values[ 1 ] % 60 
            $( "#amount" ).val( string1 + " - " + string2 );
            updateTimeInterval(ui.values[0], ui.values[1]);
        }
        var values =  [$( "#slider-range" ).slider( "values", 0 ),  $( "#slider-range" ).slider( "values", 1 )]
        var ui = {values: values};
        updateSliderUI(ui);
        updateTimeInterval(ui.values[0], ui.values[1]);
          
      });
  
  
  
    $(function() {
        $( "#slider-range-home" ).slider({
          range: false,
          min: 0,
          max: 1000,
          values: [ 400 ],
          slide: function( event, ui ) {
            var val = $( "#slider-range-work" ).slider( "values", 0 );
            var a = projection.invert([0,ui.values[0]* 2]);
            var b = projection.invert([0,0]);
            var distance = measure(a[0], a[1], b[0], b[1]) 
            $( "#homeA" ).val( Math.round(distance) / 1000 + " Km " );
            var workCheck = document.getElementById("workCheck");
            if(workCheck.checked){
              updateHomeRadius(ui.values[0], val);
            }else{
              updateHomeRadius(ui.values[0], defaultRadius);
            }
            
            
          }
        });
        
        var values =  [$( "#slider-range-home" ).slider( "values", 0 )]
  
        var a = projection.invert([0,values[0]*2]);
        var b = projection.invert([0,0]);
  
        var ui = {values: values};
        var dist = measure(a[0], a[1], b[0], b[1])
        // console.log('dist ', dist);
        $( "#homeA" ).val(Math.round(dist) / 1000 + " Km");
  
  
        // updateHomeRadius(values[0], values[0]);
  
        $( "#slider-range-home" ).slider({ disabled: "true" });
          
    });
    $(function() {
        $( "#slider-range-work" ).slider({
          range: false,
          min: 0,
          max: 1000,
          values: [ 400 ], 
          slide: function( event, ui ) {
            var val = $( "#slider-range-home" ).slider( "values", 0 );
            var a = projection.invert([0,ui.values[0] * 2]);
            var b = projection.invert([0,0]);
            var distance = measure(a[0], a[1], b[0], b[1]) 
            $( "#workB" ).val(Math.round(distance) / 1000 + " Km " );
            var homeCheck = document.getElementById("homeCheck");
            if(homeCheck.checked){
              updateWorkRadius(ui.values[0], val);
            }else{
              updateWorkRadius(ui.values[0], defaultRadius);
            }
            
  
          }
        });
        
        var values =  [$( "#slider-range-work" ).slider( "values", 0 )]
        var ui = {values: values};
        var a = projection.invert([0,values[0]*2]);
        var b = projection.invert([0,0]);
        var dist = measure(a[0], a[1], b[0], b[1])
        // console.log('dist ', dist);
        $( "#workB" ).val(Math.round(dist) / 1000 + " Km");
  
  
        var val = $( "#slider-range-home" ).slider( "values", 0 );
        // updateWorkRadius(values[0], val);
  
  
        $( "#slider-range-work" ).slider({ disabled: true });
  
  
          
    });
  }
  function initDropDown(){
      var checkList = document.getElementById('list1');
      var items = document.getElementById('items');
      checkList.getElementsByClassName('anchor')[0].onclick = function (evt) {
          if (items.classList.contains('visible')){
              items.classList.remove('visible');
              items.style.display = "none";
          }
          
          else{
              items.classList.add('visible');
              items.style.display = "block";
          }
          
          
      }
  
      items.onblur = function(evt) {
          items.classList.remove('visible');
      }
      var categoryElement = document.querySelector('.items').getElementsByTagName("input");
      categoryElement[0].addEventListener('change', toggleAllCategories)
  
      for(var i = 1; i < categoryElement.length; i++){
          categoryElement[i].addEventListener('change', updateCheckedCategory)
      }
      function toggleAllCategories(){
        for(var i = 1; i < categoryElement.length; i++){
          categoryElement[i].checked = this.checked;
        }
  
        updateCheckedCategory(this);
      
  
      }
  
  }
  