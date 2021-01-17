    // Set up size
    var width = 750,
    height = width;
  
  // Set up projection that map is using
  var projection = d3.geo.mercator()
    .center([-122.433701, 37.767683]) // San Francisco, roughly
    .scale(225000)
    .translate([width / 2, height / 2]);
  // This is the mapping between <longitude, latitude> position to <x, y> pixel position on the map
  // projection([lon, lat]) returns [x, y]
  // projection.invert([x, y]) returns [lon, lat]
  
  // Add an svg element to the DOM
  var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height)
  
  var defaultRadius = 10000;
  
  // Add svg map at correct size, assumes map is saved in a subdirectory called "data"
  svg.append("image")
            .attr("width", width)
            .attr("height", height)
            .attr("xlink:href", "images/sf-map.svg")
  
  
  var loadedData = undefined
  
  
  d3.json("json_data/scpd_incidents.json", function(error, data) {
    // This function gets called when the request is resolved (either failed or succeeded)
  
    if (error) {
      // Handle error if there is any
      return console.warn(error);
    }
  
    loadedData = data
    // If there is no error, then data is actually ready to use
    var spinner = document.getElementById("spinnerWrap");
    spinner.style = "display: none;";
    visualize(data);
    initSliders();
  });
  
  var dragCircle = d3.behavior.drag()
      .on('dragstart', function () {
      d3.event.sourceEvent.stopPropagation();
      // d3.event.sourceEvent.preventDefault();// <-- Remove This
      // console.log('Start Dragging Circle');
  }).on('drag', function (d, i) {
      var dx = d3.event.x;
      var dy = d3.event.y;
      var pos = projection.invert([dx,dy])
      d.Location[0] = pos[0]
      d.Location[1] = pos[1]
      d3.select(this).attr('cx', function(d){ return dx}).attr('cy',function(d){return dy});
      var selected = d3.select(this)
  
      if(selected.attr("class") == "markA"){
  
        var dDotA = d3.select(".dotA")
        var dx = d3.event.x;
        var dy = d3.event.y;
        var pos = projection.invert([dx,dy])
        dDotA.attr('cx', function(d){ return dx}).attr('cy',function(d){return dy});
        var workRadius = d3.select(".markB").attr("r")
        updateHomeRadius(selected.attr("r"), workRadius);  
      }else{
        var dDotB = d3.select(".dotB")
        var dx = d3.event.x;
        var dy = d3.event.y;
        var pos = projection.invert([dx,dy])
        dDotB.attr('cx', function(d){ return dx}).attr('cy',function(d){return dy});
        var homeRadius = d3.select(".markA").attr("r")
        updateWorkRadius(selected.attr("r"),homeRadius);
      }
      
  });
  
  var circleAGroup;
  var circleBGroup;
  var allDataLayer;
  
  function zoom() {
    svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  }
  var points;
  
  
  function compare(a,b) {
    if (a < b)
      return -1;
    else if (a > b)
      return 1;
    else 
      return 0;
  }
  
  
  
  function visualize(data){
    // console.log("TIme to visualize! ", data.data);
    points = data.data
    allDataLayer = svg.append("g");
    circleAGroup = svg.append("g");
    circleBGroup = svg.append("g");
  
    var category = {}
    allDataLayer.selectAll("circle")
      .data(points).enter()
      .append("circle")
      .attr("class", "circles")
      .attr("cx", function (d) { category[d.Category] = category[d.Category] ? category[d.Category] + 1 : 1 ;
        return projection(d.Location)[0]; })
      .attr("cy", function (d) { return projection(d.Location)[1]; })
      .attr("r", "2px")
      .attr("fill", "#3e4cd2")
      .style("opacity", 0.5)
  
    var ul = document.getElementById("items");
  
    Object.keys(category).sort(compare);
    var catArray =[]
    for (var key in category) {
  
      catArray.push(key);
    }
    catArray.sort()
  
    var el = document.createElement("li");
    var input = document.createElement("input");
    var label = document.createElement("label");
    input.type = "checkbox";
    input.checked = true;
    input.value = "all_crimes";
    label.textContent = "ALL CRIME TYPES";
    label.value = "ALL CRIME TYPES";
    label.style = "font-weight: bold; font-size: 18px;";
    el.appendChild(input);
    el.appendChild(label);
    ul.appendChild(el);
    for (var key in catArray) {
  
      var el = document.createElement("li");
      var input = document.createElement("input");
      var label = document.createElement("label");
      input.type = "checkbox";
      input.value = catArray[key];
      input.checked = true;
      label.textContent = catArray[key] + "  (" + category[catArray[key]] + ")";
      label.value = catArray[key];
      el.appendChild(input);
      el.appendChild(label);
      ul.appendChild(el);
  
    }
    initDropDown();
  
  
    var markA = points[40] 
  
    //Mark A 
    circleAGroup.selectAll("dotA")
      .data([markA]).enter()
      // .append("text").text("A")
      .append("circle")
      .attr("class", "dotA")
      .attr("font-size", "40px")
      .attr("fill", "brown")
      // .attr("dx", function(d){return -13})
      // .attr("dy", function(d){return 15})
      .attr("cx", function (d) { return projection(d.Location)[0]; })
      .attr("cy", function (d) { return projection(d.Location)[1]; })
      .attr("r", "4px")
      .style("display", "none");
  
    circleAGroup.selectAll("markA")
      .data([markA]).enter()
      .append("circle")
      .attr("class", "markA")
      .attr("cx", function (d) {
        return projection(d.Location)[0]; })
      .attr("cy", function (d) { return projection(d.Location)[1]; })
      .attr("r", "30px")
      .style("fill", "brown") 
      .style("fill-opacity", 0.0)  
      .style("stroke-width", 3) 
      .style("stroke", "brown") 
      .style("opacity", 1.0)
      .attr("stroke", "#FFA200")
      .style("display", "none")
      .call(dragCircle);
  
  
    
  
    //MarkB
    var markB = points[100]
    
  
    var node = circleBGroup.selectAll("dotB")
        .data([markB]).enter()
        // .append("text").text("B")
        .append("circle")
        .attr("class", "dotB")
        // .attr("font-size", "40px")
        .attr("fill", "black")
        // .attr("dx", function(d){return -13})
        // .attr("dy", function(d){return 15})
        // .attr("x", function (d) { return projection(d.Location)[0]; })
        // .attr("y", function (d) { return projection(d.Location)[1]; })
        .attr("cx", function (d) { return projection(d.Location)[0]; })
        .attr("cy", function (d) { return projection(d.Location)[1]; })
        .attr("r", "4px")
        .style("fill", "green")
        .style("display", "none");
      
    
  
    circleBGroup.selectAll("markB")
      .data([markB]).enter()
      .append("circle")
      .attr("class", "markB")
      .attr("cx", function (d) { return projection(d.Location)[0]; })
      .attr("cy", function (d) { return projection(d.Location)[1]; })
      .attr("r", "30px")
      .style("fill", "green") 
      .style("fill-opacity", 0.0)  
      .style("stroke-width", 3) 
      .style("stroke", "green")
      .call(dragCircle) 
      .style("display", "none");
  
  
  
  
    // Initial starting radius of the circle 
    updateHomeRadius(defaultRadius,defaultRadius)
    updateWorkRadius(defaultRadius,defaultRadius);
  
    // d3.select("svg").on("mousedown.log", function() {
    //   // console.log(projection.invert(d3.mouse(this)));
    //   var pos = projection.invert(d3.mouse(this));
    //   // var pos =  d3.mouse(this)
    //   // console.log('PosX ', projection(d3.mouse(this)))
    //   svg.selectAll(".markB")
    //     .attr("cx", function (d) { return projection(pos)[0];})
    //     .attr("cy", function (d) { return projection(pos)[1];})
    // });
  
  
  }
  
  
  
  // update the elements
  function updateHomeRadius(nRadius, workRadius) {
  
  
    var workData = d3.selectAll(".markB").data() 
  
    var posMarkB = projection(workData[0].Location)
    svg.selectAll(".markA")
      .attr("r", nRadius);
    var markAselect = svg.selectAll(".markA").data()
    var projPosA = projection(markAselect[0].Location)
  
    allDataLayer.selectAll(".circles").style("display" , function(v) { 
      var val = checkCircleStatus(v, posMarkB, projPosA, nRadius, workRadius, this);
      return val;
    });
    updateCheckedWeekdays()
  }
  function measure(lat1, lon1, lat2, lon2){  // generally used geo measurement function
      var R = 6378.137; // Radius of earth in KM
      var dLat = (lat2 - lat1) * Math.PI / 180;
      var dLon = (lon2 - lon1) * Math.PI / 180;
      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      var d = R * c;
      return d * 1000; // meters
  }
  function updateWorkRadius(nRadius, homeRadius) {
  
    var homeData = d3.selectAll(".markA").data();
    var posMarkA = projection(homeData[0].Location)
    var markBselect = svg.selectAll(".markB").data()
    // update the circle radius
    svg.selectAll(".markB") 
      .attr("r", nRadius);
  
    var projPosB = projection(markBselect[0].Location)
    allDataLayer.selectAll(".circles")
      .style("display",function(v) { 
        var val = checkCircleStatus(v, posMarkA, projPosB, nRadius, homeRadius, this);
        return val;
    });
    updateCheckedWeekdays()
  
    
  }
  function checkCircleStatus(v, posMarkA, projPos ,nRadius, nOtherRadius, self){
  
    var projThisPos = projection(v.Location)
    var markAx = Math.pow(projThisPos[0] - posMarkA[0], 2)
    var markAy = Math.pow(projThisPos[1] - posMarkA[1], 2)
    var x = Math.pow(projThisPos[0] - projPos[0], 2)
    var y = Math.pow(projThisPos[1] - projPos[1], 2)
    var insideDayOfWeek = d3.select(self).attr("insideDayOfWeek");
    var insideTime = d3.select(self).attr("insideTime");
    var insideCategory = d3.select(self).attr("insideCategory");
  
    if (Math.sqrt(x + y) < nRadius && (Math.sqrt(markAx + markAy) < nOtherRadius)){
      d3.select(self).attr("insideCircle", true);
      if(insideDayOfWeek == "false" || insideTime == "false" || insideCategory == "false") return "none";
      return "inline-block";
    }else{
      d3.select(self).attr("insideCircle", false);
      if(insideDayOfWeek == "false" || insideTime == "false" || insideCategory == "false") return "none";
      return "none";
    } 
  }
  updateCheckedWeekdays()
  var weekDays = document.querySelector('.days').getElementsByTagName("input");
  for(var i = 0; i < weekDays.length; i++){
      weekDays[i].addEventListener('change', updateCheckedWeekdays)
  }
  
  
  var allDays = document.getElementById('allDays');
  allDays.addEventListener('change', toggleAllDays);
  function toggleAllDays(){
  
    for(var i = 0; i < weekDays.length; i++){
      weekDays[i].checked = this.checked;
    }
    updateCheckedWeekdays()
  
  }
  
  var workCheck = document.getElementById('workCheck');
  var homeCheck = document.getElementById('homeCheck');
  workCheck.addEventListener('change', toggleWorkRadius);
  homeCheck.addEventListener('change', toggleHomeRadius );
  
  
  
  function toggleHomeRadius(){
    var markAselect = svg.selectAll(".markA");
    var dotA = svg.selectAll(".dotA");
    var style = markAselect.style("display") == "none" ? "inline" : "none";
    markAselect.style("display",style);
    dotA.style("display", style);
    $( "#slider-range-home" ).slider({ disabled: style == "none" ? true : false });
    if(style == "none"){
  
      var work = $( "#slider-range-work" ).slider( "values", 0 );
      var home = $( "#slider-range-home" ).slider( "values", 0 );
      if(workCheck.checked){
        updateHomeRadius(defaultRadius,work) 
      }else{
        updateHomeRadius(defaultRadius,defaultRadius) 
      }
      
    }else{
      var work = $( "#slider-range-work" ).slider( "values", 0 );
      var home = $( "#slider-range-home" ).slider( "values", 0 );
      updateHomeRadius(home,work)
      if(workCheck.checked){
        updateHomeRadius(home,work)
      }else{
        updateHomeRadius(home,defaultRadius)
      }
      
    }
  }
  function toggleWorkRadius(){
    var markBselect = svg.selectAll(".markB");
    var dotB = svg.selectAll(".dotB");
    var style = markBselect.style("display") == "none" ? "inline" : "none";
    markBselect.style("display",style);
    dotB.style("display", style);
    $( "#slider-range-work" ).slider({ disabled:  style == "none" ? true : false });
    if(style == "none"){
      var work = $( "#slider-range-work" ).slider( "values", 0 );
      var home = $( "#slider-range-home" ).slider( "values", 0 );
      if(homeCheck.checked){
        updateWorkRadius(defaultRadius,home)
      }else{
        updateWorkRadius(defaultRadius,defaultRadius) 
      }
      
    }else{
      var work = $( "#slider-range-work" ).slider( "values", 0 );
      var home = $( "#slider-range-home" ).slider( "values", 0 );
      if(homeCheck.checked){
        updateWorkRadius(work,home)
      }else{
        updateWorkRadius(work,defaultRadius)
      }
      
    }
  }
  function updateCheckedWeekdays() {
  
    var weekDays = document.querySelector('.weekdays').getElementsByTagName("input");
    
    svg.selectAll(".circles").style("display", function(v) { 
      //So we don't ovveride the previous style 
      var insideCircle = d3.select(this).attr("insideCircle")
      var insideTime = d3.select(this).attr("insideTime")
      var insideCategory = d3.select(this).attr("insideCategory");
  
      for(var i = 0; i < weekDays.length; i++){
        if(weekDays[i].checked && weekDays[i].value == v.DayOfWeek){
          //Show this one 
          d3.select(this).attr("insideDayOfWeek", true);
  
          if(insideCircle == "false" || !insideCircle || insideTime == "false" || insideCategory == "false"){
            return "none";
          } 
          return "inline-block";
        }
      }
      //Hide this one 
      d3.select(this).attr("insideDayOfWeek", false);
      if(insideCircle == "false" || !insideCircle || insideTime == "false" || insideCategory == "false"){
        return "none";
      } 
      return "none";
    });
  
   
  }
  function updateTimeInterval(fromMinutes, toMinutes){
    svg.selectAll(".circles").style("display", function(v) { 
      //So we don't ovveride the previous style 
      var time = v.Time.split(":")
      var minutes = Number(time[0]) * 60 + Number(time[1]);
  
      var insideCircle = d3.select(this).attr("insideCircle");
      var insideDayOfWeek = d3.select(this).attr("insideDayOfWeek");
      var insideCategory = d3.select(this).attr("insideCategory");
      
      if(minutes >= fromMinutes && minutes <= toMinutes){
        d3.select(this).attr("insideTime", true);
        if(insideCircle == "false" || !insideCircle || insideDayOfWeek == "false" || insideCategory == "false"){
          return "none";
        }
        return "inline-block";
      }else{
        //We need to set this before determine wheter inside day of week and inside Maark A and B
        d3.select(this).attr("insideTime", false);
        if(insideCircle == "false" || !insideCircle || insideDayOfWeek == "false" || insideCategory == "false"){
          return "none";
        }
        return "none";
      }
  
    })
  
  }
  
  function updateCheckedCategory(cat) {
    if(cat.target){
      cat = cat.target
    }
    //If all Crimes are selected
    if(cat.value  == "all_crimes"){
      if(cat.checked){
        svg.selectAll(".circles").style("display", function(v) {
          var insideCircle = d3.select(this).attr("insideCircle");
          var insideDayOfWeek = d3.select(this).attr("insideDayOfWeek");
          var insideTime = d3.select(this).attr("insideTime");
          d3.select(this).attr("insideCategory", true);
          if(insideCircle == "false" || !insideCircle || insideDayOfWeek == "false" || insideTime == "false"){return "none";}
          return "inline-block";
        });
      }else{
        svg.selectAll(".circles").style("display", function(v) {
          d3.select(this).attr("insideCategory", false);
          var insideCircle = d3.select(this).attr("insideCircle");
          var insideDayOfWeek = d3.select(this).attr("insideDayOfWeek");
          var insideTime = d3.select(this).attr("insideTime");
          if(insideCircle == "false" || !insideCircle || insideDayOfWeek == "false" || insideTime == "false"){return "none";}
          return "none";
        });
      }
    }else{
      var self = cat;
      svg.selectAll(".circles").style("display", function(v) { 
        //So we don't ovveride the previous style 
        var insideCircle = d3.select(this).attr("insideCircle")
        var insideTime = d3.select(this).attr("insideTime")
  
  
        if(self.checked && self.value == v.Category){
          //Show this one 
          d3.select(this).attr("insideCategory", true);
  
  
          if(insideCircle == "false" || !insideCircle || insideTime == "false"){
            return "none";
          } 
          return "inline-block";
        }else if(self.value == v.Category){
          d3.select(this).attr("insideCategory", false);
          return "none";
        }
        var val = d3.select(this).style("display");
        if(insideCircle == "false" || !insideCircle || insideTime == "false"){
          return "none";
        } 
        return val;
      });
    }
  
    
  
   
  }