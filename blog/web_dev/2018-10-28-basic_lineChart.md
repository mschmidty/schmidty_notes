---
layout: post
title:  "D3:Basic Line Chart"
date: 2018-10-28
published: true
tags: [js, D3]
---

This is a basic line chart built with D3.  I've written a few more tutorials on how to make charts starting out very basic and moving to a little more complex.  I'm no expert, so these are how a beginner (at both javascript and D3) would explain everything.  Some might find that methodology helpful. My previous tutorials: [My first charts](web_dev_notes/2018-10-08-d3js_first_charts), [SVG Plots](web_dev_notes/2018-10-08-d3js_svg_charts), [Scatterplot](web_dev_notes/2018-10-28-basic_lineChart).

{% include "d3/linechart/basic_linechart.html" %}

```html
<style> /* set the CSS */

.line {
  fill: none;
  stroke: steelblue;
  stroke-width: 2px;
}

</style>
<div class="chart">
  <svg class="linechart"></svg>
</div>
<script src="https://d3js.org/d3.v4.min.js"></script>
<script>
  // set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 680 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// parse the date / time
var parseTime = d3.timeParse("%d-%b-%y");

// set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the line
var valueline = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.close); });

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select(".linechart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.csv("data_path.csv", function(error, data) {
  if (error) throw error;

  // format the data
  data.forEach(function(d) {
      d.date = parseTime(d.date);
      d.close = +d.close;
  });

  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) { return d.close; })]);

  // Add the valueline path.
  svg.append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", valueline);

  // Add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // Add the Y Axis
  svg.append("g")
      .call(d3.axisLeft(y));

});


</script>

```
