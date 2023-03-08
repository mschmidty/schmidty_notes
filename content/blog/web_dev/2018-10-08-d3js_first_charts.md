---
layout: post
title:  "D3.js: Notes on my first outing"
date: 2018-10-08
published: true
tags: [js, D3]
---

When I learned to program, I started to come up with all of these ideas that all of the sudden I knew were possible.  But I didn't really know how to implement most of them. For instance, I've wanted to be able to use an API to retrieve data and then use that data to make a chart on the fly for quite some time.  There's only one problem: I suck at javascript. Without a doubt, charting and making api calls on the front end requires javascript.  It also means, working with D3 if you want to do it right. Needless to say, because I am not an excellent javascript (or anything but html, css, and a touch of r for that matter) this "dream" has been an uphill battle.  Just getting the data has been a challenge.  Needless to say, today I started working on some simple D3 charts.  No longer will I wait until I magically become an amazing javascript developer to learn how to make charts.  

So I started. Aaaaand it was so confusing.  There were so many steps to remember with different nuances. So this note is an attempt to go back over what I learned to try and solidify some of d3's concepts in my head.

To learn D3, I went through, [Let's Make a Bar Chart](https://bost.ocks.org/mike/bar/) by the creator of D3 Mike Bostock (freakin' genius). Much of the code is copied from that tutorial.  If you find this note helpful, you should check out the actual tutorial.  It, and almost anything that Mike does, seems to be pretty great.

Before we get into charting, there's some things we need to understand about D3 on a basic level: D3 has two important features that you need to understand: 1) make selections very easily without looping and 2) method chaining.  

## Selecting in D3
Let's say you want to create an element and then add "Hello World" to that element.  In other words you want to select an element and then do something with it. In vanilla javascript you would do the following:

```js
var div = document.createElement("div");
div.innerHTML = "Hello, world!";
document.body.appendChild(div);
```
To do the exact same thing in D3 you would do something like this:

```js
var body = d3.select("body");
var div = body.append("div");
div.html("Hello, world!");
```

Not that much better.  But lets say that we want to select a bunch of elements.  It's true that these days we could use `forEach` in javascript to make this pretty easy, but D3 also makes this really easy by using `selectAll` like so:

```js
var section = d3.selectAll("section");
var div = section.append("div");
div.html("Hello, world!");
```

So, even if we didn't use D3 for anything else, it makes selections really easy.  But remember that is just the start.

## Method Chaining

The second thing that you can do in d3 is method chaining.  Method chaining can be done in vanilla js, but is more common using libraries like jQuery and D3.  In D3, method chaining allow us to change the following:

```js
var body = d3.select("body");
body.style("color", "black");
body.style("background-color", "white");
```
Into This:

```js
d3.select("body")
    .style("color", "black")
    .style("background-color", "white");
```
This makes adding many different changes to your selection really easy.

Remember to that selecting and Chaining are not the heart of the D3 library, but they are important concepts to understand before you move on to doing more complex things.

## Coding Our First Chart



The [first chart](https://bost.ocks.org/mike/bar/#manual) in the tutorial is built with vanilla html and css, without using any D3.  The chart is a series of `<div>` elements all with in-line css styles that signify their length or value.  The first d3 chart is a recreation of this, and it looks like this:
<style>

.chart div {
  font: 10px sans-serif;
  background-color: steelblue;
  text-align: right;
  padding: 3px;
  margin: 1px;
  color: white;
}
.chart {
  margin:20px 0;
}

</style>

<div class="chart"></div>

<script src="//d3js.org/d3.v3.min.js"></script>
<script>

var data = [4, 8, 15, 16, 23, 42];

d3.select(".chart")
  .selectAll("div")
    .data(data)
  .enter().append("div")
    .style("width", function(d) { return d * 10 + "px"; })
    .text(function(d) { return d; });
</script>

And the code to make that looks like this:
```html
<div class="chart"></div>

<script src="//d3js.org/d3.v3.min.js"></script>
<script>

var data = [4, 8, 15, 16, 23, 42];

d3.select(".chart")
  .selectAll("div")
    .data(data)
  .enter().append("div")
    .style("width", function(d) { return d * 10 + "px"; })
    .text(function(d) { return d; });
</script>
```

So what is going on here.

### Set up
First we put a `<div>` element somewhere in the body so that we are going to attach the chart to later:

```html
<div class="chart"></div>
```

Then we load D3:

```js
<script src="//d3js.org/d3.v3.min.js"></script>
```
### The D3 Code

First we need to select the `html` element that we want to add the chart to.  Remember how one of the things D3 does really well is select things.

```js
d3.select(".chart")
```
Pretty easy, all we do is say select and then give the class of the element we are selecting.

Next we want to set up d3 to create several `<div>`elements that we will add widths using the html style attribute.
```js
d3.select(".chart")
  .selectAll("div")
```
I didn't say this before, but because we have created a new elements with `.selectAll` based on our first selection, we basically are forgetting the old selection and are now only able to work with the `.selectAll("div")`.  This is a little confusing because you are technically making a selection of `<div>`s that don't actually exist.  Mike B. explains: *"Think of the initial selection as declaring the elements you want to exist"*.

The next step is to now to join the data to our `<div>`s that we want to exist and then append that data to our divs.  to do this, we first need to add our data with the [`data()`](https://github.com/d3/d3/wiki#data) function, which joins data to a selection.

> **[From the D3 Wiki](https://github.com/d3/d3-selection/blob/master/README.md#selection_data)** Joins the specified array of data with the selected elements, returning a new selection that represents the update selection: the elements successfully bound to data.

The next step is kind of confusing.  After we call `data(data)` joining our data to our chain, `data()` "returns" both an `enter()` and `exit()` selection. In the tutorial it's described this way: "*The data operator returns the update selection. The enter and exit selections hang off the update selection, so you can ignore them if you don’t need to add or remove elements*". What we do with the `enter()` selection, I don't quite understand either so I'm going to quote the tutorial again directly:

> **[From the D3 Bar Chart Tutorial](https://bost.ocks.org/mike/bar/#automatic)** - Since we know the selection is empty, the returned update and exit selections are also empty, and we need only handle the enter selection which represents new data for which there was no existing element. We instantiate these missing elements by appending to the enter selection.

That's a lot to unpack. What I believe the above sudo jibberish is saying is, we use the `data()` function to join our `var data` array to our `selectAll("div")` selection. We then use the `enter()` function to take the now joined `data(data)` and create several divs by appending each element in the `var data` array to it's own div `<div>`.

```js
d3.select(".chart")
  .selectAll("div")
    .data(data)
  .enter().append("div")
```

So let's step back, until this point we have really just created the divs for every value we have in our `var data` array. If you stopped here you would have 5 divs that cross the page. But these steps are kind of critical to creating any d3 chart.  And it's really important to understand that the data created the divs based on how many values there were in the data.  Unlike selections, this would be much harder to do in vanilla javascript.

## Finishing the Chart
The next steps allow us to take our newly created `div`s and in a relative way add attributes/styles to them.

We next add a `style()` to our created `div`s with a function.  I'm not going to talk about the `styles()` attribute because using `div`s and `style`s will be jetesoned for ever after this tutorial in favor of `svg` elements and attributes `attr`.

What we are doing here, is taking our `append()`ed `div`s that are joined with our data and adding a width to each one using the `style` attribute. Each `width` will be set by `d * 10 + "px"`.  The important thing to know in this formula is the `d` value is the `var data` value that is associated with that `div`.  So given that `var data = [4, 8, 15, 16, 23, 42];` We know that our first `div` has a `d` value of 4, the second a value of 8, and so on.  The function multiplies that by 10, and adds "px" so that the width uses pixels as a unit.

```js
d3.select(".chart")
  .selectAll("div")
    .data(data)
  .enter().append("div")
    .style("width", function(d) { return d * 10 + "px"; })
```
Now the last step is to add text to each bar again with the `d` values.

```js
d3.select(".chart")
  .selectAll("div")
    .data(data)
  .enter().append("div")
    .style("width", function(d){return d * 10 + "px"})
    .text(function(d){ return d })
```


## Domain and Range

The last thing to get started with charting with D3.js is scaling the chart so that you don't have to do any math. We can use D3 so that the pixels of each bar add up to equal the width of the chart. You do this with `d3.scale.linear` (in more recent versions of d3, the function is `d3.scaleLinear`). This takes a few steps, because we not only have to set the scale with `domain()` and `range()` but we also have to change our `.style()` function. So our final code will look like this:

```js
var x = d3.scale.linear()
.domain([0, d3.max(data)]) ##Sets the max value at the range max
.range([0,420]) ##Sets the start and end of the range

d3.select(".chart")
.selectAll("div")
.data(data)
.enter().append("div")
.style("width", function(d){return x(d) + "px" })
.text(function(d){return d })
```
