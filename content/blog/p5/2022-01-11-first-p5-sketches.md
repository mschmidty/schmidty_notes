---
layout: post
title:  "p5 Art - First Tries"
date: 2022-02-11
tags: [ art, javascript ]
p5: true
---

Over the holiday break I worked on three things: eating, sleeping, and coding.  For the coding part I accomplished two things.  I this website to [eleventy js](https://www.11ty.dev/) and redesigned it (lightly!) and started playing around with p5js again.  This post the first of a few about making art and getting better at javascript with p5js and the Coding train.  I'll write up a post about porting over the eleventy....maybe. 

I've long been a fan of the [Coding Train](https://www.youtube.com/channel/UCvjgXvBlbQiydffZU7m1_aw) but I have never done much with [p5js](https://p5js.org/). Then I happened on [Tyler Hobbs and his Fridenza](https://tylerxhobbs.com/fidenza) generative art pieces.  Tyler makes some really amazing stuff. Tyler makes his stuff in java using processing (I belive?).  In my multi year attempt to bet better at javascript, I thought it would be good to try my hand at the art thing using p5, the javascript equivalent to processing.   I'll write up a few posts with my creations. 

## Random Circles
At first I just tried non-overlapping circles. I loved making this.  But I relies on just randomly placing the circles.  If they overlap it rejects them.  It literally takes 10,000 iterations, which is slow. But I like it nontheless.  When I first made it I was so stoked.  But now it's sheen has worn off and I'm interested in making other things. 

<figure id="randomCirclePacking"></figure>

<script>
  const pal = [
  ["#6b200c", "#973d21", "#da6c42", "#ee956a", "#fbc2a9", "#f6f2ee", "#bad6f9", "#7db0ea", "#447fdd", "#225bb2", "#133e7e"],
  ["#e76254", "#ef8a47", "#f7aa58", "#ffd06f", "#ffe6b7", "#aadce0", "#72bcd5", "#528fad", "#376795", "#1e466e"],
  ["#660d20", "#e59a52", "#edce79", "#094568", "#e1c59a"], //Navajo
  ["#fbe3c2", "#f2c88f", "#ecb27d", "#e69c6b", "#d37750", "#b9563f", "#92351e"],
  ["#2d223c", "#574571", "#90719f", "#b695bc", "#dec5da", "#c1d1aa", "#7fa074", "#466c4b", "#2c4b27", "#0e2810"],
  ["#fbe183", "#f4c40f", "#fe9b00", "#d8443c", "#9b3441", "#de597c", "#e87b89", "#e6a2a6", "#aa7aa1", "#9f5691", "#633372", "#1f6e9c", "#2b9b81", "#92c051"],
  ["#bd3106", "#d9700e", "#e9a00e", "#eebe04", "#5b7314", "#c3d6ce", "#89a6bb", "#454b87"],
  ["#17154f", "#2f357c", "#6c5d9e", "#9d9cd5", "#b0799a", "#f6b3b0", "#e48171", "#bf3729", "#e69b00", "#f5bb50", "#ada43b", "#355828"], //Renoir
  ["#fbe183", "#f4c40f", "#fe9b00", "#d8443c", "#9b3441", "#de597c", "#e87b89", "#e6a2a6", "#aa7aa1", "#9f5691", "#633372", "#1f6e9c", "#2b9b81", "#92c051"], //Signac
  ["#5b859e", "#1e395f", "#75884b", "#1e5a46", "#df8d71", "#af4f2f", "#d48f90", "#732f30", "#ab84a5", "#59385c", "#d8b847", "#b38711"] //Redon
]

let circles = [];
function setup(){
  noLoop();
  let c = createCanvas(700, 400)
  c.parent("randomCirclePacking")
  background('#efefef')
  noStroke();
  frameRate(0.5);

  for(let i = 0; i<10000; i++){
    let circle = {
      x: random(width),
      y: random(height),
      r: random(5, 75)
    }
    let overlapping = false;
    for(let j = 0; j<circles.length; j++){
      let otherCircle = circles[j];
      let d = dist(circle.x, circle.y, otherCircle.x, otherCircle.y)
      if(d<circle.r+otherCircle.r){
        overlapping = true
      }
    }
    if(!overlapping){
      circles.push(circle)
    }
  }
  for (var i = 0; i < circles.length; i++) {
    noStroke();
    drawTarget(circles[i].x, circles[i].y, circles[i].r*2, random(5, 10))
  }
}



function drawTarget(xloc, yloc, size, num, pallet = false){
	const steps = size/num;
  let currentPal;
  if(pallet){
    currentPal = pallet;
  }else{
    currentPal = pal[floor(random(pal.length))]
  }
  
	let colorNumber1 = Math.round(random(0,currentPal.length-1));
	let colorNumber2 = Math.round(random(0,currentPal.length-1));
	while(colorNumber1 == colorNumber2){
		colorNumber2 = Math.round(random(0,currentPal.length-1));
	}
  
	let c1 = currentPal[colorNumber1];
	let c2 = currentPal[colorNumber2]
	//console.log(c1)

	for(let i = 0; i<num; i++){
		let currentColor = lerpColor(color(c1), color(c2), 1/num*i)
		fill(currentColor);
		ellipse(xloc, yloc, size-i*steps,  size-i*steps)
	}
}

</script>

To expand on what is going on here, this code randomly selects a pallet. Each time you refresh the page it should grab a random pallet and randomly plot the circles again. I got the pallets from a wonderful R package called [MetBrewer](https://github.com/BlakeRMills/MetBrewer/).  I definitely recommend checking it out. 

```js
<script>
const pal = [
  ["#6b200c", "#973d21", "#da6c42", "#ee956a", "#fbc2a9", "#f6f2ee", "#bad6f9", "#7db0ea", "#447fdd", "#225bb2", "#133e7e"],
  ["#e76254", "#ef8a47", "#f7aa58", "#ffd06f", "#ffe6b7", "#aadce0", "#72bcd5", "#528fad", "#376795", "#1e466e"],
  ["#660d20", "#e59a52", "#edce79", "#094568", "#e1c59a"], //Navajo
  ["#fbe3c2", "#f2c88f", "#ecb27d", "#e69c6b", "#d37750", "#b9563f", "#92351e"],
  ["#2d223c", "#574571", "#90719f", "#b695bc", "#dec5da", "#c1d1aa", "#7fa074", "#466c4b", "#2c4b27", "#0e2810"],
  ["#fbe183", "#f4c40f", "#fe9b00", "#d8443c", "#9b3441", "#de597c", "#e87b89", "#e6a2a6", "#aa7aa1", "#9f5691", "#633372", "#1f6e9c", "#2b9b81", "#92c051"],
  ["#bd3106", "#d9700e", "#e9a00e", "#eebe04", "#5b7314", "#c3d6ce", "#89a6bb", "#454b87"],
  ["#17154f", "#2f357c", "#6c5d9e", "#9d9cd5", "#b0799a", "#f6b3b0", "#e48171", "#bf3729", "#e69b00", "#f5bb50", "#ada43b", "#355828"], //Renoir
  ["#fbe183", "#f4c40f", "#fe9b00", "#d8443c", "#9b3441", "#de597c", "#e87b89", "#e6a2a6", "#aa7aa1", "#9f5691", "#633372", "#1f6e9c", "#2b9b81", "#92c051"], //Signac
  ["#5b859e", "#1e395f", "#75884b", "#1e5a46", "#df8d71", "#af4f2f", "#d48f90", "#732f30", "#ab84a5", "#59385c", "#d8b847", "#b38711"] //Redon
]

let circles = [];

function setup(){
  noLoop();
  let c = createCanvas(700, 1000)
  c.parent("randomCirclePacking")
  background('#efefef')
  noStroke();

  for(let i = 0; i<50000; i++){
    let circle = {
      x: random(width),
      y: random(height),
      r: random(5, 75)
    }
    let overlapping = false;
    for(let j = 0; j<circles.length; j++){
      let otherCircle = circles[j];
      let d = dist(circle.x, circle.y, otherCircle.x, otherCircle.y)
      if(d<circle.r+otherCircle.r){
        overlapping = true
      }
    }
    if(!overlapping){
      circles.push(circle)
    }
  }
  for (var i = 0; i < circles.length; i++) {
    noStroke();
    drawTarget(circles[i].x, circles[i].y, circles[i].r*2, random(5, 10), pallet = pal[2])
  }
}



function drawTarget(xloc, yloc, size, num, pallet = false){
	const steps = size/num;
  let currentPal;
  if(pallet){
    currentPal = pallet;
  }else{
    currentPal = pal[floor(random(pal.length))]
  }
  
	let colorNumber1 = Math.round(random(0,currentPal.length-1));
	let colorNumber2 = Math.round(random(0,currentPal.length-1));
	while(colorNumber1 == colorNumber2){
		colorNumber2 = Math.round(random(0,currentPal.length-1));
	}
  
	let c1 = currentPal[colorNumber1];
	let c2 = currentPal[colorNumber2]

	for(let i = 0; i<num; i++){
		let currentColor = lerpColor(color(c1), color(c2), 1/num*i)
		fill(currentColor);
		ellipse(xloc, yloc, size-i*steps,  size-i*steps)
	}
}

</script>
```
And I was going to put another sketch down here but I guess I'll save that for a new post because I can't get namespacing to work. 


