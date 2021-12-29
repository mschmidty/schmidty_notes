---
layout: post
title:  "D3.js Next Steps: SVG"
date: 2018-10-08
published: true
tags: [js, D3]
---

So the next big steps in making charts is instead of using html elements, d3 works really well with svg elements.  But even though svg elements are a flexible for making graphics, not that many people are familiar with them so they add another level of confusion to the process.  So let's start at the beginning with what an svg element is.

## svg
[SVG or Scalable Vector Graphics](https://en.wikipedia.org/wiki/Scalable_Vector_Graphics) are a vector image file format.  If you want to know more about them you can read up on wikipedia or check out the reference on [MDN](https://developer.mozilla.org/en-US/docs/Web/SVG). For our purposes just know that SVG are extremely flexible.  For example you can make rectangles or circles using something like this:

```html
<svg viewBox = "0 0 100 50" xmlns="http://www.w3.org/2000/svg">
  <g>
    <rect x="0" y="0" width="47.25" height="47.25" />
  <rect x="52.5" y="0" width="47.25" height="47.25" rx="10" ry="10" />
  </g>

</svg>
<svg viewBox = "0 0 100 50" xmlns="http://www.w3.org/2000/svg">
  <g>
   <circle x="0" y="0" cx="25" cy="25" r="25" />
   <circle x="0" y="0" cx="25" cy="25" r="25" transform="translate(50)"/>
   </g>
</svg>
```

Which looks like this.
<svg viewBox = "0 0 100 50" xmlns="http://www.w3.org/2000/svg">
  <g>
    <rect x="0" y="0" width="47.25" height="47.25" />
  <rect x="0" y="0" width="47.25" height="47.25" rx="10" ry="10" transform="translate(50)"/>
  </g>

</svg>
<svg viewBox = "0 0 100 50" xmlns="http://www.w3.org/2000/svg" style="padding-bottom:2rem;">
  <g>
   <circle x="0" y="0" cx="25" cy="25" r="25" transform="translate(0, -25)"/>
   <circle x="0" y="0" cx="25" cy="25" r="25" transform="translate(50, 25)" fill="#11619F"/>
   </g>
</svg>


Let's break this down a bit.  The `<svg>` element wraps everything, making it an svg.  Then we have a `<g>` element, which groups the elements within it.  Next we have two types of elements, a `<rect>` and a `<circle>`, element.  Both of these elements are two of many elements specific to svg and they both have their own unique attributes. The rect has a `width` and a `height` and the circle has `cy`, `cx` and `r` attributes.  The one attribute that we haven't talked about, and will be most important for us in D#, is the `transform=translate(50,25)`. This basically gives an x and y coordinate in percent for our element. This will become important because D3 relies heavily on this attribute to position elements. Let's look at [an example](https://bost.ocks.org/mike/bar/2/).

## Building a bar Chart with SVG and D3 Manually
Let's build the chart that we want manually. This is what we want to construct with D3:
```html
<style>

.chart rect {
  fill: steelblue;
}

.chart text {
  fill: white;
  font: 10px sans-serif;
  text-anchor: end;
}

</style>
<svg class="chart" width="420" height="120">
  <g transform="translate(0,0)">
    <rect width="40" height="19"></rect>
    <text x="37" y="9.5" dy=".35em">4</text>
  </g>
  <g transform="translate(0,20)">
    <rect width="80" height="19"></rect>
    <text x="77" y="9.5" dy=".35em">8</text>
  </g>
  <g transform="translate(0,40)">
    <rect width="150" height="19"></rect>
    <text x="147" y="9.5" dy=".35em">15</text>
  </g>
  <g transform="translate(0,60)">
    <rect width="160" height="19"></rect>
    <text x="157" y="9.5" dy=".35em">16</text>
  </g>
  <g transform="translate(0,80)">
    <rect width="230" height="19"></rect>
    <text x="0" y="9.5" dy="1em">23</text>
  </g>
  <g transform="translate(0,100)">
    <rect width="420" height="19"></rect>
    <text x="417" y="0" dy=".35em">42</text>
  </g>
</svg>

```

The chart looks like this:
<style>

.chart rect {
  fill: steelblue;
}

.chart text {
  fill: white;
  font: 10px sans-serif;
  text-anchor: end;
}

</style>
<svg class="chart" width="420" height="120">
  <g transform="translate(0,0)">
    <rect width="40" height="19"></rect>
    <text x="37" y="9.5" dy=".35em">4</text>
  </g>
  <g transform="translate(0,20)">
    <rect width="80" height="19"></rect>
    <text x="77" y="9.5" dy=".35em">8</text>
  </g>
  <g transform="translate(0,40)">
    <rect width="150" height="19"></rect>
    <text x="147" y="9.5" dy=".35em">15</text>
  </g>
  <g transform="translate(0,60)">
    <rect width="160" height="19"></rect>
    <text x="157" y="9.5" dy=".35em">16</text>
  </g>
  <g transform="translate(0,80)">
    <rect width="230" height="19"></rect>
    <text x="0" y="9.5" dy="1em">23</text>
  </g>
  <g transform="translate(0,100)">
    <rect width="420" height="19"></rect>
    <text x="417" y="0" dy=".35em">42</text>
  </g>
</svg>

You can see that the position of each bar is set by translate and each bar is set 20 percent further (0, 20, 40, 60, 80, 100). One of the more difficult things that we will do when we auto generate this is set this up automatically. The `<rect>` element we already talked about.  It has a `width` which is the value of the input multiplied by 10 just like in our last example. A new element `<text>` includes the vertical and horizontal position, `y` and `x`, and the `dy` attribute which allows for vertical alignment of the text. I have changed both the x, y and dy attributes in the last two bars so that you can see the result. Here's the [MDN page](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/text) for svg, text element if you want to read more.

## Building a bar Chart with SVG and D3 Automagically

So how do we do this automatically without having to manually put in all of those numbers.

```html
<style media="screen">
  .chart2 rect {
    fill: steelblue;
  }
  .chart2 text {
    fill: white;
    font: 10px sans-serif;
    text-anchor: end;
  }
</style>

<svg class="chart2"></svg>

<script src="//d3js.org/d3.v3.min.js" charset="utf-8"></script>

<script type="text/javascript">
  var width = 680,
    barHeight = 20;

  var x = d3.scale.linear()
    .range([0, width]);

  var chart = d3.select(".chart2")
    .attr("width", width);

  d3.tsv("data/chart2data.tsv", type, function(error, data) {
    x.domain([0, d3.max(data, function(d) {
      return d.value;
    })]);

    chart.attr("height", barHeight * data.length);

    var bar = chart.selectAll("g")
      .data(data)
      .enter().append("g")
      .attr("transform", function(d, i) {
        return "translate(0," + i * barHeight + ")";
      });

    bar.append("rect")
      .attr("width", function(d) {
        return x(d.value);
      })
      .attr("height", barHeight - 1);

    bar.append("text")
      .attr("x", function(d) {
        return x(d.value) - 3;
      })
      .attr("y", barHeight / 2)
      .attr("dy", ".35em")
      .text(function(d) {
        var f_text = d.name + ": " + d.value;

        return f_text;
      });

  });

  function type(d) {
    d.value = +d.value; // coerce to number
    return d;
  }
</script>
```
And automagically we have the same chart with a few changes.
<style media="screen">
.chart2 rect {
    fill: steelblue;
  }
.chart2 text {
  fill: white;
  font: 10px sans-serif;
  text-anchor: end;
}
</style>


<svg class="chart2"> </svg>
<script src="//d3js.org/d3.v3.min.js" charset="utf-8"></script>
<script type="text/javascript">
  var width = 680,
    barHeight = 20;

  var x = d3.scale.linear()
    .range([0, width]);

  var chart = d3.select(".chart2")
    .attr("width", width);
var data;
  d3.tsv("/web_dev_notes/assets/2018/chart2data.tsv", type, function(error, data) {
    x.domain([0, d3.max(data, function(d) {
      return d.value;
    })]);

    chart.attr("height", barHeight * data.length);

    var bar = chart.selectAll("g")
      .data(data)
      .enter().append("g")
      .attr("transform", function(d, i) {
        return "translate(0," + i * barHeight + ")";
      });

    bar.append("rect")
      .attr("width", function(d) {
        return x(d.value);
      })
      .attr("height", barHeight - 1);

    bar.append("text")
      .attr("x", function(d) {
        return x(d.value) - 3;
      })
      .attr("y", barHeight / 2)
      .attr("dy", ".35em")
      .text(function(d) {
        var f_text = d.name + ": " + d.value;
        //return d.value;
        return f_text;
      });

  });

  function type(d) {
    d.value = +d.value; // coerce to number
    return d;
  }
</script>

## A Breakdown
So what is going on here? First you must know that when you load data, there is an order to what is completed and when. In the tutorial, it explains it like this:

> "Loading data introduces a new complexity: downloads are asynchronous. When you call d3.tsv, it returns immediately while the file downloads in the background. At some point in the future when the download finishes, your callback function is invoked with the new data, or an error if the download failed. In effect your code is evaluated out of order:"

In code this looks something like this:
```js
// 1. Code here runs first, before the download starts.

d3.tsv("data.tsv", function(error, data) {
  // 3. Code here runs last, after the download finishes.
});

// 2. Code here runs second, while the file is downloading.
```
This is an important concept to understand. But we are getting a little ahead of ourselves, lets go through this step by step.

### The HTML
In the HTML, we have an `<svg>` element with a class of `.chart2` (if you have two charts on the same page with `class="chart"` it only renders the first one), we have loaded D3 and we have a script tag with our D3.js.  We also have a little bit os css to style our chart once it is rendered.

```html
<style media="screen">
.chart2 rect {
    fill: steelblue;
  }
.chart2 text {
  fill: white;
  font: 10px sans-serif;
  text-anchor: end;
}
</style>
<svg class="chart2"> </svg>
<script src="//d3js.org/d3.v3.min.js" charset="utf-8"></script>
<script type="text/javascript">
//Your D3 code goes here
</script>
```

### Width and Bar Height
Now we go inside of our `<script>` tag to start making our chart.

```js
var width = 680,
    barHeight = 20
```
First we set the `width` and `barHeight` attributes.  The actual height will be set by the number of elements in our loaded data multiplied the width of the bars.

### Set scale Width
```js
var x = d3.scale.linear()
  .range([0, width]);
```
This one is easy, we make a variable `var x`.  `x` is assigned a linear scale (heads up in V4 and V4 of D3 this is `scaleLinear()` not `scale.linear` like we have here) where the range of that scale starts at coordinate 0 and goes to the `width` set in our last variable.

### Select the Chart
```js
var chart = d3.select(".chart2")
    .attr("width", width);
```
### Load the Data and Use the Data to Construct the Chart
We have a couple of steps here, so we will break this up. Remember, what is happening in these steps happens last because we are making an asynchronous call to load the data.  Meaning, this data loads while everything else is running. Once the data is loaded, the code inside this chunk will run.  Here we go step by step:

**Load the data and set the domain (height)**<br>
First we load the data using the function [d3.tsv](https://github.com/d3/d3-fetch/blob/master/README.md#tsv).  The data is in tab separated format (.tsv).

```js
d3.tsv('data/chart2data.tsv', type, function(error, data) {
    x.domain([0, d3.max(data, function(d) {
      return d.value
    })])
    //Much more below
  })
```
So there is a lot going on here.  First we load the data. Then we apply two functions, `type` and then write our own function. I had no idea what was going on with `type` attribute. Then I remembered there was a `function type(d)` at the bottom.  The type function forces the values in the data.tsv file to be numbers.  If you don't do this, the data will be returned as characters by default (I believe).  Next we continue setting our scale which as previously been assigned to `x`. This gets a bit complex because we use another d3 function: `d3.max`. `d3.max` basically returns the max d.value, which in our case is 42.  So we have loaded the data, coerced our numeric values to numbers, and set the `x.domain` to go from 0 to 42. Got all that?

**Set the Height** <br>
We apply a `.attr` to the `chart` object that sets the height. This is done by multiplying the `barHeight` by the length of the `data` array.  
```js
chart.attr("height", barHeight * data.length);
```

**Create a bunch of `<g>` Elements** <br>
```js
var bar = chart.selectAll("g")
      .data(data)
      .enter().append("g")
      .attr("transform", function(d, i) {
        return "translate(0," + i * barHeight + ")";
});
```
To the `chart`, we selectAll `<g>` elements (which don't exist, but we are about to make them with our `data`) and then chain our `data` to the selection.  We then enter the data (for a better explanation see [my last post on this](web_dev_notes/2018-10-08-d3js_first_charts)
), then `.append` the data to the `g` element by entering it into a `.attr` by giving it a `transform` attribute that returns a function.  The function concatenates a `translate(x,y)` (read above) that keeps its x attribute at 0 because we only want to move the bars vertically not horizontally. For the y attribute, you get `i`, the iterator, advancing by one as we loop over the values, multiplied by barHeight.  For the first bar you get the first `i` which is 0 multiplied to barHeight, 20, equalling 0.  So the first `<g>` element gets has a `transform="translate(0,0)`.  The next `<g>` has an `i` of 1, so the transform is `transform="translate(0,20)`, the next `i` is 2 so you get `transform="translate(0,40)` and so on until there are no more `i`s.


**Append a `<rect>` to each `<g>`** <br>
```js
bar.append("rect")
      .attr("width", function(d) {
        return x(d.value);
      })
      .attr("height", barHeight - 1);
```
Now we append to each `<g>`, which we created in our last step, a `<rect>` element. The width of each rect is set by an added `.attr("width", //stuf//)`. The width is calculated by the scale object which scales `d.value` from our data to the correct width.  The height is set by another attribute that is equal to `barHeight-1`. The minus 1 is added to add a small margin.

**Appending `<text>` element to the `<g>` element.**<br>
```js
bar.append("text")
      .attr("x", function(d) {
        return x(d.value) - 3;
      })
      .attr("y", barHeight / 2)
      .attr("dy", ".35em")
      .text(function(d) {
        var f_text = d.name + ": " + d.value;

        return f_text;
      });
```

I am not going to explain this one becuase by now, we have gone over almost everything. Just know, we use the scales `x`, the `barHeight` variable, and the `d` (data) object to make a few calculations so that everything lines up just right.

### The last thing
```js
function type(d) {
    d.value = +d.value; // coerce to number
    return d;
  }
```
Remember this last code, which if you remember runs before our data is returned, coerces our value to a number.

## So many Steps
There is a ton going on here.  I'm starting to see why D3 has such a steap learning curve.  If you are struggling, which I am, know that it has helped me to go over what I have learned slowly and deliberately.
