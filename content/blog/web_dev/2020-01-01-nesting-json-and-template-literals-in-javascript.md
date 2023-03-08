---
layout: post
title:  "Nesting Json and Using Template Literals to Produce HTML"
date: 2020-01-01
published: true
tags: [js, json]
---

I come from the R world working with data.  A very common data analysis technique is to take data and group it by a variable.   I wanted to do the same thing with javascript and then append the data using `.innerHTML` to the DOM.   I am working on an app that has data that I would like the user to be able to display in various different ways.  I had a really hard time finding any information on grouping data and how to loop through the grouped data to display the grouped data in HTML.  I am not very good a javascript so this was quite a challange for me.

## Grouping the data based on a variable

Let's say you have dome data:

```js
let data = [
  {name:"Greg", Last:"Fred", Description:"Greg Fred Blah Blah Blah"},
  {name:"Greg", Last:"Ted", Description:"Greg Ted Blah Blah Blah"},
  {name:"Greg", Last:"Aaron", Description:"Greg Aaron Blah Blah Blah"},
  {name:"Red", Last:"Fred", Description:"Red Fred Blah Blah Blah"},
  {name:"Red", Last:"Ted", Description:"Red Ted Blah Blah Blah"},
  {name:"Red", Last:"Aaron", Description:"Red Aaron Blah Blah Blah"},
  {name:"Ben", Last:"Fred", Description:"Ben Fred Blah Blah Blah"},
  {name:"Ben", Last:"Ted", Description:"Ben Ted Blah Blah Blah"},
  {name:"Ben", Last:"Aaron", Description:"Ben Aaron Blah Blah Blah"}
 ]
```

I wanted to group the data based on `name`.  The output would be `["Greg", "Red", "Ben"]` After trying a bunch of different techniques using the higher order function `.reduce` seemed to do the trick.   [Reduce basics - Part 3 of Functional Programming in JavaScript](https://www.youtube.com/watch?v=Wl98eZpkp-c&feature=youtu.be) and [Reduce Advanced - Part 4 of Functional Programming in JavaScript](https://www.youtube.com/watch?v=CQqwU2Ixu-U) really helped me understand how reduce works (I recommend checking out the whole playlist [Functional programming in JavaScript](https://www.youtube.com/playlist?list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84).   

The structure that I would like to produce is:

```js
let someVariableName = {
	Greg: [
		{
		    Description:"Greg Fred Blah Blah Blah",
		      Last:"Fred"
		},
		{
			Description: "Greg Ted Blah Blah Blah",
			Last:"Ted"
		},
		{...}
	],
	Red: [
		//Similar structure as above
	],
	Ben: [
		//Similar structure as Greg
	]
}
```

Setting up reduce.

```js

const groupedData = data.reduce((groups, line) => {
  // what we do with the data will go here
}, {})
```
Think of `.reduce` as a powerful for loop that returns a new object and does not manipulate the object passed to it. It basically goes over an array, one value at a time.  

So we apply `.reduce` to the `data` object and we pass three things:
* `groups` which is called the accumulator and will accumulate all of the reduced data to eventually be returned. This will be our new object that we will save to the variable `groupedData`.
* `line` which will be used as the current value that reduce loops over. Line will represent each value (or line) in our data array. It takes that place of `data[i]` in a four loop.
* The initializer is the last thing we need.  If we don't have an initializer reduce uses the first property and will skip it.  In this case we use `{}` to initialize on nothing to not skip the first property.

```js
const groupedData = data.reduce((groups, line) => {
  groups[line['name']] =  groups[line['name']] || []
  groups[line['name']].push({
    Last: line['Last'],
    Description: line['Description']
  })
  return groups
}, {})
```

Not being an expert at javascript I don't exactly know what is happening here.  I recommend you check out the Fun Fun Function tutorial if you are interested.  But basically what happens is the data is grouped base on name and we get the desired output. Which looks like this:

```js

let someVariableName = {
	Greg: [
		{
		    Description:"Greg Fred Blah Blah Blah",
		    Last:"Fred"
		},
		{
			Description: "Greg Ted Blah Blah Blah",
			Last:"Ted"
		},
		{...}
	],
	Red: [
		//Similar structure as above
	],
	Ben: [
		//Similar structure as Greg
	]
}

```

## Adding the data to the DOM

Now that we have the data in the right format we need to loop through each named key (Greg, Red, Ben) and then loop through each child of each name and add the data to an html object as we do this using template literls which are   back-ticks `` ` `` right below the exit. We will use a for loop and then a the higher order function `.map()` (again check out [fun fun function](https://www.youtube.com/watch?v=bCqtb-Z5YGQ&list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84&index=3&t=471s) for details on `.map`).

First we need to make an HTML element to add the data to:

```html
<div id="bind-to-me">
</div>
```
Now we use JS to append the data:

```js
let element = document.getElementById("bind-to-me")
let markup;

for(let key in groupedData){
  markup = `
    <h1>${key}</h1>
    <p>${groupedData[key].map(data=> `<p>Description: ${data.Description}, Last Name: ${data.Last}</p>` ).join('')}</p>
  `
  element.innerHTML += markup
}
```
We first need to get the element that we want to bind to: `let element = document.getElementById("bind-to-me")`.  The we use a for loop to loop over each element key. The for loop uses `key` to represent the name of the object it is currently looping over in `groupedData`. We can simply echo out the key `` `<h1>${key}</h1>`  ``.  If we left it here we would just have three headings that represent the names.

To add the data associated with the name for each key, we need to use map to loop over the each value within each key.  Finally we take the markup and append it to our element.

Here's everythin in a pen so you can play around with it.  I've added some `console.log()`s into the nesting steps to hopefully help you understand how that step works.

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="js,result" data-user="mschmidty" data-slug-hash="zYxEpEB" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Nesting Json">
  <span>See the Pen <a href="https://codepen.io/mschmidty/pen/zYxEpEB">
  Nesting Json</a> by Michael Schmidt (<a href="https://codepen.io/mschmidty">@mschmidty</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>



