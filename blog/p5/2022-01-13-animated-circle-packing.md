---
layout: post
title:  "p5 Art - Animated Circle Packing"
date: 2022-02-13
tags: [ art, javascript ]
p5: true
---

As with my first post, here we are attempting to implement circle packing.  This time I wanted to animate circle growth and then stop circle growth before the circles overlapped.  I unabashedly stole most of this from [Daniel Shiffman](https://editor.p5js.org/cah689/sketches/B1kCFI36b), but I wanted to use classes instead of just a circle object as he does in his example.  

And once again I used a Georgia Okeeffe pallet from the [MetBrewer R Package](https://github.com/BlakeRMills/MetBrewer)

<figure id="sketch"></figure>

<script>
let circles = [];
let p = ["#6b200c", "#973d21", "#da6c42", "#ee956a", "#fbc2a9", "#f6f2ee", "#bad6f9", "#7db0ea", "#447fdd", "#225bb2", "#133e7e"];
function setup(){
  const c = createCanvas(700, 500)
  c.parent("sketch")
  background('#efefef')
}

function draw(){
  for (var i = 0; i < circles.length; i++) {
    var c = circles[i];
    c.show();
  
    if (c.growing) {
      c.grow();
      for (var j = 0; j < circles.length; j++) {
        var other = circles[j];
        if (other != c) {
          var d = dist(c.x, c.y, other.x, other.y);
          if (d - 2 < c.r + other.r) {
            c.growing = false;
          }
        }
      }
    }
  }
  
  var target = 1 + constrain(floor(frameCount / 120), 0, 20);
  var count = 0;
  for (var i = 0; i < 1000; i++) {
    if (addCircle()) {
      count++;
    }
    if (count == target) {
      break;
    }
  }
  if (count < 1) {
    noLoop();
  }

}

function addCircle(){
  let palNum = floor(random(p.length))
  let newCircle = new Circle(random(width), random(height), 2, p[palNum]);
  for(var i = 0; i<circles.length; i++){
    let other = circles[i];
    let d = dist(newCircle.x, newCircle.y, other.x, other.y)
    if(d<other.r+4){
      newCircle = undefined;
      break;
    }
  }
  if(newCircle){
    circles.push(newCircle);
    return true;
  }else{
    return false;
  }
}

class Circle{
  constructor(x,y,r,pal){
    this.x = x;
    this.y = y;
    this.r = r;
    this.pal = pal;
    this.growing = true;
  }
  show(){
    fill(this.pal);
    noStroke();
    // strokeWeight(1);
    // stroke('#333333');
    ellipse(this.x, this.y, this.r*2);
  }
  grow(){
    this.r *= 1.035;
  }
  edges(){
    return (this.r>width-this.x || this.r > this.x || this.r > height - this.y || this.r > this.y)
  }
}
</script>

## The scripts
```js
let circles = [];
let p = ["#6b200c", "#973d21", "#da6c42", "#ee956a", "#fbc2a9", "#f6f2ee", "#bad6f9", "#7db0ea", "#447fdd", "#225bb2", "#133e7e"];
function setup(){
  const c = createCanvas(700, 500)
  c.parent("sketch")
  background('#efefef')
}

function draw(){
  for (var i = 0; i < circles.length; i++) {
    var c = circles[i];
    c.show();
  
    if (c.growing) {
      c.grow();
      for (var j = 0; j < circles.length; j++) {
        var other = circles[j];
        if (other != c) {
          var d = dist(c.x, c.y, other.x, other.y);
          if (d - 2 < c.r + other.r) {
            c.growing = false;
          }
        }
      }
    }
  }
  
  var target = 1 + constrain(floor(frameCount / 120), 0, 20);
  var count = 0;
  for (var i = 0; i < 1000; i++) {
    if (addCircle()) {
      count++;
    }
    if (count == target) {
      break;
    }
  }
  if (count < 1) {
    noLoop();
  }

}

function addCircle(){
  let palNum = floor(random(p.length))
  let newCircle = new Circle(random(width), random(height), 2, p[palNum]);
  for(var i = 0; i<circles.length; i++){
    let other = circles[i];
    let d = dist(newCircle.x, newCircle.y, other.x, other.y)
    if(d<other.r+4){
      newCircle = undefined;
      break;
    }
  }
  if(newCircle){
    circles.push(newCircle);
    return true;
  }else{
    return false;
  }
}

class Circle{
  constructor(x,y,r,pal){
    this.x = x;
    this.y = y;
    this.r = r;
    this.pal = pal;
    this.growing = true;
  }
  show(){
    fill(this.pal);
    noStroke();
    // strokeWeight(1);
    // stroke('#333333');
    ellipse(this.x, this.y, this.r*2);
  }
  grow(){
    this.r *= 1.035;
  }
  edges(){
    return (this.r>width-this.x || this.r > this.x || this.r > height - this.y || this.r > this.y)
  }
}
```