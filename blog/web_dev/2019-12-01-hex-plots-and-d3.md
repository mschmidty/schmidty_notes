---
layout: post
title: "Colorado: Hex Plots, APIs, and D3js"
date: 2019-11-30
tags: [js, D3]
published: true
---

After my last [blogpost](r/2019-11-30-hex-plots-and-apis-in-r) I was a little frustrated at how poorly the title text resized using ggplot and ggsave.  It was a minor issue to be honest, but I figured I could learn something new by exporting the data as geojson and plotting it using D3 js. So here it goes.

{% include "d3/hexplots/hexplot.html" %}

### The Scripts

```html
<h3 style="text-align:center; margin-bottom:0; margin-top:1.5rem;">Precipitation in Colorado</h3>
<div class="hexplot">
</div>
<script src="https://d3js.org/d3.v5.min.js"></script>
<script>

hexChart();
async function hexChart(){
    //Call the api
  var response = await fetch("https://raw.githubusercontent.com/mschmidty/datasets/master/geo/co_precip_hex.geojson");
  var hex_data = await response.json();
  const width = 960;
  const height = 600;
  const center = d3.geoCentroid(hex_data);
  const scale  = 7000;
  const offset = [width/2, height/2];
  const projection = d3.geoEquirectangular().scale(scale).center(center)
          .translate(offset);
  const path = d3.geoPath().projection(projection);

  const colorScale = d3.scaleSequential()
    .domain([d3.max(hex_data.features, d => d.properties.total), d3.min(hex_data.features, d => d.properties.total)])
    .interpolator(d3.interpolateInferno);

  const svg = d3.select(".hexplot")
    .append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 960 600")

  svg.append("g")
      .selectAll("path")
      .data(hex_data.features)
      .enter().append("path")
        .attr("d", path)
        .attr("stroke", "white")
        .attr("stroke-width", "1.5")
        .attr("fill", function(d){return colorScale(+d.properties.total)});

};
</script>
```

It still needs a scale bar but we're pretty close.
