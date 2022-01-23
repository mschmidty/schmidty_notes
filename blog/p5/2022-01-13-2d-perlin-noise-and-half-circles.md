---
layout: post
title:  "p5 Art - Half Circles and 2D Perlin Noise Effect"
date: 2022-02-13
tags: [ art, javascript ]
p5: true
---
More circles, or rather half circles, and 2d perlin noise and hsl to make it look old. 

<figure id="sketch"></figure>

### Scripts

```js
let size = 180
let y = size/3;
function setup(){
  noStroke();
  let c = createCanvas(700,900)
  c.parent('sketch')
  background('#efefef');
  noiseDetail(8, 0.65);
  let p = ["#660d20", "#e59a52", "#edce79", "#094568", "#e1c59a"];
  let gutter = 17;

  while(y<height-size){
    for(let x = size/3; x<width-size; x+=size+gutter){
      let backNum = floor(random(p.length))
      fill(p[backNum])
      rect(x,y, size)
      drawHalfCircleTarget(x+size/2,y+size/2,size*.65, 5, p)
    }
    y+=size+gutter
  }
  // Add 2d Perlin noise.
  let inc = 0.005;
  let step = 1;
  for(let x = 0; x<width; x+=step){
		for(let y = 0; y<height; y+=step){
			let n = noise(inc * x, inc * y);
      let s = map(n, 0,1, 0, 100)
      let l = map(n, 0,1,0,100)
      let fillColor = color(`hsl(48, ${s}%, ${l}%)`);
      fillColor.setAlpha(85)
			fill(fillColor)
			noStroke();
			rect(x, y, step, step)
		}
	}
}
function drawHalfCircleTarget(xloc, yloc, size, num, pallet){
  const steps = size/num;
  let currentPal = pallet;

  for(let i = 0; i<num; i++){
    let currentColor = floor(random(currentPal.length));
    fill(currentPal[currentColor]);

    if(i==0){
      ellipse(xloc, yloc, size-i*steps, size-i*steps);
    }
    const arcSelect = floor(random(5))

    if(arcSelect==0){
      ellipse(xloc, yloc, size-i*steps, size-i*steps);
    }else if(arcSelect==1){
      arc(xloc, yloc, size-i*steps, size-i*steps, 0-HALF_PI, HALF_PI)
    }else if(arcSelect==2){
      arc(xloc, yloc, size-i*steps, size-i*steps, HALF_PI, PI+HALF_PI)
    }else if(arcSelect==3){
      arc(xloc, yloc, size-i*steps, size-i*steps, 0, PI)
    }else {
      arc(xloc, yloc, size-i*steps, size-i*steps, PI, 0)
    }
  }
}
```
<script>
let size = 180
let y = size/3;
function setup(){
  noStroke();
  let c = createCanvas(700,900)
  c.parent('sketch')
  background('#efefef');
  noiseDetail(8, 0.65);
  let p = ["#660d20", "#e59a52", "#edce79", "#094568", "#e1c59a"];
  let gutter = 17;

  while(y<height-size){
    for(let x = size/3; x<width-size; x+=size+gutter){
      let backNum = floor(random(p.length))
      fill(p[backNum])
      rect(x,y, size)
      drawHalfCircleTarget(x+size/2,y+size/2,size*.65, 5, p)
    }
    y+=size+gutter
  }
  // Add 2d Perlin noise.
  let inc = 0.005;
  let step = 1;
  for(let x = 0; x<width; x+=step){
		for(let y = 0; y<height; y+=step){
			let n = noise(inc * x, inc * y);
      let s = map(n, 0,1, 0, 100)
      let l = map(n, 0,1,0,100)
      let fillColor = color(`hsl(48, ${s}%, ${l}%)`);
      fillColor.setAlpha(85)
			fill(fillColor)
			noStroke();
			rect(x, y, step, step)
		}
	}
}
function drawHalfCircleTarget(xloc, yloc, size, num, pallet){
  const steps = size/num;
  let currentPal = pallet;

  for(let i = 0; i<num; i++){
    let currentColor = floor(random(currentPal.length));
    fill(currentPal[currentColor]);

    if(i==0){
      ellipse(xloc, yloc, size-i*steps, size-i*steps);
    }
    const arcSelect = floor(random(5))

    if(arcSelect==0){
      ellipse(xloc, yloc, size-i*steps, size-i*steps);
    }else if(arcSelect==1){
      arc(xloc, yloc, size-i*steps, size-i*steps, 0-HALF_PI, HALF_PI)
    }else if(arcSelect==2){
      arc(xloc, yloc, size-i*steps, size-i*steps, HALF_PI, PI+HALF_PI)
    }else if(arcSelect==3){
      arc(xloc, yloc, size-i*steps, size-i*steps, 0, PI)
    }else {
      arc(xloc, yloc, size-i*steps, size-i*steps, PI, 0)
    }
  }
}
</script>
