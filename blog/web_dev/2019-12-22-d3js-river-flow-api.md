---
layout: post
title:  "D3js River flows"
date: 2019-12-22
published: true
tags: [js, D3]
---

I'm working on a website for a rafting non-profit.  I thought it would be cool if they could display the flow data for local rivers.  I also thought this would be good time for me to learn more about D3js and the  [USGS instantaneous flow data API](https://waterservices.usgs.gov/rest/IV-Service.html).  

{%- include "d3/linechart/river_flow.html" -%}

For the design, I need to accomplish a few customizations of a [standard line chart](web_dev_notes/_posts/2018-10-28-basic_lineChart).  

1. I wanted to use fetch to get the data using the USGS instantaneous flow data API and plot the received data on the fly.
2. The chart needs to be responsive.
3. I wanted to plot an area chart instead of a line chart.  
4. I wanted to plot the tick marks inside of the chart instead of in the margins for a nice looking design.

I'll break everythin down below.  If you are just here for the JS scripts, here they are.

```js
<script src="https://d3js.org/d3.v5.min.js"></script>

<script>
flowChart();
async function flowChart(){
  let waterUrl = "https://nwis.waterservices.usgs.gov/nwis/iv/?format=json&sites=09166500&startDT=2020-04-27&endDT=2020-05-03&parameterCd=00060&siteStatus=all"

  let timeFormat = d3.timeFormat("%m-%d-%Y %H");
  //Call the api
  const response = await fetch(waterUrl);
  const jsonData = await response.json();
  console.log(jsonData)

  //Parse the data returned from api
  let sites = jsonData.value.timeSeries[0];
  let riverName = sites.sourceInfo.siteName.toLowerCase().split(/ at | near /);
  let flowData = sites.values[0].value.map(({dateTime, value})=>({date:new Date(dateTime), value:parseFloat(value)}));

  //build chart

  // set the dimensions and margins of the graph
  let margin = {top: 10, right: 30, bottom: 30, left: 50},
    width = 600 - margin.right-margin.left,
    height = 400 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  let svg = d3.select("#my_dataviz")
    .append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 " +(width) + " " + (height))
    .append("g")
      .attr("transform",
            "translate(0 ,0)");
  let x = d3.scaleTime()
    .domain(d3.extent(flowData, function(d){return d.date}))
    .range([0,width]);
  svg.append("g")
    .attr("transform", "translate("+margin.right+","+(height-margin.bottom)+")")
    .attr("stroke-width", "0")
    .call(d3.axisBottom(x)
         .ticks(d3.timeDay.every(1)));

  let y = d3.scaleLinear()
    .domain([0, (d3.max(flowData, function(d) { return +d.value; })*1.2)])
    .range([height, 0]);
  svg.append("g")
    .attr("transform", "translate(40, 0)")
    .attr("stroke-width", "0")
    .attr("class", "x-axis")
    .call(d3.axisLeft(y)
            .ticks(5))

  svg.append("path")
    .datum(flowData)
    .attr("fill", "#FF5722")
    .attr("stroke", 'none')
    .attr("opacity", "0.45")
    .attr('d', d3.area()
            .x(function(d){return x(d.date)})
            .y0(y(0))
            .y1(function(d){return y(d.value)})
         )
  }

</script>
```


## Fetching the data and making it usable.

The first steps in plotting any chart is getting data.  In this case we will be pulling river flow data for 7 days for my home town river, the Dolores River.  I used the USGS [API generator](https://waterservices.usgs.gov/rest/IV-Test-Tool.html) to generate a URL to pull data for seven days over the summer.

```bash
https://nwis.waterservices.usgs.gov/nwis/iv/?format=json&sites=09166500&startDT=2019-07-09&endDT=2019-07-16&parameterCd=00060&siteStatus=all
```

There are two ways to use [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API):  I prefer calling fetch inside of an asynchronous function. I don't know why, but this method seems to make more sense to me.

```js
<script>
flowChart();
async function flowChart(){
  let waterUrl = "https://nwis.waterservices.usgs.gov/nwis/iv/?format=json&sites=09166500&startDT=2020-04-27&endDT=2020-05-03&parameterCd=00060&siteStatus=all"

  //Call the api
  const response = await fetch(waterUrl);
  const jsonData = await response.json();
  console.log(jsonData)
}
</script>
```

Let's break this down:
1. `flowChart();` calls the async function.
2. `async function flowChart(){}` sets us up to write a async function called `flowChart()` which has already been called.
3. `let waterUrl` assigns the API url to a variable to be used in the next step.
4. `const response = await fetch(waterUrl);` fetches the data from the API.  `await` is used here to wait until the data has been returned to assign the data to the variable.
5. Similarly `const jsonData = await response.json();` waits for the response to be to be converted to json with `.json()` and then assigned to the variable.

The result should be json data that includes the stream flow data that we want to plot in a timeseries along with a bunch of other information that the API provides.  Consoled out  —  `console.log(jsonData)` —  the beginning of the data should look like this:

```js
{
"name": "ns1:timeSeriesResponseType",
"declaredType": "org.cuahsi.waterml.TimeSeriesResponseType",
"scope": "javax.xml.bind.JAXBElement$GlobalScope",
"value": {
  "queryInfo": {
    "queryURL": "http://nwis.waterservices.usgs.gov/nwis/iv/format=json&sites=09166500&startDT=2019-07-09&endDT=2019-07-16&parameterCd=00060&siteStatus=all",
    "criteria": {
      "locationParam": "[ALL:09166500]",
      "variableParam": "[00060]",
      "timeParam": {
      "beginDateTime": "2019-07-09T00:00:00.000",
      "endDateTime": "2019-07-16T23:59:59.000"
      },
      "parameter": []
      },
    "note": [
      {
        "value": "[ALL:09166500]",
        "title": "filter:sites"
      },
      {
        "value": "[mode=RANGE, modifiedSince=null] interval={INTERVAL[2019-07-09T00:00:00.000-04:00/2019-07-16T23:59:59.000Z]}",
        "title": "filter:timeRange"
      }, //....way more json below
    }
  }
}

```
Next we will parse the incoming data.

```js
<script>
flowChart();
async function flowChart(){
  let waterUrl = "https://nwis.waterservices.usgs.gov/nwis/iv/?format=json&sites=09166500&startDT=2019-07-09&endDT=2019-07-16&parameterCd=00060&siteStatus=all"

  //Call the api
  const response = await fetch(waterUrl);
  const jsonData = await response.json();
  console.log(jsonData)

  //Parse the data returned from api
  let sites = jsonData.value.timeSeries[0];
  let flowData = sites.values[0].value.map(({dateTime, value})=>({date:new Date(dateTime), value:parseFloat(value)}));
}
</script>
```

1. The `let sites = jsonData.value.timeSeries[0];` first we create a variable `site` that will be the base for the rest of the parsing. Within the jsonData variable, we go to `value`, then `timeseries[0]`. I did this because I may call more than one river at a time for my application.  You can skip this step if you want by pasting `jsonData.value.timeSeries[0]` in place of `sites` in the next step.
2. The next step we'll break down. First we parse down to the time series value data `sites.values[0].value`. Then we use the .map() function to convert the dateTime variable, and the value variable to an array with a date formatted date column and a numerical value column.  We assign the result to a flowData function. The result should look like so: `let flowData = sites.values[0].value.map(({dateTime, value})=>({date:new Date(dateTime), value:parseFloat(value)}));`

Now we have our usable data we need to use D3 to chart the data.

## Making a Responsive Chart
```js
let svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 " +(width) + " " + (height))
  .append("g")
    .attr("transform",
          "translate(0 ,0)");
```
The key here is many examples give the chart a `height` and a `width`.  Examples also usually use some fancy javascript to check the height and the width of the window and then reset the size of the chart to make it responsive. A simple way to convert a plain chart to a responsive chart is to set the viewBox attribute — instead of a hard coded height and width — `.attr("viewBox", "0 0 " +(width) + " " + (height))` and preserve the aspect ratio `.attr("preserveAspectRatio", "xMinYMin meet")`.

## Area chart instead of a line chart
```js
svg.append("path")
  .datum(flowData)
  //some other .attr
  .attr('d', d3.area()
          .x(function(d){return x(d.date)})
          .y0(y(0))
          .y1(function(d){return y(d.value)})
       )
```

To plot an area chart you replace `.attr('d', d3.line())` with `.attr('d', d3.area())` and provide two y values, one for the upper bound of the area chart and one for the bottom (usually 0), instead of one.   The x value stays the same as it would for any line chart.

## Plotting the tick marks inside the chart.

This one was tricky for me.  For whatever reason I couldn't figure out how to make the axis have less of a width than the chart.  But really that is all you need to do is make the length or width of the axis smaller than the chart.  You have to be a little careful though because you want the ticks to line up appropriately with the data.

To understand this let's first look at the base chart.

```js
// set the dimensions and margins of the graph
let margin = {top: 10, right: 30, bottom: 30, left: 50},
  width = 600,
  height = 400;

// append the svg object to the body of the page
let svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 " +width + " " + height);
```

As we looked at above we have a svg that is appended to a `<div>` with a id of `#my_dataviz` that we set a `viewBox` attribute on of `"0 0" + width + " "+ height + "`.  Typically, we would set the width and the height to some value minus margins. The margins allow for axis marks outside of the chart. But in this case we want the axis marks to be inside of the chart. So the widths do not subtract the margins.

Next we create the x-axis and append that to the `svg`.

```js
// set the dimensions and margins of the graph
let margin = {top: 10, right: 30, bottom: 30, left: 50},
  width = 600,
  height = 400;

// append the svg object to the body of the page
let svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 " +width + " " + height);

let x = d3.scaleTime()
  .domain(d3.extent(flowData, function(d){return d.date}))
  .range([0,width]);
svg.append("g")
  .attr("transform", "translate(0,"+(height-margin.bottom)+")")
  .attr("stroke-width", "0")
  .call(d3.axisBottom(x)
       .ticks(d3.timeDay.every(1)));
```

We give the x-axis a domain of the `flowData`, `date` and a range of the entire width of the chart. We append the axis an `<g>` element within the `svg`. We then want to transform the with a `.attr` to put the axis in place.  The difference here from your standard chart is that we need to translate along the y-axis by the `height-margin.bottom` instead of just the `height` like you would in a standard plot with the axis below the chart. Subtracting the margin pulls the axis from below the chart (not visible because it is outside of the svg) to within the chart.

The last step is to plot the y-axis.

```js
//build chart

// set the dimensions and margins of the graph
let margin = {top: 10, right: 40, bottom: 30, left: 50},
  width = 600,
  height = 400;

// append the svg object to the body of the page
let svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 " +width + " " + height)

let x = d3.scaleTime()
  .domain(d3.extent(flowData, function(d){return d.date}))
  .range([0,width]);
svg.append("g")
  .attr("transform", "translate(0,"+(height-margin.bottom)+")")
  .attr("stroke-width", "0")
  .attr("class", "x-axis")
  .call(d3.axisBottom(x)
       .ticks(d3.timeDay.every(1)));

let y = d3.scaleLinear()
  .domain([0, (d3.max(flowData, function(d) { return +d.value; })*1.2)])
  .range([height, 0]);
svg.append("g")
  .attr("transform", "translate(" + margin.right + ", 0)")
  .attr("stroke-width", "0")
  .attr("class", "y-axis")
  .call(d3.axisLeft(y)
          .ticks(5))
```

This time we will use `d3.scaleLinear` because the actual flow volumes are continuous. Domain and Range are similar to above, but I multiply the max of the values by 1.2 because I want some space within the plot for a title.  After we append the element we translate by `margin.right`, to move the axis within the chart.   

## The HTML and CSS:
The rest of the chart is completed by css and some html.  Some imortant things happen here.  We hide some of the axis marks because having them inside the chart creates overlap between the x and y-axis.  We also style the associated info.  Ideally the html for the info would be automatically generated by the chart, but that is a bit much form one tutorial.

The non JS stuff looks like so:

```html
<script src="https://d3js.org/d3.v5.min.js"></script>

<style>
.tick line{
  visibility:hidden;
}
.x-axis g:first-of-type{
  visibility:hidden;
}
.y-axis g:first-of-type{
  visibility:hidden;
}
.container{
  background:#efefef;
  position:relative;
  margin-bottom: 25px;
}
.container svg{
  font-size:12px;
  font-weight:300;
  color:#666666;

}
.chart-text{
  position: absolute;
  width: 100%;
  margin-top:40px;
}
.chart-text p, .chart-text h2{
  position:relative;
  width: 100%;
  text-align:center;

}
.chart-text p:first-of-type{
  font-size:50px;
  color:rgba(255, 87, 34, 0.6);
  margin-bottom:0;
}
.chart-text p:first-of-type span{
  color:#777777;
  font-size:18px;
}
.chart-text h2{
  margin-top:0;
  line-height:0.8;
  margin-bottom:10px;
}
.chart-text p:last-of-type{
  color:#777777;
  font-size:20px;
}
</style>

<div class="container">
  <div class="chart-text">
    <p>900<span>cfs</span></p>
    <h2>Dolores River</h2>
    <p>At Dolores, CO</p>
  </div>
  <div id="my_dataviz" class="vis"></div>

</div>

<script>
flowChart();
async function flowChart(){
  let waterUrl = "https://nwis.waterservices.usgs.gov/nwis/iv/?format=json&sites=09166500&startDT=2019-07-09&endDT=2019-07-16&parameterCd=00060&siteStatus=all"

  let timeFormat = d3.timeFormat("%m-%d-%Y %H");
  //Call the api
  const response = await fetch(waterUrl);
  const jsonData = await response.json();
  console.log(jsonData)

  //Parse the data returned from api
  let sites = jsonData.value.timeSeries[0];
  let riverName = sites.sourceInfo.siteName.toLowerCase().split(/ at | near /);
  let flowData = sites.values[0].value.map(({dateTime, value})=>({date:new Date(dateTime), value:parseFloat(value)}));

  //build chart

  // set the dimensions and margins of the graph
  let margin = {top: 10, right: 30, bottom: 30, left: 50},
    width = 600,
    height = 400;

  // append the svg object to the body of the page
  let svg = d3.select("#my_dataviz")
    .append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 " +width + " " + height)

  let x = d3.scaleTime()
    .domain(d3.extent(flowData, function(d){return d.date}))
    .range([0,width]);
  svg.append("g")
    .attr("transform", "translate(0,"+(height-margin.bottom)+")")
    .attr("stroke-width", "0")
    .attr("class", "x-axis")
    .call(d3.axisBottom(x)
         .ticks(d3.timeDay.every(1)));

  let y = d3.scaleLinear()
    .domain([0, (d3.max(flowData, function(d) { return +d.value; })*1.2)])
    .range([height, 0]);
  svg.append("g")
    .attr("transform", "translate(40, 0)")
    .attr("stroke-width", "0")
    .attr("class", "y-axis")
    .call(d3.axisLeft(y)
            .ticks(5))

  svg.append("path")
    .datum(flowData)
    .attr("fill", "#FF5722")
    .attr("stroke", 'none')
    .attr("opacity", "0.45")
    .attr('d', d3.area()
            .x(function(d){return x(d.date)})
            .y0(y(0))
            .y1(function(d){return y(d.value)})
         )
}

</script>

```
